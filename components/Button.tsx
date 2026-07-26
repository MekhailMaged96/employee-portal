"use client";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-600 text-white hover:bg-green-700",
};

const sizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
}: ButtonProps) {
  const base = "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400";
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? "cursor-not-allowed opacity-50" : ""}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls}>
      {loading ? "Loading..." : children}
    </button>
  );
}
