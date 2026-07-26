"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { useDepartments } from "@/features/departments/hooks/useDepartments";
import type { Employee } from "@/types/employee";

const createSchema = z.object({
  name: z.string().min(1, "Name is required."),
  username: z.string().min(1, "Username is required."),
  email: z.string().min(1, "Email is required.").email("Invalid email."),
  password: z.string().min(6, "Min 6 characters."),
  salary: z.coerce.number().positive("Salary must be greater than 0."),
});

const editSchema = z.object({
  name: z.string().min(1, "Name is required."),
  salary: z.coerce.number().positive("Salary must be greater than 0."),
  departmentId: z.coerce.number({ invalid_type_error: "Department is required." }),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData = z.infer<typeof editSchema>;

interface Props {
  employee?: Employee | null;
  onSubmit: (data: unknown) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EmployeeForm({ employee, onSubmit, onCancel, isSubmitting }: Props) {
  const isEdit = !!employee;
  const { data: departments = [] } = useDepartments();

  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", username: "", email: "", password: "", salary: 0 },
  });

  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: employee?.name ?? "",
      salary: employee?.salary ?? 0,
      departmentId: employee?.department?.id ?? 0,
    },
  });

  const form = isEdit ? editForm : createForm;
  const { register, handleSubmit, formState: { errors } } = form;

  const handleFormSubmit = (data: CreateFormData | EditFormData) => {
    if (isEdit) {
      const { departmentId, ...rest } = data as EditFormData;
      onSubmit({ ...rest, department: { id: departmentId } });
    } else {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as Parameters<typeof handleSubmit>[0])} className="flex flex-col gap-4">
      <Input
        label="Name"
        name="name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name")}
      />

      {!isEdit && (
        <>
          <Input
            label="Username"
            name="username"
            placeholder="johndoe"
            error={(errors as Record<string, { message?: string }>).username?.message}
            {...register("username")}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            error={(errors as Record<string, { message?: string }>).email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min 6 characters"
            error={(errors as Record<string, { message?: string }>).password?.message}
            {...register("password")}
          />
        </>
      )}

      <Input
        label="Salary"
        name="salary"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.salary?.message}
        {...register("salary")}
      />

      {isEdit && (
        <Select
          label="Department"
          name="departmentId"
          options={departments}
          placeholder="Select department"
          error={(errors as Record<string, { message?: string }>).departmentId?.message}
          {...register("departmentId")}
        />
      )}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Save Changes" : "Create Employee"}
        </Button>
      </div>
    </form>
  );
}
