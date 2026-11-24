import type { CSSProperties, ReactNode } from "react";

/** Retardo de animación en segundos. */
export const at = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/** Trazo que se dibuja (pathLength normalizado a 1). */
export function Line({ d, delay, className = "" }: { d: string; delay: number; className?: string }) {
  return <path d={d} pathLength={1} className={`pl-d ${className}`} style={at(delay)} />;
}

/** Elemento que aparece con escala. */
export function Pop({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <g className="pl-pop" style={at(delay)}>
      {children}
    </g>
  );
}

/** Grupo que aparece con fundido. */
export function Fade({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <g className="pl-fade" style={at(delay)}>
      {children}
    </g>
  );
}

export function Label({
  x, y, delay, children, anchor = "start", kind = "",
}: { x: number; y: number; delay: number; children: ReactNode; anchor?: "start" | "middle" | "end"; kind?: "" | "b" | "acc" | "s" | "room" | "tag" }) {
  return (
    <text x={x} y={y} className={`pl-label pl-fade ${kind ? `pl-t--${kind}` : ""}`} style={at(delay)} textAnchor={anchor}>
      {children}
    </text>
  );
}

/** Flecha de retorno a tablero (home run). */
export function HomeRun({ x, y, dx, dy, label, delay, lx, ly }: { x: number; y: number; dx: number; dy: number; label: string; delay: number; lx?: number; ly?: number }) {
  const ex = x + dx, ey = y + dy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const head = `M${ex} ${ey} L${(ex - ux * 7 - uy * 4).toFixed(1)} ${(ey - uy * 7 + ux * 4).toFixed(1)} L${(ex - ux * 7 + uy * 4).toFixed(1)} ${(ey - uy * 7 - ux * 4).toFixed(1)} Z`;
  return (
    <Pop delay={delay}>
      <path d={`M${x} ${y} L${ex} ${ey}`} className="pl-sym pl-sym--acc" />
      <path d={head} className="pl-arrow" />
      <text x={lx ?? ex + 4} y={ly ?? ey + 4} className="pl-label pl-t--acc">{label}</text>
    </Pop>
  );
}

/** Ventana en muro: tres líneas finas. */
const win = (x1: number, y1: number, x2: number, y2: number) =>
  y1 === y2
    ? `M${x1} ${y1 - 3} H${x2} M${x1} ${y1} H${x2} M${x1} ${y1 + 3} H${x2} M${x1} ${y1 - 3} V${y1 + 3} M${x2} ${y1 - 3} V${y1 + 3}`
    : `M${x1 - 3} ${y1} V${y2} M${x1} ${y1} V${y2} M${x1 + 3} ${y1} V${y2} M${x1 - 3} ${y1} H${x1 + 3} M${x1 - 3} ${y2} H${x1 + 3}`;

/**
 * Planta arquitectónica de una vivienda (viewBox 640×440, planta en x 20–440, y 20–350):
 * muros gruesos, puertas con abatimiento, ventanas, mobiliario y nombres de recinto.
 */
export function ArchBase({ t0 = 0, furniture = true }: { t0?: number; furniture?: boolean }) {
  return (
    <g>
      <Line
        d="M20 20 H60 M130 20 H195 M235 20 H320 M400 20 H440 V210 M440 260 V350 H400 M320 350 H130 M90 350 H20 V300 M20 220 V20"
        delay={t0}
        className="pl-wall"
      />
      <Line d="M20 170 H130 M160 170 H170 M260 170 H270 M300 170 H440 M170 20 V170 M260 20 V170 M170 120 H200 M230 120 H260 M290 170 V230 M290 290 V350" delay={t0 + 0.35} className="pl-wall pl-wall--in" />
      <Line
        d={[win(60, 20, 130, 20), win(195, 20, 235, 20), win(320, 20, 400, 20), win(440, 210, 440, 260), win(320, 350, 400, 350), win(20, 220, 20, 300)].join(" ")}
        delay={t0 + 0.6}
        className="pl-win"
      />
      <Line
        d="M160 170 V140 M130 170 A30 30 0 0 1 160 140 M230 120 V90 M200 120 A30 30 0 0 1 230 90 M270 170 V140 M300 170 A30 30 0 0 0 270 140 M90 350 V310 M130 350 A40 40 0 0 0 90 310"
        delay={t0 + 0.75}
        className="pl-door"
      />
      {furniture && (
        <Fade delay={t0 + 0.9}>
          {/* Baño: inodoro, ducha y lavatorio */}
          <rect x={178} y={24} width={20} height={7} rx={1.5} className="pl-fix" />
          <ellipse cx={188} cy={42} rx={8} ry={11} className="pl-fix" />
          <rect x={226} y={24} width={31} height={36} className="pl-fix" />
          <path d="M226 24 L257 60 M257 24 L226 60" className="pl-fix pl-fix--thin" />
          <rect x={236} y={96} width={22} height={18} rx={2} className="pl-fix" />
          <ellipse cx={247} cy={105} rx={7} ry={5} className="pl-fix" />
          {/* Cocina: mueble, fregadero y cocina */}
          <path d="M300 192 H418 V300 H436" className="pl-fix pl-fix--thin" />
          <rect x={421} y={236} width={13} height={26} rx={2} className="pl-fix" />
          <rect x={370} y={175} width={30} height={14} rx={1.5} className="pl-fix" />
          <circle cx={378} cy={182} r={3} className="pl-fix pl-fix--thin" />
          <circle cx={392} cy={182} r={3} className="pl-fix pl-fix--thin" />
          {/* Dormitorios */}
          <rect x={34} y={34} width={56} height={74} rx={2} className="pl-fix pl-fix--thin" />
          <path d="M34 50 H90" className="pl-fix pl-fix--thin" />
          <rect x={370} y={34} width={56} height={74} rx={2} className="pl-fix pl-fix--thin" />
          <path d="M370 50 H426" className="pl-fix pl-fix--thin" />
          {/* Sala y comedor */}
          <rect x={30} y={236} width={20} height={64} rx={3} className="pl-fix pl-fix--thin" />
          <rect x={180} y={286} width={56} height={34} rx={2} className="pl-fix pl-fix--thin" />
        </Fade>
      )}
      <Label x={92} y={150} delay={t0 + 1} anchor="middle" kind="room">DORMITORIO 1</Label>
      <Label x={215} y={82} delay={t0 + 1.05} anchor="middle" kind="room">BAÑO</Label>
      <Label x={360} y={150} delay={t0 + 1.1} anchor="middle" kind="room">DORMITORIO 2</Label>
      <Label x={150} y={200} delay={t0 + 1.15} anchor="middle" kind="room">SALA Y COMEDOR</Label>
      <Label x={360} y={336} delay={t0 + 1.2} anchor="middle" kind="room">COCINA</Label>
    </g>
  );
}

