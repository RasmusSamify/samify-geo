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
