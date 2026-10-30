/**
 * Datos estructurados (schema.org) en un `<script type="application/ld+json">`.
 * Se escapa `<` para que ningún texto pueda cerrar la etiqueta. Solo con
 * texto publicable (use `publishedText` para contenidos con marcadores).
 *
 *   <JsonLd data={siteJsonLd()} />
 */
export function JsonLd({ data, id }: { data: Record<string, unknown>; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
