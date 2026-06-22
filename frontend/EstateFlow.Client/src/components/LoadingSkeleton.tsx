export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-card bg-white/80 shadow-soft ring-1 ring-outline-variant/40" />
      ))}
    </div>
  );
}
