# SEDIN, C.A. — Web corporativa (versión preliminar)

Construye el sitio web de **SEDIN, C.A.** (Seguridad y Defensa Integral, Compañía Anónima), empresa venezolana de seguridad privada y protección preventiva, a partir de los diseños y el sistema de diseño de esta carpeta. Responde y escribe el contenido en español.

## Qué hay en esta carpeta

| Carpeta | Contenido | Cómo usarlo |
|---|---|---|
| `design/` | Las pantallas aprobadas en formato `.dc.html` (un HTML con marcado propio del lienzo de diseño). | **Referencia visual y de contenido**, no código para copiar. Toma de ellas estructura, textos, orden de secciones, tamaños, colores y espaciados. Ignora las etiquetas `<x-dc>`, `<helmet>`, `<x-import>`, `<sc-*>` y el bloque `<script type="text/x-dc">`: son del editor. Un `<x-import component-from-global-scope="Sedin.Card">` equivale al componente `Card` del sistema de diseño. |
| `design/00-mapa-del-sitio.dc.html` | Mapa del sitio y estructura de navegación. | Define las rutas. |
| `design/01-inicio.dc.html` | Página de inicio completa. | Prioridad 1. |
| `design/02-plantilla-servicio.dc.html` | Plantilla de página de servicio (ejemplo: Vigilancia privada). | Úsala para los 4 servicios. |
| `design/03-contacto.dc.html` | Contacto y formulario de cotización. | |
| `design-system/BRAND.md` | Guía de marca: voz, color, tipografía, espaciado, elevación, estados, logos. | **Léela primero y síguela.** |
| `design-system/tokens.json` / `tokens.css` | Tokens de diseño (temas claro y oscuro). | `tokens.css` es la fuente de las variables CSS; cárgalo global. |
| `design-system/components/` | Componentes de referencia (`bundle.js`, `bundle.css`, tipos y guías por componente: Button, Chip, Input, Checkbox, Radio, Card). | Reimpleméntalos como componentes del framework con las mismas clases/estilos. |
| `assets/` | Logos (fondo claro y oscuro), escudo, foto de portada, ilustración. | Cópialos a `public/`. No redibujes ni recolorees el logo. |

## Stack sugerido

- Next.js (App Router) + TypeScript, salida estática (`output: 'export'`) para desplegar en un VPS con Dokploy.
- CSS: importar `design-system/tokens.css` como variables globales; estilos con CSS Modules o Tailwind configurado para leer esas variables (no copiar valores hex sueltos).
- Fuentes: Space Grotesk (titulares, etiquetas) e Inter (texto) con `next/font/google`.
- Imágenes con `next/image`.

## Rutas

- `/` Inicio
- `/servicios` + `/servicios/vigilancia-privada`, `/servicios/control-de-acceso`, `/servicios/sistemas-electronicos`, `/servicios/gestion-de-riesgos` (misma plantilla, contenido distinto)
- `/sectores` (industria petrolera, empresas e industria, corporaciones, residencial y condominios)
- `/nosotros` (quiénes somos, valores, personal capacitado, gestión de calidad)
- `/empleo` (vacantes y postulación)
- `/contacto` (formulario de cotización + canales)

Todas las páginas: encabezado con logo, menú y botón «Solicitar cotización»; pie con servicios, contacto y RIF J-409643387; botón flotante de WhatsApp.

## Reglas

- La portada de Inicio va con la foto a sangre (`assets/hero-puente-vigilante.jpg`), encabezado transparente encima y oscurecido a la izquierda para legibilidad, como en `01-inicio.dc.html`.
- Responsivo desde 360 px: el menú se convierte en menú hamburguesa en móvil.
- Accesible: contraste AA (ya resuelto en los tokens), `<button>`/`<a>` reales, `label` en cada campo, foco visible con `--focus-ring`.
- No inventar datos: los marcadores `[TELÉFONO]`, `[CORREO]`, `[DIRECCIÓN]`, `[HORARIO]`, `[NÚMERO DE WHATSAPP]`, `[TIEMPO DE RESPUESTA]` quedan centralizados en un archivo `src/config/site.ts` para rellenarlos después.
- Los recuadros azules con `[Foto] …` son espacios para fotografías reales: usa un componente `Placeholder` con ese texto hasta tener las fotos.
- El formulario de contacto: validación en cliente y envío a un endpoint configurable (dejar preparado, sin servicio externo por ahora).

## Contenido de los servicios (fuente: piezas de la empresa)

- **Vigilancia privada** (fija y móvil): residencial y condominios, empresas, industria. Seguridad confiable, vigilancia 24/7, presencia disuasiva, atención inmediata.
- **Control de acceso y salida de personal**: procedimientos de acceso, inspección y control, protocolos de seguridad, prevención y comunicación, trato respetuoso y profesional.
- **Sistemas de seguridad electrónica**: cámaras de alta definición con visión nocturna y monitoreo en tiempo real, vigilancia remota 24/7 desde centro de control, cercado eléctrico, concertinas.
- **Gestión de riesgos y consultoría**: prevención, análisis y respuesta efectiva; asesoría.
- Valores: Seguridad · Orden · Disciplina · Control · Responsabilidad.
- Lemas: «Protegemos lo que mueve tu mundo», «Seguridad que impulsa tu operación. Confianza que te respalda.», «Cada ingreso controlado es un riesgo menos para tu empresa.», «Atentos siempre, protegiendo lo que más importa.»

## Orden de trabajo

1. Leer `design-system/BRAND.md` y las 4 pantallas de `design/`.
2. Montar el proyecto, tokens, fuentes y componentes base.
3. Construir Inicio idéntico al diseño; después Contacto, la plantilla de servicio y el resto de rutas.
4. Comprobar en 360, 768 y 1440 px.
