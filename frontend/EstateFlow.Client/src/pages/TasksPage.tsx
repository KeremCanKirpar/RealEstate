import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { customersApi } from "../api/customersApi";
import { propertiesApi } from "../api/propertiesApi";
import { tasksApi } from "../api/tasksApi";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Modal } from "../components/Modal";
import { Select } from "../components/Select";
import { TaskKanban } from "../components/TaskKanban";
import { Textarea } from "../components/Textarea";
import type { TaskItem, TaskPayload, TaskStatus } from "../types";

const schema = z.object({
  title: z.string().min(2, "Başlık gerekli"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Todo", "InProgress", "Waiting", "Done"]),
  customerId: z.number().optional(),
  propertyId: z.number().optional(),
});

type TaskFormValues = z.infer<typeof schema>;

export function TasksPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tasksQuery, customersQuery, propertiesQuery] = useQueries({
    queries: [
      { queryKey: ["tasks"], queryFn: tasksApi.list },
      { queryKey: ["customers", "select"], queryFn: () => customersApi.list({ pageSize: 100 }) },
      { queryKey: ["properties", "select"], queryFn: () => propertiesApi.list({ pageSize: 100 }) },
    ],
  });

  const { register, handleSubmit, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: "Medium",
      status: "Todo",
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: TaskPayload) => tasksApi.create(payload),
    onSuccess: () => {
      reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const moveMutation = useMutation({
    mutationFn: ({ task, status }: { task: TaskItem; status: TaskStatus }) => tasksApi.updateStatus(task.id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const tasks = tasksQuery.data ?? [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">İş panosu</p>
          <h1 className="mt-2 font-heading text-4xl font-black text-primary">Görevler</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">Danışman işlerini yapılacak, devam eden, bekleyen ve tamamlanan adımlar arasında taşıyın.</p>
        </div>
        <Button className="bg-secondary text-white shadow-luxury hover:bg-secondary/90" icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>
          Görev ekle
        </Button>
      </div>

      <section className="luxury-card flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Görev Yönetimi</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary">Duruma göre danışman iş akışı</h2>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white">
          <ClipboardList className="h-6 w-6" />
        </div>
      </section>

      {tasksQuery.isLoading ? <LoadingSkeleton rows={4} /> : <TaskKanban tasks={tasks} onMove={(task, status) => moveMutation.mutate({ task, status })} />}

      <Modal title="Görev ekle" open={open} onClose={() => setOpen(false)}>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit((values) =>
            createMutation.mutate({
              title: values.title,
              description: values.description || null,
              dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
              priority: values.priority,
              status: values.status,
              customerId: values.customerId ?? null,
              propertyId: values.propertyId ?? null,
            }),
          )}
        >
          <Input label="Başlık" {...register("title")} />
          <Textarea label="Açıklama" {...register("description")} />
          <Input label="Son tarih" type="date" {...register("dueDate")} />
          <Select label="Öncelik" {...register("priority")}>
            <option value="Low">Düşük</option>
            <option value="Medium">Orta</option>
            <option value="High">Yüksek</option>
          </Select>
          <Select label="Durum" {...register("status")}>
            <option value="Todo">Yapılacak</option>
            <option value="InProgress">Devam ediyor</option>
            <option value="Waiting">Beklemede</option>
            <option value="Done">Tamamlandı</option>
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
            Görevi kaydet
          </Button>
        </form>
      </Modal>
    </div>
  );
}
