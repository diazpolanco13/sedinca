import type { Metadata } from "next";
import localFont from "next/font/local";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { site } from "@/config/site";
import "./globals.css";

// Archivos latinos de Google Fonts (Inter v20, Space Grotesk v22), autoalojados
// para que el trazo coincida con los diseños aprobados.
const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk-latin-var.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/inter-latin-var.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.shortName} — Seguridad y Defensa Integral`,
    template: `%s — ${site.shortName}`,
  },
  description:
    "Seguridad y Defensa Integral, Compañía Anónima (SEDIN, C.A.): vigilancia privada, control de acceso y sistemas de seguridad electrónica para industrias, empresas, corporaciones y conjuntos residenciales.",
  icons: { icon: "/assets/escudo-sedin.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
