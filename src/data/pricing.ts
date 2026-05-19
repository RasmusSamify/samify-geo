// Claude API priser (USD per 1M tokens). Officiellt från Anthropic, januari 2026.
// Justera om Anthropic ändrar pris.

export type ModelId = "opus-4.7" | "sonnet-4.6" | "haiku-4.5";

export type ModelPricing = {
  id: ModelId;
  name: string;
  shortName: string;
  inputFresh: number; // USD / 1M tokens
  inputCacheRead: number;
  inputCacheWrite: number;
  output: number;
  contextWindow: string;
  description: string;
};

export const MODELS: Record<ModelId, ModelPricing> = {
  "opus-4.7": {
    id: "opus-4.7",
    name: "Claude opus 4.7",
    shortName: "opus",
    inputFresh: 15,
    inputCacheRead: 1.5,
    inputCacheWrite: 18.75,
    output: 75,
    contextWindow: "1M",
    description: "Bästa kvalitet · för Report Synthesis, vision, komplex reasoning",
  },
  "sonnet-4.6": {
    id: "sonnet-4.6",
    name: "Claude sonnet 4.6",
    shortName: "sonnet",
    inputFresh: 3,
    inputCacheRead: 0.3,
    inputCacheWrite: 3.75,
    output: 15,
    contextWindow: "200k",
    description: "Bra balans · för Geological/Historical Context, RAG-flöden",
  },
  "haiku-4.5": {
    id: "haiku-4.5",
    name: "Claude haiku 4.5",
    shortName: "haiku",
    inputFresh: 1,
    inputCacheRead: 0.1,
    inputCacheWrite: 1.25,
    output: 5,
    contextWindow: "200k",
    description: "Snabbast & billigast · för Compliance, tabellparsing, klassificering",
  },
};

export type TokenUsage = {
  inputFresh: number; // antal tokens
  inputCacheRead: number;
  inputCacheWrite: number;
  output: number;
};

// Returnerar kostnad i USD för en given modell + token-usage
export const calculateCostUSD = (model: ModelId, usage: TokenUsage): number => {
  const p = MODELS[model];
  return (
    (usage.inputFresh * p.inputFresh) / 1_000_000 +
    (usage.inputCacheRead * p.inputCacheRead) / 1_000_000 +
    (usage.inputCacheWrite * p.inputCacheWrite) / 1_000_000 +
    (usage.output * p.output) / 1_000_000
  );
};

// Per-agent typisk fördelning för ett PM Markmiljö
export type AgentProfile = {
  id: string;
  name: string;
  defaultModel: ModelId;
  tokensPerPM: TokenUsage;
};

export const AGENT_PROFILES: AgentProfile[] = [
  {
    id: "extract",
    name: "Data Extraction Agent",
    defaultModel: "opus-4.7",
    tokensPerPM: {
      inputFresh: 85_000, // PDF vision-tokens är dyra
      inputCacheRead: 15_000,
      inputCacheWrite: 5_000,
      output: 12_000,
    },
  },
  {
    id: "geo",
    name: "Geological Context Agent",
    defaultModel: "sonnet-4.6",
    tokensPerPM: {
      inputFresh: 25_000,
      inputCacheRead: 80_000,
      inputCacheWrite: 8_000,
      output: 18_000,
    },
  },
  {
    id: "hist",
    name: "Historical Context Agent",
    defaultModel: "sonnet-4.6",
    tokensPerPM: {
      inputFresh: 20_000,
      inputCacheRead: 95_000,
      inputCacheWrite: 6_000,
      output: 15_000,
    },
  },
  {
    id: "compliance",
    name: "Compliance Agent",
    defaultModel: "haiku-4.5",
    tokensPerPM: {
      inputFresh: 8_000,
      inputCacheRead: 30_000,
      inputCacheWrite: 3_000,
      output: 5_000,
    },
  },
  {
    id: "synth",
    name: "Report Synthesis Agent",
    defaultModel: "opus-4.7",
    tokensPerPM: {
      inputFresh: 35_000, // projektspecifik input per sektion
      inputCacheRead: 180_000, // mall, riktvärden, tidigare PM cached
      inputCacheWrite: 25_000,
      output: 120_000, // 8 sektioner × ~15k tokens
    },
  },
];

// Beräkna total kostnad för 1 PM Markmiljö med givna modellval per agent
export const calculateCostPerPM = (
  modelOverrides: Partial<Record<string, ModelId>> = {},
): { totalUSD: number; perAgent: { agent: AgentProfile; model: ModelId; usd: number }[] } => {
  const perAgent = AGENT_PROFILES.map((agent) => {
    const model = modelOverrides[agent.id] ?? agent.defaultModel;
    const usd = calculateCostUSD(model, agent.tokensPerPM);
    return { agent, model, usd };
  });
  const totalUSD = perAgent.reduce((a, b) => a + b.usd, 0);
  return { totalUSD, perAgent };
};

