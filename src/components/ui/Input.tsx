"use client";

import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  required?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  required,
  className = "",
  id,
  ...props
}: InputProps) {
  /* Génère un id stable si non fourni */
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12px] font-medium text-[#374151]"
        >
          {label}
          {required && <span className="text-[#ef4444] ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6b7280]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            "h-[34px] w-full rounded-[6px]",
            "border border-[#e5e7eb] bg-white",
            "px-[10px] text-[12px] text-[#111827]",
            "placeholder:text-[#9ca3af]",
            "outline-none transition-colors duration-150",
            "focus:border-[#00B4B4]",
            "disabled:bg-[#f5f6f8] disabled:text-[#9ca3af] disabled:cursor-not-allowed",
            error ? "border-[#ef4444] focus:border-[#ef4444]" : "",
            icon ? "pl-8" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </div>

      {error && (
        <p className="text-[11px] text-[#ef4444]">{error}</p>
      )}
      {hint && !error && (
        <p className="text-[11px] text-[#6b7280]">{hint}</p>
      )}
    </div>
  );
}
