import type { ReactNode } from "react";
import { ArchBase, Line, Pop, Fade, Label, at, isoPath } from "./primitives";
import { Frame, ElectricPlan, HydraulicPlan, FirePlan, BimPlan } from "./Plans";

/** Cajetín inferior para láminas sin columna de simbología (y 384–428). */
function TitleStrip({ title, subtitle, sheet, t0 = 1 }: { title: string; subtitle: string; sheet: string; t0?: number }) {
  return (
    <g>
      <Line d="M20 384 H620 V428 H20 Z M200 384 V428 M520 384 V428" delay={t0} className="pl-sheet" />
      <Label x={32} y={411} delay={t0 + 0.3} kind="acc">GO INGENIERÍA</Label>
      <Label x={212} y={403} delay={t0 + 0.35} kind="b">{title}</Label>
      <Label x={212} y={418} delay={t0 + 0.4} kind="s">{subtitle}</Label>
      <Label x={570} y={411} delay={t0 + 0.45} kind="b" anchor="middle">{sheet}</Label>
    </g>
  );
}

/* ============ Estudios eléctricos: unifilar + coordinación de protecciones (curvas TCC) ============ */
function Estudios() {
  const xs = [52, 104, 156, 208, 260];
  const loads = ["C-1", "C-2", "C-3", "C-5", "C-6"];
  const bk = ["1P-15 A", "1P-20 A", "1P-20 A", "1P-20 A", "2P-40 A"];
  // rejilla log-log del gráfico TCC
  const gx = [330, 402, 474, 546, 618];
  const gy = [30, 100, 170, 240, 310];
  const minor = [0.3, 0.48, 0.6, 0.7, 0.78, 0.85, 0.9, 0.95];
  return (
    <Frame vb="0 0 640 440" title="Estudio eléctrico: unifilar y coordinación de protecciones">
      {/* Unifilar */}
      <Label x={24} y={24} delay={0.1} kind="tag">Acometida 2#1/0 + 1#2 THHN</Label>
      <Line d="M156 30 V56" delay={0.1} className="pl-wall pl-wall--in" />
      <Pop delay={0.35}><circle cx={156} cy={70} r={14} className="pl-light" /><text x={156} y={74} textAnchor="middle" className="pl-label pl-t--symtxt">M</text></Pop>
      <Line d="M156 84 V104 M156 128 V150" delay={0.5} className="pl-wall pl-wall--in" />
      <Pop delay={0.65}><path d="M148 104 Q166 116 148 128" className="pl-sym pl-sym--acc" /><circle cx={156} cy={104} r={2.5} className="pl-dot" /><circle cx={156} cy={128} r={2.5} className="pl-dot" /></Pop>
      <Label x={176} y={120} delay={0.75} kind="tag">Principal 2P-150 A</Label>
      <Line d="M36 150 H276" delay={0.9} className="pl-bus" />
      <Label x={36} y={142} delay={1} kind="tag">CC-1 · 120/240 V</Label>
      <Line d="M36 150 V176 M28 176 H44 M31 181 H41 M34 186 H38" delay={1.1} className="pl-wall pl-wall--in" />
      {xs.map((x, i) => (
        <g key={x}>
          <Line d={`M${x + 16} 150 V188 M${x + 16} 212 V252`} delay={1.25 + i * 0.1} className="pl-wall pl-wall--in" />
          <Pop delay={1.4 + i * 0.1}><path d={`M${x + 9} 188 Q${x + 27} 200 ${x + 9} 212`} className="pl-sym pl-sym--acc" /></Pop>
          <text x={x + 16} y={232} transform={`rotate(-90 ${x + 22} 232)`} className="pl-label pl-t--tag pl-fade" style={at(1.6 + i * 0.1)}>{bk[i]}</text>
          <Pop delay={1.7 + i * 0.1}><circle cx={x + 16} cy={262} r={10} className="pl-light" /><text x={x + 16} y={266} textAnchor="middle" className="pl-label pl-t--tag">{loads[i]}</text></Pop>
        </g>
      ))}
      <path d="M156 30 V150 H68 V252" pathLength={100} className="pl-pulse" style={at(3.2)} />
      <Label x={24} y={300} delay={2.2} kind="s">Corto circuito en barra: Icc calculada</Label>
      <Label x={24} y={316} delay={2.25} kind="s">Arco eléctrico según NFPA 70E</Label>
      {/* Gráfico tiempo-corriente */}
      <Line d="M330 30 H618 V310 H330 Z" delay={0.6} className="pl-sheet" />
      <Fade delay={0.9}>
        {gx.slice(0, -1).map((x0) => minor.map((m) => <path key={`${x0}-${m}`} d={`M${(x0 + 72 * m).toFixed(1)} 30 V310`} className="pl-grid" />))}
        {gy.slice(0, -1).map((y0) => minor.map((m) => <path key={`h${y0}-${m}`} d={`M330 ${(y0 + 70 * m).toFixed(1)} H618`} className="pl-grid" />))}
        {gx.map((x) => <path key={`X${x}`} d={`M${x} 30 V310`} className="pl-grid pl-grid--major" />)}
        {gy.map((y) => <path key={`Y${y}`} d={`M330 ${y} H618`} className="pl-grid pl-grid--major" />)}
      </Fade>
      <Line d="M352 34 C372 120 392 190 410 222 L412 262 H424 L426 306" delay={2} className="pl-elec pl-elec--tcc" />
      <Line d="M436 34 C462 120 492 200 516 236 L520 270 H540 L542 306" delay={2.4} className="pl-water pl-water--tcc" />
      <Line d="M590 40 V306" delay={2.8} className="pl-elec pl-elec--leg" />
      <Label x={394} y={180} delay={2.6} kind="tag">Ramal 1P-20 A</Label>
      <Label x={500} y={140} delay={3} kind="tag">Principal 2P-150 A</Label>
      <Label x={586} y={54} delay={3.1} kind="tag" anchor="end">Icc</Label>
      <Label x={474} y={328} delay={1.2} kind="s" anchor="middle">Corriente (A)</Label>
      <text x={318} y={170} transform="rotate(-90 318 170)" textAnchor="middle" className="pl-label pl-t--s pl-fade" style={at(1.2)}>Tiempo (s)</text>
      <Label x={340} y={48} delay={1.3} kind="b">Coordinación de protecciones</Label>
      <TitleStrip title="ESTUDIO ELÉCTRICO" subtitle="Unifilar, cortocircuito y coordinación · IEEE / NFPA" sheet="EE-01" t0={1.4} />
    </Frame>
  );
}

