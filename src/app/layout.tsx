import type { Metadata } from "next";
import { Mona_Sans, Cardo, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Providers } from "@/context/Providers";
import "./globals.css";

const monaSans = Mona_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const cardo = Cardo({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Camellio — Trabajadores locales en Bogotá",
  description:
    "Trabajadores locales para lo que necesitas resolver. Plomería, electricidad, limpieza y más en Bogotá.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${monaSans.variable} ${cardo.variable} ${mono.variable} ${GeistSans.variable}`}
    >
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
