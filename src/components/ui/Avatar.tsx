/* Composant Avatar — photo ou initiales avec palette de couleurs automatique */

interface AvatarProps {
  prenom?: string;
  nom?: string;
  photoUrl?: string | null;
  size?: number;
  className?: string;
}

/* Palette de couleurs pour les avatars sans photo */
const AVATAR_COLORS = [
  "#016050", // teal
  "#1A365D", // bleu foncé
  "#7c6ea0", // violet
  "#e07040", // orange
  "#2563eb", // bleu
  "#16a34a", // vert
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(prenom?: string, nom?: string): string {
  const p = prenom?.[0]?.toUpperCase() ?? "";
  const n = nom?.[0]?.toUpperCase() ?? "";
  return p + n || "?";
}

export default function Avatar({
  prenom,
  nom,
  photoUrl,
  size = 36,
  className = "",
}: AvatarProps) {
  const initials = getInitials(prenom, nom);
  const fullName = `${prenom ?? ""} ${nom ?? ""}`.trim();
  const bgColor = getAvatarColor(fullName || "?");

  if (photoUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={photoUrl}
        alt={fullName || "Avatar"}
        width={size}
        height={size}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: Math.round(size * 0.36),
      }}
      aria-label={fullName || "Avatar"}
    >
      {initials}
    </div>
  );
}
