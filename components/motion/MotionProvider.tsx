"use client";
import { createContext, useContext, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

const IntensityCtx = createContext(7);
export const useIntensity = () => useContext(IntensityCtx);

/** Expone design.dials.motion y respeta prefers-reduced-motion en todo el sitio. */
export function MotionProvider({ intensity, children }: { intensity: number; children: ReactNode }) {
  return (
    <IntensityCtx.Provider value={intensity}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </IntensityCtx.Provider>
  );
}
