"use client";
import { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, useReducedMotion } from "motion/react";
import { waLink } from "@/lib/site";
import { Reveal } from "../motion/Reveal";
import { useIntensity } from "../motion/MotionProvider";
import { WhatsAppGlyph } from "../Icon";
import { PLANS, type PlanId } from "../plans/Plans";

type Plan = { id: PlanId; label: string; caption: string; duration: number };

export type HeroData = {
  id: string;
  title: string;
  titleLight?: string;
  subtitle: string;
  primaryCta: { label: string; message: string };
  secondaryCta: { label: string; href: string };
  plans: Plan[];
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Secuencia firma: cada plano se dibuja en grande, se minimiza arriba y entra el siguiente.
 * Al terminar, tocar una miniatura la vuelve principal y la redibuja.
 */
function PlanSequence({ plans }: { plans: Plan[] }) {
  const reduce = useReducedMotion();
  const intensity = useIntensity();
  const instant = reduce || intensity <= 3;
  const ids = plans.map((p) => p.id);

  const [revealed, setRevealed] = useState<PlanId[]>(instant ? ids : [ids[0]]);
  const [active, setActive] = useState<PlanId>(instant ? ids[ids.length - 1] : ids[0]);
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (instant) {
      setRevealed(ids);
      setActive(ids[ids.length - 1]);
      return;
    }
    let t = 0;
    plans.slice(0, -1).forEach((p, i) => {
      t += p.duration * 1000;
      timers.current.push(
        window.setTimeout(() => {
          const next = ids[i + 1];
          setRevealed((r) => (r.includes(next) ? r : [...r, next]));
          setActive(next);
        }, t)
      );
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instant]);

  const pick = (id: PlanId) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRevealed(ids);
    setActive(id);
    setRun((n) => n + 1);
  };

  const current = plans.find((p) => p.id === active)!;
  const thumbs = plans.filter((p) => revealed.includes(p.id) && p.id !== active);
  const Main = PLANS[active];

  return (
    <LayoutGroup>
      <div className="seq">
        <ul className="seq__thumbs" aria-label="Planos del proyecto">
          {thumbs.map((p) => {
            const Thumb = PLANS[p.id];
            return (
              <motion.li key={p.id} layoutId={`plan-${p.id}`} transition={{ duration: 0.8, ease: EASE }} className="seq__thumb">
                <button type="button" onClick={() => pick(p.id)} aria-label={`Ver ${p.label.toLowerCase()}`}>
                  <span className="seq__thumb-art"><Thumb static /></span>
                  <span className="seq__thumb-label">{p.label}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <motion.div key={active} layoutId={`plan-${active}`} transition={{ duration: 0.8, ease: EASE }} className="seq__main">
          <div className="seq__head">
            <motion.span key={`l-${active}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="seq__label">
              {current.label}
            </motion.span>
            <span className="seq__count" aria-hidden="true">{ids.indexOf(active) + 1} de {ids.length}</span>
          </div>
          <div className="seq__art" key={`${active}-${run}`}>
            <Main />
          </div>
          <p className="seq__caption">{current.caption}</p>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}

export function Hero({ data }: { data: HeroData }) {
  const words = data.title.split(" ");
  const lightFrom = data.titleLight ? data.title.indexOf(data.titleLight) : -1;
  let cursor = 0;

  return (
    <section id={data.id} className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title" aria-label={data.title}>
            {words.map((w, i) => {
              const start = cursor;
              cursor += w.length + 1;
              const light = lightFrom >= 0 && start >= lightFrom;
              return (
                <span key={i} aria-hidden="true" className="word">
                  <span className={light ? "word__in is-light" : "word__in"} style={{ animationDelay: `${0.08 + i * 0.06}s` }}>
                    {w}&nbsp;
                  </span>
                </span>
              );
            })}
          </h1>
          <Reveal delay={0.45}>
            <p className="hero__sub">{data.subtitle}</p>
          </Reveal>
          <Reveal delay={0.6}>
            <div className="hero__ctas">
              <a className="btn btn--accent btn--lg" href={waLink(data.primaryCta.message)} target="_blank" rel="noopener">
                <WhatsAppGlyph size={20} /> {data.primaryCta.label}
              </a>
              <a className="btn btn--ghost btn--lg" href={data.secondaryCta.href}>{data.secondaryCta.label}</a>
            </div>
          </Reveal>
        </div>
        <div className="hero__visual">
          <PlanSequence plans={data.plans} />
        </div>
      </div>
    </section>
  );
}
