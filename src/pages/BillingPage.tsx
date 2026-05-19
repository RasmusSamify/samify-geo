import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import {
  AGENT_PROFILES,
  DEFAULT_USD_SEK,
  DEFAULT_VAT,
  MODELS,
  PM_SIZES,
  calculateCostPerPM,
  calculateCostPerSize,
} from "../data/pricing";
import type { ModelId, PMSize } from "../data/pricing";
import { useRole } from "../hooks/useRole";

type Mode = "forecast" | "history" | "invoice";

// Mockad historik per månad (för demo). I produktion populeras detta från
// Anthropic Usage API + lokala logs i Supabase.
type MonthlyEntry = {
  month: string;
  pmCount: number;
  apiCalls: number;
  totalTokensInput: number;
  totalTokensOutput: number;
  costUSD: number;
};

const monthlyHistory: MonthlyEntry[] = [
  {
    month: "2025-12",
    pmCount: 32,
    apiCalls: 1247,
    totalTokensInput: 142_300_000,
    totalTokensOutput: 6_840_000,
    costUSD: 712.4,
  },
  {
    month: "2026-01",
    pmCount: 38,
    apiCalls: 1483,
    totalTokensInput: 169_400_000,
    totalTokensOutput: 8_120_000,
    costUSD: 845.7,
  },
  {
    month: "2026-02",
    pmCount: 41,
    apiCalls: 1612,
    totalTokensInput: 184_700_000,
    totalTokensOutput: 8_730_000,
    costUSD: 912.3,
  },
  {
    month: "2026-03",
    pmCount: 47,
    apiCalls: 1854,
    totalTokensInput: 212_500_000,
    totalTokensOutput: 10_040_000,
    costUSD: 1048.6,
  },
  {
    month: "2026-04",
    pmCount: 52,
    apiCalls: 2047,
    totalTokensInput: 235_800_000,
    totalTokensOutput: 11_120_000,
    costUSD: 1163.2,
  },
  {
    month: "2026-05",
    pmCount: 38,
    apiCalls: 1521,
    totalTokensInput: 175_400_000,
    totalTokensOutput: 8_250_000,
    costUSD: 871.4,
  },
];

// Per-projekt breakdown för senaste månaden
type ProjectCost = {
  id: string;
  name: string;
  client: string;
  pmCount: number;
  apiCalls: number;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
};

const projectCosts: ProjectCost[] = [
  {
    id: "GS-2026-0417",
    name: "Norra Lainas Gruvområde",
    client: "Boliden Mineral AB",
    pmCount: 1,
    apiCalls: 47,
    inputTokens: 4_320_000,
    outputTokens: 218_000,
    costUSD: 42.18,
  },
  {
    id: "GS-2026-0411",
    name: "Råstasjön efterbehandling",
    client: "Solna stad",
    pmCount: 2,
    apiCalls: 89,
    inputTokens: 8_140_000,
    outputTokens: 412_000,
    costUSD: 79.34,
  },
  {
    id: "GS-2026-0415",
    name: "Klippan f.d. tryckimpregnering",
    client: "Klippans kommun",
    pmCount: 3,
    apiCalls: 142,
    inputTokens: 13_280_000,
    outputTokens: 658_000,
    costUSD: 126.7,
  },
  {
    id: "GS-2026-0419",
    name: "Spillepengen f.d. avfallsanl.",
    client: "VA Syd",
    pmCount: 2,
    apiCalls: 94,
    inputTokens: 8_650_000,
    outputTokens: 438_000,
    costUSD: 84.92,
  },
  {
    id: "GS-2026-0408",
    name: "Vänernhamn · oljespill 2025",
    client: "Karlstads kommun",
    pmCount: 1,
    apiCalls: 38,
    inputTokens: 3_540_000,
    outputTokens: 178_000,
    costUSD: 34.7,
  },
];

const formatSEK = (sek: number, decimals = 0) =>
  sek.toLocaleString("sv-SE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const formatUSD = (usd: number, decimals = 2) =>
  usd.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const formatTokens = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
};

type QualityPreset = "max" | "balanced" | "lean";

const PRESETS: Record<QualityPreset, Partial<Record<string, ModelId>>> = {
  max: {
    extract: "opus-4.7",
    geo: "opus-4.7",
    hist: "opus-4.7",
    compliance: "opus-4.7",
    synth: "opus-4.7",
  },
  balanced: {}, // default per agent från pricing.ts
  lean: {
    extract: "sonnet-4.6",
    geo: "haiku-4.5",
    hist: "haiku-4.5",
    compliance: "haiku-4.5",
    synth: "sonnet-4.6",
  },
};

