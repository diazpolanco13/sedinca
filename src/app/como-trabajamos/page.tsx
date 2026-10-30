import { ComoTrabajamosPage } from "@/components/trust/ComoTrabajamos";
import { comoTrabajamosMeta } from "@/components/trust/content";
import { routes } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

/** /como-trabajamos/ (propuesta 8.5): el método, con anclas para cada pieza. */
export const metadata = pageMetadata({ ...comoTrabajamosMeta, path: routes.comoTrabajamos });

export default function Page() {
  return <ComoTrabajamosPage />;
}
