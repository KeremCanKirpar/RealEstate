import { Building2, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "../utils/cn";

const links = [
  { to: "/musteri", label: "Ana Sayfa", end: true },
  { to: "/musteri/ilanlar", label: "İlanlar" },
  { to: "/musteri/talep", label: "Talep Bırak" },
];

export function PublicLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-40 border-b border-outline-variant/70 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link to="/musteri" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-soft">
              <Building2 className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-heading text-2xl font-black leading-none text-primary">EstateFlow</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">Gayrimenkul Danışmanlığı</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-5 py-2 text-sm font-bold text-on-surface-variant transition hover:bg-primary/5 hover:text-primary",
                    isActive && "bg-primary text-white hover:bg-primary hover:text-white",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/panel/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-white px-5 text-sm font-bold text-primary transition hover:border-secondary hover:text-secondary"
            >
              <LogIn className="h-4 w-4" />
              Yönetici Girişi
            </Link>
          </div>

          <button
            type="button"
            aria-label="Menüyü aç"
            onClick={() => setIsOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-outline-variant bg-white text-primary lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-outline-variant bg-white px-5 py-4 lg:hidden">
            <nav className="grid gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn("rounded-xl px-4 py-3 text-sm font-bold text-primary", isActive ? "bg-secondary-container" : "bg-surface-container-low")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/panel/login"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white"
              >
                Yönetici Girişi
              </Link>
            </nav>
          </div>
        )}
      </header>

      <Outlet />

      <footer className="border-t border-outline-variant bg-primary text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="font-heading text-2xl font-black">EstateFlow</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-fixed-dim">
              Satılık ve kiralık portföyler için hızlı talep bırakın; danışman ekibi sizin için en uygun eşleşmeleri panele taşır.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/musteri/ilanlar" className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20">
              İlanları Gör
            </Link>
            <Link to="/musteri/talep" className="rounded-lg bg-secondary-container px-4 py-2 text-sm font-bold text-primary transition hover:bg-white">
              Talep Bırak
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
