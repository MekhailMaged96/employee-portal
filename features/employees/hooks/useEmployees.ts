"use client";

import { useQuery } from "@tanstack/react-query";
import { getEmployeesPaged } from "../services/employeeService";

export function useEmployees(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["employees", page, pageSize],
    queryFn: () => getEmployeesPaged(page, pageSize),
  });
}
