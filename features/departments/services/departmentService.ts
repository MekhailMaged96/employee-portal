import api from "@/lib/api";
import type { Department } from "@/types/employee";

export const getDepartments = () => api.get<Department[]>("/departments");
