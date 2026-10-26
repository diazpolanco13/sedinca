# SEDIN, C.A. — web corporativa

Brief completo, diseños aprobados y sistema de diseño en `design-reference/` (léase primero `design-reference/CLAUDE.md` y `design-reference/design-system/BRAND.md`).

## Stack y convenciones
- Next.js 15 (App Router) + React 19 + TypeScript, exportación estática (`output: "export"`, carpeta `out/`).
- Tailwind CSS v4. `src/styles/tokens.css` es la fuente de variables; `src/app/globals.css` las expone a Tailwind (`bg-surface`, `text-ink-muted`, `bg-azure-950`, `rounded-lg`…). La paleta por defecto de Tailwind está desactivada: no usar hex sueltos.
- Los diseños usan `max-width: 1280px` + padding en content-box: en Tailwind equivale a `max-w-[1344px] px-8`.
- Fuentes autoalojadas (`src/fonts/`, mismos archivos que sirve Google Fonts) con `next/font/local`.
- Marcadores `[TELÉFONO]`, `[CORREO]`… centralizados en `src/config/site.ts`.
- Dirección visual acordada con el cliente: TODAS las páginas usan el encabezado oscuro transparente sobre la foto `public/assets/hero-puente-vigilante.jpg` (versión limpia), como Inicio. El vigilante real de esa foto es el modelo; no usar `ilustracion-vigilante.png`. Esto sustituye al encabezado claro de los diseños 02 y 03.
- Cada página: `<SitePage>` (encabezado + main + pie) y empieza con `Hero` (Inicio) o `PageHero` (interiores, con ruta de navegación).
- Componentes: `src/components/ui` (Card, Chip, Placeholder, PageHero, HeroBackdrop, CtaBand, `blocks.tsx` con SectionHeader/FeatureBand/StepList, `form.tsx` con Input/Select/Textarea/FileInput/Checkbox/Radio/Button), `src/components/layout` (SitePage, SiteHeader, SiteFooter, WhatsAppButton), `src/components/home` (secciones de Inicio), `src/components/contact` (QuoteForm), `src/components/jobs` (JobForm).
- Contenidos en `src/content/` (servicios, sectores). Hechos de la empresa en Nosotros y Empleo: reglamento interno SED-GC-PR-01. No inventar datos: lo pendiente va como marcador en `site.ts` (p. ej. `[REQUISITOS DE POSTULACIÓN]`).
- Fotos de Sectores: generadas con IA (Grok) con escenas del Zulia, en `public/assets/sectores/<id>.webp` (1280×720, WebP calidad 80). SEDIN es vigilancia no armada: ninguna foto debe mostrar armas.
- Servicios: una sola plantilla (`src/components/service/ServiceTemplate.tsx`) y la ruta `src/app/servicios/[slug]`; los textos de cada servicio viven en `src/content/services.ts`.
- Formularios (variables definidas en tiempo de build; sin ellas muestran un aviso y no envían): cotización → POST JSON a `NEXT_PUBLIC_CONTACT_ENDPOINT`; postulación → POST multipart con el CV a `NEXT_PUBLIC_JOBS_ENDPOINT`.
