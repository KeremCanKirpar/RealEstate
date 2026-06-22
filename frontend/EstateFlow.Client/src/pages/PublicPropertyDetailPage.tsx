import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BedDouble, CalendarDays, Flame, Home, MapPin, Ruler } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { LeadForm } from "../components/LeadForm";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { StatusBadge } from "../components/StatusBadge";
import { currency, listingTypeLabel, propertyTypeLabel, shortDate } from "../utils/format";

const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

export function PublicPropertyDetailPage() {
  const { id } = useParams();
  const propertyId = Number(id);
  const query = useQuery({
    queryKey: ["public-property", propertyId],
    queryFn: () => publicApi.propertyDetail(propertyId),
    enabled: Boolean(propertyId),
  });

  if (query.isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <LoadingSkeleton rows={5} />
      </main>
    );
  }

  if (!query.data) return null;

  const property = query.data;
  const mainImage = property.images.find((image) => image.isMainImage)?.imageUrl ?? property.images[0]?.imageUrl ?? fallbackImage;
  const gallery = property.images.length ? property.images : [{ id: 0, imageUrl: fallbackImage, isMainImage: true }];

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-6 lg:px-8">
      <Link to="/musteri/ilanlar" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-primary transition hover:text-secondary">
        <ArrowLeft className="h-4 w-4" />
        İlanlara dön
      </Link>

      <section className="relative min-h-[520px] overflow-hidden rounded-card shadow-luxury">
        <img src={mainImage} alt={property.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-transparent" />
        <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="gold">{listingTypeLabel[property.listingType]}</StatusBadge>
            <StatusBadge>{propertyTypeLabel[property.propertyType]}</StatusBadge>
          </div>
          <div className="max-w-4xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-secondary-container">
              <MapPin className="h-4 w-4" />
              {[property.city, property.district, property.neighborhood].filter(Boolean).join(", ")}
            </p>
            <h1 className="font-heading text-4xl font-black leading-tight text-white md:text-6xl">{property.title}</h1>
            <p className="mt-5 font-heading text-4xl font-black text-secondary-container">{currency.format(property.price)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-6">
          <div className="luxury-card p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailMetric icon={<Ruler className="h-5 w-5" />} label="Alan" value={`${property.squareMeters} m2`} />
              <DetailMetric icon={<BedDouble className="h-5 w-5" />} label="Oda" value={property.roomCount} />
              <DetailMetric icon={<Home className="h-5 w-5" />} label="Kat" value={property.floor?.toString() ?? "-"} />
              <DetailMetric icon={<CalendarDays className="h-5 w-5" />} label="Yayın tarihi" value={shortDate.format(new Date(property.createdAt))} />
            </div>
          </div>

          <div className="luxury-card p-6">
            <h2 className="font-heading text-2xl font-black text-primary">İlan Açıklaması</h2>
            <p className="mt-4 whitespace-pre-line leading-8 text-on-surface-variant">{property.description}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <InfoBox label="Isıtma" value={property.heatingType ?? "-"} />
              <InfoBox label="Eşyalı" value={property.isFurnished ? "Evet" : "Hayır"} />
              <InfoBox label="Bina yaşı" value={property.buildingAge?.toString() ?? "-"} />
              <InfoBox label="Toplam kat" value={property.totalFloors?.toString() ?? "-"} />
              <InfoBox label="Aidat" value={property.dues ? currency.format(property.dues) : "-"} />
              <InfoBox label="Depozito" value={property.deposit ? currency.format(property.deposit) : "-"} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {gallery.slice(0, 3).map((image) => (
              <img key={image.id} src={image.imageUrl} alt={property.title} className="h-44 w-full rounded-2xl object-cover shadow-soft" />
            ))}
          </div>
        </div>

        <aside className="luxury-card h-fit p-6 xl:sticky xl:top-28">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">İlan talebi</p>
            <h2 className="mt-2 font-heading text-2xl font-black text-primary">Bu ilan için bilgi alın</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              Bilgileriniz panele müşteri kaydı ve takip görevi olarak aktarılır.
            </p>
          </div>
          <LeadForm property={property} compact />
        </aside>
      </section>
    </main>
  );
}

function DetailMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-low p-4">
      <div className="mb-3 text-secondary">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">{label}</p>
      <p className="mt-1 font-heading text-xl font-black text-primary">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant p-4">
      <div className="mb-2 flex items-center gap-2 text-secondary">
        <Flame className="h-4 w-4" />
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">{label}</p>
      </div>
      <p className="font-bold text-primary">{value}</p>
    </div>
  );
}