export const BillingPage = () => {
  const { toast } = useToast();
  const { role } = useRole();
  const isOwner = role === "owner";
  const [mode, setMode] = useState<Mode>("forecast");
  const [usdSek, setUsdSek] = useState(DEFAULT_USD_SEK);
  const [vat, setVat] = useState(DEFAULT_VAT);
  const [pmBySize, setPmBySize] = useState<Record<PMSize, number>>({
    small: 8,
    standard: 30,
    large: 10,
    xl: 2,
  });
  const [modelOverrides, setModelOverrides] = useState<Partial<Record<string, ModelId>>>(
    {},
  );
  const [batchDiscount, setBatchDiscount] = useState(false);
  // Samify owner-kontroller
  const [fixedFee, setFixedFee] = useState(35_000); // SEK/mån fast plattformsavgift
  const [markup, setMarkup] = useState(50); // % påslag på AI-kostnaden

  const { totalUSD: costPerPMRaw, perAgent } = useMemo(
    () => calculateCostPerPM(modelOverrides),
    [modelOverrides],
  );
  const costPerPM = batchDiscount ? costPerPMRaw * 0.5 : costPerPMRaw;

  // AI-kostnad per storleksklass (USD)
  const costPerSizeUSD = useMemo(() => {
    const result = {} as Record<PMSize, number>;
    (Object.keys(PM_SIZES) as PMSize[]).forEach((size) => {
      const raw = calculateCostPerSize(size, modelOverrides);
      result[size] = batchDiscount ? raw * 0.5 : raw;
    });
    return result;
  }, [modelOverrides, batchDiscount]);

  // Total volym över alla storlekar
  const pmPerMonth = (Object.keys(pmBySize) as PMSize[]).reduce(
    (acc, s) => acc + pmBySize[s],
    0,
  );

  // Total AI-kostnad (USD) viktad över storlekar
  const monthlyUSD = (Object.keys(pmBySize) as PMSize[]).reduce(
    (acc, s) => acc + costPerSizeUSD[s] * pmBySize[s],
    0,
  );
  const monthlySEK = monthlyUSD * usdSek;

  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[1360px] mx-auto px-8 py-6">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1 flex items-center gap-2">
              Kostnader · faktureringsunderlag
              {isOwner && (
                <span
                  className="hairline-soft rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider normal-case"
                  style={{ color: "var(--samify-purple)" }}
                >
                  Samify intern vy
                </span>
              )}
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight leading-tight">
              {isOwner ? "AI-marginal och fakturering" : "Vad systemet kostar varje månad"}
            </h1>
            <div className="text-[12px] text-ink-muted mt-0.5">
              {isOwner
                ? "Total kontroll · sätt fast avgift, påslag, modellmix"
                : "Du styr AI-kvalitet och volym · siffrorna uppdateras live"}
              {" · "}senaste sync 06:14
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="btn-ghost hairline-soft px-3 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="chevronRight" size={12} className="rotate-180" />
              Tillbaka till demo
            </Link>
            <button
              onClick={() =>
                toast("CSV-export förbereds", {
                  detail: "Skickas till info@samify.se inom 30 sekunder",
                  kind: "success",
                })
              }
              className="btn-accent px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="download" size={12} strokeWidth={2} />
              Exportera underlag
            </button>
          </div>
        </div>

        {/* Mode-tabs */}
        <div className="flex items-center gap-1 mb-4 hairline rounded bg-paper p-0.5 w-fit">
          {[
            { id: "forecast", label: "Prognos", icon: "chart" as const },
            { id: "history", label: "Historik", icon: "clock" as const },
            { id: "invoice", label: "Faktura", icon: "edit" as const },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as Mode)}
              className={`px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5 transition-colors ${
                mode === m.id ? "bg-ink text-paper" : "text-ink-soft hover:bg-cream-2"
              }`}
            >
              <Icon name={m.icon} size={11} />
              {m.label}
            </button>
          ))}
        </div>

        {/* Valutakurs och moms toolbar */}
        <div className="hairline rounded bg-paper p-3 mb-4 flex items-center gap-5 text-[12px]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              USD / SEK
            </span>
            <input
              type="number"
              step="0.05"
              value={usdSek}
              onChange={(e) => setUsdSek(parseFloat(e.target.value) || 0)}
              className="hairline-soft rounded px-2 py-1 w-20 font-mono text-[12px] bg-cream/40 outline-none focus:bg-cream"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Moms
            </span>
            <input
              type="number"
              step="0.01"
              value={(vat * 100).toFixed(0)}
              onChange={(e) => setVat((parseFloat(e.target.value) || 0) / 100)}
              className="hairline-soft rounded px-2 py-1 w-14 font-mono text-[12px] bg-cream/40 outline-none focus:bg-cream"
            />
            <span className="text-ink-muted">%</span>
          </div>
          <div className="ml-auto text-[11px] text-ink-muted">
            Källa: Anthropic prislista · uppdaterad 2026-01-15
          </div>
        </div>

        {mode === "forecast" && (
          <ForecastView
            pmBySize={pmBySize}
            setPmBySize={setPmBySize}
            pmPerMonth={pmPerMonth}
            costPerSizeUSD={costPerSizeUSD}
            modelOverrides={modelOverrides}
            setModelOverrides={setModelOverrides}
            batchDiscount={batchDiscount}
            setBatchDiscount={setBatchDiscount}
            perAgent={perAgent}
            costPerPM={costPerPM}
            costPerPMRaw={costPerPMRaw}
            monthlySEK={monthlySEK}
            usdSek={usdSek}
            vat={vat}
            fixedFee={fixedFee}
            setFixedFee={setFixedFee}
            markup={markup}
            setMarkup={setMarkup}
            applyPreset={(p) => setModelOverrides(PRESETS[p])}
            isOwner={isOwner}
          />
        )}

        {mode === "history" && (
          <HistoryView monthlyHistory={monthlyHistory} usdSek={usdSek} />
        )}

        {mode === "invoice" && (
          <InvoiceView
            projectCosts={projectCosts}
            usdSek={usdSek}
            vat={vat}
            onExport={() =>
              toast("Faktureringsunderlag exporterat", {
                detail: "Geosyntec_API-kostnader_maj-2026.pdf · 4 sidor",
                kind: "success",
              })
            }
          />
        )}
      </div>
    </div>
  );
};

