"use client";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "../motion/Reveal";
import { useIntensity } from "../motion/MotionProvider";

export type ProjectsData = {
  id: string;
  title: string;
  intro: string;
  items: { title: string; category: string; image: string; imageAlt: string; size?: "wide" | "tall" | "normal" }[];
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Mosaico vertical: cada obra entra con una cortina al llegar a ella; todas quedan visibles. */
export function Projects({ data }: { data: ProjectsData }) {
  const reduce = useReducedMotion();
  const intensity = useIntensity();
  const animate = !reduce && intensity > 3;

  return (
    <section id={data.id} className="section projects" aria-labelledby={`${data.id}-t`}>
      <div className="wrap">
        <div className="section__head">
          <Reveal><h2 id={`${data.id}-t`} className="h2">{data.title}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{data.intro}</p></Reveal>
        </div>
        <ul className="mosaic">
          {data.items.map((p, i) => (
            <motion.li
              key={i}
              className={`mosaic__item mosaic__item--${p.size ?? "normal"}`}
              initial={animate ? { clipPath: "inset(18% 0 0 0 round 18px)", opacity: 0, y: 60 } : false}
              whileInView={{ clipPath: "inset(0% 0 0 0 round 18px)", opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: EASE }}
            >
              <figure>
                <motion.img
                  src={p.image}
                  alt={p.imageAlt}
                  loading="lazy"
                  initial={animate ? { scale: 1.18 } : false}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 1.4, delay: (i % 3) * 0.08, ease: EASE }}
                />
                <figcaption>
                  <span className="mosaic__cat">{p.category}</span>
                  <span className="mosaic__t">{p.title}</span>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
