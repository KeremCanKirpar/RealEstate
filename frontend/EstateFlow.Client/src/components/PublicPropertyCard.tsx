import { ArrowRight, BedDouble, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import type { PublicProperty } from "../types";
import { currency, listingTypeLabel, propertyTypeLabel } from "../utils/format";

interface PublicPropertyCardProps {
  property: PublicProperty;
}

const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const mainImage = property.images.find((image) => image.isMainImage)?.imageUrl ?? property.images[0]?.imageUrl ?? fallbackImage;

  return (
    <Link to={`/musteri/ilanlar/${property.id}`} className="luxury-card luxury-card-hover group block overflow-hidden">
      <div className="relative h-56">
        <img src={mainImage} alt={property.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {listingTypeLabel[property.listingType]}
          </span>
          <span className="rounded-full bg-secondary-container px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {propertyTypeLabel[property.propertyType]}
          </span>
        </div>
        <p className="absolute bottom-5 left-5 font-heading text-2xl font-black text-white">{currency.format(property.price)}</p>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl font-black leading-tight text-primary">{property.title}</h3>
            <p className="mt-3 flex items-center gap-2 text-sm text-on-surface-variant">
              <MapPin className="h-4 w-4 text-secondary" />
              {[property.city, property.district, property.neighborhood].filter(Boolean).join(", ")}
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-white transition group-hover:bg-secondary">
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-outline-variant pt-5 text-sm">
          <span className="flex items-center gap-2 text-on-surface-variant">
            <BedDouble className="h-4 w-4 text-primary" />
            {property.roomCount}
          </span>
          <span className="flex items-center gap-2 text-on-surface-variant">
            <Ruler className="h-4 w-4 text-primary" />
            {property.squareMeters} m2
          </span>
          <span className="text-on-surface-variant">Kat {property.floor ?? "-"}</span>
        </div>
      </div>
    </Link>
  );
}
