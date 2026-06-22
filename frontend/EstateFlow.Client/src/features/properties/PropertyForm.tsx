import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Camera, Home, MapPin, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/Button";
import { ImageUpload } from "../../components/ImageUpload";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";
import type { Property, PropertyPayload } from "../../types";

const optionalNumber = z.number().optional();
const optionalNumberField = {
  setValueAs: (value: string) => (value === "" ? undefined : Number(value)),
};

const propertySchema = z.object({
  title: z.string().min(3, "Başlık gerekli"),
  description: z.string().min(10, "Açıklama gerekli"),
  listingType: z.enum(["ForSale", "ForRent"]),
  propertyType: z.enum(["Apartment", "Villa", "Land", "Office", "Shop"]),
  price: z.number().min(1, "Fiyat gerekli"),
  city: z.string().min(2, "Şehir gerekli"),
  district: z.string().min(2, "İlçe gerekli"),
  neighborhood: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  squareMeters: z.number().min(1, "Metrekare gerekli"),
  roomCount: z.string().min(1, "Oda sayısı gerekli"),
  buildingAge: optionalNumber,
  floor: optionalNumber,
  totalFloors: optionalNumber,
  heatingType: z.string().optional().nullable(),
  isFurnished: z.boolean(),
  dues: optionalNumber,
  deposit: optionalNumber,
  status: z.enum(["Active", "Passive", "Sold", "Rented"]),
  ownerName: z.string().min(2, "Mülk sahibi adı gerekli"),
  ownerPhone: z.string().min(6, "Mülk sahibi telefonu gerekli"),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialProperty?: Property;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: PropertyPayload, imageUrl: string) => Promise<void> | void;
}

function defaults(property?: Property): PropertyFormValues {
  return {
    title: property?.title ?? "",
    description: property?.description ?? "",
    listingType: property?.listingType ?? "ForSale",
    propertyType: property?.propertyType ?? "Apartment",
    price: property?.price ?? 0,
    city: property?.city ?? "",
    district: property?.district ?? "",
    neighborhood: property?.neighborhood ?? "",
    address: property?.address ?? "",
    squareMeters: property?.squareMeters ?? 90,
    roomCount: property?.roomCount ?? "2+1",
    buildingAge: property?.buildingAge ?? undefined,
    floor: property?.floor ?? undefined,
    totalFloors: property?.totalFloors ?? undefined,
    heatingType: property?.heatingType ?? "",
    isFurnished: property?.isFurnished ?? false,
    dues: property?.dues ?? undefined,
    deposit: property?.deposit ?? undefined,
    status: property?.status ?? "Active",
    ownerName: property?.ownerName ?? "",
    ownerPhone: property?.ownerPhone ?? "",
  };
}

export function PropertyForm({ initialProperty, submitLabel, isSubmitting, onSubmit }: PropertyFormProps) {
  const [imageUrl, setImageUrl] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: defaults(initialProperty),
  });

  return (
    <form
      className="grid gap-6"
      onSubmit={handleSubmit((values) =>
        onSubmit(
          {
            ...values,
            neighborhood: values.neighborhood || null,
            address: values.address || null,
            heatingType: values.heatingType || null,
            buildingAge: values.buildingAge ?? null,
            floor: values.floor ?? null,
            totalFloors: values.totalFloors ?? null,
            dues: values.dues ?? null,
            deposit: values.deposit ?? null,
          },
          imageUrl,
        ),
      )}
    >
      <section className="luxury-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <Home className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">Temel Bilgiler</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Başlık" error={errors.title?.message} {...register("title")} />
          <Input label="Fiyat" type="number" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
          <Select label="İlan türü" {...register("listingType")}>
            <option value="ForSale">Satılık</option>
            <option value="ForRent">Kiralık</option>
          </Select>
          <Select label="Emlak türü" {...register("propertyType")}>
            <option value="Apartment">Daire</option>
            <option value="Villa">Villa</option>
            <option value="Land">Arsa</option>
            <option value="Office">Ofis</option>
            <option value="Shop">Mağaza</option>
          </Select>
          <Select label="Durum" {...register("status")}>
            <option value="Active">Aktif</option>
            <option value="Passive">Pasif</option>
            <option value="Sold">Satıldı</option>
            <option value="Rented">Kiralandı</option>
          </Select>
          <Textarea label="Açıklama" className="lg:col-span-2" error={errors.description?.message} {...register("description")} />
        </div>
      </section>

      <section className="luxury-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">Konum</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Şehir" error={errors.city?.message} {...register("city")} />
          <Input label="İlçe" error={errors.district?.message} {...register("district")} />
          <Input label="Mahalle" {...register("neighborhood")} />
          <Input label="Adres" {...register("address")} />
        </div>
      </section>

      <section className="luxury-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">İlan Detayları</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Input label="Metrekare" type="number" error={errors.squareMeters?.message} {...register("squareMeters", { valueAsNumber: true })} />
          <Input label="Oda sayısı" error={errors.roomCount?.message} {...register("roomCount")} />
          <Input label="Bina yaşı" type="number" {...register("buildingAge", optionalNumberField)} />
          <Input label="Kat" type="number" {...register("floor", optionalNumberField)} />
          <Input label="Toplam kat" type="number" {...register("totalFloors", optionalNumberField)} />
          <Input label="Isıtma tipi" {...register("heatingType")} />
          <Input label="Aidat" type="number" {...register("dues", optionalNumberField)} />
          <Input label="Depozito" type="number" {...register("deposit", optionalNumberField)} />
          <label className="flex h-12 items-center gap-3 self-end rounded-lg border border-outline-variant bg-surface-container-lowest px-4 text-sm font-bold text-primary transition focus-within:ring-2 focus-within:ring-secondary">
            <input type="checkbox" className="h-4 w-4 accent-primary" {...register("isFurnished")} />
            Eşyalı
          </label>
        </div>
      </section>

      <section className="luxury-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">Mülk Sahibi Bilgileri</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Mülk sahibi adı" error={errors.ownerName?.message} {...register("ownerName")} />
          <Input label="Mülk sahibi telefonu" error={errors.ownerPhone?.message} {...register("ownerPhone")} />
        </div>
      </section>

      <section className="luxury-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <Camera className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-xl font-bold text-primary">Görseller</h2>
        </div>
        <ImageUpload value={imageUrl} onChange={setImageUrl} />
      </section>

      <div className="flex justify-end rounded-card bg-primary p-4 shadow-soft">
        <Button type="submit" className="bg-secondary text-white hover:bg-secondary/90" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
