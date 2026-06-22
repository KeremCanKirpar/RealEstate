import { useQueries } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { dashboardApi } from "../api/dashboardApi";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { currency, taskStatusLabel } from "../utils/format";

export function ReportsPage() {
  const [statsQuery, tasksQuery] = useQueries({
    queries: [
      { queryKey: ["dashboard", "stats"], queryFn: dashboardApi.stats },
      { queryKey: ["dashboard", "task-summary"], queryFn: dashboardApi.taskSummary },
    ],
  });

  if (statsQuery.isLoading) return <LoadingSkeleton rows={4} />;

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">İçgörüler</p>
        <h1 className="mt-2 font-heading text-4xl font-black text-primary">Raporlar</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Portföy performansı ve operasyonel iş yükü.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="luxury-card p-6">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">İşlem Özeti</h2>
          <dl className="mt-5 grid gap-4">
            <div className="flex justify-between border-b border-outline-variant pb-3">
              <dt className="text-on-surface-variant">Tamamlanan işlemler</dt>
              <dd className="font-bold text-primary">{statsQuery.data?.completedDeals ?? 0}</dd>
            </div>
            <div className="flex justify-between border-b border-outline-variant pb-3">
              <dt className="text-on-surface-variant">Aktif ilanlar</dt>
              <dd className="font-bold text-primary">{statsQuery.data?.activeListings ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Tahmini komisyon</dt>
              <dd className="font-bold text-secondary">{currency.format(statsQuery.data?.estimatedCommission ?? 0)}</dd>
            </div>
          </dl>
        </div>

        <div className="luxury-card p-6">
          <h2 className="mb-5 font-heading text-xl font-bold text-primary">Görev Dağılımı</h2>
          <div className="grid gap-4">
            {tasksQuery.data?.map((summary) => (
              <div key={summary.status}>
                <div className="mb-2 flex justify-between text-sm font-bold text-primary">
                  <span>{taskStatusLabel[summary.status]}</span>
                  <span>{summary.count}</span>
                </div>
                <div className="h-3 rounded-full bg-surface-container-high">
                  <div className="h-3 rounded-full bg-secondary" style={{ width: `${Math.min(summary.count * 18, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
