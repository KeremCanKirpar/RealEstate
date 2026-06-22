import { apiClient } from "./client";
import type { Appointment, AppointmentPayload, AppointmentStatus } from "../types";

export const appointmentsApi = {
  list: async () => {
    const response = await apiClient.get<Appointment[]>("/appointments");
    return response.data;
  },
  create: async (payload: AppointmentPayload) => {
    const response = await apiClient.post<Appointment>("/appointments", payload);
    return response.data;
  },
  update: async (id: number, payload: AppointmentPayload) => {
    const response = await apiClient.put<Appointment>(`/appointments/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    await apiClient.delete(`/appointments/${id}`);
  },
  updateStatus: async (id: number, status: AppointmentStatus) => {
    const response = await apiClient.put<Appointment>(`/appointments/${id}/status`, { status });
    return response.data;
  },
};
