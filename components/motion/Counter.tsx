"use client";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useIntensity } from "./MotionProvider";

const format = (n: number) => Math.round(n).toLocaleString("es-CR");

/** El HTML estático ya trae el valor final (SEO); el cliente anima escribiendo en el DOM. */
export function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const intensity = useIntensity();

  useEffect(() => {
    if (!inView || reduce || intensity <= 3 || !ref.current) return;
    const el = ref.current;
    const c = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => (el.textContent = format(n)),
    });
    return () => c.stop();
  }, [inView, reduce, intensity, value, suffix]);

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
      <span ref={ref}>{format(value)}</span>
      {suffix && <span className="counter__suffix">{suffix}</span>}
    </span>
  );
}
