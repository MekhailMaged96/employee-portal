import api from "@/lib/api";
import type { Employee, PagedResponse } from "@/types/employee";

export const getEmployeesPaged = (page: number, size: number) =>
  api.get<PagedResponse<Employee>>(`/employee/page?page=${page}&size=${size}`);

export const getEmployees = () => api.get<Employee[]>("/employee/all");

export const createEmployee = (data: unknown) =>
  api.post<Employee>("/employee/create", data);

export const updateEmployee = (id: number, data: unknown) =>
  api.put<Employee>(`/employee/update/${id}`, data);

export const deleteEmployee = (id: number) =>
  api.delete(`/employee/delete/${id}`);
