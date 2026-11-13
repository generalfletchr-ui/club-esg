"use client";

/* Composant client — photos qui défilent en fondu derrière le hero de la home */
import { useEffect, useState } from "react";
import Image from "next/image";

/* Photos du diaporama : [fichier dans /public, cadrage vertical] */
const SLIDES: [string, string][] = [
  ["/hero-home-parasol.webp",   "object-[center_52%]"],
  ["/hero-home-bar.jpg",        "object-center"],
  ["/hero-home-webinaire.jpg",  "object-top"],
  ["/hero-home-terrasse-1.jpg", "object-center"],
  ["/hero-home-comptoir.jpg",   "object-center"],
  ["/hero-home-terrasse-2.jpg", "object-center"],
];

/* Durée d'affichage de chaque photo */
const INTERVAL_MS = 6000;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    /* Pas de défilement si le visiteur a demandé à limiter les animations */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(
      () => setCurrent((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      {SLIDES.map(([src, position], i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          /* Chargées d'avance : sinon le fondu révèle un fond vide */
          loading={i === 0 ? undefined : "eager"}
          sizes="100vw"
          className={`object-cover ${position} transition-opacity duration-[1500ms] ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
