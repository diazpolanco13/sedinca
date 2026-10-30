import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { SitePage } from "@/components/layout/SitePage";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqList } from "@/components/ui/FaqList";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/SectionHeading";
import { ctaLabels, hasPending, routes, showPending, type CtaAction } from "@/config/site";
import { faqCategories, faqs, faqsByCategory, type FaqCategory, type FaqId, type FaqItem } from "@/content/faq";
import { isVisible, publishedText } from "@/lib/pending";
import {
  faqHero,
  faqKeywords,
  faqMinPerTopic,
  faqOwnPhrase,
  faqTopics,
  faqWhatsapp,
  ubicaciones,
  type Icon,
} from "./content";
import { FaqHashOpener } from "./FaqHashOpener";
import { HeroLead, IconBadge } from "./TrustBlocks";

/*
 * /preguntas-frecuentes: todas las preguntas de faq.ts, agrupadas por tema.
 *   portada (foto del puente)
 *   → barra de temas (chips con ancla y nº de preguntas; desplazable en móvil)
 *   → sunken / light alternos: un tema por sección (encabezado + FaqList)
 *   → dark    cierre «¿No encontró su pregunta?»
 *
 * Los temas con menos de `faqMinPerTopic` preguntas publicadas se funden con
 * otro (`mergeInto`) y conservan su ancla. La entradilla y el recuento de
 * cada tema salen de las preguntas que se publican. Las de `faqOwnPhrase`
 * solo se publican con su frase propia (si no, repetirían otra respuesta).
 *
 * Cada pregunta conserva su `id` como ancla (/preguntas-frecuentes#falta-oficial)
 * y se abre sola al llegar con ese ancla (FaqHashOpener). Un único bloque
 * JSON-LD FAQPage reúne todas las respuestas publicables.
 */

const UBI = ubicaciones.faq;

const heroActions: CtaAction[] = [
  { kind: "whatsapp", label: ctaLabels.whatsapp, message: faqWhatsapp, ubicacion: UBI },
  { kind: "link", label: "Ver cómo trabajamos", href: routes.comoTrabajamos, ubicacion: UBI },
];

/**
 * ¿Se publica la frase propia de la pregunta (`faqOwnPhrase`)? Sin entrada,
 * sí. `all`: cuenta también las frases con [MARCADOR] (modo revisión).
 */
function hasOwnPhrase(item: FaqItem, all = showPending) {
  const phrase = faqOwnPhrase[item.id as FaqId];
  return !phrase || item.answer.some((s) => s.toLowerCase().includes(phrase) && (all || !hasPending(s)));
}

/** ¿La pregunta se publica en el modo actual? (regla de FaqList + frase propia). */
function shown(item: FaqItem) {
  return (showPending || !hasPending(item.question)) && isVisible(item.answer) && hasOwnPhrase(item);
}

/** «Relevos, reportes y supervisión.» con las palabras clave de las preguntas publicadas. */
function describe(items: readonly FaqItem[]) {
  const words = [...new Set(items.map((f) => faqKeywords[f.id as FaqId]).filter((w): w is string => !!w))];
  if (words.length === 0) return undefined;
  const list = words.length > 1 ? `${words.slice(0, -1).join(", ")} y ${words.at(-1)}` : words[0];
  return `${list.charAt(0).toUpperCase()}${list.slice(1)}.`;
}

interface Topic {
  id: FaqCategory;
  Icon: Icon;
  label: string;
  items: FaqItem[];
  links: { label: string; href: string }[];
  /** Anclas de los temas fundidos en este. */
  anchors: FaqCategory[];
  description?: string;
}

/** Temas con preguntas publicables, en el orden de `faqTopics`, ya fundidos. */
function visibleTopics(): Topic[] {
  const topics: Topic[] = faqTopics
    .map((topic) => ({
      id: topic.id,
      Icon: topic.Icon,
      label: faqCategories[topic.id].label,
      items: faqsByCategory(topic.id).filter(shown),
      links: topic.link ? [topic.link] : [],
      anchors: [],
    }))
    .filter((topic) => topic.items.length > 0);

  for (const topic of faqTopics) {
    const own = topics.find((t) => t.id === topic.id);
    const host = topics.find((t) => t.id === topic.mergeInto);
    if (!own || !host || own.items.length >= faqMinPerTopic) continue;
    host.items.push(...own.items);
    host.links.push(...own.links);
    host.anchors.push(own.id, ...own.anchors);
    topics.splice(topics.indexOf(own), 1);
  }
  return topics.map((topic) => ({ ...topic, description: describe(topic.items) }));
}