export type LegendRow = { sym: ReactNode; text: string };

/** Simbología y cajetín en la columna derecha de la lámina (x 456–630). */
export function Sheet({ rows, title, subtitle, sheet, scale = "1:75", t0 = 1.4 }: { rows: LegendRow[]; title: string; subtitle: string; sheet: string; scale?: string; t0?: number }) {
  return (
    <g>
      <Line d="M456 20 H630 V250 H456 Z M456 262 H630 V350 H456 Z M456 292 H630 M456 328 H630 M543 328 V350" delay={t0} className="pl-sheet" />
      <Label x={466} y={38} delay={t0 + 0.3} kind="b">SIMBOLOGÍA</Label>
      {rows.map((r, i) => (
        <Fade key={r.text} delay={t0 + 0.4 + i * 0.07}>
          <g transform={`translate(476 ${60 + i * 24})`}>{r.sym}</g>
          <text x={494} y={64 + i * 24} className="pl-label pl-t--s">{r.text}</text>
        </Fade>
      ))}
      <Label x={466} y={282} delay={t0 + 0.5} kind="acc">GO INGENIERÍA</Label>
      <Label x={466} y={308} delay={t0 + 0.55} kind="b">{title}</Label>
      <Label x={466} y={321} delay={t0 + 0.6} kind="s">{subtitle}</Label>
      <Label x={466} y={343} delay={t0 + 0.65} kind="s">Escala {scale}</Label>
      <Label x={553} y={343} delay={t0 + 0.7} kind="b">{sheet}</Label>
    </g>
  );
}

/* Símbolos normalizados, dibujados alrededor de (0,0) */
export const Sym = {
  luminaria: (tag?: string) => (
    <>
      <circle r={7} className="pl-light" />
      <path d="M-5 -5 L5 5 M5 -5 L-5 5" className="pl-sym pl-sym--acc" />
      {tag && <text x={8} y={-6} className="pl-label pl-t--tag">{tag}</text>}
    </>
  ),
  apagador: (tag?: string) => (
    <>
      <text x={0} y={4} textAnchor="middle" className="pl-label pl-t--symtxt">S</text>
      {tag && <text x={6} y={8} className="pl-label pl-t--tag">{tag}</text>}
    </>
  ),
  toma: (vertical = true, extra?: string) => (
    <>
      <circle r={4.5} className="pl-light" />
      <path d={vertical ? "M-8 -2 H8 M-8 2 H8" : "M-2 -8 V8 M2 -8 V8"} className="pl-sym pl-sym--acc" />
      {extra && <text x={vertical ? -8 : 7} y={vertical ? -8 : -6} textAnchor={vertical ? "end" : "start"} className="pl-label pl-t--tag">{extra}</text>}
    </>
  ),
  toma240: () => (
    <>
      <circle r={4.5} className="pl-light" />
      <path d="M-2 -8 V8 M2 -8 V8 M-6 0 H6" className="pl-sym pl-sym--acc" />
    </>
  ),
  tablero: () => (
    <>
      <rect x={-12} y={-5} width={24} height={10} className="pl-light" />
      <path d="M-12 5 L12 -5 L12 5 Z" className="pl-arrow" />
    </>
  ),
};

/** Proyección isométrica para modelos 3D. */
export const iso = (x: number, y: number, z: number, ox = 300, oy = 236): [number, number] => [
  +(ox + (x - y) * 0.866).toFixed(1),
  +(oy + (x + y) * 0.5 - z).toFixed(1),
];
export const isoPath = (pts: Array<[number, number, number]>, close = false) =>
  pts.map((p, i) => `${i ? "L" : "M"}${iso(...p).join(" ")}`).join(" ") + (close ? " Z" : "");

/** Aristas de una caja isométrica. */
export function isoBox(x: number, y: number, z: number, w: number, d: number, h: number) {
  type P3 = [number, number, number];
  const A: P3 = [x, y, z], B: P3 = [x + w, y, z], C: P3 = [x + w, y + d, z], D: P3 = [x, y + d, z];
  const up = (p: P3): P3 => [p[0], p[1], p[2] + h];
  return [isoPath([A, B, C, D], true), isoPath([up(A), up(B), up(C), up(D)], true), isoPath([B, up(B)]), isoPath([C, up(C)]), isoPath([D, up(D)])].join(" ");
}
