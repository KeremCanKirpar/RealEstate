import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { propertiesApi } from "../api/propertiesApi";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { FilterDropdown } from "../components/FilterDropdown";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyTable } from "../components/PropertyTable";
import { SearchInput } from "../components/SearchInput";
import type { Property } from "../types";

export function PropertiesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const query = useQuery({
    queryKey: ["properties", { search, listingType, propertyType, status, sortBy }],
    queryFn: () =>
      propertiesApi.list({
        search,
        listingType,
        propertyType,
        status,
        sortBy,
        sortDirection: "desc",
        pageSize: 24,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (property: Property) => propertiesApi.remove(property.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["properties"] }),
  });

  const properties = query.data?.items ?? [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Portföy</p>
          <h1 className="mt-2 font-heading text-4xl font-black text-primary">İlanlar</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">Satış ve kiralama ilanlarını özel danışman çalışma alanından yönetin.</p>
        </div>
        <Button className="bg-secondary text-white shadow-luxury hover:bg-secondary/90" icon={<Plus className="h-4 w-4" />} onClick={() => navigate("/panel/properties/new")}>
          İlan ekle
        </Button>
      </div>

      <section className="luxury-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-primary">Portföy Filtreleri</h2>
              <p className="text-sm text-on-surface-variant">{query.data?.totalCount ?? properties.length} ilan görüntüleniyor</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1.4fr)_repeat(4,minmax(150px,1fr))]">
          <SearchInput value={search} onChange={setSearch} placeholder="Başlık, şehir veya ilçe ara" />
          <FilterDropdown label="İlan türü" value={listingType} onChange={setListingType} options={[{ value: "ForSale", label: "Satılık" }, { value: "ForRent", label: "Kiralık" }]} />
          <FilterDropdown
            label="Emlak türü"
            value={propertyType}
            onChange={setPropertyType}
            options={[
              { value: "Apartment", label: "Daire" },
              { value: "Villa", label: "Villa" },
              { value: "Land", label: "Arsa" },
              { value: "Office", label: "Ofis" },
              { value: "Shop", label: "Mağaza" },
            ]}
          />
          <FilterDropdown label="Durum" value={status} onChange={setStatus} options={[{ value: "Active", label: "Aktif" }, { value: "Passive", label: "Pasif" }, { value: "Sold", label: "Satıldı" }, { value: "Rented", label: "Kiralandı" }]} />
          <FilterDropdown label="Sıralama" value={sortBy} onChange={setSortBy} options={[{ value: "createdAt", label: "En yeni" }, { value: "price", label: "Fiyat" }]} />
        </div>
      </section>

      {query.isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : properties.length === 0 ? (
        <EmptyState title="İlan bulunamadı" action={<Button onClick={() => navigate("/panel/properties/new")}>İlan ekle</Button>} />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} onClick={() => navigate(`/panel/properties/${property.id}`)} />
            ))}
          </div>
          <div>
            <h2 className="mb-4 font-heading text-xl font-bold text-primary">Portföy İndeksi</h2>
          <PropertyTable
            properties={properties}
            onView={(property) => navigate(`/panel/properties/${property.id}`)}
            onEdit={(property) => navigate(`/panel/properties/${property.id}/edit`)}
            onDelete={(property) => deleteMutation.mutate(property)}
          />
          </div>
        </>
      )}
    </div>
  );
}
