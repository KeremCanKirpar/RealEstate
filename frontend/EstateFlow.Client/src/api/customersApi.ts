import { apiClient } from "./client";
import type { Customer, CustomerPayload, PagedResult, Property } from "../types";

export interface CustomerQuery {
  search?: string;
  customerType?: string;
  status?: string;
  source?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const customersApi = {
  list: async (query: CustomerQuery = {}) => {
    const response = await apiClient.get<PagedResult<Customer>>("/customers", { params: query });
    return response.data;
  },
  detail: async (id: number) => {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },
  create: async (payload: CustomerPayload) => {
    const response = await apiClient.post<Customer>("/customers", payload);
    return response.data;
  },
  update: async (id: number, payload: CustomerPayload) => {
    const response = await apiClient.put<Customer>(`/customers/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    await apiClient.delete(`/customers/${id}`);
  },
  addNote: async (id: number, note: string) => {
    const response = await apiClient.post<Customer>(`/customers/${id}/notes`, { note });
    return response.data;
  },
  matchedProperties: async (id: number) => {
    const response = await apiClient.get<Property[]>(`/customers/${id}/matched-properties`);
    return response.data;
  },
};
