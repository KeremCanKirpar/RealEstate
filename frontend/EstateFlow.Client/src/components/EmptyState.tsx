import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="grid place-items-center rounded-card border border-dashed border-outline-variant bg-white p-12 text-center shadow-soft">
      <h3 className="font-heading text-xl font-bold text-primary">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-on-surface-variant">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