/** FAQPage con todo el texto publicable (nunca frases con [MARCADOR]). */
function faqJsonLd() {
  const mainEntity = faqs
    .filter((f) => !hasPending(f.question) && hasOwnPhrase(f, false) && publishedText(f.answer))
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: publishedText(f.answer) },
    }));
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity };
}

const plural = (n: number) => (n === 1 ? "1 pregunta" : `${n} preguntas`);

export function PreguntasFrecuentesPage() {
  const topics = visibleTopics();
  const jsonLd = faqJsonLd();
  return (
    <SitePage>
      <PageHero
        crumbs={[{ label: "Preguntas frecuentes" }]}
        eyebrow={faqHero.eyebrow}
        title={faqHero.title}
        lead={<HeroLead text={faqHero.lead} actions={heroActions} />}
        primary={null}
      />

      {/* Barra de temas: chips con ancla (desplazable en horizontal en móvil).
          `relative` en la lista: si no, los `sr-only` (absolutos) escapan del
          desplazamiento y ensanchan la página. */}
      <nav aria-label="Temas" className="border-b border-line bg-surface">
        <Container>
          <ul className="relative -mx-4 my-0 flex list-none gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {topics.map((topic) => (
              <li key={topic.id} className="flex-none">
                <a
                  href={`#${topic.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-card bg-surface px-4 font-display text-[15px] leading-5 font-semibold whitespace-nowrap text-ink no-underline transition-colors hover:border-accent hover:text-ink-brand motion-reduce:transition-none"
                >
                  <topic.Icon size={18} className="flex-none text-ink-brand" />
                  {topic.label}
                  <span className="rounded-full bg-surface-brand px-2 text-[13px] leading-5 text-ink-brand tabular-nums">
                    {topic.items.length}
                    <span className="sr-only"> {topic.items.length === 1 ? "pregunta" : "preguntas"}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {topics.map((topic, i) => {
        const titleId = `${topic.id}-titulo`;
        return (
          <Section
            key={topic.id}
            tone={i % 2 === 0 ? "sunken" : "light"}
            id={topic.id}
            labelledBy={titleId}
            space="tight"
          >
            {topic.anchors.map((anchor) => (
              <span key={anchor} id={anchor} className="block scroll-mt-24" />
            ))}
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <div className="flex flex-col gap-5 lg:sticky lg:top-28">
                  <span className="hidden lg:block">
                    <IconBadge Icon={topic.Icon} size="lg" />
                  </span>
                  <SectionHeader
                    id={titleId}
                    eyebrow={`Tema ${String(i + 1).padStart(2, "0")} · ${plural(topic.items.length)}`}
                    title={topic.label}
                    lead={topic.description}
                    size="md"
                  />
                  {topic.links.length > 0 && (
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {topic.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            prefetch={false}
                            className="group inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-ink-brand no-underline hover:underline"
                          >
                            {link.label}
                            <ArrowRightIcon
                              size={16}
                              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="lg:col-span-8">
                <FaqList items={topic.items} headingLevel="h3" openFirst />
              </div>
            </div>
          </Section>
        );
      })}

      <CtaBand
        eyebrow="¿Otra pregunta?"
        title="¿No encontró su pregunta?"
        lead="Escríbanos por WhatsApp: un asesor le responde y, si lo necesita, coordina con usted la inspección del sitio."
        whatsappMessage={faqWhatsapp}
        ubicacion={UBI}
        footnote={
          <>
            ¿Quiere ver el método completo?{" "}
            <ArrowLink href={routes.comoTrabajamos} className="text-[15px]">
              Cómo trabajamos
            </ArrowLink>
          </>
        }
      />

      {jsonLd.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <FaqHashOpener />
    </SitePage>
  );
}
