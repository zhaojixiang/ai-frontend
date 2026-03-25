import { useEffect, useMemo, useRef, useState } from 'react';

import Timeline from '@/components/Timeline';
import { useSceneThumbnails } from '@/hooks/useVideoPlayer';

interface Scene {
  id: string;
  start: number;
  end: number;
  file: string;
  thumbnail?: string;
}

function mapTimelineToVideoTime(time: number, scenes: Scene[]) {
  let acc = 0;
  for (const s of scenes) {
    const d = s.end - s.start;
    if (time < acc + d) {
      return s.start + (time - acc);
    }
    acc += d;
  }
  return 0;
}

function mapVideoToTimelineTime(time: number, scenes: Scene[]) {
  let acc = 0;
  for (const s of scenes) {
    const d = s.end - s.start;
    if (time >= s.start && time <= s.end) {
      return acc + (time - s.start);
    }
    acc += d;
  }
  return 0;
}

export default function VideoPlayer({ scenes: initialScenes }: { scenes: Scene[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scenes, setScenes] = useState(initialScenes);
  // 单视频：假设所有 scene 来自同一原视频
  const videoSrc = useMemo(() => {
    return scenes[0]?.file;
  }, [scenes]);

  const thumbs = useSceneThumbnails(videoSrc, scenes);

  useEffect(() => {
    setScenes(initialScenes);
  }, [initialScenes]);

  // 将自动生成的缩略图合并回 scenes（不覆盖接口已给的 thumbnail）
  useEffect(() => {
    if (!thumbs || Object.keys(thumbs).length === 0) return;
    setScenes((prev) => {
      let changed = false;
      const next = prev.map((s, idx) => {
        const id = String(s.id ?? (s as any).index ?? s.start ?? idx);
        const t = thumbs[id];
        if (!t || s.thumbnail) return s;
        changed = true;
        return { ...s, thumbnail: t };
      });
      return changed ? next : prev;
    });
  }, [thumbs]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    video.onloadedmetadata = () => {
      video.play();
    };
  }, [videoSrc]);

  const scenesRef = useRef(scenes);
  useEffect(() => {
    scenesRef.current = scenes;
  }, [scenes]);

  const currentTimeRef = useRef(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const isDraggingRef = useRef(isDragging);
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  const totalDuration = useMemo(
    () => scenes.reduce((sum, s) => sum + (s.end - s.start), 0),
    [scenes]
  );
  const totalDurationRef = useRef(totalDuration);
  useEffect(() => {
    totalDurationRef.current = totalDuration;
  }, [totalDuration]);

  const rafRef = useRef<number | null>(null);
  const lastTickMsRef = useRef<number>(0);
  const lastUiUpdateMsRef = useRef<number>(0);

  const stopTimelineRaf = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const startTimelineRaf = () => {
    stopTimelineRaf();
    lastTickMsRef.current = performance.now();
    lastUiUpdateMsRef.current = 0;

    const tick = (now: number) => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused || video.ended) {
        stopTimelineRaf();
        return;
      }

      if (isDraggingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt = (now - lastTickMsRef.current) / 1000;
      lastTickMsRef.current = now;

      const playbackRate = video.playbackRate || 1;
      const nextTime = Math.min(
        totalDurationRef.current,
        currentTimeRef.current + dt * playbackRate
      );

      currentTimeRef.current = nextTime;

      // 每隔一段时间更新 UI，避免 setState 每帧导致卡顿
      if (now - lastUiUpdateMsRef.current > 50) {
        lastUiUpdateMsRef.current = now;
        setCurrentTime(nextTime);
      }

      const real = mapTimelineToVideoTime(nextTime, scenesRef.current);
      // 允许一点误差，避免频繁 set currentTime
      if (Math.abs(video.currentTime - real) > 0.08) {
        video.currentTime = real;
      }

      if (nextTime >= totalDurationRef.current) {
        stopTimelineRaf();
        video.pause();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const handleReorder = (from: number, to: number) => {
    const updated = [...scenes];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setScenes(updated);

    const video = videoRef.current;
    if (video) {
      const real = mapTimelineToVideoTime(currentTime, updated);
      video.currentTime = real;
      // 不强制播放：如果用户当前暂停，就保持暂停
    }
  };

  const handleDelete = (index: number) => {
    const updated = scenes.filter((_, i) => i !== index);
    setScenes(updated);

    const video = videoRef.current;
    if (video && updated.length > 0) {
      const clamped = Math.min(
        currentTime,
        updated.reduce((s, x) => s + (x.end - x.start), 0)
      );
      const real = mapTimelineToVideoTime(clamped, updated);
      video.currentTime = real;
      setCurrentTime(clamped);
    }
  };

  // 🎯 用“时间轴驱动真实视频时间”，让重排后的播放一定按时间轴顺序推进
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.onplay = () => {
      startTimelineRaf();
    };

    video.onpause = () => {
      stopTimelineRaf();
    };

    // 用户用浏览器控件 seek 时：只在“暂停态”同步一次 currentTime
    video.onseeked = () => {
      if (!video.paused) return;
      const real = video.currentTime;
      const timelineTime = mapVideoToTimelineTime(real, scenesRef.current);
      currentTimeRef.current = timelineTime;
      setCurrentTime(timelineTime);
    };

    if (!video.paused && !video.ended) {
      startTimelineRaf();
    }
  }, [videoSrc]);

  return (
    <div>
      <video
        ref={videoRef}
        src={videoSrc}
        crossOrigin='anonymous'
        controls
        style={{ width: '100%', height: '200px' }}
      />

      <Timeline
        scenes={scenes}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        videoRef={videoRef}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onReorder={handleReorder}
        onDelete={handleDelete}
      />
    </div>
  );
}
