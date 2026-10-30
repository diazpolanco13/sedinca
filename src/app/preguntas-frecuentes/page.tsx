import { PreguntasFrecuentesPage } from "@/components/trust/PreguntasFrecuentes";
import { faqMeta } from "@/components/trust/content";
import { routes } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

/** /preguntas-frecuentes/: todas las preguntas por tema, con datos estructurados FAQPage. */
export const metadata = pageMetadata({ ...faqMeta, path: routes.faq });

export default function Page() {
  return <PreguntasFrecuentesPage />;
}
