"use client";

import Loader from "@/components/Loader";
import EmployeeRow from "./EmployeeRow";
import type { Employee } from "@/types/employee";

const COLUMNS = ["#", "Name", "Email", "Department", "Salary", "Role", "Actions"];

interface Props {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}

export default function EmployeeTable({ employees, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {employees.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-4 py-8 text-center text-sm text-gray-400"
              >
                No employees found.
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <EmployeeRow
                key={emp.id}
                employee={emp}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
