import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { propertiesApi } from "../api/propertiesApi";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PropertyForm } from "../features/properties/PropertyForm";
import type { PropertyPayload } from "../types";

export function EditPropertyPage() {
  const { id } = useParams();
  const propertyId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const propertyQuery = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertiesApi.detail(propertyId),
    enabled: Boolean(propertyId),
  });

  const mutation = useMutation({
    mutationFn: async ({ values, imageUrl }: { values: PropertyPayload; imageUrl: string }) => {
      const property = await propertiesApi.update(propertyId, values);
      if (imageUrl) {
        await propertiesApi.addImage(property.id, imageUrl, false);
      }
      return property;
    },
    onSuccess: (property) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", property.id] });
      navigate(`/panel/properties/${property.id}`);
    },
  });

  if (propertyQuery.isLoading) return <LoadingSkeleton rows={4} />;
  if (!propertyQuery.data) return null;

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Portföy güncelleme</p>
        <h1 className="mt-2 font-heading text-4xl font-black text-primary">İlanı Düzenle</h1>
        <p className="mt-2 text-sm text-on-surface-variant">{propertyQuery.data.title}</p>
      </div>
      <PropertyForm
        initialProperty={propertyQuery.data}
        submitLabel="Değişiklikleri kaydet"
        isSubmitting={mutation.isPending}
        onSubmit={async (values, imageUrl) => {
          await mutation.mutateAsync({ values, imageUrl });
        }}
      />
    </div>
  );
}
