"use client";

import { InputHTMLAttributes, ReactNode, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  required?: boolean;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Input({
  label,
  error,
  hint,
  icon,
  required,
  className = "",
  id,
  type,
  ...props
}: InputProps) {
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  /* Génère un id stable si non fourni */
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const resolvedType = isPasswordField ? (showPassword ? "text" : "password") : type;

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
          type={resolvedType}
          className={[
            "h-[34px] w-full rounded-[6px]",
            "border border-[#e5e7eb] bg-white",
            "px-[10px] text-[12px] text-[#111827]",
            "placeholder:text-[#9ca3af]",
            "outline-none transition-colors duration-150",
            "focus:border-[#016050]",
            "disabled:bg-[#f5f6f8] disabled:text-[#9ca3af] disabled:cursor-not-allowed",
            error ? "border-[#ef4444] focus:border-[#ef4444]" : "",
            icon ? "pl-8" : "",
            isPasswordField ? "pr-8" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
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
