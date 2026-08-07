import clsx from "clsx";
import type { Packaging } from "@/lib/types";

const GOLD = "#C9A227";
const JOST = "var(--font-jost), serif";
const INTER = "var(--font-inter), sans-serif";

// Rótulo padronizado (pedido do cliente): UMA cor só para todos os potes —
// faixa verde Tua + escrita dourada. Mesma identidade em toda a prateleira.
const LABEL_BG = "#163B2C";

// Posição do rótulo Tua Pharma no corpo de cada garrafa base (calibrado à mão).
type Box = { left: string; top: string; width: string; height: string };
// Largura CHEIA do corpo do pote (o rótulo envolve de silhueta a silhueta),
// para o efeito de rótulo que dá a volta no cilindro.
const DEFAULT_BOX: Box = { left: "30%", top: "43%", width: "40%", height: "31%" };
const LABEL_BOX: Record<string, Box> = {
  // potes brancos sólidos — rótulo casando a largura do corpo (silhueta a silhueta)
  "/produtos/base/pote-capsula-1.jpg": { left: "30%", top: "43%", width: "40%", height: "31%" },
  "/produtos/base/pote-capsula-3.jpg": { left: "30%", top: "43%", width: "40%", height: "31%" },
  // pote de goma transparente — corpo um pouco mais largo/deslocado
  "/produtos/base/pote-capsula-2.jpg": { left: "30%", top: "40%", width: "43%", height: "39%" },
};

// Sombreado curvo horizontal FORTE — bordas escuras + realce fora do centro
// simulam o papel dobrando ao dar a volta no cilindro (efeito "wrap").
const CURVE =
  "linear-gradient(90deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 9%, rgba(255,255,255,0.16) 30%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.14) 70%, rgba(0,0,0,0.34) 91%, rgba(0,0,0,0.62) 100%)";

/** Quebra o texto em no máximo `maxLines` linhas de até `maxChars` caracteres. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
    if (lines.length >= maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines.slice(0, maxLines);
}

/** Logo Tua Pharma em SVG (TUA · risco · PHARMA), em dourado sobre a faixa verde. */
function BrandMark({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <text x={cx} y={cy} textAnchor="middle" fontFamily={JOST} fontSize={7} fill={GOLD} letterSpacing={2.4} style={{ fontWeight: 300 }}>
        TUA
      </text>
      <line x1={cx - 11} y1={cy + 2.4} x2={cx + 11} y2={cy + 2.4} stroke={GOLD} strokeOpacity={0.85} strokeWidth={0.7} />
      <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={JOST} fontSize={3.2} fill={GOLD} fillOpacity={0.95} letterSpacing={2.6} style={{ fontWeight: 300 }}>
        PHARMA
      </text>
    </g>
  );
}

/** Conteúdo do rótulo: logo + nome + selo de dosagem, sobre a faixa colorida. */
function LabelContent({ cx, label, spec, top, bottom, maxChars = 12 }: { cx: number; label?: string; spec?: string; top: number; bottom: number; maxChars?: number }) {
  const nameLines = label ? wrap(label, maxChars, 2) : [];
  const two = nameLines.length > 1;
  const nameY = two ? top + 32 : top + 36;
  return (
    <>
      <BrandMark cx={cx} cy={top + 13} />
      {nameLines.map((ln, i) => (
        <text key={i} x={cx} y={nameY + i * 11} textAnchor="middle" fontFamily={INTER} fontSize={10} fill="#fff" style={{ fontWeight: 700 }}>
          {ln}
        </text>
      ))}
      {spec && (
        <>
          <rect x={cx - 27} y={bottom - 20} width={54} height={13} rx={6.5} fill={GOLD} fillOpacity={0.16} stroke={GOLD} strokeOpacity={0.5} strokeWidth={0.5} />
          <text x={cx} y={bottom - 11} textAnchor="middle" fontFamily={INTER} fontSize={6.5} fill={GOLD} letterSpacing={0.5} style={{ fontWeight: 600 }}>
            {spec}
          </text>
        </>
      )}
    </>
  );
}

type Shape = { accent: string; label?: string; spec?: string };

