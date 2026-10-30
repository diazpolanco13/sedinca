SEDIN — Seguridad y Defensa Integral, Compañía Anónima — presta servicios de seguridad privada y protección preventiva no armada a personas y bienes: vigilancia fija, vigilancia móvil, consultoría y asesoría. La marca transmite fiabilidad de alto nivel, precisión táctica e inteligencia tecnológica: la silueta de un can vigilante dentro de un escudo protector — lealtad, alerta constante, estructura y defensa de nivel empresarial.

## Contenido y voz

- Escribe en español formal, en tercera persona e impersonal ("La empresa tendrá por objeto…", "Se entiende por…"). Nada de tuteo comercial, exclamaciones ni emoji.
- En la web: **usted** en llamadas a la acción y trato directo ("Cuéntenos qué necesita proteger"); impersonal en descripciones ("Cada puesto cuenta con libro de novedades"); "nosotros" para la cercanía ("Visitamos su instalación"). Sin tuteo, tampoco en Empleo.
- Usa la razón social completa la primera vez: **Seguridad y Defensa Integral, Compañía Anónima (SEDIN, C.A.)**; después, **SEDIN**. El logotipo nuevo escribe "SEDIN, C.A".
- Vocabulario propio: *oficial de seguridad*, *servicio*, *puesto*, *novedades*, *libro de novedades*, *supervisor*, *Jefe de Operaciones*, *STS* (Sistemas Tecnológicos de Seguridad), *vigilancia fija / móvil*.
- Documentos del Sistema de Gestión de Calidad (ISO 9001): código `SED-<proceso>-<tipo>-<nº>` (p. ej. `SED-GC-PR-01`), encabezado con *Procedimiento Nº*, *Revisión*, *Página X de Y*; secciones en MAYÚSCULAS (PROPÓSITO, ALCANCE, DEFINICIONES / ABREVIATURAS, PROCEDIMIENTO, REFERENCIAS, ANEXO, CONTROL DE REVISIONES); artículos numerados ("Artículo 1."). Componlos en `doc-body` (Arial 12 pt, justificado) y `doc-header` (Arial 10 pt).
- En interfaces, los metadatos, estados y códigos van en MAYÚSCULAS con `label-md` / `label-sm`: "OPERATIVO", "EN ESPERA", "PUESTO 04".

## Color

La paleta tiene dos capas. **Usa siempre los tokens semánticos** en interfaces; las escalas son la materia prima y solo se usan directamente en ilustración, gráficos y piezas de marca.

**Identidad.** Tres azules del escudo y un gris titanio: `azure-600` (Sapphire Azure, primario), `azure-900` (Deep Midnight Navy, autoridad), `cyan-400` (Radiant Cyan, acento) y `titanium-500` (gris del logotipo). La marca es azul y blanca: el azul domina, el cian solo destella.

**Escalas** (50–950, construidas en OKLCH a partir de los valores originales de marca): `azure`, `cyan`, `titanium`, y las de estado `success`, `warning`, `danger`.

**Temas.** `light` (por defecto) y `dark`. El tema oscuro no es un gris invertido: es azul medianoche (`bg` = `azure-950`), con superficies que suben hacia `azure-900` y el cian como luz.

| Rol | Tokens | Regla |
|---|---|---|
| Fondos | `bg`, `surface`, `surface-raised`, `surface-sunken`, `surface-brand`, `surface-inverse` | Página en `bg`; tarjetas y controles en `surface`; modales en `surface-raised`. |
| Texto | `ink`, `ink-muted`, `ink-subtle`, `ink-inverse`, `ink-brand`, `ink-accent` | Cuerpo en `ink`, secundario en `ink-muted`. `ink-subtle` solo para placeholders o ≥24px. Enlaces en `ink-brand`. |
| Marca | `brand`, `brand-hover`, `brand-deep`, `on-brand` | Rellenos de acción y selección; texto encima siempre `on-brand`. |
| Acento | `accent`, `on-accent`, `accent-subtle` | Indicadores en vivo, puntos, rim-lights, gráficos. En tema claro es decorativo: nunca texto ni única señal. |
| Líneas | `line`, `line-strong`, `focus-ring` | `line` divide; `line-strong` delimita controles (≥3:1); `focus-ring` marca el foco. |
| Estado | `success` · `warning` · `danger`, cada uno con `on-`, `-subtle` e `ink-` | Siempre con palabra o icono, nunca solo color. Información = `brand`. |
| Vidrio | `glass-1`, `glass-card`, `glass-2`, `line-glass`, `line-card`, `line-cyan`, `line-modal` | Ver Elevación. |

