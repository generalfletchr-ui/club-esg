"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_LINK } from "@/lib/constants";

/* Navigation membre */
const MEMBER_NAV = [
  { label: "Tableau de bord", href: "/dashboard",    icon: "⊞" },
  { label: "Annuaire",        href: "/annuaire",      icon: "◫" },
  { label: "Missions",        href: "/missions",      icon: "◈" },
  { label: "Mes missions",    href: "/mes-missions",  icon: "◇" },
  { label: "Agenda",          href: "/agenda",        icon: "◷" },
  { label: "Replays",         href: "/replays",       icon: "▶" },
];

/* Navigation admin */
const ADMIN_NAV = [
  { label: "Demandes",    href: "/admin/demandes",    icon: "⏳" },
  { label: "Membres",     href: "/admin/membres",     icon: "≡" },
  { label: "Missions",    href: "/admin/missions",    icon: "◈" },
  { label: "Événements",  href: "/admin/evenements",  icon: "✦" },
  { label: "Replays",     href: "/admin/replays",     icon: "▤" },
  { label: "Export CSV",  href: "/admin/export-csv",  icon: "↓" },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  function NavItem({ label, href, icon }: { label: string; href: string; icon: string }) {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={[
          "flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-[14px] font-semibold",
          "transition-colors duration-150",
          isActive
            ? "bg-[#e4f7f3] text-[#016050]"
            : "text-[#142832] hover:bg-[#f5f6f8]",
        ].join(" ")}
      >
        <span className={`text-[15px] ${isActive ? "text-[#016050]" : "text-[#142832]"}`}>
          {icon}
        </span>
        {label}
      </Link>
    );
  }

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 overflow-y-auto"
      style={{
        width: "var(--sidebar-width, 240px)",
        background: "#ebebe6",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="px-4 py-4">
        <Logo width={160} />
      </div>

      {/* Navigation admin */}
      {isAdmin && (
        <nav className="px-3 pt-4">
          <p className="label-caps px-3 mb-2">Admin</p>
          <ul className="flex flex-col gap-0.5">
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <NavItem {...item} />
              </li>
            ))}
          </ul>
          <div className="my-3 border-t border-[#e5e7eb]" />
        </nav>
      )}

      {/* Navigation membre */}
      <nav className={`px-3 ${isAdmin ? "pt-0" : "pt-4"} flex-1`}>
        {isAdmin && (
          <p className="label-caps px-3 mb-2">Membre</p>
        )}
        <ul className="flex flex-col gap-0.5">
          {MEMBER_NAV.map((item) => (
            <li key={item.href}>
              <NavItem {...item} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Pied de sidebar */}
      <div className="px-3 pb-4">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-[8px] bg-[#f0fdf4] text-[12px] text-[#16a34a] font-medium hover:bg-[#dcfce7] transition-colors"
        >
          <WhatsAppIcon size={18} />
          Groupe WhatsApp
        </a>
      </div>
    </aside>
  );
}
