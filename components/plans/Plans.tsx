import type { ReactNode } from "react";
import { ArchBase, Sheet, Sym, Line, Pop, Fade, Label, HomeRun, at, isoPath, isoBox } from "./primitives";

type PlanProps = { static?: boolean; title?: string };

export function Frame({ vb = "0 0 640 440", title, isStatic, children }: { vb?: string; title?: string; isStatic?: boolean; children: ReactNode }) {
  return (
    <svg viewBox={vb} className={`pl ${isStatic ? "is-static" : ""}`} role="img" aria-label={title} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}

const P = ({ x, y, d, children }: { x: number; y: number; d: number; children: ReactNode }) => (
  <Pop delay={d}>
    <g transform={`translate(${x} ${y})`}>{children}</g>
  </Pop>
);

/* ============ Plano eléctrico: iluminación y tomacorrientes (lámina E-01) ============ */
const LIGHTS: Array<[number, number, string]> = [[95, 95, "a"], [205, 92, "b"], [200, 145, "c"], [350, 95, "d"], [110, 260, "e"], [205, 260, "e"], [360, 255, "f"]];
const SWITCHES: Array<[number, number, string]> = [[120, 162, "a"], [193, 112, "b"], [178, 160, "c"], [310, 162, "d"], [142, 341, "e"], [298, 212, "f"]];
const OUTLETS: Array<[number, number, boolean, string?]> = [
  [25, 60, true], [25, 130, true], [80, 165, false],
  [435, 60, true], [435, 130, true], [390, 25, false],
  [25, 190, true], [25, 318, true], [200, 345, false], [285, 320, true],
  [435, 225, true, "GFCI"], [435, 285, true, "GFCI"], [256, 80, true, "GFCI"],
];
const C1 = "M45 340 Q60 292 110 260 Q158 240 205 260 Q225 200 200 145 Q280 100 350 95";

export function ElectricPlan({ static: s, title = "Plano eléctrico" }: PlanProps) {
  return (
    <Frame title={title} isStatic={s}>
      <ArchBase />
      <Sheet
        title="PLANO ELÉCTRICO"
        subtitle="Iluminación y tomacorrientes"
        sheet="E-01"
        rows={[
          { sym: Sym.luminaria(), text: "Luminaria de techo" },
          { sym: Sym.apagador(), text: "Apagador sencillo" },
          { sym: Sym.toma(false), text: "Tomacorriente 120 V" },
          { sym: Sym.toma(false, "GFCI"), text: "Tomacorriente GFCI" },
          { sym: Sym.toma240(), text: "Tomacorriente 240 V" },
          { sym: Sym.tablero(), text: "Centro de carga CC-1" },
          { sym: <path d="M-12 4 Q0 -8 12 4 M-6 -1 l2 5 M-1 -3 l2 5 M4 -2 l2 5" className="pl-sym pl-sym--acc" />, text: "Circuito, 3 conductores" },
          { sym: <><path d="M-12 0 H8" className="pl-sym pl-sym--acc" /><path d="M12 0 L5 -4 L5 4 Z" className="pl-arrow" /></>, text: "Retorno a tablero" },
        ]}
      />
      {/* Centro de carga y medidor */}
      <P x={45} y={344} d={1.6}>{Sym.tablero()}</P>
      <Label x={56} y={334} delay={1.7} kind="tag">CC-1</Label>
      <Pop delay={1.65}><circle cx={45} cy={380} r={9} className="pl-light" /><text x={45} y={384} textAnchor="middle" className="pl-label pl-t--symtxt">M</text></Pop>
      <Line d="M45 371 V350" delay={1.7} className="pl-elec" />
      <Label x={60} y={384} delay={1.75} kind="s">Medidor</Label>
      {LIGHTS.map(([x, y, t], i) => <P key={i} x={x} y={y} d={1.8 + i * 0.07}>{Sym.luminaria(t)}</P>)}
      {SWITCHES.map(([x, y, t], i) => <P key={i} x={x} y={y} d={2.2 + i * 0.05}>{Sym.apagador(t)}</P>)}
      {OUTLETS.map(([x, y, v, e], i) => <P key={i} x={x} y={y} d={2.4 + i * 0.04}>{Sym.toma(v, e)}</P>)}
      <P x={385} y={175} d={2.9}>{Sym.toma240()}</P>
      {/* Circuito C-1 de iluminación con retornos a apagadores */}
      <Line d={C1} delay={3} className="pl-elec" />
      <Line d="M200 145 Q150 110 95 95 M200 145 Q190 120 205 92 M205 260 Q285 230 360 255" delay={3.3} className="pl-elec" />
      <Line d="M95 95 Q102 140 120 162 M205 92 Q186 100 193 112 M200 145 Q186 150 178 160 M350 95 Q332 140 310 162 M110 260 Q130 310 142 341 M360 255 Q322 222 298 212" delay={3.6} className="pl-elec pl-elec--leg" />
      <Line d="M50 318 l9 -5 M53 324 l9 -5 M56 330 l9 -5" delay={3.6} className="pl-elec" />
      {/* Circuitos de tomacorrientes */}
      <Line d="M25 60 Q36 95 25 130 Q48 160 80 165" delay={3.8} className="pl-elec pl-elec--rec" />
      <Line d="M390 25 Q420 32 435 60 Q446 95 435 130" delay={3.9} className="pl-elec pl-elec--rec" />
      <Line d="M25 190 Q36 255 25 318 M200 345 Q260 340 285 320" delay={4} className="pl-elec pl-elec--rec" />
      <Line d="M435 225 Q446 255 435 285" delay={4.1} className="pl-elec pl-elec--rec" />
      <HomeRun x={80} y={165} dx={-14} dy={20} label="C-2" delay={4.3} />
      <HomeRun x={435} y={130} dx={-18} dy={18} label="C-3" delay={4.35} lx={398} ly={160} />
      <HomeRun x={200} y={345} dx={-26} dy={-14} label="C-4" delay={4.4} lx={166} ly={322} />
      <HomeRun x={435} y={285} dx={-20} dy={16} label="C-5" delay={4.45} lx={396} ly={312} />
      <HomeRun x={256} y={80} dx={-14} dy={-10} label="C-5" delay={4.5} lx={226} ly={66} />
      <HomeRun x={385} y={175} dx={-22} dy={14} label="C-6" delay={4.55} lx={340} ly={196} />
      <Label x={70} y={300} delay={4.6} kind="acc">C-1</Label>
      <path d={C1} pathLength={100} className="pl-pulse" style={at(4.8)} />
    </Frame>
  );
}

/* ============ Plano hidrosanitario (lámina M-01) ============ */
const cr = (x: number, y: number) => `M${x - 8} ${y - 8} h16 v16 h-16 Z M${x - 8} ${y - 8} l16 16 M${x + 8} ${y - 8} l-16 16`;

export function HydraulicPlan({ static: s, title = "Plano hidrosanitario" }: PlanProps) {
  const AP = "M249 404 V182 H430 V240";
  return (
    <Frame title={title} isStatic={s}>
      <ArchBase />
      <Sheet
        title="PLANO MECÁNICO"
        subtitle="Agua potable y sanitario"
        sheet="M-01"
        rows={[
          { sym: <path d="M-12 0 H12" className="pl-water" />, text: "Agua potable fría (AP)" },
          { sym: <path d="M-12 0 H12" className="pl-hot" />, text: "Agua caliente (AC)" },
          { sym: <path d="M-12 0 H12" className="pl-drain" />, text: "Aguas negras (AN)" },
          { sym: <path d="M-12 0 H12" className="pl-grey" />, text: "Aguas jabonosas (AJ)" },
          { sym: <path d={cr(0, 0)} className="pl-sym" />, text: "Caja de registro" },
          { sym: <path d="M-7 -5 L7 5 V-5 L-7 5 Z" className="pl-valve" />, text: "Llave de paso" },
          { sym: <><circle r={7} className="pl-heater" /><text y={3} textAnchor="middle" className="pl-label pl-t--tag">TA</text></>, text: "Tanque de agua caliente" },
          { sym: <path d="M-10 0 H6 M2 -4 L8 0 L2 4" className="pl-sym" />, text: "Pendiente 2 %" },
        ]}
      />
      {/* Medidor y llave de paso */}
      <Pop delay={1.6}><rect x={240} y={404} width={18} height={14} rx={2} className="pl-meter" /><text x={249} y={414} textAnchor="middle" className="pl-label pl-t--tag">M</text></Pop>
      <Pop delay={1.7}><path d="M242 368 L256 378 V368 L242 378 Z" className="pl-valve" /></Pop>
      <Label x={264} y={414} delay={1.75} kind="s">Medidor</Label>
      {/* Agua potable fría */}
      <Line d={AP} delay={1.9} className="pl-water" />
      <Line d="M249 182 H188 V54 M226 182 V62 M253 182 V114 M430 240 V300 H418 V318" delay={2.4} className="pl-water pl-water--thin" />
      <path d={AP} pathLength={100} className="pl-flow" style={at(4.6)} />
      {/* Tanque de agua caliente y distribución */}
      <Pop delay={2.6}><circle cx={418} cy={330} r={11} className="pl-heater" /><text x={418} y={334} textAnchor="middle" className="pl-label pl-t--tag">TA</text></Pop>
      <Line d="M407 330 H300 V194 H222 V62 M240 194 V114 M424 319 V262" delay={2.8} className="pl-hot" />
      {/* Aguas negras y jabonosas */}
      <Line d="M188 54 V150 H150 V380" delay={3.1} className="pl-drain" />
      <Line d="M241 42 V150 M247 105 H241 M427 262 H450 V410 H338 V396" delay={3.3} className="pl-grey" />
      <Pop delay={3.4}><path d={cr(150, 388)} className="pl-sym" /></Pop>
      <Pop delay={3.45}><path d={cr(338, 388)} className="pl-sym" /></Pop>
      <Line d="M330 388 H158 M142 388 H28" delay={3.6} className="pl-drain" />
      <Pop delay={3.9}><path d="M28 388 l8 -5 v10 z" className="pl-arrow pl-arrow--grey" /></Pop>
      {/* Rotulación */}
      <Label x={310} y={205} delay={4} kind="tag">AP Ø 13 mm PVC</Label>
      <Label x={306} y={262} delay={4.05} kind="tag">AC Ø 13 mm CPVC</Label>
      <Label x={156} y={300} delay={4.1} kind="tag">AN Ø 100 mm</Label>
      <Label x={156} y={312} delay={4.15} kind="tag">2 % ↓</Label>
      <Label x={360} y={426} delay={4.2} kind="tag">AJ Ø 50 mm</Label>
      <Label x={126} y={414} delay={4.25} kind="tag">CR-1</Label>
      <Label x={314} y={414} delay={4.3} kind="tag">CR-2</Label>
      <Label x={24} y={408} delay={4.35} kind="tag">Al colector</Label>
    </Frame>
  );
}


/* ============ Seguridad humana: detección y alarma de incendios (lámina SH-01) ============ */
const DET: Array<[number, number, string]> = [[95, 95, "DH"], [200, 145, "DH"], [350, 95, "DH"], [110, 260, "DH"], [205, 260, "DH"], [360, 255, "DT"]];
const det = (t: string) => (
  <>
    <circle r={9} className="pl-light" />
    <text y={3.5} textAnchor="middle" className="pl-label pl-t--tag">{t}</text>
  </>
);
const em = () => (
  <>
    <rect x={-7} y={-7} width={14} height={14} className="pl-panel" />
    <text y={3.5} textAnchor="middle" className="pl-label pl-t--tag">F</text>
  </>
);
const se = () => (
  <>
    <rect x={-7} y={-7} width={14} height={14} className="pl-light" />
    <path d="M-4 4 L0 -4 L4 4 Z" className="pl-arrow" />
  </>
);
const SLC = "M36 312 Q60 280 110 260 Q158 240 205 260 Q225 200 200 145 Q150 110 95 95 M200 145 Q280 100 350 95 M205 260 Q285 236 360 255 Q330 300 296 326 Q220 352 142 341 Q80 338 36 326";

export function FirePlan({ static: s, title = "Plano de seguridad humana" }: PlanProps) {
  return (
    <Frame title={title} isStatic={s}>
      <ArchBase />
      <Sheet
        title="SEGURIDAD HUMANA"
        subtitle="Detección y alarma de incendios"
        sheet="SH-01"
        rows={[
          { sym: det("DH"), text: "Detector de humo" },
          { sym: det("DT"), text: "Detector térmico" },
          { sym: em(), text: "Estación manual" },
          { sym: se(), text: "Sirena con luz estroboscópica" },
          { sym: <rect x={-12} y={-6} width={24} height={12} className="pl-panel" />, text: "Panel de control (PCI)" },
          { sym: <path d="M-12 0 H12" className="pl-elec pl-elec--slc" />, text: "Lazo de detección (SLC)" },
          { sym: <path d="M-12 0 H12" className="pl-elec pl-elec--rec" />, text: "Circuito de notificación" },
        ]}
      />
      <Pop delay={1.6}><rect x={24} y={304} width={14} height={30} className="pl-panel" /></Pop>
      <Label x={44} y={330} delay={1.7} kind="tag">PCI</Label>
      {DET.map(([x, y, t], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={9} className="pl-ring" style={at(4.2 + i * 0.35)} />
          <P x={x} y={y} d={1.9 + i * 0.08}>{det(t)}</P>
        </g>
      ))}
      <P x={142} y={341} d={2.4}>{em()}</P>
      <P x={296} y={326} d={2.45}>{em()}</P>
      <P x={25} y={200} d={2.5}>{se()}</P>
      <P x={178} y={150} d={2.55}>{se()}</P>
      <P x={435} y={100} d={2.6}>{se()}</P>
      <Line d={SLC} delay={2.9} className="pl-elec pl-elec--slc" />
      <Line d="M30 304 Q18 250 25 200 Q100 172 178 150 Q320 88 435 100" delay={3.4} className="pl-elec pl-elec--rec" />
      <Label x={70} y={296} delay={3.9} kind="acc">SLC</Label>
      <Label x={300} y={112} delay={3.95} kind="acc">NAC</Label>
      <path d={SLC} pathLength={100} className="pl-pulse" style={at(4.4)} />
    </Frame>
  );
}

/* ============ Modelo BIM coordinado ============ */
const W = 230, Dp = 160, F = 92;
const slab = (z: number) => isoPath([[0, 0, z], [W, 0, z], [W, Dp, z], [0, Dp, z]], true);
const cols: Array<[number, number]> = [[0, 0], [W / 2, 0], [W, 0], [W, Dp], [W / 2, Dp], [0, Dp]];
const ELEC = isoPath([[25, 147, 34], [25, 147, F + 80], [210, 147, F + 80], [210, 20, F + 80]]);
const WATER = isoPath([[170, 70, F * 2], [170, 70, F + 70], [60, 70, F + 70], [60, 70, 70], [200, 70, 70]]);

export function BimPlan({ static: s, title = "Modelo BIM" }: PlanProps) {
  return (
    <Frame vb="0 0 640 440" title={title} isStatic={s}>
      <g transform="translate(-20 0)">
        <path d={isoPath([[0, Dp, 0], [W, Dp, 0], [W, Dp, F * 2], [0, Dp, F * 2]], true)} className="pl-face pl-face--a" style={at(3.4)} />
        <path d={isoPath([[W, 0, 0], [W, Dp, 0], [W, Dp, F * 2], [W, 0, F * 2]], true)} className="pl-face pl-face--b" style={at(3.5)} />
        {[0, F, F * 2].map((z, i) => <Line key={z} d={slab(z)} delay={0.1 + i * 0.35} className="pl-wall pl-wall--iso" />)}
        {cols.map(([x, y], i) => <Line key={i} d={isoPath([[x, y, 0], [x, y, F * 2]])} delay={1 + i * 0.07} className="pl-wall pl-wall--in" />)}
        <Line d={isoPath([[0, 0, F], [W, 0, F]]) + " " + isoPath([[0, 0, F - 10], [W, 0, F - 10]])} delay={1.4} className="pl-wall pl-wall--in" />
        <path d={isoBox(18, 140, 0, 14, 14, 34)} className="pl-d pl-box pl-box--elec" pathLength={1} style={at(1.6)} />
        <Line d={isoPath([[25, 147, 34], [25, 147, 80], [210, 147, 80], [210, 20, 80]])} delay={1.8} className="pl-elec" />
        <Line d={ELEC} delay={2.1} className="pl-elec" />
        <path d={ELEC} pathLength={100} className="pl-pulse" style={at(3.6)} />
        <path d={isoBox(150, 50, F * 2, 40, 40, 30)} className="pl-d pl-box pl-box--water" pathLength={1} style={at(1.7)} />
        <Line d={WATER} delay={2.2} className="pl-water" />
        <path d={WATER} pathLength={100} className="pl-flow" style={at(3.5)} />
        <Line d={isoPath([[90, 120, F * 2 - 10], [90, 120, -10], [-30, 120, -10]])} delay={2.5} className="pl-drain" />
      </g>
      <Fade delay={2.9}>
        <circle cx={174} cy={226} r={3} className="pl-dot" />
        <path d="M174 226 L120 290 H40" className="pl-sym pl-sym--acc" />
        <text x={40} y={284} className="pl-label pl-t--s">Ducto eléctrico</text>
        <circle cx={367} cy={182} r={3} className="pl-dot" />
        <path d="M367 182 L420 120 H500" className="pl-sym pl-sym--water" />
        <text x={424} y={114} className="pl-label pl-t--s">Agua potable</text>
        <circle cx={254} cy={300} r={3} className="pl-dot" />
        <path d="M254 300 L200 380 H110" className="pl-sym" />
        <text x={110} y={374} className="pl-label pl-t--s">Bajante sanitaria</text>
      </Fade>
      <Pop delay={4}>
        <rect x={430} y={372} width={190} height={40} rx={20} className="pl-badge" />
        <circle cx={452} cy={392} r={10} className="pl-check-bg" />
        <path d="M447 392 l3.5 4 l7 -8" className="pl-check" />
        <text x={470} y={397} className="pl-label pl-t--b">Sin interferencias</text>
      </Pop>
      <Label x={24} y={36} delay={3.2} kind="b">MODELO BIM COORDINADO</Label>
      <Label x={24} y={52} delay={3.3} kind="s">Arquitectura, estructura y sistemas</Label>
    </Frame>
  );
}

export const PLANS = { electrico: ElectricPlan, hidraulico: HydraulicPlan, incendios: FirePlan, bim: BimPlan } as const;
export type PlanId = keyof typeof PLANS;
