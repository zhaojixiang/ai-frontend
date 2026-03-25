interface TimelineItemProps {
  scene: any;
  duration: number;
  onClick: () => void;
}

export default function TimelineItem({ scene, duration, onClick }: TimelineItemProps) {
  const widthPercent = ((scene.end - scene.start) / duration) * 100;

  return (
    <div
      onClick={onClick}
      style={{
        width: `${widthPercent}%`,
        background: '#4caf50',
        borderRight: '1px solid #000',
        cursor: 'pointer',
        position: 'relative'
      }}>
      <span
        style={{
          position: 'absolute',
          fontSize: 10,
          color: '#fff'
        }}>
        {scene.index}
      </span>
    </div>
  );
}
