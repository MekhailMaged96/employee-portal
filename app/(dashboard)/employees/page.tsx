"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import ErrorBoundary from "@/components/ErrorBoundary";
import EmployeeTable from "@/features/employees/components/EmployeeTable";
import EmployeeForm from "@/features/employees/components/EmployeeForm";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import {
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/features/employees/hooks/useEmployeeMutations";
import { useDebounce } from "@/hooks/useDebounce";
import type { Employee } from "@/types/employee";

const PAGE_SIZE = 5;

function EmployeesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter + page state lives in the URL — shareable, bookmarkable, back-button works
  const search = searchParams.get("search") ?? "";
  const currentPage = Number(searchParams.get("page") ?? "1");

  const debouncedSearch = useDebounce(search, 400);

  const setSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // reset page on new search
    router.replace(`?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`);
  };

  const { data, isLoading } = useEmployees(currentPage - 1, PAGE_SIZE);
  const employees = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filteredEmployees = debouncedSearch.trim()
    ? employees.filter((emp) =>
        `${emp.name} ${emp.user?.email ?? ""}`
          .toLowerCase()
          .includes(debouncedSearch.trim().toLowerCase()),
      )
    : employees;

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const openCreate = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  const handleDelete = (employee: Employee) => setDeletingEmployee(employee);

  const closeForm = () => {
    setFormOpen(false);
    setEditingEmployee(null);
  };

  const handleFormSubmit = (data: unknown) => {
    if (editingEmployee) {
      updateEmployee.mutate({ id: editingEmployee.id, data }, { onSuccess: closeForm });
    } else {
      createEmployee.mutate(data, { onSuccess: closeForm });
    }
  };

  const confirmDelete = () => {
    if (!deletingEmployee) return;
    deleteEmployee.mutate(deletingEmployee.id, {
      onSuccess: () => setDeletingEmployee(null),
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Button onClick={openCreate}>Add Employee</Button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
        />
      </div>

      <ErrorBoundary>
        <EmployeeTable
          employees={filteredEmployees}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ErrorBoundary>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
      >
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isSubmitting={createEmployee.isPending || updateEmployee.isPending}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingEmployee}
        message={`Delete "${deletingEmployee?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingEmployee(null)}
        loading={deleteEmployee.isPending}
      />
    </div>
  );
}

// useSearchParams() requires Suspense boundary
export default function EmployeesPage() {
  return (
    <Suspense>
      <EmployeesContent />
    </Suspense>
  );
}
