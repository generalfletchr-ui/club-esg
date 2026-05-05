"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

interface Props {
  completion: number;
  hasPhoto: boolean;
  hasLinkedin: boolean;
  hasTelephone: boolean;
}

const STORAGE_KEY = "profile_completion_dismissed";

export default function ProfileCompletionWidget({
  completion,
  hasPhoto,
  hasLinkedin,
  hasTelephone,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setDismissed(true);
    }
  }, []);

  if (!mounted || dismissed || completion >= 100) return null;

  function handleDismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  }

  return (
    <Card>
      <div className="flex items-center gap-5">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[13px] font-semibold text-[#374151]">
              Complétion du profil
            </span>
            <span className="text-[13px] font-bold text-[#016050]">
              {completion}%
            </span>
          </div>
          <div className="h-[5px] bg-[#e5e7eb] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full progress-bar transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-[11px] text-[#6b7280] mt-1.5">
            {!hasPhoto && "Ajoute ta photo de profil · "}
            {!hasLinkedin && "LinkedIn · "}
            {!hasTelephone && "Téléphone"}
            {" "}pour compléter ton profil.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <Link
            href="/mon-profil"
            className="px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors whitespace-nowrap"
          >
            Compléter mon profil →
          </Link>
          <button
            onClick={handleDismiss}
            className="text-[11px] text-[#9ca3af] hover:underline"
          >
            Je complète plus tard
          </button>
        </div>
      </div>
    </Card>
  );
}
