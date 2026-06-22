import { zodResolver } from "@hookform/resolvers/zod";
import { Search, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";
import type { Customer, CustomerPayload } from "../../types";

const optionalNumber = z.number().optional();
const optionalNumberField = {
  setValueAs: (value: string) => (value === "" ? undefined : Number(value)),
};

const customerSchema = z.object({
  fullName: z.string().min(2, "Ad soyad gerekli"),
  phone: z.string().min(6, "Telefon gerekli"),
  email: z.string().email().optional().or(z.literal("")),
  customerType: z.enum(["Buyer", "Tenant", "PropertyOwner"]),
  budgetMin: optionalNumber,
  budgetMax: optionalNumber,
  desiredPropertyType: z.enum(["Apartment", "Villa", "Land", "Office", "Shop"]).optional().or(z.literal("")),
  desiredCity: z.string().optional().nullable(),
  desiredDistrict: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(["New", "Interested", "Contacted", "DealMade", "Passive"]),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  initialCustomer?: Customer;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: CustomerPayload) => Promise<void> | void;
}

function defaults(customer?: Customer): CustomerFormValues {
  return {
    fullName: customer?.fullName ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    customerType: customer?.customerType ?? "Buyer",
    budgetMin: customer?.budgetMin ?? undefined,
    budgetMax: customer?.budgetMax ?? undefined,
    desiredPropertyType: customer?.desiredPropertyType ?? "",
    desiredCity: customer?.desiredCity ?? "",
    desiredDistrict: customer?.desiredDistrict ?? "",
    notes: customer?.notes ?? "",
    status: customer?.status ?? "New",
  };
}

export function CustomerForm({ initialCustomer, submitLabel, isSubmitting, onSubmit }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaults(initialCustomer),
  });

  return (
    <form
      className="grid gap-6"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          ...values,
          email: values.email || null,
          desiredPropertyType: values.desiredPropertyType || null,
          desiredCity: values.desiredCity || null,
          desiredDistrict: values.desiredDistrict || null,
          notes: values.notes || null,
          budgetMin: values.budgetMin ?? null,
          budgetMax: values.budgetMax ?? null,
        }),
      )}
    >
      <section className="luxury-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">Müşteri Profili</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Ad soyad" error={errors.fullName?.message} {...register("fullName")} />
          <Input label="Telefon" error={errors.phone?.message} {...register("phone")} />
          <Input label="E-posta" error={errors.email?.message} {...register("email")} />
          <Select label="Müşteri türü" {...register("customerType")}>
            <option value="Buyer">Alıcı</option>
            <option value="Tenant">Kiracı</option>
            <option value="PropertyOwner">Mal sahibi</option>
          </Select>
          <Select label="Durum" {...register("status")}>
            <option value="New">Yeni</option>
            <option value="Interested">İlgili</option>
            <option value="Contacted">Görüşüldü</option>
            <option value="DealMade">Anlaşma</option>
            <option value="Passive">Pasif</option>
          </Select>
        </div>
      </section>

      <section className="luxury-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <Search className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">Arama Kriterleri</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Minimum bütçe" type="number" {...register("budgetMin", optionalNumberField)} />
          <Input label="Maksimum bütçe" type="number" {...register("budgetMax", optionalNumberField)} />
          <Select label="İstenen emlak türü" {...register("desiredPropertyType")}>
            <option value="">Fark etmez</option>
            <option value="Apartment">Daire</option>
            <option value="Villa">Villa</option>
            <option value="Land">Arsa</option>
            <option value="Office">Ofis</option>
            <option value="Shop">Mağaza</option>
          </Select>
          <Input label="İstenen şehir" {...register("desiredCity")} />
          <Input label="İstenen ilçe" {...register("desiredDistrict")} />
          <Textarea label="Notlar" className="lg:col-span-2" {...register("notes")} />
        </div>
      </section>

      <div className="flex justify-end rounded-card bg-primary p-4 shadow-soft">
        <Button type="submit" className="bg-secondary text-white hover:bg-secondary/90" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
