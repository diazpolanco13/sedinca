import { EmpresasPage } from "@/components/trust/Empresas";
import { empresasMeta } from "@/components/trust/content";
import { routes } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

/** /empresas/ «Para compras y proveedores» (propuesta 8.7 y 4.9). */
export const metadata = pageMetadata({ ...empresasMeta, path: routes.empresas });

export default function Page() {
  return <EmpresasPage />;
}
