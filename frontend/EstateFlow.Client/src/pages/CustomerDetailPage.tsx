import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Mail, MapPin, Phone, Plus, WalletCards } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { customersApi } from "../api/customersApi";
import { Button } from "../components/Button";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PropertyCard } from "../components/PropertyCard";
import { StatusBadge } from "../components/StatusBadge";
import { Textarea } from "../components/Textarea";
import { currency, customerStatusLabel, customerTypeLabel, shortDate } from "../utils/format";
import { isWebLeadCustomer } from "../utils/leadSource";

export function CustomerDetailPage() {
  const { id } = useParams();
  const customerId = Number(id);
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");

  const [customerQuery, matchesQuery] = useQueries({
    queries: [
      { queryKey: ["customer", customerId], queryFn: () => customersApi.detail(customerId), enabled: Boolean(customerId) },
      { queryKey: ["customer", customerId, "matches"], queryFn: () => customersApi.matchedProperties(customerId), enabled: Boolean(customerId) },
    ],
  });

  const addNoteMutation = useMutation({
    mutationFn: () => customersApi.addNote(customerId, note),
    onSuccess: () => {
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
    },
  });

  if (customerQuery.isLoading) return <LoadingSkeleton rows={4} />;
  const customer = customerQuery.data;
  if (!customer) return null;
  const isWebLead = isWebLeadCustomer(customer);

  return (
    <div className="grid gap-6">
      <div className="luxury-card bg-primary p-6 text-white">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary-container">{customerTypeLabel[customer.customerType]}</p>
            <h1 className="mt-2 font-heading text-4xl font-black">{customer.fullName}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-primary-fixed-dim">
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </span>
              {customer.email && (
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isWebLead && <StatusBadge tone="gold">Web Talebi</StatusBadge>}

            <StatusBadge>{customerStatusLabel[customer.status]}</StatusBadge>
            <span className="text-sm text-primary-fixed-dim">{shortDate.format(new Date(customer.createdAt))}</span>
          </div>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="luxury-card p-6">
          <h2 className="mb-5 font-heading text-xl font-bold text-primary">Profil Özeti</h2>
          <dl className="grid gap-4 text-sm">
            <div className="rounded-2xl bg-surface-container-low p-4">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                <WalletCards className="h-4 w-4 text-primary" />
                Bütçe
              </dt>
              <dd className="mt-2 font-heading text-lg font-bold text-primary">
                {customer.budgetMin ? currency.format(customer.budgetMin) : "-"} - {customer.budgetMax ? currency.format(customer.budgetMax) : "-"}
              </dd>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                <MapPin className="h-4 w-4 text-primary" />
                İstenen konum
              </dt>
              <dd className="mt-2 font-heading text-lg font-bold text-primary">
                {customer.desiredCity ?? "-"} {customer.desiredDistrict ? `/ ${customer.desiredDistrict}` : ""}
              </dd>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Notlar</dt>
              <dd className="mt-2 leading-6 text-on-surface-variant">{customer.notes ?? "-"}</dd>
            </div>
          </dl>
        </div>

        <div className="luxury-card p-6">
          <h2 className="mb-4 font-heading text-xl font-bold text-primary">Müşteri Notları</h2>
          <div className="grid gap-3">
            {customer.customerNotes.map((item) => (
              <div key={item.id} className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4">
                <p className="text-sm leading-6 text-on-surface-variant">{item.note}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-outline">{shortDate.format(new Date(item.createdAt))}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Not ekle" />
            <Button className="bg-secondary text-white hover:bg-secondary/90" icon={<Plus className="h-4 w-4" />} disabled={!note || addNoteMutation.isPending} onClick={() => addNoteMutation.mutate()}>
              Not ekle
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-xl font-bold text-primary">Eşleşen İlanlar</h2>
        {matchesQuery.isLoading ? (
          <LoadingSkeleton rows={2} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matchesQuery.data?.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        )}
      </section>
    </div>
  );
}
