import { Bell, Menu, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function TopNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg bg-white text-primary shadow-soft lg:hidden" aria-label="Menü">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden h-11 w-[min(46vw,620px)] items-center gap-3 rounded-full bg-surface-container-low px-4 ring-1 ring-outline-variant md:flex">
            <Search className="h-5 w-5 text-outline" />
            <input placeholder="İlan, anlaşma veya müşteri ara..." className="w-full bg-transparent text-sm outline-none placeholder:text-on-surface-variant/70" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="hidden h-11 min-w-[126px] items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-bold tracking-wide text-white shadow-soft transition hover:bg-primary-container md:flex"
            onClick={() => navigate("/panel/properties/new")}
          >
            <Plus className="h-4 w-4" />
            Hızlı Ekle
          </button>
          <button type="button" className="relative grid h-10 w-10 place-items-center text-primary transition hover:text-secondary" aria-label="Bildirimler">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-surface" />
          </button>
          <div className="flex items-center gap-3 border-l border-outline-variant pl-4">
            <div className="hidden text-right xl:block">
              <p className="whitespace-nowrap text-sm font-bold tracking-wide text-primary">{user?.fullName ?? "EstateFlow"}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">{user?.role === "Admin" ? "Yönetici" : "Danışman"}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-secondary-container bg-primary text-xs font-bold text-white">
              {user?.fullName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2) ?? "EF"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