/* ============ Estudio de iluminación: planta con isolíneas y puntos de cálculo ============ */
function Iluminacion() {
  const lum: Array<[number, number]> = [];
  [95, 230, 365].forEach((x) => [85, 185, 285].forEach((y) => lum.push([x, y])));
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 4; j++) {
      const x = 50 + i * 72, y = 60 + j * 80;
      const dx = (x - 230) / 230, dy = (y - 185) / 170;
      pts.push([x, y, Math.round((560 - 230 * (dx * dx + dy * dy)) / 10) * 10]);
    }
  return (
    <Frame vb="0 0 640 440" title="Estudio de iluminación de una oficina">
      <defs>
        <radialGradient id="il-glow">
          <stop offset="0%" stopColor="oklch(0.9 0.13 85)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="oklch(0.9 0.13 85)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="il-room"><rect x={23} y={23} width={414} height={324} /></clipPath>
      </defs>
      <Line d="M20 20 H120 M200 20 H260 M340 20 H440 V350 H90 M50 350 H20 V20" delay={0.1} className="pl-wall" />
      <Line d="M120 17 H200 M120 20 H200 M120 23 H200 M260 17 H340 M260 20 H340 M260 23 H340 M50 350 V312 M90 350 A40 40 0 0 0 50 310" delay={0.4} className="pl-win" />
      <Fade delay={0.6}>
        {[[50, 120], [190, 120], [330, 120], [50, 230], [190, 230], [330, 230]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={80} height={36} rx={2} className="pl-fix pl-fix--thin" />
        ))}
      </Fade>
      <g clipPath="url(#il-room)">
      {lum.map(([x, y], i) => (
        <circle key={`g${i}`} cx={x} cy={y} r={120} fill="url(#il-glow)" className="pl-cone" style={at(1.3 + i * 0.08)} />
      ))}
      </g>
      {lum.map(([x, y], i) => (
        <Pop key={i} delay={1 + i * 0.06}>
          <rect x={x - 24} y={y - 7} width={48} height={14} className="pl-light" />
          <path d={`M${x - 24} ${y} H${x + 24}`} className="pl-sym pl-sym--acc" />
        </Pop>
      ))}
      <Line d="M60 55 H400 Q420 55 420 75 V300 Q420 320 400 320 H60 Q40 320 40 300 V75 Q40 55 60 55 Z" delay={2.2} className="pl-iso" />
      <Line d="M115 95 H345 Q370 95 370 120 V255 Q370 280 345 280 H115 Q90 280 90 255 V120 Q90 95 115 95 Z" delay={2.5} className="pl-iso" />
      <Line d="M170 140 H290 Q315 140 315 165 V210 Q315 235 290 235 H170 Q145 235 145 210 V165 Q145 140 170 140 Z" delay={2.8} className="pl-iso" />
      <Label x={408} y={50} delay={2.6} kind="tag" anchor="end">300 lx</Label>
      <Label x={360} y={90} delay={2.9} kind="tag" anchor="end">500 lx</Label>
      <Label x={306} y={136} delay={3.2} kind="tag" anchor="end">750 lx</Label>
      {pts.map(([x, y, v], i) => (
        <Pop key={`p${i}`} delay={3.3 + i * 0.04}>
          <path d={`M${x - 3} ${y} H${x + 3} M${x} ${y - 3} V${y + 3}`} className="pl-sym" />
          <text x={x + 4} y={y - 4} className="pl-label pl-t--num">{v}</text>
        </Pop>
      ))}
      <g>
        <Line d="M456 20 H630 V350 H456 Z" delay={0.8} className="pl-sheet" />
        <Label x={466} y={40} delay={1} kind="b">SIMBOLOGÍA</Label>
        <Fade delay={1.1}>
          <rect x={466} y={54} width={26} height={9} className="pl-light" />
          <text x={500} y={62} className="pl-label pl-t--s">Luminaria LED 2×4</text>
          <path d="M466 82 H492" className="pl-iso-s" />
          <text x={500} y={86} className="pl-label pl-t--s">Isolínea (lx)</text>
          <path d="M476 106 H482 M479 103 V109" className="pl-sym" />
          <text x={500} y={110} className="pl-label pl-t--s">Punto de cálculo</text>
        </Fade>
        <Label x={466} y={150} delay={3.6} kind="b">RESULTADO</Label>
        <Label x={466} y={170} delay={3.7} kind="s">Plano de trabajo a 0,85 m</Label>
        <Label x={466} y={186} delay={3.8} kind="s">Objetivo oficina: 500 lx</Label>
        <Pop delay={4.2}>
          <rect x={466} y={198} width={154} height={30} rx={15} className="pl-badge" />
          <circle cx={484} cy={213} r={9} className="pl-check-bg" />
          <path d="M479.5 213 l3 3.5 l6.5 -7" className="pl-check" />
          <text x={500} y={217} className="pl-label pl-t--b">Cumple INTECO</text>
        </Pop>
      </g>
      <TitleStrip title="ESTUDIO DE ILUMINACIÓN" subtitle="Oficina · cálculo de iluminancia" sheet="IL-01" t0={1.2} />
    </Frame>
  );
}

