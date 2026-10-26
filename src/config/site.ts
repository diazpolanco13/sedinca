/**
 * Datos centrales del sitio. Los valores entre corchetes son marcadores
 * pendientes: se rellenan aquí y se propagan a todas las páginas.
 */
export const site = {
  shortName: "SEDIN",
  name: "SEDIN, C.A.",
  legalName: "Seguridad y Defensa Integral, Compañía Anónima",
  rif: "J-409643387",
  phone: "[TELÉFONO]",
  email: "[CORREO]",
  address: "[DIRECCIÓN]",
  hours: "[HORARIO]",
  whatsappNumber: "[NÚMERO DE WHATSAPP]",
  responseTime: "[TIEMPO DE RESPUESTA]",
  jobRequirements: "[REQUISITOS DE POSTULACIÓN]",
  /** Endpoint que recibe el formulario de cotización (POST JSON). Vacío = sin envío. */
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
  /** Endpoint que recibe las postulaciones (POST multipart con el CV). Vacío = sin envío. */
  jobsEndpoint: process.env.NEXT_PUBLIC_JOBS_ENDPOINT ?? "",
} as const;

export function isPlaceholder(value: string) {
  return /^\[.*\]$/.test(value);
}

/** Enlace de WhatsApp; mientras no haya número, lleva a la página de contacto. */
export function whatsappHref() {
  if (isPlaceholder(site.whatsappNumber)) return "/contacto";
  return `https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}`;
}

export function phoneHref() {
  if (isPlaceholder(site.phone)) return undefined;
  return `tel:${site.phone.replace(/[^\d+]/g, "")}`;
}

export function emailHref() {
  if (isPlaceholder(site.email)) return undefined;
  return `mailto:${site.email}`;
}

export const mainNav = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Sectores", href: "/sectores" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const services = {
  vigilancia: { label: "Vigilancia privada", href: "/servicios/vigilancia-privada" },
  acceso: { label: "Control de acceso", href: "/servicios/control-de-acceso" },
  electronicos: { label: "Sistemas electrónicos", href: "/servicios/sistemas-electronicos" },
  riesgos: { label: "Gestión de riesgos", href: "/servicios/gestion-de-riesgos" },
} as const;

export const routes = {
  home: "/",
  services: "/servicios",
  sectors: "/sectores",
  about: "/nosotros",
  jobs: "/empleo",
  contact: "/contacto",
} as const;
