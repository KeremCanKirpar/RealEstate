import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { propertiesApi } from "../api/propertiesApi";
import { PropertyForm } from "../features/properties/PropertyForm";
import type { PropertyPayload } from "../types";

export function AddPropertyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ values, imageUrl }: { values: PropertyPayload; imageUrl: string }) => {
      const property = await propertiesApi.create(values);
      if (imageUrl) {
        await propertiesApi.addImage(property.id, imageUrl, true);
      }
      return property;
    },
    onSuccess: (property) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      navigate(`/panel/properties/${property.id}`);
    },
  });

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Yeni portföy dosyası</p>
        <h1 className="mt-2 font-heading text-4xl font-black text-primary">İlan Ekle</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Danışman takibi için eksiksiz bir ilan dosyası oluşturun.</p>
      </div>
      <PropertyForm
        submitLabel="İlan oluştur"
        isSubmitting={mutation.isPending}
        onSubmit={async (values, imageUrl) => {
          await mutation.mutateAsync({ values, imageUrl });
        }}
      />
    </div>
  );
}
