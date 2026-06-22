import { apiClient } from "./client";
import type { TaskItem, TaskPayload, TaskStatus } from "../types";

export const tasksApi = {
  list: async () => {
    const response = await apiClient.get<TaskItem[]>("/tasks");
    return response.data;
  },
  create: async (payload: TaskPayload) => {
    const response = await apiClient.post<TaskItem>("/tasks", payload);
    return response.data;
  },
  update: async (id: number, payload: TaskPayload) => {
    const response = await apiClient.put<TaskItem>(`/tasks/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    await apiClient.delete(`/tasks/${id}`);
  },
  updateStatus: async (id: number, status: TaskStatus) => {
    const response = await apiClient.put<TaskItem>(`/tasks/${id}/status`, { status });
    return response.data;
  },
};
