import Script from "next/script";
import { site } from "@/config/site";

/**
 * Analítica sin cookies (Umami autoalojado, propuesta 15.5). Solo se carga si
 * en el build existen `NEXT_PUBLIC_UMAMI_ID` (id del sitio en Umami) y
 * `NEXT_PUBLIC_UMAMI_SRC` (URL del script, p. ej.
 * `https://analytics.sedinca.com/script.js`); si falta alguna, no se pinta
 * nada. Los eventos se miden con los atributos `data-umami-event` de cada
 * enlace (ver `src/lib/analytics.ts`). `data-domains` evita contar las
 * visitas de desarrollo y de pruebas.
 */
export function Umami() {
  const id = process.env.NEXT_PUBLIC_UMAMI_ID;
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
  if (!id || !src) return null;
  return (
    <Script
      id="umami"
      src={src}
      strategy="afterInteractive"
      data-website-id={id}
      data-domains={`${site.domain},www.${site.domain}`}
    />
  );
}
