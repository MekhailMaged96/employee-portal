"use client";

import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../services/departmentService";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
}
