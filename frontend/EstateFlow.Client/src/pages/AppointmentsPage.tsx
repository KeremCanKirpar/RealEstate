import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { appointmentsApi } from "../api/appointmentsApi";
import { customersApi } from "../api/customersApi";
import { propertiesApi } from "../api/propertiesApi";
import { AppointmentCard } from "../components/AppointmentCard";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Input } from "../components/Input";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Modal } from "../components/Modal";
import { Select } from "../components/Select";
import { Textarea } from "../components/Textarea";
import type { AppointmentPayload } from "../types";

const schema = z.object({
  customerId: z.number().min(1, "Müşteri gerekli"),
  propertyId: z.number().optional(),
  appointmentDate: z.string().min(1, "Tarih gerekli"),
  appointmentType: z.enum(["PropertyViewing", "OfficeMeeting", "PhoneCall"]),
  location: z.string().min(2, "Konum gerekli"),
  status: z.enum(["Planned", "Completed", "Cancelled"]),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof schema>;

export function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [appointmentsQuery, customersQuery, propertiesQuery] = useQueries({
    queries: [
      { queryKey: ["appointments"], queryFn: appointmentsApi.list },
      { queryKey: ["customers", "select"], queryFn: () => customersApi.list({ pageSize: 100 }) },
      { queryKey: ["properties", "select"], queryFn: () => propertiesApi.list({ pageSize: 100 }) },
    ],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      appointmentType: "PropertyViewing",
      status: "Planned",
      location: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: AppointmentPayload) => appointmentsApi.create(payload),
    onSuccess: () => {
      reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "Completed" | "Cancelled" }) => appointmentsApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const appointments = appointmentsQuery.data ?? [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Takvim</p>
          <h1 className="mt-2 font-heading text-4xl font-black text-primary">Randevular</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">Portföy gezilerini, ofis görüşmelerini ve aramaları planlayın.</p>
        </div>
        <Button className="bg-secondary text-white shadow-luxury hover:bg-secondary/90" icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>
          Randevu ekle
        </Button>
      </div>

      <section className="luxury-card bg-primary p-6 text-white">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-container">Danışman Takvimi</p>
            <p className="mt-2 font-heading text-3xl font-black">{appointments.length} aktif takvim kaydı</p>
          </div>
          <CalendarDays className="h-10 w-10 text-secondary-container" />
        </div>
      </section>

      {appointmentsQuery.isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : appointments.length === 0 ? (
        <EmptyState title="Henüz randevu yok" action={<Button onClick={() => setOpen(true)}>Randevu ekle</Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="grid gap-2">
              <AppointmentCard appointment={appointment} />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1 bg-white"
                  icon={<Check className="h-4 w-4" />}
                  disabled={appointment.status === "Completed"}
                  onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: "Completed" })}
                >
                  Tamamla
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 bg-white text-red-600"
                  icon={<X className="h-4 w-4" />}
                  disabled={appointment.status === "Cancelled"}
                  onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: "Cancelled" })}
                >
                  İptal et
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal title="Randevu ekle" open={open} onClose={() => setOpen(false)}>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit((values) =>
            createMutation.mutate({
              customerId: values.customerId,
              propertyId: values.propertyId ?? null,
              appointmentDate: new Date(values.appointmentDate).toISOString(),
              appointmentType: values.appointmentType,
              location: values.location,
              status: values.status,
              notes: values.notes || null,
            }),
          )}
        >
          <Select label="Müşteri" error={errors.customerId?.message} {...register("customerId", { valueAsNumber: true })}>
            <option value="">Müşteri seç</option>
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
          <Input label="Tarih ve saat" type="datetime-local" error={errors.appointmentDate?.message} {...register("appointmentDate")} />
          <Select label="Tür" {...register("appointmentType")}>
            <option value="PropertyViewing">Portföy gezisi</option>
            <option value="OfficeMeeting">Ofis görüşmesi</option>
            <option value="PhoneCall">Telefon araması</option>
          </Select>
          <Input label="Konum" error={errors.location?.message} {...register("location")} />
          <Textarea label="Notlar" {...register("notes")} />
          <Button type="submit" disabled={createMutation.isPending}>
            Randevuyu kaydet
          </Button>
        </form>
      </Modal>
    </div>
  );
}
