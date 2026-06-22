import { apiClient } from "./client";
import type { DocumentItem, DocumentType } from "../types";

export interface DocumentPayload {
  fileName: string;
  fileUrl?: string;
  file?: FileList;
  documentType: DocumentType;
  customerId?: number | null;
  propertyId?: number | null;
}

export const documentsApi = {
  list: async () => {
    const response = await apiClient.get<DocumentItem[]>("/documents");
    return response.data;
  },
  create: async (payload: DocumentPayload) => {
    const formData = new FormData();
    formData.append("fileName", payload.fileName);
    formData.append("documentType", payload.documentType);
    if (payload.fileUrl) formData.append("fileUrl", payload.fileUrl);
    if (payload.customerId) formData.append("customerId", payload.customerId.toString());
    if (payload.propertyId) formData.append("propertyId", payload.propertyId.toString());
    if (payload.file?.[0]) formData.append("file", payload.file[0]);

    const response = await apiClient.post<DocumentItem>("/documents", formData);
    return response.data;
  },
  remove: async (id: number) => {
    await apiClient.delete(`/documents/${id}`);
  },
};
