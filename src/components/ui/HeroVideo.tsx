"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/*
 * Animación de la portada (Grok Imagine, 2026-10-31; original en
 * /opt/SEDIN/video-portada/). Su primer fotograma es la foto de la portada,
 * así que la foto hace de póster y el vídeo entra encima con un fundido.
 * Bucle de ida y vuelta (12 s, sin salto al repetir), sin sonido:
 * - horizontal 1280×720: WebM VP9 (≈630 KB) y MP4 H.264 (≈700 KB);
 * - vertical (<640px en vertical, el mismo recorte que `hero-movil.webp`):
 *   444×720, ≈350 KB.
 * Se pide después del evento `load` (no compite con la foto, que es la
 * imagen LCP) y no se carga con «reducir movimiento», con ahorro de datos ni
 * en 2G. Se pausa fuera de pantalla. Como dura más de 5 s, lleva botón de
 * pausa (WCAG 2.2.2); la pausa se recuerda en las demás páginas.
 */

const base = "/assets/portada";
const sources = {
  horizontal: [
    { src: `${base}/hero-video-1280.webm`, type: "video/webm" },
    { src: `${base}/hero-video-1280.mp4`, type: "video/mp4" },
  ],
  vertical: [
    { src: `${base}/hero-video-movil.webm`, type: "video/webm" },
    { src: `${base}/hero-video-movil.mp4`, type: "video/mp4" },
  ],
} as const;

/** El mismo corte que el `<source>` vertical de la foto en HeroBackdrop. */
const PORTRAIT_QUERY = "(max-width: 639px) and (orientation: portrait)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const STORAGE_KEY = "sedin-portada-pausada";

/* Estado compartido entre el vídeo y su botón (hay una portada por página). */
type Status = "off" | "playing" | "paused";
let status: Status = "off";
const listeners = new Set<() => void>();

function setStatus(next: Status) {
  if (next === status) return;
  status = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function storedPause() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function storePause(paused: boolean) {
  try {
    if (paused) localStorage.setItem(STORAGE_KEY, "1");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sin almacenamiento (modo privado, cookies bloqueadas): solo vale para esta página.
  }
}

function canAnimate() {
  if (matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  return !connection?.saveData && !/2g$/.test(connection?.effectiveType ?? "");
}

/** El vídeo, encima de la foto y debajo de los velos. `className`: el mismo encuadre que la foto. */
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<keyof typeof sources | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!canAnimate()) return;
    const start = () => setVariant(matchMedia(PORTRAIT_QUERY).matches ? "vertical" : "horizontal");
    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!variant || !video) return;
    // iOS solo reproduce sin interacción si está silenciado (React no escribe el atributo).
    video.muted = true;
    let onScreen = true;
    const sync = () => {
      if (status === "playing" && onScreen) video.play().catch(() => {});
      else video.pause();
    };
    const unsubscribe = subscribe(sync);
    setStatus(storedPause() ? "paused" : "playing");
    sync();

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    const reducedMotion = matchMedia(REDUCED_MOTION_QUERY);
    const onReducedMotion = () => {
      if (reducedMotion.matches) setStatus("paused");
    };
    reducedMotion.addEventListener("change", onReducedMotion);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", onReducedMotion);
      unsubscribe();
      setStatus("off");
    };
  }, [variant]);

  if (!variant) return null;
  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onPlaying={() => setShown(true)}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
        shown ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {sources[variant].map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}

/** Pausar / reanudar la animación. Solo aparece cuando el vídeo está cargado. */
export function HeroVideoToggle({ className }: { className?: string }) {
  const current = useSyncExternalStore(
    subscribe,
    () => status,
    () => "off" as Status,
  );
  if (current === "off") return null;
  const paused = current === "paused";
  const label = paused ? "Reanudar la animación de fondo" : "Pausar la animación de fondo";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        storePause(!paused);
        setStatus(paused ? "playing" : "paused");
      }}
      className={cn(
        "absolute z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-azure-950/40 text-white/85 backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10 hover:text-white",
        className,
      )}
    >
      {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
    </button>
  );
}
