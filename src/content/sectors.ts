import { BriefcaseIcon, BuildingIcon, FactoryIcon, HomeIcon } from "@/components/icons";
import type { ServiceContent } from "@/content/services";

type Icon = typeof FactoryIcon;

export interface SectorContent {
  id: string;
  title: string;
  Icon: Icon;
  text: string;
  focus: string[];
  services: ServiceContent["slug"][];
  /** Foto del sector (generada con IA), en `public/assets/sectores/<id>.webp`. */
  photo: { src: string; alt: string };
}

/** Sectores atendidos (fuente: mapa del sitio e Inicio). */
export const sectorsContent: SectorContent[] = [
  {
    id: "industria-petrolera",
    title: "Industria petrolera",
    Icon: FactoryIcon,
    text: "Protección de instalaciones, activos críticos y personal en operaciones de alto riesgo.",
    focus: [
      "Instalaciones y activos críticos",
      "Operaciones de alto riesgo",
      "Control de salida de personal y bienes",
    ],
    services: [
      "vigilancia-privada",
      "control-de-acceso",
      "sistemas-electronicos",
      "gestion-de-riesgos",
    ],
    photo: {
      src: "/assets/sectores/industria-petrolera.webp",
      alt: "Oficial de seguridad vigila el cerco perimetral de un campo petrolero a orillas del Lago de Maracaibo, con balancines y torres de perforación al atardecer.",
    },
  },
  {
    id: "empresas-e-industria",
    title: "Empresas e industria",
    Icon: BuildingIcon,
    text: "Seguridad corporativa para oficinas, plantas, almacenes y centros de distribución.",
    focus: ["Oficinas", "Plantas y almacenes", "Centros de distribución"],
    services: ["vigilancia-privada", "control-de-acceso", "sistemas-electronicos"],
    photo: {
      src: "/assets/sectores/empresas-e-industria.webp",
      alt: "Oficial de seguridad, con su planilla, atiende al conductor de un camión en la barrera de acceso de un centro de distribución.",
    },
  },
  {
    id: "corporaciones",
    title: "Corporaciones",
    Icon: BriefcaseIcon,
    text: "Soluciones a la medida, discreción, control y protección para tu tranquilidad.",
    focus: ["Soluciones a la medida", "Discreción", "Control y protección"],
    services: ["vigilancia-privada", "control-de-acceso", "gestion-de-riesgos"],
    photo: {
      src: "/assets/sectores/corporaciones.webp",
      alt: "Oficial de seguridad entrega una credencial de visitante a un ejecutivo en la recepción de una sede corporativa con vista al Lago de Maracaibo.",
    },
  },
  {
    id: "residencial-y-condominios",
    title: "Residencial y condominios",
    Icon: HomeIcon,
    text: "Presencia disuasiva, vigilancia 24/7 y control de accesos para conjuntos residenciales.",
    focus: ["Presencia disuasiva", "Vigilancia 24/7", "Control de accesos"],
    services: ["vigilancia-privada", "control-de-acceso", "sistemas-electronicos"],
    photo: {
      src: "/assets/sectores/residencial-y-condominios.webp",
      alt: "Oficial de seguridad atiende con su radio a un conductor en la garita de acceso de un conjunto residencial al anochecer.",
    },
  },
];