// USD → SEK växelkurs (justerbar i UI)
export const DEFAULT_USD_SEK = 10.5;
export const DEFAULT_VAT = 0.25; // 25% moms

// ============================================================
// PRISNIVÅER (TIERS)
// Plattformsavgift och volymrabatt anpassas efter kundvolym.
// Pilot: lågvolym-kunder som etablerar referens. Standard: typisk
// konsultbyrå. Enterprise: storkunder med dedikerad support och rabatt.
// ============================================================

export type Tier = "pilot" | "standard" | "enterprise";

export type TierProfile = {
  id: Tier;
  label: string;
  range: string;
  pmRangeMin: number;
  pmRangeMax: number;
  fixedFeeSEK: number;
  pmPriceMultiplier: number; // 1.0 default, < 1.0 = volymrabatt
  description: string;
};

export const TIERS: Record<Tier, TierProfile> = {
  pilot: {
    id: "pilot",
    label: "Pilot",
    range: "0–5 PM/mån",
    pmRangeMin: 0,
    pmRangeMax: 5,
    fixedFeeSEK: 18_000,
    pmPriceMultiplier: 1.0,
    description: "Lågvolym · etablera referens · subventionerad plattformsavgift",
  },
  standard: {
    id: "standard",
    label: "Standard",
    range: "5–25 PM/mån",
    pmRangeMin: 5,
    pmRangeMax: 25,
    fixedFeeSEK: 35_000,
    pmPriceMultiplier: 1.0,
    description: "Typisk konsultbyrå · full support · normalpris per PM",
  },
  enterprise: {
    id: "enterprise",
    label: "Enterprise",
    range: "25+ PM/mån",
    pmRangeMin: 25,
    pmRangeMax: 9999,
    fixedFeeSEK: 50_000,
    pmPriceMultiplier: 0.88,
    description: "Storkund · dedikerad success-manager · 12 % volymrabatt på PM",
  },
};

export const detectTier = (pmPerMonth: number): Tier => {
  if (pmPerMonth < TIERS.standard.pmRangeMin) return "pilot";
  if (pmPerMonth < TIERS.enterprise.pmRangeMin) return "standard";
  return "enterprise";
};

// ============================================================
// PM-STORLEKSKLASSER
// Olika rapporter har olika scope. En 8-sidors PM kräver mycket
// mindre AI-arbete än en 50-sidors med 100+ provpunkter.
// tokenMultiplier multiplicerar bas-tokens (AGENT_PROFILES) per PM.
// ============================================================

export type PMSize = "small" | "standard" | "large" | "xl";

export type PMSizeProfile = {
  id: PMSize;
  label: string;
  description: string;
  pages: string;
  samplePoints: string;
  tokenMultiplier: number; // skalfaktor på AI-kostnad
  basePriceSEK: number; // riktpris till kund (vad Geosyntec betalar)
};

export const PM_SIZES: Record<PMSize, PMSizeProfile> = {
  small: {
    id: "small",
    label: "Liten",
    description: "Mindre objekt · enkel klassning",
    pages: "8–15 sidor",
    samplePoints: "~10 provpunkter",
    tokenMultiplier: 0.4,
    basePriceSEK: 450,
  },
  standard: {
    id: "standard",
    label: "Standard",
    description: "Typisk markundersökning",
    pages: "15–30 sidor",
    samplePoints: "~30 provpunkter",
    tokenMultiplier: 1.0,
    basePriceSEK: 850,
  },
  large: {
    id: "large",
    label: "Stor",
    description: "Komplex undersökning · flera hotspots",
    pages: "30–50 sidor",
    samplePoints: "~80 provpunkter",
    tokenMultiplier: 2.5,
    basePriceSEK: 2000,
  },
  xl: {
    id: "xl",
    label: "XL",
    description: "MIFO fas 2 · riskbedömning · stor RAG-kontext",
    pages: "50+ sidor",
    samplePoints: "100+ provpunkter",
    tokenMultiplier: 4.5,
    basePriceSEK: 3800,
  },
};

// Skala token-usage med size-multiplikator
export const scaleTokensBySize = (usage: TokenUsage, mult: number): TokenUsage => ({
  inputFresh: Math.round(usage.inputFresh * mult),
  inputCacheRead: Math.round(usage.inputCacheRead * mult),
  inputCacheWrite: Math.round(usage.inputCacheWrite * mult),
  output: Math.round(usage.output * mult),
});

// AI-kostnad per PM givet en storlek
export const calculateCostPerSize = (
  size: PMSize,
  modelOverrides: Partial<Record<string, ModelId>> = {},
): number => {
  const mult = PM_SIZES[size].tokenMultiplier;
  return AGENT_PROFILES.reduce((acc, agent) => {
    const model = modelOverrides[agent.id] ?? agent.defaultModel;
    return acc + calculateCostUSD(model, scaleTokensBySize(agent.tokensPerPM, mult));
  }, 0);
};
