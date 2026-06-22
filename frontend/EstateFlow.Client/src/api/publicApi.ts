import { apiClient } from "./client";
import type { ListingType, PagedResult, PropertyType, PublicLeadPayload, PublicProperty } from "../types";

export interface PublicPropertyQuery {
  search?: string;
  listingType?: ListingType | "";
  propertyType?: PropertyType | "";
  city?: string;
  district?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const publicApi = {
  listProperties: async (query: PublicPropertyQuery = {}) => {
    const response = await apiClient.get<PagedResult<PublicProperty>>("/public/properties", { params: query });
    return response.data;
  },
  propertyDetail: async (id: number) => {
    const response = await apiClient.get<PublicProperty>(`/public/properties/${id}`);
    return response.data;
  },
  createLead: async (payload: PublicLeadPayload) => {
    const response = await apiClient.post<{ message: string }>("/public/leads", payload);
    return response.data;
  },
};
