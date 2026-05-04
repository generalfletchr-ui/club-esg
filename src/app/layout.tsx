import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

/* Police principale — Work Sans (charte Fletchr sept. 2025) */
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Club ESG — Ensemble, accélérons la transition RSE",
  description:
    "Le Club ESG est un portail communautaire privé pour les professionnels engagés dans la transition ESG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f6f8] text-[#111827]">
        {children}
      </body>
    </html>
  );
}
