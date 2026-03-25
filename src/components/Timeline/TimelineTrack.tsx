import TimelineItem from './TimelineItem';

interface TimelineTrackProps {
  scenes: any[];
  duration: number;
  onSeek: (time: number) => void;
}

export default function TimelineTrack({ scenes, duration, onSeek }: TimelineTrackProps) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {scenes.map((scene) => (
        <TimelineItem
          key={scene.index}
          scene={scene}
          duration={duration}
          onClick={() => onSeek(scene.start)}
        />
      ))}
    </div>
  );
}
