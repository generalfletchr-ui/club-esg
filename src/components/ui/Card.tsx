import { ReactNode } from "react";

/* Composant Card — surface blanche avec bordure et radius */
interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingStyles = {
  none: "",
  sm:   "p-3",
  md:   "p-4",
  lg:   "p-6",
};

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={[
        "bg-white rounded-[8px] shadow-[var(--shadow-card)]",
        paddingStyles[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
