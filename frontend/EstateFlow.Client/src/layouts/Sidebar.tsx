import { NavLink } from "react-router-dom";
import { BarChart3, Building2, CalendarDays, CheckSquare, FileText, LayoutDashboard, LogOut, Settings, Sparkles, Users } from "lucide-react";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../utils/cn";

const navItems = [
  { to: "/panel/dashboard", label: "Gösterge Paneli", icon: LayoutDashboard },
  { to: "/panel/properties", label: "İlanlar", icon: Building2 },
  { to: "/panel/customers", label: "Müşteriler", icon: Users },
  { to: "/panel/appointments", label: "Randevular", icon: CalendarDays },
  { to: "/panel/tasks", label: "Görevler", icon: CheckSquare },
  { to: "/panel/documents", label: "Dokümanlar", icon: FileText },
  { to: "/panel/reports", label: "Raporlar", icon: BarChart3 },
  { to: "/panel/settings", label: "Ayarlar", icon: Settings },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col bg-primary-container p-6 text-on-primary lg:flex">
      <div className="mb-10">
        <p className="font-heading text-3xl font-extrabold leading-none tracking-tight text-white">EstateFlow</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-on-primary-container/70">Elit Danışman</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex h-12 items-center gap-4 rounded-lg px-4 text-sm font-bold tracking-wide transition",
                isActive
                  ? "scale-[0.98] bg-primary text-white shadow-inner"
                  : "text-on-primary-container/70 hover:bg-primary/45 hover:text-white",
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-on-primary-container/10 pt-6">
        <div className="mb-4 rounded-xl bg-secondary p-4 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/75">Plan Durumu</p>
          <p className="mt-2 font-heading text-xl font-bold leading-tight">Premium'a Yükselt</p>
          <button className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-bold text-primary transition hover:bg-surface">
            <Sparkles className="h-4 w-4" />
            Özellikleri Aç
          </button>
        </div>
        <Button type="button" variant="ghost" className="w-full justify-start text-on-primary-container/80 hover:bg-primary/40 hover:text-white" icon={<LogOut className="h-4 w-4" />} onClick={logout}>
          Çıkış
        </Button>
      </div>
    </aside>
  );
}
