"use client";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useIntensity } from "./MotionProvider";

export type RevealKind = "fade-up" | "mask" | "blur" | "none";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  kind = "fade-up",
  delay = 0,
  className,
  as = "div",
  children,
}: {
  kind?: RevealKind | string;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
  children: ReactNode;
}) {
  const intensity = useIntensity();
  const reduce = useReducedMotion();
  const Tag = as;
  if (kind === "none" || reduce || intensity <= 3) return <Tag className={className}>{children}</Tag>;

  const d = intensity * 3;
  const duration = 0.35 + intensity * 0.06;
  const variants: Record<string, Variants> = {
    "fade-up": { hidden: { opacity: 0, y: d }, show: { opacity: 1, y: 0 } },
    mask: { hidden: { clipPath: "inset(0 0 100% 0)" }, show: { clipPath: "inset(0 0 0% 0)" } },
    blur: { hidden: { opacity: 0, filter: "blur(12px)" }, show: { opacity: 1, filter: "blur(0px)" } },
  };
  const M = motion[Tag];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05, margin: "0px 0px -8% 0px" }}
      variants={variants[kind] ?? variants["fade-up"]}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}
