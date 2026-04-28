"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

/* Variants disponibles */
type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

/* Styles par variant */
const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#00B4B4] text-white hover:bg-[#009898] border border-[#00B4B4] hover:border-[#009898]",
  outline:
    "bg-white text-[#374151] border border-[#e5e7eb] hover:bg-[#f5f6f8]",
  ghost:
    "bg-transparent text-[#374151] border border-transparent hover:bg-[#f5f6f8]",
  danger:
    "bg-[#ef4444] text-white hover:bg-[#dc2626] border border-[#ef4444]",
};

/* Styles par taille */
const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[11px]",
  md: "px-[14px] py-[7px] text-[12px]",
  lg: "px-5 py-2.5 text-[13px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-1.5",
        "rounded-[6px] font-semibold",
        "transition-colors duration-150 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading && (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
