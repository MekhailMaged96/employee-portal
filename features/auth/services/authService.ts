"use client";

import api from "@/lib/api";

export const login = (data: { username: string; password: string }) =>
  api.post<{ token: string }>("/auth/login", data);

export const register = (data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);
