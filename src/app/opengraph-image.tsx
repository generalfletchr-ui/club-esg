import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Club ESG — Ensemble, accélérons notre impact RSE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#016050",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grille de fond */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Titre */}
        <div
          style={{
            color: "white",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-1px",
            marginBottom: 16,
            position: "relative",
          }}
        >
          Club ESG
        </div>

        {/* Séparateur */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "white",
            borderRadius: 2,
            marginBottom: 32,
            position: "relative",
          }}
        />

        {/* Sous-titre */}
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 36,
            fontWeight: 400,
            position: "relative",
          }}
        >
          Ensemble, accélérons notre impact RSE
        </div>
      </div>
    ),
    { ...size }
  );
}
