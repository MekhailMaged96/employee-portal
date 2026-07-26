"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/features/auth/hooks/useRegister";
import Input from "@/components/Input";
import Button from "@/components/Button";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  username: z.string().min(1, "Username is required."),
  email: z.string().min(1, "Email is required.").email("Invalid email."),
  password: z.string().min(6, "Min 6 characters."),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Create account</h1>
        <p className="mb-6 text-sm text-gray-500">Fill in your details to register</p>

        <form onSubmit={handleSubmit((data) => register(data))} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            name="fullName"
            placeholder="John Doe"
            error={errors.fullName?.message}
            {...rhfRegister("fullName")}
          />
          <Input
            label="Username"
            name="username"
            placeholder="johndoe"
            error={errors.username?.message}
            {...rhfRegister("username")}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...rhfRegister("email")}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...rhfRegister("password")}
          />
          <Button type="submit" loading={isPending} className="mt-2 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
