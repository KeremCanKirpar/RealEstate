import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customersApi } from "../api/customersApi";
import { Button } from "../components/Button";
import { CustomerTable } from "../components/CustomerTable";
import { EmptyState } from "../components/EmptyState";
import { FilterDropdown } from "../components/FilterDropdown";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { SearchInput } from "../components/SearchInput";
import type { Customer } from "../types";

export function CustomersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");

  const query = useQuery({
    queryKey: ["customers", { search, customerType, status, source }],
    queryFn: () => customersApi.list({ search, customerType, status, source, pageSize: 24 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (customer: Customer) => customersApi.remove(customer.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const customers = query.data?.items ?? [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Özel CRM</p>
          <h1 className="mt-2 font-heading text-4xl font-black text-primary">Müşteriler</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">Alıcıları, kiracıları ve mülk sahiplerini notlar ve eşleşmelerle takip edin.</p>
        </div>
        <Button className="bg-secondary text-white shadow-luxury hover:bg-secondary/90" icon={<Plus className="h-4 w-4" />} onClick={() => navigate("/panel/customers/new")}>
          Müşteri ekle
        </Button>
      </div>

      <section className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="luxury-card bg-primary p-6 text-white">
          <Users className="h-8 w-8 text-secondary-container" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed-dim">Aktif İlişki Masası</p>
          <p className="mt-3 font-heading text-4xl font-black">{query.data?.totalCount ?? customers.length}</p>
          <p className="mt-2 text-sm leading-6 text-primary-fixed-dim">Bu danışman çalışma alanındaki müşteri kayıtları.</p>
        </div>
        <div className="luxury-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
              <Filter className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-primary">CRM Filtreleri</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_170px_170px_170px]">
            <SearchInput value={search} onChange={setSearch} placeholder="Ad, telefon veya konum ara" />
            <FilterDropdown label="Tür" value={customerType} onChange={setCustomerType} options={[{ value: "Buyer", label: "Alıcı" }, { value: "Tenant", label: "Kiracı" }, { value: "PropertyOwner", label: "Mal sahibi" }]} />
            <FilterDropdown
              label="Durum"
              value={status}
              onChange={setStatus}
              options={[
                { value: "New", label: "Yeni" },
                { value: "Interested", label: "İlgili" },
                { value: "Contacted", label: "Görüşüldü" },
                { value: "DealMade", label: "Anlaşma" },
                { value: "Passive", label: "Pasif" },
              ]}
            />
            <FilterDropdown label="Kaynak" value={source} onChange={setSource} options={[{ value: "web", label: "Web Talebi" }]} />
          </div>
        </div>
      </section>

      {query.isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : customers.length === 0 ? (
        <EmptyState title="Müşteri bulunamadı" action={<Button onClick={() => navigate("/panel/customers/new")}>Müşteri ekle</Button>} />
      ) : (
        <CustomerTable customers={customers} onView={(customer) => navigate(`/panel/customers/${customer.id}`)} onDelete={(customer) => deleteMutation.mutate(customer)} />
      )}
    </div>
  );
}
