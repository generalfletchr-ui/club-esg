import { ReactNode } from "react";

/* Variants de tags / badges */
type TagVariant = "teal" | "neutral" | "orange" | "green" | "red" | "purple" | "yellow";

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  teal:    "bg-[#e6f7f7] text-[#00B4B4]",
  neutral: "bg-[#f5f6f8] text-[#6b7280]",
  orange:  "bg-[#fff4ee] text-[#f97316]",
  green:   "bg-[#f0fdf4] text-[#16a34a]",
  red:     "bg-[#fef2f2] text-[#ef4444]",
  purple:  "bg-[#f5f3ff] text-[#7c3aed]",
  yellow:  "bg-[#fefce8] text-[#ca8a04]",
};

export default function Tag({
  children,
  variant = "teal",
  onRemove,
  className = "",
}: TagProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1",
        "px-[10px] py-[2px] rounded-[20px]",
        "text-[11px] font-semibold",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Retirer"
        >
          ×
        </button>
      )}
    </span>
  );
}
