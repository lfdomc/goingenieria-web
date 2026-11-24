"use client";
import { motion } from "motion/react";
import { site } from "@/lib/site";
import { Reveal } from "../motion/Reveal";
import { Icon } from "../Icon";

type Category = { id: string; title: string; short: string; icon: string; text: string };
export type ServicesData = {
  id: string;
  title: string;
  intro: string;
  categories: Category[];
  bimNote: { title: string; text: string };
  cta: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Listado por especialidad: cada fila abre la página del servicio, donde está su diagrama animado. */
export function Services({ data }: { data: ServicesData }) {
  return (
    <section id={data.id} className="section" aria-labelledby={`${data.id}-t`}>
      <div className="wrap">
        <div className="section__head">
          <Reveal><h2 id={`${data.id}-t`} className="h2">{data.title}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{data.intro}</p></Reveal>
        </div>

        <div className="svc-cols">
          {data.categories.map((c, ci) => {
            const items = site.services.filter((s) => s.discipline === c.id);
            return (
              <Reveal key={c.id} delay={ci * 0.1} className="svc-col">
                <header className="svc-col__head">
                  <span className="cat__icon"><Icon name={c.icon} size={22} /></span>
                  <div>
                    <h3 className="svc-col__t">{c.title}</h3>
                    <p className="svc-col__p">{c.text}</p>
                  </div>
                </header>
                <ul className="svc-list">
                  {items.map((s, i) => (
                    <motion.li
                      key={s.slug}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.5, delay: 0.15 + ci * 0.1 + i * 0.06, ease: EASE }}
                    >
                      <a href={`/servicios/${s.slug}/`} className="svc-row">
                        <span className="svc-row__fill" aria-hidden="true" />
                        <span className="svc-row__main">
                          <span className="svc-row__t">{s.name}</span>
                          <span className="svc-row__arrow" aria-hidden="true"><Icon name="arrow" size={18} /></span>
                        </span>
                        <span className="svc-row__more">
                          <span className="svc-row__p">{s.summary}</span>
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="bim-note">
            <span className="cat__icon"><Icon name="cube" size={22} /></span>
            <div>
              <p className="bim-note__t">{data.bimNote.title}</p>
              <p className="muted">{data.bimNote.text}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
