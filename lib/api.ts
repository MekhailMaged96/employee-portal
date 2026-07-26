import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

api.interceptors.request.use((config) => {
  const isAuthRoute = config.url?.startsWith("/auth/");
  if (!isAuthRoute) {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ERROR_MESSAGES: Record<number, string> = {
  401: "Unauthorized. Please log in again.",
  403: "You don't have permission to perform this action.",
  500: "Server error. Please try again later.",
};

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response || error.message);

    const status: number | undefined = error.response?.status;
    const isAuthRoute = error.config?.url?.startsWith("/auth/");

    const message =
      (status && ERROR_MESSAGES[status]) ??
      error.response?.data?.message ??
      (error.request ? "Network error or CORS blocked." : "Something went wrong.");

    toast.error(message);

    // Only auto-redirect on 401 for protected routes, not auth routes
    if (status === 401 && !isAuthRoute) {
      document.cookie = "token=; path=/; max-age=0";
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
