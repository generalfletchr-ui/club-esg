import Image from "next/image";
import Link from "next/link";

/* Logo Club ESG — nœud réseau + wordmark (option C du design system) */
interface LogoProps {
  href?: string;
  width?: number;
  className?: string;
}

export default function Logo({ href = "/", width = 140, className = "" }: LogoProps) {
  const logo = (
    <Image
      src="/logo.svg"
      alt="Club ESG"
      width={width}
      height={Math.round(width * 0.33)}
      priority
      className={className}
    />
  );

  if (href) {
    return <Link href={href}>{logo}</Link>;
  }

  return logo;
}
