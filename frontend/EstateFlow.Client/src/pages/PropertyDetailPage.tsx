import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Edit, Home, MapPin, Ruler, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { propertiesApi } from "../api/propertiesApi";
import { Button } from "../components/Button";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { StatusBadge } from "../components/StatusBadge";
import { currency, listingTypeLabel, propertyStatusLabel, propertyTypeLabel, shortDate } from "../utils/format";

export function PropertyDetailPage() {
  const { id } = useParams();
  const propertyId = Number(id);
  const query = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertiesApi.detail(propertyId),
    enabled: Boolean(propertyId),
  });

  if (query.isLoading) return <LoadingSkeleton rows={4} />;
  const property = query.data;
  if (!property) return null;

  const image = property.images.find((item) => item.isMainImage)?.imageUrl ?? property.images[0]?.imageUrl ?? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

  return (
    <div className="grid gap-6">
      <section className="relative min-h-[460px] overflow-hidden rounded-card shadow-luxury">
        <img src={image} alt={property.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-transparent" />
        <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="gold">{listingTypeLabel[property.listingType]}</StatusBadge>
              <StatusBadge>{propertyStatusLabel[property.status]}</StatusBadge>
            </div>
            <Link to={`/panel/properties/${property.id}/edit`}>
              <Button className="bg-white text-primary hover:bg-secondary-container" icon={<Edit className="h-4 w-4" />}>
                Düzenle
              </Button>
            </Link>
          </div>
          <div className="max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-secondary-container">
              <MapPin className="h-4 w-4" />
              {property.city}, {property.district}
            </p>
            <h1 className="font-heading text-4xl font-black leading-tight text-white md:text-5xl">{property.title}</h1>
            <p className="mt-5 font-heading text-4xl font-black text-secondary-container">{currency.format(property.price)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="luxury-card p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">İlan Değeri</p>
              <p className="mt-2 font-heading text-3xl font-black text-primary">{currency.format(property.price)}</p>
            </div>
            <StatusBadge tone="gold">{propertyTypeLabel[property.propertyType]}</StatusBadge>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-surface-container-low p-4">
              <Ruler className="mb-3 h-5 w-5 text-primary" />
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Alan</dt>
              <dd className="mt-1 font-heading text-xl font-bold text-primary">{property.squareMeters} m2</dd>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <Home className="mb-3 h-5 w-5 text-primary" />
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Oda</dt>
              <dd className="mt-1 font-heading text-xl font-bold text-primary">{property.roomCount}</dd>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Kat</dt>
              <dd className="mt-1 font-heading text-xl font-bold text-primary">{property.floor ?? "-"}</dd>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <CalendarDays className="mb-3 h-5 w-5 text-primary" />
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Oluşturma</dt>
              <dd className="mt-1 font-heading text-xl font-bold text-primary">{shortDate.format(new Date(property.createdAt))}</dd>
            </div>
          </dl>
          <div className="mt-6 rounded-2xl bg-primary p-5 text-white">
            <div className="mb-3 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-secondary-container" />
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-fixed-dim">Mülk Sahibi</p>
            </div>
            <p className="font-heading text-xl font-bold">{property.ownerName}</p>
            <p className="mt-1 text-sm text-primary-fixed-dim">{property.ownerPhone}</p>
          </div>
        </div>

        <div className="luxury-card p-6">
          <h2 className="font-heading text-2xl font-bold text-primary">Açıklama</h2>
          <p className="mt-4 leading-8 text-on-surface-variant">{property.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-outline-variant p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Isıtma</p>
              <p className="mt-1 font-bold text-primary">{property.heatingType ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Eşyalı</p>
              <p className="mt-1 font-bold text-primary">{property.isFurnished ? "Evet" : "Hayır"}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Aidat</p>
              <p className="mt-1 font-bold text-primary">{property.dues ? currency.format(property.dues) : "-"}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Depozito</p>
              <p className="mt-1 font-bold text-primary">{property.deposit ? currency.format(property.deposit) : "-"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
