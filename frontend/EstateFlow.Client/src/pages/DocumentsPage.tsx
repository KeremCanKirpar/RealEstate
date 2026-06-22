import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Trash2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { customersApi } from "../api/customersApi";
import { documentsApi } from "../api/documentsApi";
import { propertiesApi } from "../api/propertiesApi";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Input } from "../components/Input";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Modal } from "../components/Modal";
import { Select } from "../components/Select";
import { documentTypeLabel, shortDate } from "../utils/format";

const schema = z.object({
  fileName: z.string().min(2, "Dosya adı gerekli"),
  fileUrl: z.string().optional(),
  file: z.any().optional(),
  documentType: z.enum(["TitleDeed", "Contract", "IdCopy", "AuthorizationDocument", "ExpertiseReport"]),
  customerId: z.number().optional(),
  propertyId: z.number().optional(),
});

type DocumentFormValues = z.infer<typeof schema>;

export function DocumentsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [documentsQuery, customersQuery, propertiesQuery] = useQueries({
    queries: [
      { queryKey: ["documents"], queryFn: documentsApi.list },
      { queryKey: ["customers", "select"], queryFn: () => customersApi.list({ pageSize: 100 }) },
      { queryKey: ["properties", "select"], queryFn: () => propertiesApi.list({ pageSize: 100 }) },
    ],
  });

  const { register, handleSubmit, reset } = useForm<DocumentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      documentType: "Contract",
    },
  });

  const createMutation = useMutation({
    mutationFn: documentsApi.create,
    onSuccess: () => {
      reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: documentsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });

  const documents = documentsQuery.data ?? [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Doküman kasası</p>
          <h1 className="mt-2 font-heading text-4xl font-black text-primary">Dokümanlar</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">Sözleşmeleri, tapuları, yetki belgelerini ve raporları saklayın.</p>
        </div>
        <Button className="bg-secondary text-white shadow-luxury hover:bg-secondary/90" icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>
          Doküman ekle
        </Button>
      </div>

      <section className="luxury-card flex flex-col justify-between gap-5 p-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Güvenli Kütüphane</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary">{documents.length} dosya indekslendi</h2>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white">
          <UploadCloud className="h-6 w-6" />
        </div>
      </section>

      {documentsQuery.isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : documents.length === 0 ? (
        <EmptyState title="Henüz doküman yüklenmedi" action={<Button onClick={() => setOpen(true)}>Doküman ekle</Button>} />
      ) : (
        <div className="grid gap-3">
          {documents.map((document) => (
            <div key={document.id} className="luxury-card flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <a href={document.fileUrl} className="font-heading font-bold text-primary hover:text-secondary" target="_blank" rel="noreferrer">
                    {document.fileName}
                  </a>
                  <p className="text-sm text-on-surface-variant">
                    {documentTypeLabel[document.documentType]} / {document.customerName ?? document.propertyTitle ?? "Genel"} / {shortDate.format(new Date(document.createdAt))}
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="text-red-600" icon={<Trash2 className="h-4 w-4" />} onClick={() => deleteMutation.mutate(document.id)}>
                Sil
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal title="Doküman ekle" open={open} onClose={() => setOpen(false)}>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit((values) =>
            createMutation.mutate({
              fileName: values.fileName,
              fileUrl: values.fileUrl,
              file: values.file,
              documentType: values.documentType,
              customerId: values.customerId ?? null,
              propertyId: values.propertyId ?? null,
            }),
          )}
        >
          <Input label="Dosya adı" {...register("fileName")} />
          <Input label="Dosya URL'si" placeholder="Dosya yüklerken opsiyonel" {...register("fileUrl")} />
          <Input label="Dosya yükle" type="file" {...register("file")} />
          <Select label="Doküman türü" {...register("documentType")}>
            <option value="TitleDeed">Tapu</option>
            <option value="Contract">Sözleşme</option>
            <option value="IdCopy">Kimlik kopyası</option>
            <option value="AuthorizationDocument">Yetki belgesi</option>
            <option value="ExpertiseReport">Ekspertiz raporu</option>
          </Select>
          <Select label="Müşteri" {...register("customerId", { setValueAs: (value) => (value === "" ? undefined : Number(value)) })}>
            <option value="">Opsiyonel</option>
            {customersQuery.data?.items.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.fullName}
              </option>
            ))}
          </Select>
          <Select label="İlan" {...register("propertyId", { setValueAs: (value) => (value === "" ? undefined : Number(value)) })}>
            <option value="">Opsiyonel</option>
            {propertiesQuery.data?.items.map((property) => (
              <option key={property.id} value={property.id}>
                {property.title}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={createMutation.isPending}>
            Dokümanı kaydet
          </Button>
        </form>
      </Modal>
    </div>
  );
}
