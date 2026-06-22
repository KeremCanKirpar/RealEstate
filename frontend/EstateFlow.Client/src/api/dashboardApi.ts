import { apiClient } from "./client";
import type { Appointment, Customer, DashboardStats, Property, TaskSummary } from "../types";

export const dashboardApi = {
  stats: async () => {
    const response = await apiClient.get<DashboardStats>("/dashboard/stats");
    return response.data;
  },
  recentProperties: async () => {
    const response = await apiClient.get<Property[]>("/dashboard/recent-properties");
    return response.data;
  },
  upcomingAppointments: async () => {
    const response = await apiClient.get<Appointment[]>("/dashboard/upcoming-appointments");
    return response.data;
  },
  latestCustomers: async () => {
    const response = await apiClient.get<Customer[]>("/dashboard/latest-customers");
    return response.data;
  },
  taskSummary: async () => {
    const response = await apiClient.get<TaskSummary[]>("/dashboard/task-summary");
    return response.data;
  },
};