/** Pote cilíndrico (cápsulas / pó). O rótulo cobre quase todo o corpo → cheio. */
function Pot({ accent, label, spec, w = 82, top = 61 }: Shape & { w?: number; top?: number }) {
  const x = 100 - w / 2;
  const bot = 217;
  const lTop = top + 7;
  const lBot = bot - 9;
  const capW = w - 14;
  return (
    <>
      <ellipse cx={100} cy={top - 1} rx={capW / 2 + 2} ry={6} fill="#0f2a1e" />
      <rect x={100 - capW / 2} y={top - 1} width={capW} height={20} rx={4} fill="url(#capGrad)" />
      <rect x={x + 2} y={top + 16} width={w - 4} height={7} rx={3} fill="#e7eae6" />
      <rect x={x} y={top + 20} width={w} height={bot - top - 20} rx={16} fill="url(#potGrad)" stroke="#d6dcd6" strokeWidth={1} />
      <rect x={x} y={lTop} width={w} height={lBot - lTop} fill={accent} />
      <rect x={x} y={lTop} width={w} height={4} fill="#000" fillOpacity={0.14} />
      <rect x={x} y={lBot - 4} width={w} height={4} fill="#000" fillOpacity={0.14} />
      <LabelContent cx={100} label={label} spec={spec} top={lTop} bottom={lBot} />
      <rect x={x} y={top + 20} width={w} height={bot - top - 20} rx={16} fill="url(#cyl)" pointerEvents="none" />
    </>
  );
}

/** Pote baixo e largo de creme/sérum, com tampa colorida. */
function CreamJar({ accent, label, spec }: Shape) {
  const top = 100, bot = 184, lTop = 108, lBot = 176;
  return (
    <>
      <rect x={56} y={72} width={88} height={30} rx={10} fill={accent} />
      <rect x={56} y={72} width={88} height={30} rx={10} fill="url(#cyl)" />
      <rect x={54} y={98} width={92} height={7} rx={3} fill="#e7eae6" />
      <rect x={58} y={top} width={84} height={bot - top} rx={12} fill="url(#potGrad)" stroke="#d6dcd6" strokeWidth={1} />
      <rect x={58} y={lTop} width={84} height={lBot - lTop} fill={accent} />
      <LabelContent cx={100} label={label} spec={spec} top={lTop} bottom={lBot} maxChars={13} />
      <rect x={58} y={top} width={84} height={bot - top} rx={12} fill="url(#cyl)" pointerEvents="none" />
    </>
  );
}

/** Bisnaga/tubo (pomada, gel). */
function Tube({ accent, label, spec }: Shape) {
  const lTop = 70, lBot = 192;
  return (
    <>
      {/* crimpagem no topo */}
      <path d="M72 50 h56 v10 l-4 4 h-48 l-4 -4 z" fill="#cfd6cf" />
      <line x1={80} y1={52} x2={80} y2={62} stroke="#a9b2a9" strokeWidth={1} />
      <line x1={100} y1={52} x2={100} y2={62} stroke="#a9b2a9" strokeWidth={1} />
      <line x1={120} y1={52} x2={120} y2={62} stroke="#a9b2a9" strokeWidth={1} />
      {/* corpo */}
      <path d="M74 64 q26 -6 52 0 v130 q0 6 -6 6 h-40 q-6 0 -6 -6 z" fill="url(#potGrad)" stroke="#d6dcd6" strokeWidth={1} />
      {/* tampa de rosca embaixo */}
      <rect x={86} y={200} width={28} height={16} rx={3} fill="url(#capGrad)" />
      <rect x={74} y={lTop} width={52} height={lBot - lTop} fill={accent} />
      <LabelContent cx={100} label={label} spec={spec} top={lTop} bottom={lBot} maxChars={10} />
      <path d="M74 64 q26 -6 52 0 v130 q0 6 -6 6 h-40 q-6 0 -6 -6 z" fill="url(#cyl)" pointerEvents="none" />
    </>
  );
}

