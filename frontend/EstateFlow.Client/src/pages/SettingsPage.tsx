import { ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Çalışma Alanı</p>
        <h1 className="mt-2 font-heading text-4xl font-black text-primary">Ayarlar</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Çalışma alanı kimliği ve ortam yapılandırması.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="luxury-card p-6">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">Hesap</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <div>
              <dt className="text-on-surface-variant">Ad soyad</dt>
              <dd className="font-bold text-primary">{user?.fullName}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">E-posta</dt>
              <dd className="font-bold text-primary">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Rol</dt>
              <dd className="font-bold text-primary">{user?.role === "Admin" ? "Yönetici" : "Danışman"}</dd>
            </div>
          </dl>
        </div>

        <div className="luxury-card p-6">
          <h2 className="font-heading text-xl font-bold text-primary">API</h2>
          <p className="mt-4 rounded-2xl bg-surface-container-low p-4 font-mono text-sm text-primary">{import.meta.env.VITE_API_BASE_URL}</p>
        </div>
      </section>
    </div>
  );
}
