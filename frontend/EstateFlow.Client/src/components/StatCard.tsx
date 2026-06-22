import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  detail?: string;
  icon: ReactNode;
}

export function StatCard({ title, value, detail, icon }: StatCardProps) {
  return (
    <div className="luxury-card luxury-card-hover p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant">{title}</p>
          <p className="mt-4 font-heading text-3xl font-bold text-primary">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-surface-container text-secondary">{icon}</div>
      </div>
      {detail && <p className="mt-4 text-sm text-on-surface-variant">{detail}</p>}
    </div>
  );
}
