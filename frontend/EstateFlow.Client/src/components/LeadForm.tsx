import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { publicApi } from "../api/publicApi";
import type { CustomerType, PropertyType, PublicLeadPayload, PublicProperty } from "../types";
import { customerTypeLabel, propertyTypeLabel } from "../utils/format";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";

const leadSchema = z.object({
  fullName: z.string().min(2, "Ad soyad gerekli").max(120, "Ad soyad çok uzun"),
  phone: z.string().min(7, "Telefon gerekli").max(40, "Telefon çok uzun"),
  email: z.string().email("Geçerli bir e-posta girin").or(z.literal("")).optional(),
  customerType: z.string().optional(),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  desiredPropertyType: z.string().optional(),
  desiredCity: z.string().max(80, "Şehir çok uzun").optional(),
  desiredDistrict: z.string().max(80, "İlçe çok uzun").optional(),
  preferredContactTime: z.string().max(120, "İletişim zamanı çok uzun").optional(),
  notes: z.string().max(1200, "Not çok uzun").optional(),
  website: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  property?: PublicProperty;
  compact?: boolean;
}

const propertyTypes: PropertyType[] = ["Apartment", "Villa", "Land", "Office", "Shop"];
const customerTypes: CustomerType[] = ["Buyer", "Tenant", "PropertyOwner"];

export function LeadForm({ property, compact = false }: LeadFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      customerType: property?.listingType === "ForRent" ? "Tenant" : "Buyer",
      desiredPropertyType: property?.propertyType ?? "",
      desiredCity: property?.city ?? "",
      desiredDistrict: property?.district ?? "",
      website: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: PublicLeadPayload) => publicApi.createLead(payload),
    onSuccess: () => {
      reset({
        customerType: property?.listingType === "ForRent" ? "Tenant" : "Buyer",
        desiredPropertyType: property?.propertyType ?? "",
        desiredCity: property?.city ?? "",
        desiredDistrict: property?.district ?? "",
        website: "",
      });
    },
  });

  const toNumberOrNull = (value?: string) => {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit((values) => {
        mutation.mutate({
          fullName: values.fullName.trim(),
          phone: values.phone.trim(),
          email: values.email?.trim() || null,
          customerType: (values.customerType || null) as CustomerType | null,
          budgetMin: toNumberOrNull(values.budgetMin),
          budgetMax: toNumberOrNull(values.budgetMax),
          desiredPropertyType: (values.desiredPropertyType || null) as PropertyType | null,
          desiredCity: values.desiredCity?.trim() || null,
          desiredDistrict: values.desiredDistrict?.trim() || null,
          notes: values.notes?.trim() || null,
          propertyId: property?.id ?? null,
          preferredContactTime: values.preferredContactTime?.trim() || null,
          website: values.website?.trim() || null,
        });
      })}
    >
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <Input label="Ad soyad" placeholder="Adınız ve soyadınız" error={errors.fullName?.message} {...register("fullName")} />
        <Input label="Telefon" placeholder="05xx xxx xx xx" error={errors.phone?.message} {...register("phone")} />
      </div>
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <Input label="E-posta" placeholder="ornek@eposta.com" error={errors.email?.message} {...register("email")} />
        <Input label="Uygun iletişim zamanı" placeholder="Bugün 14:00 sonrası" error={errors.preferredContactTime?.message} {...register("preferredContactTime")} />
      </div>
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <Select label="Talep türü" error={errors.customerType?.message} {...register("customerType")}>
          {customerTypes.map((type) => (
            <option key={type} value={type}>
              {customerTypeLabel[type]}
            </option>
          ))}
        </Select>
        <Select label="Emlak türü" error={errors.desiredPropertyType?.message} {...register("desiredPropertyType")}>
          <option value="">Fark etmez</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {propertyTypeLabel[type]}
            </option>
          ))}
        </Select>
      </div>
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <Input label="Şehir" placeholder="İstanbul" error={errors.desiredCity?.message} {...register("desiredCity")} />
        <Input label="İlçe" placeholder="Kadıköy" error={errors.desiredDistrict?.message} {...register("desiredDistrict")} />
      </div>
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <Input label="Minimum bütçe" type="number" min="0" placeholder="2500000" error={errors.budgetMin?.message} {...register("budgetMin")} />
        <Input label="Maksimum bütçe" type="number" min="0" placeholder="6000000" error={errors.budgetMax?.message} {...register("budgetMax")} />
      </div>
      <Textarea label="Notunuz" placeholder="Aradığınız konum, bütçe veya sorunuz..." error={errors.notes?.message} {...register("notes")} />

      {mutation.isSuccess && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {mutation.data.message}
        </p>
      )}
      {mutation.isError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {mutation.error instanceof Error ? mutation.error.message : "Talep gönderilemedi."}
        </p>
      )}

      <Button type="submit" className="bg-secondary text-white shadow-luxury hover:bg-secondary/90" icon={<Send className="h-4 w-4" />} disabled={mutation.isPending}>
        {mutation.isPending ? "Gönderiliyor" : "Talebimi Gönder"}
      </Button>
    </form>
  );
}
