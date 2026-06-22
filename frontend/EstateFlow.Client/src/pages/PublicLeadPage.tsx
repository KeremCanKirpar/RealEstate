import { Building2, CheckCircle2 } from "lucide-react";
import { LeadForm } from "../components/LeadForm";

export function PublicLeadPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <section className="relative min-h-[620px] overflow-hidden rounded-card bg-primary p-8 text-white shadow-luxury">
        <img
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"
          alt="Modern konut iç mekanı"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-primary/55" />
        <div className="relative z-10 flex h-full min-h-[560px] flex-col justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary-container">
              <Building2 className="h-4 w-4" />
              Web müşteri talebi
            </p>
            <h1 className="mt-6 font-heading text-5xl font-black leading-tight">Aradığınız gayrimenkulü bize anlatın</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-primary-fixed-dim">
              Talebiniz yönetici paneline müşteri kaydı ve takip görevi olarak düşer. Ekip sizinle en kısa sürede iletişime geçer.
            </p>
          </div>
          <div className="grid gap-3">
            {["Bütçe ve konum tercihinizi paylaşın", "Satılık veya kiralık ihtiyacınızı belirtin", "Danışman ekibi sizi geri arasın"].map((item) => (
              <p key={item} className="flex items-center gap-3 text-sm font-bold text-white">
                <CheckCircle2 className="h-5 w-5 text-secondary-container" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="luxury-card p-6 sm:p-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Talep formu</p>
          <h2 className="mt-2 font-heading text-3xl font-black text-primary">Müşteri Bilgileri</h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Zorunlu alanlar ad soyad ve telefondur. Diğer bilgiler doğru portföyle eşleşmenizi hızlandırır.
          </p>
        </div>
        <LeadForm />
      </section>
    </main>
  );
}