/** Frasco conta-gotas (sublingual, gotas). */
function Dropper({ accent, label, spec }: Shape) {
  const lTop = 70, lBot = 162;
  return (
    <>
      <rect x={92} y={14} width={16} height={16} rx={6} fill={accent} />
      <rect x={84} y={30} width={32} height={16} rx={2} fill="url(#capGrad)" />
      <rect x={94} y={44} width={12} height={8} fill="#183d2c" />
      <rect x={72} y={50} width={56} height={122} rx={12} fill="url(#potGrad)" stroke="#d6dcd6" strokeWidth={1} />
      <rect x={72} y={lTop} width={56} height={lBot - lTop} fill={accent} />
      <LabelContent cx={100} label={label} spec={spec} top={lTop} bottom={lBot} maxChars={10} />
      <rect x={72} y={50} width={56} height={122} rx={12} fill="url(#cyl)" pointerEvents="none" />
    </>
  );
}

/** Frasco líquido com bomba (xampu, solução, xarope). */
function Bottle({ accent, label, spec }: Shape) {
  const lTop = 78, lBot = 206;
  return (
    <>
      <rect x={78} y={18} width={16} height={8} rx={2} fill="#2b2b2b" />
      <rect x={90} y={18} width={20} height={14} rx={3} fill="#2b2b2b" />
      <rect x={92} y={30} width={16} height={16} fill="#183d2c" />
      <rect x={66} y={46} width={68} height={170} rx={14} fill="url(#potGrad)" stroke="#d6dcd6" strokeWidth={1} />
      <rect x={66} y={lTop} width={68} height={lBot - lTop} fill={accent} />
      <rect x={66} y={lTop} width={68} height={4} fill="#000" fillOpacity={0.14} />
      <rect x={66} y={lBot - 4} width={68} height={4} fill="#000" fillOpacity={0.14} />
      <LabelContent cx={100} label={label} spec={spec} top={lTop} bottom={lBot} maxChars={11} />
      <rect x={66} y={46} width={68} height={170} rx={14} fill="url(#cyl)" pointerEvents="none" />
    </>
  );
}

/** Frasco spray âmbar (minoxidil, loção capilar). */
function Spray({ accent, label, spec }: Shape) {
  const lTop = 96, lBot = 198;
  return (
    <>
      <rect x={94} y={20} width={14} height={10} rx={2} fill="#333" />
      <rect x={86} y={29} width={30} height={15} rx={3} fill="#2b2b2b" />
      <rect x={66} y={33} width={24} height={6} rx={3} fill="#2b2b2b" />
      <rect x={90} y={44} width={20} height={9} fill="#222" />
      <rect x={62} y={54} width={76} height={162} rx={15} fill="url(#amberGrad)" stroke="#4d2e0c" strokeOpacity={0.5} strokeWidth={1.2} />
      <rect x={62} y={lTop} width={76} height={lBot - lTop} fill={accent} />
      <rect x={62} y={lTop} width={76} height={4} fill="#000" fillOpacity={0.14} />
      <rect x={62} y={lBot - 4} width={76} height={4} fill="#000" fillOpacity={0.14} />
      <LabelContent cx={100} label={label} spec={spec} top={lTop} bottom={lBot} />
      <rect x={62} y={54} width={76} height={162} rx={15} fill="url(#cyl)" pointerEvents="none" />
    </>
  );
}

/** Caixa/estojo (sachês). */
function Box({ accent, label, spec }: Shape) {
  const lTop = 78, lBot = 194;
  return (
    <>
      <path d="M138 52 L156 60 L156 206 L138 210 Z" fill={accent} fillOpacity={0.55} />
      <path d="M60 52 L138 52 L156 60 L78 60 Z" fill="#fff" fillOpacity={0.85} />
      <rect x={60} y={52} width={78} height={158} rx={4} fill="url(#potGrad)" stroke="#d6dcd6" strokeWidth={1} />
      <rect x={60} y={lTop} width={78} height={lBot - lTop} fill={accent} />
      <LabelContent cx={99} label={label} spec={spec} top={lTop} bottom={lBot} maxChars={11} />
      <rect x={60} y={52} width={78} height={158} rx={4} fill="url(#cyl)" pointerEvents="none" />
    </>
  );
}

function Packaging_({ packaging, ...s }: Shape & { packaging: Packaging }) {
  switch (packaging) {
    case "pote-po":
      return <Pot {...s} w={94} top={68} />;
    case "pote-creme":
      return <CreamJar {...s} />;
    case "bisnaga":
      return <Tube {...s} />;
    case "gotas":
      return <Dropper {...s} />;
    case "frasco":
      return <Bottle {...s} />;
    case "spray":
      return <Spray {...s} />;
    case "caixa":
      return <Box {...s} />;
    default:
      return <Pot {...s} />;
  }
}