/* ============ Piscina: planta mecánica de recirculación ============ */
function Piscina() {
  return (
    <Frame vb="0 0 640 440" title="Diseño mecánico de piscina">
      <rect x={60} y={50} width={320} height={210} rx={26} className="pl-pool pl-fade" style={at(0.5)} />
      <Line d="M86 50 H354 Q380 50 380 76 V234 Q380 260 354 260 H86 Q60 260 60 234 V76 Q60 50 86 50 Z" delay={0.1} className="pl-wall" />
      <Line d="M76 66 H364 V244 H76 Z" delay={0.3} className="pl-win" />
      {[100, 140, 180, 220].map((y, i) => (
        <path key={y} d={`M90 ${y} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} className="pl-ripple" style={at(1 + i * 0.2)} />
      ))}
      <Label x={110} y={156} delay={1} kind="tag">Prof. 1,20 m</Label>
      <Label x={290} y={156} delay={1.05} kind="tag">Prof. 1,60 m</Label>
      {/* Desnatadores, drenajes y retornos */}
      {[150, 290].map((x, i) => <Pop key={x} delay={0.9 + i * 0.08}><rect x={x - 14} y={38} width={28} height={16} rx={2} className="pl-panel" /></Pop>)}
      <Label x={180} y={32} delay={1.1} kind="tag">Desnatadores</Label>
      {[200, 240].map((x, i) => <Pop key={x} delay={1 + i * 0.08}><rect x={x - 9} y={186} width={18} height={18} rx={2} className="pl-outlet" /><path d={`M${x - 9} 195 H${x + 9} M${x} 186 V204`} className="pl-sym" /></Pop>)}
      <Label x={252} y={212} delay={1.2} kind="tag">Drenajes de fondo</Label>
      {[[110, 260], [220, 260], [330, 260], [60, 150], [380, 150]].map(([x, y], i) => <Pop key={i} delay={1.15 + i * 0.06}><circle cx={x} cy={y} r={6} className="pl-node" /></Pop>)}
      <Label x={384} y={142} delay={1.3} kind="tag">Retorno</Label>
      {/* Cuarto de máquinas */}
      <Line d="M440 60 H620 V250 H440 Z" delay={0.6} className="pl-wall pl-wall--in" />
      <Label x={448} y={52} delay={1.2} kind="b">CUARTO DE MÁQUINAS</Label>
      <Pop delay={1.4}><circle cx={480} cy={200} r={20} className="pl-light" /><path d="M470 200 h20 m-6 -6 l6 6 -6 6" className="pl-sym" /></Pop>
      <Label x={466} y={238} delay={1.5} kind="tag">Bomba</Label>
      <Pop delay={1.5}><rect x={540} y={100} width={44} height={80} rx={20} className="pl-heater" /></Pop>
      <Label x={540} y={196} delay={1.6} kind="tag">Filtro de arena</Label>
      <Pop delay={1.6}><circle cx={562} cy={92} r={8} className="pl-panel" /></Pop>
      <Label x={576} y={84} delay={1.7} kind="tag">Multipuerto</Label>
      {/* Tuberías */}
      <Line d="M150 54 V22 H420 V200 H460 M290 54 V22 M200 204 V300 H420 V200 M240 204 V300" delay={1.9} className="pl-drain" />
      <Line d="M500 200 H540 V180 M562 100 V30 H632 V330 H40 V150 H60 M110 260 V330 M220 260 V330 M330 260 V330 M380 150 H400 V330" delay={2.3} className="pl-water" />
      <path d="M562 100 V30 H632 V330 H40 V150 H60" pathLength={100} className="pl-flow" style={at(3.3)} />
      <path d="M200 204 V300 H420 V200 H460" pathLength={100} className="pl-flow pl-flow--drain" style={at(3.1)} />
      <Label x={300} y={318} delay={2.8} kind="tag">Succión Ø 63 mm</Label>
      <Label x={90} y={346} delay={2.9} kind="tag">Retorno Ø 50 mm</Label>
      <TitleStrip title="PLANO MECÁNICO DE PISCINA" subtitle="Recirculación, filtración y retornos" sheet="MP-01" t0={1.4} />
    </Frame>
  );
}

/* ============ Gas LPG: isométrico de tubería ============ */
function Gas() {
  const valve = (x: number, y: number) => `M${x - 7} ${y - 5} L${x + 7} ${y + 5} V${y - 5} L${x - 7} ${y + 5} Z`;
  const PIPE = "M150 300 H200 M228 300 H260 V120 H520 V180";
  return (
    <Frame vb="0 0 640 440" title="Sistema de gas LPG">
      <Line d="M60 270 H130 A30 30 0 0 1 130 330 H60 A30 30 0 0 1 60 270 Z" delay={0.1} className="pl-wall" />
      <Line d="M70 330 V356 M120 330 V356 M60 356 H130" delay={0.4} className="pl-wall pl-wall--in" />
      <Label x={46} y={372} delay={0.8} kind="tag">Tanque LPG estacionario</Label>
      <Pop delay={0.9}><path d="M135 300 l14 -9 v18 z" className="pl-panel" /></Pop>
      <Label x={126} y={286} delay={1} kind="tag">Regulador 1ª etapa</Label>
      <Pop delay={1}><path d={valve(214, 300)} className="pl-valve" /></Pop>
      <Label x={196} y={322} delay={1.1} kind="tag">Válvula de corte</Label>
      <Pop delay={1.2}><path d="M253 150 l14 -9 v18 z" className="pl-panel" /></Pop>
      <Label x={272} y={160} delay={1.3} kind="tag">Regulador 2ª etapa</Label>
      <Line d={PIPE} delay={1.4} className="pl-gas" />
      <Line d="M400 120 V246" delay={1.9} className="pl-gas" />
      <path d={PIPE} pathLength={100} className="pl-flow pl-flow--gas" style={at(3)} />
      <Pop delay={2}><path d={valve(520, 160)} className="pl-valve" /></Pop>
      <Pop delay={2.05}><path d={valve(400, 230)} className="pl-valve" /></Pop>
      <Pop delay={2.2}><rect x={470} y={180} width={100} height={64} rx={6} className="pl-panel" /></Pop>
      {[495, 545].map((x, i) => (
        <g key={x}>
          <Pop delay={2.3 + i * 0.1}><circle cx={x} cy={212} r={14} className="pl-outlet" /></Pop>
          <path d={`M${x} 220 q-8 -10 0 -22 q8 12 0 22z`} className="pl-flame" style={at(2.7 + i * 0.15)} />
        </g>
      ))}
      <Label x={472} y={262} delay={2.4} kind="tag">Cocina</Label>
      <Pop delay={2.4}><rect x={370} y={246} width={60} height={90} rx={8} className="pl-heater" /></Pop>
      <path d="M400 322 q-7 -9 0 -19 q7 10 0 19z" className="pl-flame" style={at(3)} />
      <Label x={360} y={354} delay={2.5} kind="tag">Calentador de paso</Label>
      <Label x={300} y={110} delay={2.6} kind="tag">Cobre tipo L · Ø 3/8"</Label>
      <TitleStrip title="SISTEMA DE GAS LPG" subtitle="Almacenamiento, regulación y distribución" sheet="G-01" t0={1.5} />
    </Frame>
  );
}

/* ============ Inspección de obra: recorrido en planta + bitácora ============ */
function Inspeccion() {
  const items = ["Tuberías y cajas empotradas", "Tablero y protecciones", "Puesta a tierra", "Prueba de presión hidráulica", "Pendientes sanitarias", "Rotulación de circuitos"];
  const route = "M95 95 L350 95 L360 255 L205 260 L110 260 Z";
  return (
    <Frame vb="0 0 640 440" title="Inspección de obra">
      <g transform="translate(0 30) scale(0.86)">
        <ArchBase furniture={false} />
        <g className="pl-fade" style={at(1.4)}>
          <g>
            <circle r={30} className="pl-lens" />
            <path d="M21 21 L42 42" className="pl-lens-handle" />
            <animateMotion dur="7s" repeatCount="indefinite" path={route} />
          </g>
        </g>
      </g>
      <Line d="M410 20 H630 V360 H410 Z" delay={0.6} className="pl-sheet" />
      <Label x={424} y={44} delay={0.9} kind="b">BITÁCORA DE INSPECCIÓN</Label>
      <Label x={424} y={62} delay={1} kind="s">Visita en etapa de obra gris</Label>
      {items.map((t, i) => (
        <g key={t}>
          <Fade delay={1.1 + i * 0.06}>
            <rect x={424} y={86 + i * 38} width={18} height={18} rx={3} className="pl-outlet" />
            <text x={452} y={100 + i * 38} className="pl-label pl-t--s">{t}</text>
          </Fade>
          <Pop delay={2.2 + i * 0.55}><path d={`M428 ${95 + i * 38} l4 5 l8 -10`} className="pl-check pl-check--acc" /></Pop>
        </g>
      ))}
      <Pop delay={5.8}>
        <g transform="rotate(-8 520 330)">
          <rect x={452} y={312} width={136} height={38} rx={6} className="pl-stamp" />
          <text x={520} y={337} textAnchor="middle" className="pl-label pl-t--stamp">REVISADO</text>
        </g>
      </Pop>
      <TitleStrip title="INSPECCIÓN Y DIRECCIÓN DE OBRA" subtitle="Lo construido contra lo diseñado" sheet="IO-01" t0={1.2} />
    </Frame>
  );
}

/* ============ Evaluación de tablero existente ============ */
function Evaluacion() {
  const rows = [0, 1, 2, 3, 4, 5];
  const warn: Record<string, string> = { "0-3": "Circuito sin rotular", "1-1": "Conductor subdimensionado" };
  return (
    <Frame vb="0 0 640 440" title="Evaluación de instalación existente">
      <g transform="translate(20 0) scale(0.82)">
        <Line d="M170 30 H430 V450 H170 Z" delay={0.1} className="pl-wall" />
        <Line d="M196 70 H404 V410 H196 Z" delay={0.4} className="pl-wall pl-wall--in" />
        <Line d="M300 70 V410" delay={0.6} className="pl-wall pl-wall--in" />
        {rows.map((r) =>
          [0, 1].map((c) => {
            const x = c ? 318 : 214;
            const y = 92 + r * 52;
            const k = `${c}-${r}`;
            const cx = c ? 460 : 140;
            return (
              <g key={k}>
                <Pop delay={0.8 + r * 0.06 + c * 0.03}><rect x={x} y={y} width={68} height={30} rx={4} className="pl-outlet" /><rect x={x + 26} y={y + 8} width={16} height={14} rx={2} className="pl-dot" /></Pop>
                {warn[k] ? (
                  <Pop delay={2.6 + r * 0.2}>
                    <path d={`M${cx} ${y + 4} l11 20 h-22 z`} className="pl-warn" />
                    <text x={c ? cx + 18 : cx - 18} y={y + 20} textAnchor={c ? "start" : "end"} className="pl-label pl-t--b">{warn[k]}</text>
                  </Pop>
                ) : (
                  <Pop delay={2 + r * 0.12 + c * 0.05}><circle cx={cx} cy={y + 15} r={9} className="pl-check-bg" /><path d={`M${cx - 4} ${y + 15} l3 4 l6 -8`} className="pl-check" /></Pop>
                )}
              </g>
            );
          })
        )}
        <rect x={196} y={70} width={208} height={3} className="pl-scan" />
      </g>
      <TitleStrip title="EVALUACIÓN DE INSTALACIÓN EXISTENTE" subtitle="Diagnóstico circuito por circuito" sheet="EV-01" t0={1.2} />
    </Frame>
  );
}

/* ============ Construcción de sistemas ============ */
function Construccion() {
  const W = 220, D = 150, F = 70;
  const slab = (z: number) => isoPath([[0, 0, z], [W, 0, z], [W, D, z], [0, D, z]], true);
  const cols: Array<[number, number]> = [[0, 0], [W, 0], [W, D], [0, D], [W / 2, 0], [W / 2, D]];
  return (
    <Frame vb="0 0 640 440" title="Construcción de sistemas">
      <g transform="translate(60 0) scale(0.85)">
        {[0, 1, 2, 3].map((n) => (
          <g key={n} className="pl-rise" style={at(0.2 + n * 0.55)}>
            <path d={slab(n * F)} className="pl-slab" />
            {n < 3 && cols.map(([x, y], i) => <path key={i} d={isoPath([[x, y, n * F], [x, y, n * F + F]])} className="pl-col" />)}
          </g>
        ))}
        <Line d={isoPath([[20, 140, 0], [20, 140, F * 3 - 10], [200, 140, F * 3 - 10]])} delay={2.6} className="pl-elec" />
        <Line d={isoPath([[20, 140, F - 10], [200, 140, F - 10], [200, 20, F - 10]])} delay={2.8} className="pl-elec" />
        <Line d={isoPath([[60, 20, F * 3], [60, 20, 10], [200, 20, 10]])} delay={3} className="pl-water" />
        <path d={isoPath([[20, 140, 0], [20, 140, F * 3 - 10], [200, 140, F * 3 - 10]])} pathLength={100} className="pl-pulse" style={at(3.8)} />
      </g>
      <Label x={24} y={36} delay={3.3} kind="b">INSTALACIÓN POR NIVELES</Label>
      <Label x={24} y={52} delay={3.4} kind="s">Canalización eléctrica y tubería en cada losa</Label>
      <TitleStrip title="CONSTRUCCIÓN DE SISTEMAS" subtitle="Eléctricos y mecánicos, del diseño a la entrega" sheet="CS-01" t0={1.2} />
    </Frame>
  );
}

const ARTS: Record<string, () => ReactNode> = {
  electrico: () => <ElectricPlan />,
  hidraulico: () => <HydraulicPlan />,
  incendios: () => <FirePlan />,
  bim: () => <BimPlan />,
  unifilar: Estudios,
  iluminacion: Iluminacion,
  piscina: Piscina,
  gas: Gas,
  inspeccion: Inspeccion,
  evaluacion: Evaluacion,
  construccion: Construccion,
};

export function ServiceArt({ art }: { art: string }) {
  const A = ARTS[art] ?? ARTS.electrico;
  return <A />;
}
