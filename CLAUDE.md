# SEDIN, C.A. — web corporativa

Brief completo, diseños aprobados y sistema de diseño en `design-reference/` (léase primero `design-reference/CLAUDE.md` y `design-reference/design-system/BRAND.md`).

## Stack y convenciones
- Next.js 15 (App Router) + React 19 + TypeScript, exportación estática (`output: "export"`, carpeta `out/`).
- Tailwind CSS v4. `src/styles/tokens.css` es la fuente de variables; `src/app/globals.css` las expone a Tailwind (`bg-surface`, `text-ink-muted`, `bg-azure-950`, `rounded-lg`…). La paleta por defecto de Tailwind está desactivada: no usar hex sueltos.
- Los diseños usan `max-width: 1280px` + padding en content-box: en Tailwind equivale a `max-w-[1344px] px-8`.
- Fuentes autoalojadas (`src/fonts/`, mismos archivos que sirve Google Fonts) con `next/font/local`.
- Marcadores `[TELÉFONO]`, `[CORREO]`… centralizados en `src/config/site.ts`.
- Componentes: `src/components/ui` (Card, Placeholder, encabezados, `form.tsx` con Input/Select/Textarea/Checkbox/Radio/Button), `src/components/layout` (SiteHeader `overlay` para Inicio y `solid` para páginas interiores, SiteFooter, WhatsAppButton), `src/components/home` (secciones de Inicio), `src/components/contact` (QuoteForm).
- Servicios: una sola plantilla (`src/components/service/ServiceTemplate.tsx`) y la ruta `src/app/servicios/[slug]`; los textos de cada servicio viven en `src/content/services.ts`.
- Formulario de cotización: envía POST JSON a `NEXT_PUBLIC_CONTACT_ENDPOINT` (definida en tiempo de build); sin ella muestra un aviso y no envía.
