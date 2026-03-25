import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

import S from './index.module.less';

interface TimelineProps {
  scenes: any[];
  currentTime: number;
  setCurrentTime: (time: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete?: (index: number) => void;
}

function SortableSceneBlock({
  id,
  scene,
  widthPercent,
  isSelected,
  onSelect,
  onDelete
}: {
  id: string;
  scene: any;
  widthPercent: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const style: React.CSSProperties = {
    width: `${widthPercent}%`,
    height: '100%',
    borderRight: '1px solid #000',
    overflow: 'hidden',
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.85 : 1,
    touchAction: 'none',
    boxShadow: isSelected ? 'inset 0 0 0 2px #4a9eff' : 'none',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: isDragging ? 1000 : undefined
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={handleClick}>
      {scene.thumbnail && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            // 单张缩略图分辨率有限，铺满超长分镜时 object-fit: cover 会放大变糊。
            // 按轨道高度等比缩放后横向平铺，每格保持清晰（类似胶片条）。
            backgroundColor: '#1a1a1a',
            backgroundImage: `url(${scene.thumbnail})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'left center',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        />
      )}
      {isSelected && onDelete && (
        <button
          type='button'
          className={S.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title='删除切片'>
          ×
        </button>
      )}
    </div>
  );
}

export default function Timeline({
  scenes,
  currentTime,
  setCurrentTime,
  videoRef,
  isDragging,
  setIsDragging,
  onReorder,
  onDelete
}: TimelineProps) {
  // 兼容：当前仓库 React 18 + @types/react 19 的类型组合，会让 dnd-kit 的 SortableContext 在 TS 层面报
  // “cannot be used as a JSX component”。这里做一次本地类型转换，避免牵扯全局依赖调整。
  const SortableContextAny = SortableContext as unknown as React.ComponentType<any>;

  const getSceneId = React.useCallback((scene: any, index: number) => {
    return String(scene?.id ?? scene?.index ?? scene?.start ?? index);
  }, []);

  const getTotalDuration = () => scenes.reduce((sum, s) => sum + (s.end - s.start), 0);

  const mapTimelineToVideoTime = (time: number) => {
    let acc = 0;
    for (const s of scenes) {
      const d = s.end - s.start;
      if (time < acc + d) {
        return s.start + (time - acc);
      }
      acc += d;
    }
    return 0;
  };

  const totalDuration = getTotalDuration();
  const [isSorting, setIsSorting] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const timelineRef = React.useRef<HTMLDivElement>(null);

  // 长按激活拖拽（剪映式交互）：点击选中，长按拖拽
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 300, tolerance: 5 }
    })
  );

  const ids = React.useMemo(() => {
    return scenes.map((s, idx) => getSceneId(s, idx));
  }, [getSceneId, scenes]);

  // 🎯 点击切片区域外顶部跳转（与拖拽区域相似的 seek strip）
  const handleSeekStripClick = (e: React.MouseEvent) => {
    if (isSorting) return;
    const rect = (timelineRef.current ?? e.currentTarget).getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * totalDuration;

    seek(time, { play: true });
  };

  // 删除选中切片
  const handleDelete = React.useCallback(() => {
    if (selectedIndex === null || !onDelete) return;
    onDelete(selectedIndex);
    setSelectedIndex(null);
  }, [selectedIndex, onDelete]);

  // Delete/Backspace 键删除选中切片
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null || !onDelete) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, onDelete, handleDelete]);

  // 🎯 拖动（拖动时间轴）
  const handleDrag = (e: React.PointerEvent) => {
    if (isSorting) return;
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * totalDuration;

    seek(time, { play: false });
  };

  const seek = (time: number, options?: { play?: boolean }) => {
    const video = videoRef.current;
    if (!video) return;

    const real = mapTimelineToVideoTime(time);
    video.currentTime = real;
    if (options?.play === false) {
      video.pause();
    } else {
      video.play();
    }

    setCurrentTime(time);
  };

  const handleDndStart = () => {
    setIsSorting(true);
    setIsDragging(false);
  };

  const handleDndEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsSorting(false);

    if (!over || active.id === over.id) return;

    const fromIndex = ids.indexOf(String(active.id));
    const toIndex = ids.indexOf(String(over.id));
    if (fromIndex < 0 || toIndex < 0) return;

    onReorder(fromIndex, toIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDndStart}
      onDragEnd={handleDndEnd}>
      <div
        ref={timelineRef}
        style={{
          position: 'relative',
          height: 80,
          background: '#222',
          marginTop: 20,
          cursor: isSorting ? 'default' : 'default'
        }}>
        {/* 切片区域外顶部：点击切换播放时间点 */}
        <div className={S.seekStrip} onClick={handleSeekStripClick} title='点击切换播放时间点' />
        {/* 🎬 分镜块（可拖拽排序，点击选中） */}
        <SortableContextAny items={ids} strategy={horizontalListSortingStrategy}>
          <div style={{ display: 'flex', height: '100%' }}>
            {scenes.map((scene, index) => {
              const duration = scene.end - scene.start;
              const widthPercent = totalDuration ? (duration / totalDuration) * 100 : 0;

              return (
                <SortableSceneBlock
                  id={ids[index]}
                  key={ids[index]}
                  scene={scene}
                  widthPercent={widthPercent}
                  isSelected={selectedIndex === index}
                  onSelect={() => setSelectedIndex(index)}
                  onDelete={onDelete ? () => handleDelete() : undefined}
                />
              );
            })}
          </div>
        </SortableContextAny>

        {/* 🔴 当前进度条 */}
        <div
          className={S.progressBar}
          style={{
            left: `${totalDuration ? (currentTime / totalDuration) * 100 : 0}%`
          }}>
          <div
            className={S.progressBar_top}
            onPointerMove={(e) => isDragging && handleDrag(e)}
            onPointerDown={(e) => {
              if (isSorting) return;
              setIsDragging(true);
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerUp={(e) => {
              setIsDragging(false);
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {
                // ignore
              }
            }}
            onPointerCancel={() => setIsDragging(false)}
          />
          <div className={S.progressBar_bottom} />
        </div>
      </div>
    </DndContext>
  );
}
