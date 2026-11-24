"use client";
import { motion, useReducedMotion } from "motion/react";
import { Counter } from "../motion/Counter";
import { Reveal } from "../motion/Reveal";
import { fmt } from "@/lib/site";

type Item = { value: number; suffix: string; label: string; static?: boolean };
export type StatsData = {
  id: string;
  title: string;
  lead: Item;
  secondary: Item[];
  breakdownTitle: string;
  breakdown: { label: string; m2: number; projects: number }[];
  note: string;
};

export function Stats({ data }: { data: StatsData }) {
  const reduce = useReducedMotion();
  const max = Math.max(...data.breakdown.map((b) => b.m2));
  return (
    <section id={data.id} className="section stats" aria-labelledby={`${data.id}-t`}>
      <div className="wrap stats__grid">
        <div>
          <Reveal><h2 id={`${data.id}-t`} className="h2">{data.title}</h2></Reveal>
          <Reveal delay={0.1}>
            <p className="stats__lead">
              <Counter value={data.lead.value} suffix={data.lead.suffix} className="stats__big" />
              <span className="stats__lead-label">{data.lead.label}</span>
            </p>
          </Reveal>
          <div className="stats__secondary">
            {data.secondary.map((s, i) => (
              <Reveal key={s.label} delay={0.15 + i * 0.08}>
                <p className="stats__mini">
                  {s.static ? <span className="stats__num">{s.value}</span> : <Counter value={s.value} suffix={s.suffix} className="stats__num" />}
                  <span className="muted">{s.label}</span>
                </p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="stats__card">
          <h3 className="stats__card-t">{data.breakdownTitle}</h3>
          <ul className="bars">
            {data.breakdown.map((b, i) => (
              <li key={b.label} className="bars__row">
                <div className="bars__head">
                  <span>{b.label}</span>
                  <span className="bars__val">{fmt(b.m2)} m²</span>
                </div>
                <div className="bars__track">
                  <motion.span
                    className="bars__fill"
                    style={{ width: `${(b.m2 / max) * 100}%`, originX: 0 }}
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="bars__proj muted">{b.projects} {b.projects === 1 ? "proyecto" : "proyectos"}</span>
              </li>
            ))}
          </ul>
          <p className="stats__note">{data.note}</p>
        </div>
      </div>
    </section>
  );
}