// ============================================================
// FORECAST VIEW · Live-kalkylator
// ============================================================
const ForecastView = ({
  pmBySize,
  setPmBySize,
  pmPerMonth,
  costPerSizeUSD,
  modelOverrides,
  setModelOverrides,
  batchDiscount,
  setBatchDiscount,
  perAgent,
  costPerPM,
  costPerPMRaw,
  monthlySEK,
  usdSek,
  vat,
  fixedFee,
  setFixedFee,
  markup,
  setMarkup,
  applyPreset,
  isOwner,
}: {
  pmBySize: Record<PMSize, number>;
  setPmBySize: (m: Record<PMSize, number>) => void;
  pmPerMonth: number;
  costPerSizeUSD: Record<PMSize, number>;
  modelOverrides: Partial<Record<string, ModelId>>;
  setModelOverrides: (m: Partial<Record<string, ModelId>>) => void;
  batchDiscount: boolean;
  setBatchDiscount: (b: boolean) => void;
  perAgent: { agent: (typeof AGENT_PROFILES)[number]; model: ModelId; usd: number }[];
  costPerPM: number;
  costPerPMRaw: number;
  monthlySEK: number;
  usdSek: number;
  vat: number;
  fixedFee: number;
  setFixedFee: (n: number) => void;
  markup: number;
  setMarkup: (n: number) => void;
  applyPreset: (p: "max" | "balanced" | "lean") => void;
  isOwner: boolean;
}) => {
  // Samify's fakturering till Geosyntec
  const aiCostMonthlySEK = monthlySEK;
  const aiCostWithMarkupSEK = aiCostMonthlySEK * (1 + markup / 100);
  const totalChargedSEK = fixedFee + aiCostWithMarkupSEK;
  const samifyMarginSEK = totalChargedSEK - aiCostMonthlySEK;
  const marginPercent = totalChargedSEK > 0 ? (samifyMarginSEK / totalChargedSEK) * 100 : 0;

  return (
    <div className="grid grid-cols-[1fr_400px] gap-4">
      {/* Vänster: konfiguration */}
      <div className="space-y-4">
        {/* Kvalitetspresets */}
        <div className="hairline rounded bg-paper p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                AI-kvalitet
              </div>
              <div className="text-[13.5px] font-medium">
                Välj kvalitetsnivå · påverkar både resultat och kostnad
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: "max" as const,
                title: "Maxkvalitet",
                sub: "Allt opus 4.7",
                price: "Dyrast · bästa output",
                color: "#6b5b95",
              },
              {
                id: "balanced" as const,
                title: "Balanserad",
                sub: "Opus + sonnet + haiku",
                price: "Standard · default",
                color: "#047857",
              },
              {
                id: "lean" as const,
                title: "Kostnadseffektiv",
                sub: "Mest haiku 4.5",
                price: "Billigast · snabbast",
                color: "#475569",
              },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="hairline-soft rounded bg-cream/40 p-3 text-left hover:bg-cream-2 transition-colors"
                style={{ borderTopWidth: 2, borderTopColor: p.color }}
              >
                <div className="text-[12.5px] font-semibold mb-0.5">{p.title}</div>
                <div className="text-[10.5px] text-ink-muted font-mono">{p.sub}</div>
                <div className="text-[10.5px] text-ink-soft mt-1.5">{p.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Volym per storleksklass */}
        <div className="hairline rounded bg-paper overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line-soft">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Volym & rapportstorlek
              </div>
              <div className="text-[13.5px] font-medium">
                Förväntad fördelning av PM per månad
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Totalt
              </div>
              <div className="text-[22px] font-semibold tracking-tight leading-none tabular-nums">
                {pmPerMonth}
              </div>
            </div>
          </div>
          <div className="divide-y divide-line-soft">
            {(Object.keys(PM_SIZES) as PMSize[]).map((size) => {
              const profile = PM_SIZES[size];
              const count = pmBySize[size];
              const aiCostSEK = costPerSizeUSD[size] * usdSek;
              const chargedPerPM = aiCostSEK * (1 + markup / 100);
              const monthlyForSize = chargedPerPM * count;
              return (
                <div key={size} className="px-4 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium">{profile.label}</span>
                      <span className="font-mono text-[10px] text-ink-muted">
                        {profile.pages}
                      </span>
                      <span className="text-ink-muted">·</span>
                      <span className="font-mono text-[10px] text-ink-muted">
                        {profile.samplePoints}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-muted mt-0.5">
                      {profile.description}
                    </div>
                  </div>

                  <div className="text-right w-28">
                    <div className="font-mono text-[9.5px] uppercase tracking-wider text-ink-muted mb-0.5">
                      {isOwner ? "AI / Pris per PM" : "Pris per PM"}
                    </div>
                    <div className="font-mono text-[12px]">
                      {isOwner && (
                        <span className="text-ink-muted">
                          {formatSEK(aiCostSEK, 0)}
                          {" / "}
                        </span>
                      )}
                      <span className="font-medium text-ink">
                        {formatSEK(chargedPerPM, 0)} kr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 hairline-soft rounded">
                    <button
                      onClick={() =>
                        setPmBySize({
                          ...pmBySize,
                          [size]: Math.max(0, count - 1),
                        })
                      }
                      className="w-7 h-7 flex items-center justify-center text-ink-muted hover:bg-cream-2 transition-colors text-[15px] leading-none"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) =>
                        setPmBySize({
                          ...pmBySize,
                          [size]: Math.max(0, parseInt(e.target.value) || 0),
                        })
                      }
                      className="w-12 text-center bg-transparent font-mono text-[13px] font-medium outline-none"
                    />
                    <button
                      onClick={() =>
                        setPmBySize({ ...pmBySize, [size]: count + 1 })
                      }
                      className="w-7 h-7 flex items-center justify-center text-ink-muted hover:bg-cream-2 transition-colors text-[15px] leading-none"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right font-mono text-[12.5px] font-semibold tabular-nums">
                    {count > 0 ? `${formatSEK(monthlyForSize, 0)} kr` : "—"}
                  </div>
                </div>
              );
            })}
            <div className="px-4 py-3 flex items-center gap-4 bg-cream/40">
              <div className="flex-1 text-[12px] text-ink-muted">
                Total volym {pmPerMonth} PM/mån, varav{" "}
                <span className="font-mono text-ink">
                  {(((pmBySize.small + pmBySize.standard) / Math.max(1, pmPerMonth)) * 100).toFixed(0)}%
                </span>{" "}
                liten/standard,{" "}
                <span className="font-mono text-ink">
                  {(((pmBySize.large + pmBySize.xl) / Math.max(1, pmPerMonth)) * 100).toFixed(0)}%
                </span>{" "}
                stor/XL
              </div>
              <div className="w-24 text-right font-mono text-[14px] font-bold tabular-nums">
                {formatSEK(
                  (Object.keys(pmBySize) as PMSize[]).reduce(
                    (acc, s) =>
                      acc +
                      costPerSizeUSD[s] * usdSek * (1 + markup / 100) * pmBySize[s],
                    0,
                  ),
                  0,
                )}{" "}
                kr
              </div>
            </div>
          </div>
        </div>

        {/* Per-agent modellval — endast för owner (Samify intern) */}
        {isOwner && (
          <div className="hairline rounded bg-paper overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line-soft">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-2">
                  Modellmix per agent
                  <span
                    className="rounded px-1 py-px font-mono text-[8.5px] uppercase tracking-wider normal-case"
                    style={{
                      background: "rgba(107, 91, 149, 0.15)",
                      color: "var(--samify-purple)",
                    }}
                  >
                    Samify intern
                  </span>
                </div>
                <div className="text-[13.5px] font-medium">
                  Finkornig kontroll · sänk kostnaden med Haiku där det räcker
                </div>
              </div>
              <button
                onClick={() => setModelOverrides({})}
                className="text-[11px] text-ink-muted hover:text-ink font-mono uppercase tracking-wider"
              >
                Återställ default
              </button>
            </div>
            <div className="divide-y divide-line-soft">
              {perAgent.map(({ agent, model, usd }) => (
                <div key={agent.id} className="px-4 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium">{agent.name}</div>
                    <div className="text-[10.5px] text-ink-muted font-mono mt-0.5">
                      {formatTokens(
                        agent.tokensPerPM.inputFresh +
                          agent.tokensPerPM.inputCacheRead +
                          agent.tokensPerPM.inputCacheWrite,
                      )}{" "}
                      input · {formatTokens(agent.tokensPerPM.output)} output / PM
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 hairline-soft rounded p-0.5">
                    {(Object.keys(MODELS) as ModelId[]).map((m) => (
                      <button
                        key={m}
                        onClick={() =>
                          setModelOverrides({ ...modelOverrides, [agent.id]: m })
                        }
                        className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider ${
                          model === m
                            ? "bg-ink text-paper"
                            : "text-ink-muted hover:bg-cream-2"
                        }`}
                      >
                        {MODELS[m].shortName}
                      </button>
                    ))}
                  </div>
                  <div className="font-mono text-[12.5px] font-medium w-24 text-right tabular-nums">
                    ${formatUSD(usd, 3)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fast månadskostnad + påslag — endast för owner */}
        {isOwner && (
        <div className="hairline rounded bg-paper p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Fakturering till Geosyntec
              </div>
              <div className="text-[13.5px] font-medium">
                Fast plattformsavgift + påslag på AI-kostnad
              </div>
            </div>
            <span
              className="hairline-soft rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
              style={{ color: "var(--samify-purple)" }}
            >
              Samify intern
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5 mt-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] text-ink-soft">
                  Fast månadsavgift (plattform · support)
                </span>
                <input
                  type="number"
                  step="1000"
                  value={fixedFee}
                  onChange={(e) => setFixedFee(parseInt(e.target.value) || 0)}
                  className="hairline-soft rounded px-2 py-1 w-24 font-mono text-[12px] text-right bg-cream/40 outline-none focus:bg-cream"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[20_000, 35_000, 50_000, 75_000].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFixedFee(f)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      fixedFee === f
                        ? "bg-ink text-paper"
                        : "hairline-soft text-ink-soft hover:bg-cream-2"
                    }`}
                  >
                    {(f / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
              <div className="text-[10.5px] text-ink-muted mt-2 leading-snug">
                Täcker Samify-licens, support, vidareutveckling, hosting
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] text-ink-soft">Påslag på AI-kostnad</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="200"
                    value={markup}
                    onChange={(e) => setMarkup(parseInt(e.target.value) || 0)}
                    className="hairline-soft rounded px-2 py-1 w-14 font-mono text-[12px] text-right bg-cream/40 outline-none focus:bg-cream"
                  />
                  <span className="text-[11px] text-ink-muted font-mono">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={markup}
                onChange={(e) => setMarkup(parseInt(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mt-0.5">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <div className="text-[10.5px] text-ink-muted mt-1 leading-snug">
                Rekommendation: <span className="text-gold font-medium">40–60 %</span>{" "}
                · branschstandard för svensk AI-SaaS
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Batch-rabatt */}
        <div className="hairline rounded bg-paper p-4 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium">Batch API (−50 %)</div>
            <div className="text-[11.5px] text-ink-muted mt-0.5">
              För icke-realtidskörningar · resultat inom 24 h · halverar kostnaden
            </div>
          </div>
          <button
            onClick={() => setBatchDiscount(!batchDiscount)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              batchDiscount ? "bg-green-brand" : "bg-cream-2 hairline-soft"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                batchDiscount ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Token-detalj */}
        <div className="hairline rounded bg-paper overflow-hidden">
          <div className="px-4 py-3 border-b border-line-soft">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Token-uppdelning per PM
            </div>
            <div className="text-[13px] font-medium">
              Per agent · uppdaterad live
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Modell</th>
                <th className="text-right">Input fresh</th>
                <th className="text-right">Cache läs</th>
                <th className="text-right">Cache skriv</th>
                <th className="text-right">Output</th>
                <th className="text-right">USD / PM</th>
              </tr>
            </thead>
            <tbody>
              {perAgent.map(({ agent, model, usd }) => (
                <tr key={agent.id}>
                  <td>{agent.name}</td>
                  <td className="font-mono text-[11px] text-ink-soft">
                    {MODELS[model].shortName}
                  </td>
                  <td className="text-right font-mono">
                    {formatTokens(agent.tokensPerPM.inputFresh)}
                  </td>
                  <td className="text-right font-mono text-ink-muted">
                    {formatTokens(agent.tokensPerPM.inputCacheRead)}
                  </td>
                  <td className="text-right font-mono text-ink-muted">
                    {formatTokens(agent.tokensPerPM.inputCacheWrite)}
                  </td>
                  <td className="text-right font-mono">
                    {formatTokens(agent.tokensPerPM.output)}
                  </td>
                  <td className="text-right font-mono font-medium">
                    ${formatUSD(usd, 3)}
                  </td>
                </tr>
              ))}
              <tr style={{ background: "var(--bg-soft)" }}>
                <td colSpan={2} className="font-medium">
                  Total per PM {batchDiscount && "(−50 % batch)"}
                </td>
                <td
                  colSpan={4}
                  className="text-right text-[10.5px] text-ink-muted font-mono"
                >
                  Baspris: ${formatUSD(costPerPMRaw, 2)}
                </td>
                <td className="text-right font-mono font-semibold text-gold">
                  ${formatUSD(costPerPM, 2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Höger: live resultat */}
      <div className="space-y-4">
        <div className="hairline rounded bg-ink text-paper p-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-paper/60 mb-2">
            {isOwner ? "Faktureras till Geosyntec" : "Månadskostnad"}
          </div>
          <div className="text-[36px] font-bold tracking-tight leading-none tabular-nums">
            {formatSEK(totalChargedSEK)}{" "}
            <span className="text-[18px] font-medium text-paper/70">kr/mån</span>
          </div>
          <div className="text-[11.5px] text-paper/60 mt-1.5 font-mono">
            {isOwner ? (
              <>
                {formatSEK(fixedFee)} (fast) +{" "}
                {formatSEK(aiCostWithMarkupSEK, 0)} (AI +{markup}%)
              </>
            ) : (
              <>
                {formatSEK(fixedFee)} plattform +{" "}
                {formatSEK(aiCostWithMarkupSEK, 0)} användning ({pmPerMonth} PM)
              </>
            )}
          </div>
          {!isOwner && (
            <div className="text-[10.5px] text-paper/50 mt-1 leading-snug">
              Inkluderar Claude API, infrastruktur, support och uppdateringar
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-paper/15 grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <div className="text-paper/60 font-mono uppercase tracking-wider text-[9.5px] mb-0.5">
                Inkl. moms ({(vat * 100).toFixed(0)}%)
              </div>
              <div className="font-mono text-[14px] tabular-nums">
                {formatSEK(totalChargedSEK * (1 + vat))} kr
              </div>
            </div>
            <div>
              <div className="text-paper/60 font-mono uppercase tracking-wider text-[9.5px] mb-0.5">
                Per år (exkl. moms)
              </div>
              <div className="font-mono text-[14px] tabular-nums">
                {formatSEK(totalChargedSEK * 12)} kr
              </div>
            </div>
          </div>
        </div>

        {/* Samifys marginal-vy — endast owner */}
        {isOwner && (
          <div
            className="hairline rounded p-4"
            style={{ background: "rgba(107, 91, 149, 0.08)" }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Samifys marginal
              </div>
              <span
                className="font-mono text-[9px] uppercase tracking-wider bg-paper/80 rounded px-1.5 py-0.5"
                style={{ color: "var(--samify-purple)" }}
              >
                Samify intern
              </span>
            </div>
            <div
              className="text-[28px] font-bold tracking-tight leading-none tabular-nums"
              style={{ color: "var(--samify-purple)" }}
            >
              {formatSEK(samifyMarginSEK)}{" "}
              <span className="text-[14px] font-medium text-ink-muted">kr/mån</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="font-mono text-[11px] font-medium"
                style={{ color: "var(--samify-purple)" }}
              >
                {marginPercent.toFixed(0)}% bruttomarginal
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-line-soft space-y-1.5 text-[11.5px]">
              <SplitRow
                label="Intäkt från Geosyntec"
                value={`+${formatSEK(totalChargedSEK)} kr`}
              />
              <SplitRow
                label="− Anthropic API"
                value={`−${formatSEK(aiCostMonthlySEK, 0)} kr`}
                negative
              />
              <SplitRow
                label="= Bruttomarginal"
                value={`${formatSEK(samifyMarginSEK)} kr`}
                bold
              />
            </div>
          </div>
        )}

        <div className="hairline rounded bg-paper p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2.5">
            Per storleksklass
          </div>
          <div className="space-y-2">
            {(Object.keys(PM_SIZES) as PMSize[]).map((size) => {
              const p = PM_SIZES[size];
              const aiSek = costPerSizeUSD[size] * usdSek;
              const chargedSek = aiSek * (1 + markup / 100);
              return (
                <ResultRow
                  key={size}
                  label={`${p.label} (${p.pages})`}
                  value={`${formatSEK(chargedSek, 0)} kr`}
                  sub={isOwner ? `AI: ${formatSEK(aiSek, 0)} kr` : undefined}
                />
              );
            })}
            <div className="border-t border-line-soft pt-2 mt-2" />
            <ResultRow
              label="Snittpris per PM (din mix)"
              value={`${formatSEK(
                pmPerMonth > 0
                  ? (Object.keys(pmBySize) as PMSize[]).reduce(
                      (acc, s) =>
                        acc +
                        costPerSizeUSD[s] *
                          usdSek *
                          (1 + markup / 100) *
                          pmBySize[s],
                      0,
                    ) / pmPerMonth
                  : 0,
                0,
              )} kr`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SplitRow = ({
  label,
  value,
  negative,
  bold,
}: {
  label: string;
  value: string;
  negative?: boolean;
  bold?: boolean;
}) => (
  <div className="flex justify-between items-baseline">
    <span className={`text-ink-soft ${bold ? "font-medium text-ink" : ""}`}>
      {label}
    </span>
    <span
      className={`font-mono ${
        bold
          ? "font-semibold text-gold-deep"
          : negative
            ? "text-rust"
            : "text-ink"
      }`}
    >
      {value}
    </span>
  </div>
);

// ============================================================
// HISTORY VIEW · 6 månader bakåt
// ============================================================
const HistoryView = ({
  monthlyHistory,
  usdSek,
}: {
  monthlyHistory: MonthlyEntry[];
  usdSek: number;
}) => {
  const total = monthlyHistory.reduce((a, b) => a + b.costUSD, 0);
  const totalPM = monthlyHistory.reduce((a, b) => a + b.pmCount, 0);
  const max = Math.max(...monthlyHistory.map((m) => m.costUSD));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <SumCard
          label="Total (6 mån)"
          value={`${formatSEK(total * usdSek)} kr`}
          sub={`$${formatUSD(total)}`}
        />
        <SumCard label="PM totalt" value={String(totalPM)} sub="senaste 6 månader" />
        <SumCard
          label="Snittkostnad / PM"
          value={`${formatSEK((total * usdSek) / totalPM)} kr`}
          sub={`$${formatUSD(total / totalPM, 2)}`}
        />
        <SumCard
          label="Snitt / månad"
          value={`${formatSEK((total * usdSek) / 6)} kr`}
          sub="exkl. moms"
        />
      </div>

      <div className="hairline rounded bg-paper overflow-hidden">
        <div className="px-4 py-3 border-b border-line-soft">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Månadsvis
          </div>
          <div className="text-[13px] font-medium">
            Faktisk Claude API-användning · Geosyntec
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Månad</th>
              <th className="text-right">PM</th>
              <th className="text-right">API-anrop</th>
              <th className="text-right">Input tokens</th>
              <th className="text-right">Output tokens</th>
              <th className="text-right">USD</th>
              <th className="text-right">SEK</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {monthlyHistory.map((m) => (
              <tr key={m.month}>
                <td className="font-mono">{m.month}</td>
                <td className="text-right font-mono">{m.pmCount}</td>
                <td className="text-right font-mono text-ink-muted">
                  {m.apiCalls.toLocaleString("sv-SE")}
                </td>
                <td className="text-right font-mono">
                  {formatTokens(m.totalTokensInput)}
                </td>
                <td className="text-right font-mono">
                  {formatTokens(m.totalTokensOutput)}
                </td>
                <td className="text-right font-mono">${formatUSD(m.costUSD)}</td>
                <td className="text-right font-mono font-medium">
                  {formatSEK(m.costUSD * usdSek)} kr
                </td>
                <td>
                  <div className="h-1.5 bg-cream rounded-full overflow-hidden w-24">
                    <div
                      className="h-full bg-ink rounded-full"
                      style={{ width: `${(m.costUSD / max) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="hairline rounded bg-cream/40 p-3.5 flex items-start gap-3">
        <Icon name="info" size={13} className="text-ink-muted mt-0.5" />
        <div className="text-[11.5px] text-ink-soft leading-snug">
          Historik synkas dagligen från Anthropic Usage API och kompletteras med per-anropslog
          i Supabase för att möjliggöra per-projekt/per-kund-nedbrytning som Anthropic
          själva inte ger.
        </div>
      </div>
    </div>
  );
};

// ============================================================
// INVOICE VIEW · Per-projekt nedbrytning med fakturaperiod
// ============================================================
const InvoiceView = ({
  projectCosts,
  usdSek,
  vat,
  onExport,
}: {
  projectCosts: ProjectCost[];
  usdSek: number;
  vat: number;
  onExport: () => void;
}) => {
  const total = projectCosts.reduce((a, b) => a + b.costUSD, 0);
  const totalSEK = total * usdSek;

  return (
    <div className="space-y-4">
      {/* Faktura-header */}
      <div className="hairline rounded bg-paper p-5">
        <div className="grid grid-cols-3 gap-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
              Faktura
            </div>
            <div className="text-[15px] font-semibold tracking-tight">
              2026-05-INV-014
            </div>
            <div className="text-[11.5px] text-ink-muted mt-0.5">Utkast</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
              Period
            </div>
            <div className="text-[13.5px]">2026-05-01 → 2026-05-31</div>
            <div className="text-[11.5px] text-ink-muted mt-0.5">31 dagar</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
              Kund
            </div>
            <div className="text-[13.5px]">Geosyntec Sweden AB</div>
            <div className="text-[11.5px] text-ink-muted mt-0.5 font-mono">
              Org.nr 556xxx-xxxx
            </div>
          </div>
        </div>
      </div>

      {/* Per-projekt rader */}
      <div className="hairline rounded bg-paper overflow-hidden">
        <div className="px-4 py-3 border-b border-line-soft">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Per projekt
          </div>
          <div className="text-[13px] font-medium">
            API-kostnad uppdelat på debiterbara projekt
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Projekt-ID</th>
              <th>Beställare · projekt</th>
              <th className="text-right">PM</th>
              <th className="text-right">API-anrop</th>
              <th className="text-right">Input tokens</th>
              <th className="text-right">Output tokens</th>
              <th className="text-right">USD</th>
              <th className="text-right">SEK</th>
            </tr>
          </thead>
          <tbody>
            {projectCosts.map((p) => (
              <tr key={p.id}>
                <td className="font-mono font-medium">{p.id}</td>
                <td>
                  <div>{p.name}</div>
                  <div className="text-[10.5px] text-ink-muted font-mono">
                    {p.client}
                  </div>
                </td>
                <td className="text-right font-mono">{p.pmCount}</td>
                <td className="text-right font-mono text-ink-muted">
                  {p.apiCalls.toLocaleString("sv-SE")}
                </td>
                <td className="text-right font-mono">
                  {formatTokens(p.inputTokens)}
                </td>
                <td className="text-right font-mono">
                  {formatTokens(p.outputTokens)}
                </td>
                <td className="text-right font-mono">${formatUSD(p.costUSD)}</td>
                <td className="text-right font-mono font-medium">
                  {formatSEK(p.costUSD * usdSek)} kr
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sammanställning */}
      <div className="hairline rounded bg-paper overflow-hidden">
        <div className="px-4 py-3 border-b border-line-soft">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Sammanställning
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-[1fr_240px] gap-6">
            <div className="space-y-2 text-[12.5px]">
              <SumLine
                label="Summa Claude API-anrop (USD)"
                value={`$${formatUSD(total)}`}
                mono
              />
              <SumLine
                label={`Växelkurs (${usdSek.toFixed(2)} kr/USD)`}
                value={`${formatSEK(totalSEK)} kr`}
                mono
              />
              <SumLine
                label="Infrastruktur (Supabase Pro)"
                value="2 700 kr"
                mono
                subtle
              />
              <SumLine
                label="Hosting (Netlify Business)"
                value="450 kr"
                mono
                subtle
              />
              <SumLine
                label="Övriga API:er (Lantmäteriet licens)"
                value="850 kr"
                mono
                subtle
              />
              <div className="border-t border-line-soft pt-2 mt-1" />
              <SumLine
                label="Subtotal · faktiska kostnader"
                value={`${formatSEK(totalSEK + 2700 + 450 + 850)} kr`}
                mono
                bold
              />
              <SumLine
                label={`Moms (${(vat * 100).toFixed(0)}%)`}
                value={`${formatSEK((totalSEK + 2700 + 450 + 850) * vat)} kr`}
                mono
                subtle
              />
              <div className="border-t border-line-soft pt-2 mt-1" />
              <SumLine
                label="Att betala · inkl. moms"
                value={`${formatSEK((totalSEK + 2700 + 450 + 850) * (1 + vat))} kr`}
                mono
                bold
                highlight
              />
            </div>
            <div className="space-y-2">
              <button
                onClick={onExport}
                className="w-full btn-accent px-3 py-2 rounded text-[12.5px] flex items-center justify-center gap-2"
              >
                <Icon name="download" size={12} strokeWidth={2} />
                Generera PDF
              </button>
              <button className="w-full btn-ghost hairline-soft px-3 py-2 rounded text-[12.5px] flex items-center justify-center gap-2">
                <Icon name="copy" size={12} />
                Kopiera SIE-fil
              </button>
              <button className="w-full btn-ghost hairline-soft px-3 py-2 rounded text-[12.5px] flex items-center justify-center gap-2">
                <Icon name="external" size={12} />
                Skicka via Fortnox
              </button>
              <div className="text-[10.5px] text-ink-muted mt-3 leading-snug">
                Fakturan inkluderar enbart de faktiska infrastrukturkostnaderna för
                fakturering enligt cost-plus-modell. SaaS-avgiften fakturas separat.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hairline rounded bg-cream/40 p-3.5 flex items-start gap-3">
        <Icon name="info" size={13} className="text-ink-muted mt-0.5" />
        <div className="text-[11.5px] text-ink-soft leading-snug">
          <strong className="text-ink">Cost-plus transparens:</strong> Denna sida visar
          de exakta API- och infrastrukturkostnader vi (Samify) betalar för Geosyntecs
          räkning. Sparar tid jämfört med att hämta separata rapporter från Anthropic,
          Supabase och Netlify. Underlaget kan exporteras som PDF eller SIE-fil för
          direkt bokföring.
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Helpers
// ============================================================
const ResultRow = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="flex justify-between items-baseline gap-3 text-[12px]">
    <span className="text-ink-soft">{label}</span>
    <div className="text-right">
      <span className="font-mono font-medium">{value}</span>
      {sub && (
        <span className="text-ink-muted font-mono text-[10.5px] ml-1">{sub}</span>
      )}
    </div>
  </div>
);

const SumCard = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="hairline rounded bg-paper px-4 py-3.5">
    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
      {label}
    </div>
    <div className="text-[20px] font-semibold leading-none tracking-tight">
      {value}
    </div>
    {sub && (
      <div className="text-[10.5px] text-ink-muted mt-1 font-mono">{sub}</div>
    )}
  </div>
);

const SumLine = ({
  label,
  value,
  mono,
  subtle,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  subtle?: boolean;
  bold?: boolean;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-baseline gap-3">
    <span
      className={`${subtle ? "text-ink-muted" : "text-ink-soft"} ${bold ? "font-medium text-ink" : ""}`}
    >
      {label}
    </span>
    <span
      className={`${mono ? "font-mono" : ""} ${bold ? "font-semibold" : ""} ${
        highlight ? "text-gold text-[14px]" : "text-ink"
      }`}
    >
      {value}
    </span>
  </div>
);