- Todas las parejas de texto cumplen 4.5:1 y los bordes de control y el foco 3:1, en ambos temas.
- Acción primaria: `gradient-action` con `on-brand`. `gradient-shield` (con su tramo cian) es para superficies de marca y portadas, no detrás de texto pequeño.
- Degradados permitidos: `gradient-shield`, `gradient-action`, `gradient-atmosphere` / `gradient-atmosphere-dark`, `gradient-rim`, `gradient-accent-line`. No inventes otros.
- **Excepción documentada: WhatsApp.** El glifo de WhatsApp usa su verde oficial (`--whatsapp` #25D366 sobre botones de marca y fondos oscuros; `--whatsapp-deep` #128C7E sobre superficies claras). Solo el glifo: el botón sigue siendo de marca (`gradient-action` o secundario) con su texto en `on-brand`/`ink`, y el verde nunca se usa para texto, fondos ni otros elementos.
- Gráficos: series en `azure-600`, `cyan-600`, `azure-900`, `titanium-500` en ese orden (todas ≥3:1 sobre `surface` claro); en oscuro, `azure-400`, `cyan-400`, `titanium-300`, `azure-200`.

## Tipografía

- Titulares, cifras y etiquetas en **Space Grotesk** (`display-hero` … `headline-sm`, `label-lg` … `label-sm`), eco de la geometría firme del logotipo. Titulares con tracking negativo (-0.02em a -0.01em); etiquetas en mayúsculas con tracking positivo (+0.04em a +0.08em).
- Texto continuo en **Inter** (`body-lg`, `body-md`, `body-sm`).
- Ambas son Google Fonts: cárgalas con `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;600&display=swap`.
- Por debajo de 640px usa las variantes `-mobile`.

## Espaciado y retícula

- Ritmo base de 8px: `space-xs` 4 · `space-sm` 8 · `space-md` 16 · `space-lg` 24 · `space-xl` 40.
- Retícula fluida: móvil (<640px) 4 columnas, margen y medianil 1rem; tablet (640–1024px) 8 columnas, margen 1.5rem, medianil 1.25rem; escritorio (>1024px) 12 columnas, `margin` 2rem, `gutter` 1.5rem, ancho máximo 1440px.
- Espacio en blanco generoso, como el campo luminoso del key visual; las secciones inferiores pueden apoyarse en paneles `brand-deep` o `surface-inverse`.

## Elevación y profundidad

La profundidad se logra con translucidez tipo vidrio y luminiscencia azul, no con sombras pesadas.

- Nivel 0: `bg` o `surface`.
- Nivel 1 (placa): `glass-1`, `backdrop-filter: blur(var(--blur-1))`, borde 1px `line-glass`, `elevation-1`.
- Nivel 2 (módulo activo): `glass-2`, `blur-2`, borde 1px `line-cyan`, `elevation-2`.
- Nivel 3 (modal): `surface-raised`, borde 1px `line-modal`, `elevation-3`.

## Formas

- La geometría replica el escudo: firme, protectora, aerodinámica. Botones y campos `radius` (8px); tarjetas `radius-lg`; contenedores destacados `radius-xl`; chips de estado `radius-full`.
- Los elementos internos usan el radio del padre menos su separación, para mantener la concentricidad.
- Tarjeta con acento: línea superior de 2px en `gradient-accent-line`.

## Estados e interacción

- Botón primario (`gradient-action`): hover sube el brillo y añade `glow-cyan`; activo escala a 0.98.
- Secundario: hover cambia el borde a `brand` y el fondo a `surface-brand`.
- Campos: borde `line-strong`; foco con borde `brand` más halo de 3px `focus-halo`. El halo es decorativo (no llega a 3:1); el estado lo comunica el borde.
- Foco de teclado en botones y controles: contorno sólido de 2px `focus-ring` con 2px de separación (`azure-600` en claro, `cyan-400` en oscuro).
- Indicador en vivo: punto de 6px `accent` con pulso.

## Logotipos e imágenes

- Logotipo vigente: `assets/Logos/sedin-logo-horizontal.png` — "SEDIN, C.A" en `titanium-500` junto al escudo con el can en degradado cian→zafiro. Es un recorte del key visual (raster sobre fondo claro): úsalo solo en el tema claro hasta disponer del vector.
- Logotipo legado: `assets/Logos/sedin-logo-legado-escudo.jpg`, el escudo plateado con estrellas usado en los documentos ISO. Solo en documentos que aún lo llevan.
- Key visual: `assets/Imagery/sedin-key-visual-vertical.jpg` — ondas de luz azul, rim-lights cian y tramas de puntos sobre campo blanco luminoso.
- No dibujes, redibujes ni recolorees el escudo o el can.

## Iconografía

La marca no aporta un set de iconos. Hasta definirlo, usa iconos de trazo lineal en `ink-brand` o `ink-muted`; sin emoji.
