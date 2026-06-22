import { Heart, MapPin, MoreVertical } from "lucide-react";
import type { Property } from "../types";
import { currency, listingTypeLabel, propertyStatusLabel, propertyTypeLabel } from "../utils/format";
import { StatusBadge } from "./StatusBadge";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const mainImage = property.images.find((image) => image.isMainImage)?.imageUrl ?? property.images[0]?.imageUrl ?? fallbackImage;

  return (
    <button
      type="button"
      onClick={onClick}
      className="luxury-card luxury-card-hover overflow-hidden text-left"
    >
      <div className="relative h-52">
        <img src={mainImage} alt={property.title} className="h-full w-full object-cover" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            {propertyTypeLabel[property.propertyType]}
          </span>
          <span className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            {listingTypeLabel[property.listingType]}
          </span>
        </div>
        <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/70 text-white backdrop-blur">
          <Heart className="h-6 w-6 fill-white stroke-white" />
        </div>
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-heading text-2xl font-bold leading-tight text-primary">{property.title}</h3>
          <StatusBadge>{propertyStatusLabel[property.status]}</StatusBadge>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <MapPin className="h-4 w-4 text-primary" />
          {property.city}, {property.district}
        </div>
        <div className="mt-6 grid grid-cols-3 divide-x divide-outline-variant border-y border-outline-variant/60 py-4 text-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Oda</p>
            <p className="mt-1 font-heading text-xl font-bold text-primary">{property.roomCount}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kat</p>
            <p className="mt-1 font-heading text-xl font-bold text-primary">{property.floor ?? "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">M2</p>
            <p className="mt-1 font-heading text-xl font-bold text-primary">{property.squareMeters}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="font-heading text-2xl font-bold text-secondary">{currency.format(property.price)}</p>
          <MoreVertical className="h-5 w-5 text-primary" />
        </div>
      </div>
    </button>
  );
}
