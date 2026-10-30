import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { Umami } from "@/components/seo/Umami";
import { PendingModeBadge } from "@/components/ui/Pending";
import { site } from "@/config/site";
import { defaultDescription, defaultTitle, ogImage, siteJsonLd, titleTemplate } from "@/lib/seo";
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

/*
 * Metadatos comunes (propuesta, 15.3). Sin `alternates.canonical` ni
 * `openGraph.url` aquí: se heredarían en todas las páginas apuntando a
 * Inicio. Cada página los pone con `pageMetadata()` (src/lib/seo.ts). El
 * título y la descripción de openGraph y twitter se heredan de los de cada
 * página.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: titleTemplate },
  description: defaultDescription,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: site.name,
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", images: [ogImage] },
  icons: {
    icon: [{ url: "/assets/marca/icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/assets/marca/apple-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  // = --azure-950 (tokens.css): barra del navegador móvil del color del encabezado.
  themeColor: "#071530",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-VE" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        {children}
        <WhatsAppButton />
        <PendingModeBadge />
        <JsonLd id="datos-empresa" data={siteJsonLd()} />
        <Umami />
      </body>
    </html>
  );
}
