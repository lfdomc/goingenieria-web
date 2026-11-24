import type { ComponentType } from "react";
import type { Section } from "@/lib/site";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Stats } from "./Stats";
import { Services } from "./Services";
import { Process } from "./Process";
import { Projects } from "./Projects";
import { Faq } from "./Faq";
import { Contact } from "./Contact";

/** El orden y tipo de secciones viene de site.json: reordenar o quitar secciones no toca código. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, ComponentType<{ data: any }>> = {
  hero: Hero,
  marquee: Marquee,
  stats: Stats,
  services: Services,
  process: Process,
  projects: Projects,
  faq: Faq,
  contact: Contact,
};

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s) => {
        const C = registry[s.type];
        if (!C) {
          if (process.env.NODE_ENV !== "production") console.warn(`Sección sin componente: ${s.type}`);
          return null;
        }
        return <C key={s.id} data={s} />;
      })}
    </>
  );
}
