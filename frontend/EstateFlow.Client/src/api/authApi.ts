import { apiClient } from "./client";
import type { AuthResponse, User } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  fullName: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },
  register: async (payload: RegisterPayload) => {
    const response = await apiClient.post<AuthResponse>("/auth/register", payload);
    return response.data;
  },
  me: async () => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
