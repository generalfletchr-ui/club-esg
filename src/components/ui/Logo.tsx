import Link from "next/link";

interface LogoProps {
  href?: string;
  width?: number;
  className?: string;
}

export default function Logo({ href = "https://club.fletchr.fr/dashboard", width = 140, className = "" }: LogoProps) {
  const height = Math.round(width * 0.25);
  const logo = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Club ESG"
      className={className}
    >
      <text x="155" y="42" fontFamily="'DM Sans','Inter',sans-serif" fontSize="36" fontWeight="700" fill="#016050" letterSpacing="-0.8" textAnchor="end">CLUB ESG</text>
    </svg>
  );

  if (href) {
    return <Link href={href}>{logo}</Link>;
  }

  return logo;
}
