// src/features/auth/services/auth.service.ts

import api from "../lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "employee" | "manager" | "admin";
  };
}

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(
      "/api/v1/login",
      payload
    );

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || {
      message: "Login failed",
    };
  }
};