export function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div>
      <h3>加载失败</h3>
      <button onClick={onRetry}>重试</button>
    </div>
  );
}
