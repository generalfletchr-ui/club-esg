"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HashErrorRedirect() {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("otp_expired") || hash.includes("access_denied")) {
      router.replace("/mot-de-passe-oublie?lien=expire");
    }
  }, [router]);
  return null;
}
