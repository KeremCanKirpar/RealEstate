import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, CheckCircle2, Home, MapPin, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { Button } from "../components/Button";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PublicPropertyCard } from "../components/PublicPropertyCard";
import type { ListingType } from "../types";

const heroImage = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d";

export function PublicHomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState<ListingType | "">("");

  const featuredQuery = useQuery({
    queryKey: ["public-properties", "featured"],
    queryFn: () => publicApi.listProperties({ pageSize: 3, sortBy: "createdAt", sortDirection: "desc" }),
  });

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (listingType) params.set("listingType", listingType);
    navigate(`/musteri/ilanlar${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <main>
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
        <img src={heroImage} alt="Lüks konut salonu" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/65" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary-container backdrop-blur">
              <Building2 className="h-4 w-4" />
              Premium gayrimenkul portföyü
            </p>
            <h1 className="font-heading text-5xl font-black leading-tight text-white md:text-7xl">
              Satılık ve kiralık ilanları keşfedin
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-fixed-dim">
              Beğendiğiniz ilan için talep bırakın; müşteri kaydınız ve arama görevi doğrudan EstateFlow yönetici paneline düşsün.
            </p>
          </div>

          <form onSubmit={submitSearch} className="mt-10 grid max-w-4xl gap-3 rounded-card border border-white/25 bg-white/95 p-3 shadow-luxury md:grid-cols-[1fr_180px_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Şehir, ilçe veya ilan başlığı ara"
                className="h-[52px] w-full rounded-xl border border-outline-variant bg-white py-4 pl-12 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </label>
            <select
              aria-label="İlan türü"
              value={listingType}
              onChange={(event) => setListingType(event.target.value as ListingType | "")}
              className="h-[52px] rounded-xl border border-outline-variant bg-white px-4 py-4 text-sm font-semibold text-primary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            >
              <option value="">Tüm ilanlar</option>
              <option value="ForSale">Satılık</option>
              <option value="ForRent">Kiralık</option>
            </select>
            <Button type="submit" className="h-full min-h-[52px] bg-secondary text-white shadow-luxury hover:bg-secondary/90" icon={<ArrowRight className="h-4 w-4" />}>
              Ara
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto -mt-10 grid max-w-7xl gap-5 px-5 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          ["Aktif portföy", "Yalnızca yayındaki ilanlar müşteri sitesinde görünür."],
          ["Güvenli talep", "Ziyaretçi bilgisi müşteri ve görev olarak panele aktarılır."],
          ["Hızlı dönüş", "Admin için otomatik takip görevi oluşturulur."],
        ].map(([title, text]) => (
          <div key={title} className="luxury-card p-6">
            <CheckCircle2 className="h-6 w-6 text-secondary" />
            <h2 className="mt-4 font-heading text-xl font-black text-primary">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Öne çıkanlar</p>
            <h2 className="mt-2 font-heading text-4xl font-black text-primary">Yeni Aktif İlanlar</h2>
          </div>
          <Link to="/musteri/ilanlar" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-secondary">
            Tüm ilanlar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredQuery.isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : featuredQuery.data?.items.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredQuery.data.items.map((property) => (
              <PublicPropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="luxury-card p-8 text-center">
            <Home className="mx-auto h-10 w-10 text-secondary" />
            <h3 className="mt-4 font-heading text-2xl font-black text-primary">Yayında ilan yok</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Aktif ilan eklendiğinde burada görünecek.</p>
          </div>
        )}
      </section>

      <section className="bg-primary px-5 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary-container">Müşteri talebi</p>
            <h2 className="mt-3 font-heading text-4xl font-black">Aradığınız evi birlikte bulalım</h2>
            <p className="mt-4 max-w-2xl text-primary-fixed-dim">
              Konum, bütçe ve beklentinizi paylaşın; ekip sizi uygun portföylerle eşleştirsin.
            </p>
          </div>
          <Link to="/musteri/talep" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary-container px-6 text-sm font-bold text-primary transition hover:bg-white">
            Talep Bırak
            <MapPin className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