export function ProductImage({
  packaging = "pote-capsula",
  label,
  spec,
  className,
  variant = "card",
  categorySlug,
  image,
  showBrand = true,
}: {
  packaging?: Packaging;
  label?: string;
  spec?: string;
  className?: string;
  variant?: "card" | "detail";
  categorySlug?: string;
  image?: string;
  showBrand?: boolean;
  /** compat — não utilizado */
  name?: string;
  iconSize?: number;
}) {
  const detail = variant === "detail";
  // Cor única padronizada para o rótulo de TODOS os produtos (verde Tua).
  // `categorySlug`/`ACCENTS` mantidos por compatibilidade, mas o rótulo não varia mais por categoria.
  void categorySlug;
  const accent = LABEL_BG;

  // Foto real do frasco (royalty-free) com o RÓTULO Tua Pharma impresso no corpo.
  if (image) {
    const nameLines = label ? wrap(label, 16, 2) : [];
    const box = LABEL_BOX[image] ?? DEFAULT_BOX;
    return (
      <div className={clsx("relative flex items-center justify-center overflow-hidden bg-white", className)} style={{ containerType: "inline-size" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={label ?? "Produto Tua Pharma"} loading="lazy" className="h-full w-full object-cover" />
        {showBrand && (
          <div
            className="pointer-events-none absolute flex flex-col items-center justify-center px-[2cqw] text-center"
            style={box}
          >
            {/* Camada do rótulo: entra em multiply p/ herdar a luz e a sombra do
                pote da foto (integra ao mockup em vez de ficar chapado por cima).
                Bordas elípticas simulam a curvatura do cilindro. */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: accent,
                backgroundImage: CURVE,
                mixBlendMode: "multiply",
                borderRadius: "1.5cqw",
                boxShadow:
                  "inset 0 0.5cqw 0.7cqw rgba(255,255,255,0.14), inset 0 -0.7cqw 0.9cqw rgba(0,0,0,0.32)",
              }}
            />
            {/* Conteúdo por cima, sem blend, para o texto ficar nítido. */}
            <div className="relative flex flex-col items-center justify-center">
              <span className="font-display font-light" style={{ fontSize: "2.5cqw", letterSpacing: "0.15em", color: GOLD }}>
                TUA PHARMA
              </span>
              <span className="my-[0.6cqw] h-px w-[7cqw]" style={{ backgroundColor: GOLD, opacity: 0.6 }} />
              {nameLines.map((ln, i) => (
                <span key={i} className="font-bold leading-tight text-white" style={{ fontSize: "3.1cqw" }}>
                  {ln}
                </span>
              ))}
              {spec && (
                <span className="mt-[0.8cqw] font-semibold" style={{ fontSize: "2.4cqw", color: GOLD }}>
                  {spec}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#F1EFE8]", className)}>
      <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid meet" className={clsx("w-auto", detail ? "h-[94%]" : "h-[88%]")}>
        <defs>
          <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e2e6e2" />
            <stop offset="0.12" stopColor="#fff" />
            <stop offset="0.5" stopColor="#fff" />
            <stop offset="0.88" stopColor="#f3f5f2" />
            <stop offset="1" stopColor="#d9ded9" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0e2a1e" />
            <stop offset="0.5" stopColor="#1c4433" />
            <stop offset="1" stopColor="#0c231a" />
          </linearGradient>
          <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C6822E" />
            <stop offset="0.5" stopColor="#9A5A1B" />
            <stop offset="1" stopColor="#7A4413" />
          </linearGradient>
          <linearGradient id="cyl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity={0.28} />
            <stop offset="0.18" stopColor="#fff" stopOpacity={0.08} />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.82" stopColor="#000" stopOpacity={0.12} />
            <stop offset="1" stopColor="#000" stopOpacity={0.26} />
          </linearGradient>
        </defs>
        <ellipse cx={100} cy={226} rx={46} ry={6} fill="#0C1E16" opacity={0.14} />
        <Packaging_ packaging={packaging} accent={accent} label={label} spec={spec} />
      </svg>
    </div>
  );
}
