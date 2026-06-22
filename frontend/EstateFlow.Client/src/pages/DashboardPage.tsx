import { useQueries } from "@tanstack/react-query";
import { ArrowUpRight, Building2, CalendarDays, CheckCircle2, HandCoins, Home, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AppointmentCard } from "../components/AppointmentCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PropertyCard } from "../components/PropertyCard";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { dashboardApi } from "../api/dashboardApi";
import { compactNumber, currency, taskStatusLabel } from "../utils/format";

export function DashboardPage() {
  const [statsQuery, propertiesQuery, appointmentsQuery, customersQuery, taskSummaryQuery] = useQueries({
    queries: [
      { queryKey: ["dashboard", "stats"], queryFn: dashboardApi.stats },
      { queryKey: ["dashboard", "recent-properties"], queryFn: dashboardApi.recentProperties },
      { queryKey: ["dashboard", "upcoming-appointments"], queryFn: dashboardApi.upcomingAppointments },
      { queryKey: ["dashboard", "latest-customers"], queryFn: dashboardApi.latestCustomers },
      { queryKey: ["dashboard", "task-summary"], queryFn: dashboardApi.taskSummary },
    ],
  });

  const stats = statsQuery.data;
  const activePercent = stats ? Math.min(Math.round((stats.activeListings / Math.max(stats.totalProperties, 1)) * 100), 100) : 0;
  const dealPercent = stats ? Math.min(Math.round((stats.completedDeals / Math.max(stats.totalProperties, 1)) * 100), 100) : 0;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">EstateFlow Elit Danışman</p>
          <h1 className="mt-2 font-heading text-4xl font-black text-primary">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">Portföy, müşteri ve randevular tek odaklı danışman çalışma alanında.</p>
        </div>
        <Link
          to="/panel/properties/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-secondary px-5 text-sm font-bold text-white shadow-luxury transition hover:bg-secondary/90"
        >
          <Plus className="h-4 w-4" />
          İlan Ekle
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Toplam İlan" value={stats?.totalProperties ?? "-"} icon={<Building2 className="h-5 w-5" />} detail="Yönetilen portföy sayısı" />
        <StatCard title="Aktif İlanlar" value={stats?.activeListings ?? "-"} icon={<Home className="h-5 w-5" />} detail="Açık satış ve kiralama dosyaları" />
        <StatCard title="Müşteriler" value={stats?.customers ?? "-"} icon={<Users className="h-5 w-5" />} detail="Takip edilen müşteri kayıtları" />
        <StatCard title="Bu Haftaki Randevular" value={stats?.appointmentsThisWeek ?? "-"} icon={<CalendarDays className="h-5 w-5" />} detail="Planlanan danışman takvimi" />
        <StatCard title="Tamamlanan İşlemler" value={stats?.completedDeals ?? "-"} icon={<CheckCircle2 className="h-5 w-5" />} detail="Satılan ve kiralanan ilanlar" />
        <StatCard
          title="Tahmini Komisyon"
          value={stats ? compactNumber(stats.estimatedCommission) : "-"}
          icon={<HandCoins className="h-5 w-5" />}
          detail={stats ? currency.format(stats.estimatedCommission) : "Öngörülen gelir"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="grid gap-6">
          <div className="luxury-card grid gap-6 p-6 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Gelir Nabzı</p>
              <p className="mt-3 font-heading text-4xl font-black text-primary">{stats ? currency.format(stats.estimatedCommission) : "-"}</p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">Aktif ve tamamlanan dosyalar üzerinden tahmini komisyon.</p>
              <div className="mt-6 grid gap-4">
                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                    <span>Aktif İlanlar</span>
                    <span>{activePercent}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-surface-container-high">
                    <div className="h-3 rounded-full bg-primary" style={{ width: `${activePercent}%` }} />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                    <span>Kapanış İvmesi</span>
                    <span>{dealPercent}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-surface-container-high">
                    <div className="h-3 rounded-full bg-secondary" style={{ width: `${dealPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-primary p-5 text-white">
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed-dim">Danışman Odağı</p>
                  <h2 className="mt-3 font-heading text-2xl font-bold">Günlük detayları kaybetmeden yüksek değerli akış.</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/panel/appointments" className="rounded-xl bg-white/10 p-4 transition hover:bg-white/15">
                    <CalendarDays className="h-5 w-5 text-secondary-container" />
                    <p className="mt-3 text-sm font-bold">Takvim</p>
                  </Link>
                  <Link to="/panel/tasks" className="rounded-xl bg-white/10 p-4 transition hover:bg-white/15">
                    <ArrowUpRight className="h-5 w-5 text-secondary-container" />
                    <p className="mt-3 text-sm font-bold">Görevler</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-primary">Son İlanlar</h2>
              <Link to="/panel/properties" className="text-sm font-bold text-secondary hover:text-primary">
                Tümünü gör
              </Link>
            </div>
            {propertiesQuery.isLoading ? (
              <LoadingSkeleton rows={3} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {propertiesQuery.data?.map((property) => <PropertyCard key={property.id} property={property} />)}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-primary">Yaklaşan Randevular</h2>
            <Link to="/panel/appointments" className="text-sm font-bold text-secondary hover:text-primary">
              Planla
            </Link>
          </div>
          {appointmentsQuery.isLoading ? (
            <LoadingSkeleton rows={3} />
          ) : (
            <div className="grid gap-3">
              {appointmentsQuery.data?.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="luxury-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-primary">Son Müşteriler</h2>
            <Users className="h-5 w-5 text-secondary" />
          </div>
          <div className="grid gap-3">
            {customersQuery.data?.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-4">
                <div>
                  <p className="font-bold text-primary">{customer.fullName}</p>
                  <p className="text-sm text-on-surface-variant">{customer.phone}</p>
                </div>
                <StatusBadge>{customer.status}</StatusBadge>
              </div>
            ))}
          </div>
        </div>

        <div className="luxury-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-primary">Görev Özeti</h2>
            <CheckCircle2 className="h-5 w-5 text-secondary" />
          </div>
          <div className="grid gap-3">
            {taskSummaryQuery.data?.map((summary) => (
              <div key={summary.status} className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-4">
                <span className="font-bold text-on-surface">{taskStatusLabel[summary.status]}</span>
                <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">{summary.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
