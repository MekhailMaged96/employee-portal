"use client";

import Button from "@/components/Button";
import type { Employee } from "@/types/employee";

interface Props {
  employee: Employee;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}

export default function EmployeeRow({ employee, onEdit, onDelete }: Props) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{employee.id}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{employee.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{employee.user?.email}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {employee.department?.name ?? "N/A"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {employee.salary ?? "N/A"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {employee.user?.roles.join(", ")}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(employee)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(employee)}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
