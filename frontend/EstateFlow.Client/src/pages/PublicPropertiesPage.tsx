import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { EmptyState } from "../components/EmptyState";
import { FilterDropdown } from "../components/FilterDropdown";
import { Input } from "../components/Input";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PublicPropertyCard } from "../components/PublicPropertyCard";
import { SearchInput } from "../components/SearchInput";
import type { ListingType, PropertyType } from "../types";

export function PublicPropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const listingType = (searchParams.get("listingType") ?? "") as ListingType | "";
  const propertyType = (searchParams.get("propertyType") ?? "") as PropertyType | "";
  const city = searchParams.get("city") ?? "";
  const district = searchParams.get("district") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const query = useQuery({
    queryKey: ["public-properties", { search, listingType, propertyType, city, district, sortBy }],
    queryFn: () =>
      publicApi.listProperties({
        search,
        listingType,
        propertyType,
        city,
        district,
        sortBy,
        sortDirection: "desc",
        pageSize: 24,
      }),
  });

  const properties = query.data?.items ?? [];

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:px-8">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Müşteri portföyü</p>
          <h1 className="mt-2 font-heading text-4xl font-black text-primary">Aktif İlanlar</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Satılık ve kiralık aktif portföyleri inceleyin, beğendiğiniz ilan için talep bırakın.
          </p>
        </div>
        <div className="rounded-full bg-white px-5 py-3 text-sm font-bold text-primary shadow-soft">
          {query.data?.totalCount ?? properties.length} aktif ilan
        </div>
      </section>

      <section className="luxury-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-primary">İlan Filtreleri</h2>
            <p className="text-sm text-on-surface-variant">Konum, tür ve ilan tipine göre daraltın.</p>
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1.3fr)_repeat(5,minmax(140px,1fr))]">
          <SearchInput value={search} onChange={(value) => setParam("search", value)} placeholder="Başlık, şehir veya ilçe ara" />
          <FilterDropdown
            label="İlan türü"
            value={listingType}
            onChange={(value) => setParam("listingType", value)}
            options={[
              { value: "ForSale", label: "Satılık" },
              { value: "ForRent", label: "Kiralık" },
            ]}
          />
          <FilterDropdown
            label="Emlak türü"
            value={propertyType}
            onChange={(value) => setParam("propertyType", value)}
            options={[
              { value: "Apartment", label: "Daire" },
              { value: "Villa", label: "Villa" },
              { value: "Land", label: "Arsa" },
              { value: "Office", label: "Ofis" },
              { value: "Shop", label: "Mağaza" },
            ]}
          />
          <Input aria-label="Şehir" value={city} onChange={(event) => setParam("city", event.target.value)} placeholder="Şehir" />
          <Input aria-label="İlçe" value={district} onChange={(event) => setParam("district", event.target.value)} placeholder="İlçe" />
          <FilterDropdown
            label="Sıralama"
            value={sortBy}
            onChange={(value) => setParam("sortBy", value)}
            options={[
              { value: "createdAt", label: "En yeni" },
              { value: "price", label: "Fiyat" },
            ]}
          />
        </div>
      </section>

      {query.isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : properties.length === 0 ? (
        <EmptyState title="Aktif ilan bulunamadı" description="Filtreleri değiştirerek tekrar deneyin." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PublicPropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}
