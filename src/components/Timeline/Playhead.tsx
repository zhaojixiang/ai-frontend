interface PlayheadProps {
  currentTime: number;
  duration: number;
}

export default function Playhead({ currentTime, duration }: PlayheadProps) {
  const left = (currentTime / duration) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: `${left}%`,
        width: 2,
        height: '100%',
        background: 'red'
      }}
    />
  );
}
