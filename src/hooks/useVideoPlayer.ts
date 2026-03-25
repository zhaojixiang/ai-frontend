import { useEffect, useMemo, useRef, useState } from 'react';

type SceneLike = {
  id?: string;
  index?: number;
  start: number;
  end: number;
  file: string;
  thumbnail?: string;
};

function getSceneId(scene: SceneLike, idx: number) {
  return String(scene.id ?? scene.index ?? scene.start ?? idx);
}

async function waitForEvent(target: EventTarget, eventName: string) {
  await new Promise<void>((resolve, reject) => {
    const onOk = () => {
      cleanup();
      resolve();
    };
    const onErr = () => {
      cleanup();
      reject(new Error(`Failed waiting for ${eventName}`));
    };
    const cleanup = () => {
      target.removeEventListener(eventName, onOk as any);
      target.removeEventListener('error', onErr as any);
    };

    target.addEventListener(eventName, onOk as any, { once: true });
    target.addEventListener('error', onErr as any, { once: true });
  });
}

async function captureFrame(video: HTMLVideoElement, time: number, width = 640, quality = 0.72) {
  const videoEl = video;
  // clamp to avoid seeking beyond duration (some browsers get stuck)
  const safeTime = Math.max(0, Math.min(time, Math.max(0, (videoEl.duration || 0) - 0.05)));

  if (Math.abs(videoEl.currentTime - safeTime) > 0.02) {
    videoEl.currentTime = safeTime;
    await waitForEvent(videoEl, 'seeked');
  }

  const canvas = document.createElement('canvas');
  const vw = videoEl.videoWidth || width;
  const vh = videoEl.videoHeight || Math.round((width * 9) / 16);
  const scale = width / vw;

  canvas.width = width;
  canvas.height = Math.round(vh * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) return undefined;

  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

export function useSceneThumbnails(videoSrc: string | undefined, scenes: SceneLike[]) {
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const cancelledRef = useRef(false);
  const runIdRef = useRef(0);

  const ids = useMemo(() => scenes.map((s, idx) => getSceneId(s, idx)), [scenes]);

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (!videoSrc) return;

    const missing = scenes
      .map((s, idx) => ({ s, id: ids[idx] }))
      .filter(({ s, id }) => !s.thumbnail && !thumbs[id]);

    if (missing.length === 0) return;

    const runId = ++runIdRef.current;

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'auto';
    video.src = videoSrc;

    const run = async () => {
      try {
        // ensure we have dimensions/duration
        await waitForEvent(video, 'loadeddata');

        for (const { s, id } of missing) {
          if (cancelledRef.current || runIdRef.current !== runId) return;

          try {
            const dataUrl = await captureFrame(video, s.start);
            if (!dataUrl) continue;

            if (cancelledRef.current || runIdRef.current !== runId) return;
            setThumbs((prev) => (prev[id] ? prev : { ...prev, [id]: dataUrl }));
          } catch {
            // ignore single-scene failures
          }
        }
      } catch {
        // ignore (CORS / decode / network). Thumbnails are best-effort.
      }
    };

    run();
    // thumbs is intentionally in deps to avoid regenerating existing ones
  }, [ids, scenes, thumbs, videoSrc]);

  return thumbs;
}
