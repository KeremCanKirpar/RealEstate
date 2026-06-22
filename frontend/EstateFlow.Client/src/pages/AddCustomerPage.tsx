import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { customersApi } from "../api/customersApi";
import { CustomerForm } from "../features/customers/CustomerForm";
import type { CustomerPayload } from "../types";

export function AddCustomerPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: CustomerPayload) => customersApi.create(values),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate(`/panel/customers/${customer.id}`);
    },
  });

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">CRM kaydı</p>
        <h1 className="mt-2 font-heading text-4xl font-black text-primary">Müşteri Ekle</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Alıcı, kiracı veya mal sahibi kaydı oluşturun.</p>
      </div>
      <CustomerForm
        submitLabel="Müşteri oluştur"
        isSubmitting={mutation.isPending}
        onSubmit={async (values) => {
          await mutation.mutateAsync(values);
        }}
      />
    </div>
  );
}
