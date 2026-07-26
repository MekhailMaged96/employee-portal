"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { login } from "../services/authService";
import { useAuth } from "@/context/AuthContext";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: setAuth } = useAuth();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token);
      toast.success("Logged in successfully.");
      // Redirect back to the page user was trying to visit (middleware sets ?from=)
      const from = searchParams.get("from") ?? "/";
      router.replace(from);
    },
  });
}
