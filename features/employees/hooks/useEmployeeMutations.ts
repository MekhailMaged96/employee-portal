"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";
import type { Employee, PagedResponse } from "@/types/employee";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created.");
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated.");
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });

      const previousPages = queryClient.getQueriesData<PagedResponse<Employee>>({
        queryKey: ["employees"],
      });

      queryClient.setQueriesData<PagedResponse<Employee>>(
        { queryKey: ["employees"] },
        (old) => {
          if (!old?.content) return old;
          return { ...old, content: old.content.filter((emp) => emp.id !== id) };
        },
      );

      return { previousPages };
    },

    onError: (_err, _id, context) => {
      context?.previousPages?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Failed to delete employee. Reverted.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },

    onSuccess: () => {
      toast.success("Employee deleted.");
    },
  });
}
