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
  photo: { caption: string; label: string };
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
      caption: "[Foto] Oficial de SEDIN en una instalación petrolera",
      label: "Espacio para fotografía de instalación petrolera",
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
      caption: "[Foto] Control de acceso en planta o almacén",
      label: "Espacio para fotografía de planta o almacén",
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
      caption: "[Foto] Recepción de sede corporativa con oficial de seguridad",
      label: "Espacio para fotografía de sede corporativa",
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
      caption: "[Foto] Garita de conjunto residencial",
      label: "Espacio para fotografía de conjunto residencial",
    },
  },
];
