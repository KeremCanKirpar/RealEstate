import { apiClient } from "./client";
import type { PagedResult, Property, PropertyPayload, PropertyStatus } from "../types";

export interface PropertyQuery {
  search?: string;
  listingType?: string;
  propertyType?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const propertiesApi = {
  list: async (query: PropertyQuery = {}) => {
    const response = await apiClient.get<PagedResult<Property>>("/properties", { params: query });
    return response.data;
  },
  detail: async (id: number) => {
    const response = await apiClient.get<Property>(`/properties/${id}`);
    return response.data;
  },
  create: async (payload: PropertyPayload) => {
    const response = await apiClient.post<Property>("/properties", payload);
    return response.data;
  },
  update: async (id: number, payload: PropertyPayload) => {
    const response = await apiClient.put<Property>(`/properties/${id}`, payload);
    return response.data;
  },
  remove: async (id: number) => {
    await apiClient.delete(`/properties/${id}`);
  },
  addImage: async (id: number, imageUrl: string, isMainImage = false) => {
    const response = await apiClient.post<Property>(`/properties/${id}/images`, { imageUrl, isMainImage });
    return response.data;
  },
  updateStatus: async (id: number, status: PropertyStatus) => {
    const response = await apiClient.put<Property>(`/properties/${id}/status`, { status });
    return response.data;
  },
};
