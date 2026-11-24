"use client";
import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { site } from "@/lib/site";
import { Reveal } from "../motion/Reveal";
import { Icon } from "../Icon";
import { ServiceArt } from "../plans/Arts";

type Category = { id: string; title: string; short: string; icon: string; text: string };
export type ServicesData = {
  id: string;
  title: string;
  intro: string;
  allLabel: string;
  categories: Category[];
  bimNote: { title: string; text: string };
  cta: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Catálogo por especialidad: todos los servicios visibles, filtrables y con su plano en miniatura. */
export function Services({ data }: { data: ServicesData }) {
  const [filter, setFilter] = useState<string>("all");
  const [hover, setHover] = useState<string | null>(null);
  const groups = data.categories
    .filter((c) => filter === "all" || c.id === filter)
    .map((c) => ({ ...c, items: site.services.filter((s) => s.discipline === c.id) }));
  const count = (id: string) => site.services.filter((s) => s.discipline === id).length;

  return (
    <section id={data.id} className="section" aria-labelledby={`${data.id}-t`}>
      <div className="wrap">
        <div className="section__head">
          <Reveal><h2 id={`${data.id}-t`} className="h2">{data.title}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{data.intro}</p></Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="cat-filter" role="group" aria-label="Filtrar servicios por especialidad">
            <LayoutGroup id="cat-filter">
              {[{ id: "all", label: data.allLabel, n: site.services.length }, ...data.categories.map((c) => ({ id: c.id, label: c.short, n: count(c.id) }))].map((f) => (
                <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={filter === f.id ? "is-on" : ""}>
                  {filter === f.id && <motion.span layoutId="cat-pill" className="cat-filter__pill" transition={{ duration: 0.45, ease: EASE }} />}
                  <span className="cat-filter__label">{f.label}</span>
                  <span className="cat-filter__n">{f.n}</span>
                </button>
              ))}
            </LayoutGroup>
          </div>
        </Reveal>

        <div className="cat-groups">
          <AnimatePresence mode="popLayout" initial={false}>
            {groups.map((g) => (
              <motion.div
                key={g.id}
                layout
                className="cat"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <header className="cat__head">
                  <span className="cat__icon"><Icon name={g.icon} size={22} /></span>
                  <div>
                    <h3 className="cat__t">{g.title}</h3>
                    <p className="muted cat__p">{g.text}</p>
                  </div>
                  <span className="cat__count">{g.items.length} servicios</span>
                </header>
                <ul className="cat__grid" style={{ ["--n" as string]: g.items.length } as CSSProperties}>
                  {g.items.map((s, i) => (
                    <motion.li
                      key={s.slug}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                    >
                      <a
                        href={`/servicios/${s.slug}/`}
                        className="svc-card"
                        onPointerEnter={() => setHover(s.slug)}
                        onPointerLeave={() => setHover((h) => (h === s.slug ? null : h))}
                        onFocus={() => setHover(s.slug)}
                        onBlur={() => setHover(null)}
                      >
                        <span className={`svc-card__art ${hover === s.slug ? "is-live" : "is-still"}`} aria-hidden="true">
                          <ServiceArt key={hover === s.slug ? "live" : "still"} art={s.art} />
                        </span>
                        <span className="svc-card__body">
                          <span className="svc-card__t">{s.name}</span>
                          <span className="svc-card__p">{s.summary}</span>
                          <span className="svc-card__cta">{data.cta} <Icon name="arrow" size={16} /></span>
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
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
