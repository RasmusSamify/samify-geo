import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import { Link } from "react-router-dom";

type IntegrationStatus = "aktiv" | "begränsad" | "frånkopplad";

type Integration = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  latency: string;
  lastSync: string;
  apiCallsToday: number;
  endpoints: string[];
  color: string;
  icon: "map" | "archive" | "scale" | "database" | "file" | "layers";
  by?: "Samify" | "Geosyntec";
};

const integrations: Integration[] = [
  {
    id: "sgu",
    name: "SGU",
    category: "Geologi & hydrogeologi",
    description:
      "Sveriges geologiska undersökning — jordartskartan, berggrundskartan, brunnsarkivet, grundvattenmagasin",
    status: "aktiv",
    latency: "86 ms",
    lastSync: "för 12 sekunder",
    apiCallsToday: 1247,
    endpoints: [
      "wfs/jordart_25k",
      "wfs/berggrund_50k",
      "wfs/brunnsarkivet",
      "wfs/grundvattenmagasin",
    ],
    color: "#0369a1",
    icon: "map",
    by: "Samify",
  },
  {
    id: "ebh",
    name: "EBH-stödet",
    category: "Föroreningshistorik",
    description:
      "Länsstyrelsens nationella databas över potentiellt förorenade områden · MIFO-klassning · objektsbeskrivningar",
    status: "aktiv",
    latency: "231 ms",
    lastSync: "för 3 minuter",
    apiCallsToday: 484,
    endpoints: ["ebh/api/query", "ebh/api/object", "ebh/api/branch"],
    color: "#b45309",
    icon: "archive",
    by: "Samify",
  },
  {
    id: "lantmateriet",
    name: "Lantmäteriet",
    category: "Geodata & historiska kartor",
    description:
      "Fastighetskarta · historiska flygfoton 1955–2024 · ekonomiska kartan · adresser",
    status: "aktiv",
    latency: "142 ms",
    lastSync: "för 8 minuter",
    apiCallsToday: 318,
    endpoints: [
      "geodata/fastighet",
      "geodata/historiska-flygfoton",
      "geodata/ekonomiska-kartan",
    ],
    color: "#047857",
    icon: "layers",
    by: "Samify",
  },
  {
    id: "nv",
    name: "Naturvårdsverket",
    category: "Riktvärden & lagstiftning",
    description:
      "Generella riktvärden för förorenad mark (NV 2009:1867) · avfallsförordning · senaste revisioner",
    status: "aktiv",
    latency: "—",
    lastSync: "veckosynk · 2026-05-18",
    apiCallsToday: 0,
    endpoints: ["statisk-katalog"],
    color: "#7c3aed",
    icon: "scale",
    by: "Samify",
  },
  {
    id: "eurofins",
    name: "Eurofins Environment",
    category: "Laboratorium",
    description:
      "Direktintegration mot Eurofins labbsystem · automatisk import av analysresultat · ackrediteringsnummer 1125",
    status: "aktiv",
    latency: "445 ms",
    lastSync: "för 32 minuter",
    apiCallsToday: 18,
    endpoints: ["eurofins/api/results", "eurofins/api/methods"],
    color: "#0f766e",
    icon: "database",
    by: "Samify",
  },
  {
    id: "als",
    name: "ALS Scandinavia",
    category: "Laboratorium",
    description:
      "Import av analysresultat från ALS · stödjer XLSX/PDF · ackrediteringsnummer 2030",
    status: "aktiv",
    latency: "612 ms",
    lastSync: "för 4 timmar",
    apiCallsToday: 4,
    endpoints: ["als/api/reports"],
    color: "#0f766e",
    icon: "database",
    by: "Samify",
  },
  {
    id: "synlab",
    name: "SYNLAB Analytics",
    category: "Laboratorium",
    description:
      "Import av analysresultat från SYNLAB · ackrediteringsnummer 1006",
    status: "begränsad",
    latency: "1.2 s",
    lastSync: "för 1 dag",
    apiCallsToday: 0,
    endpoints: ["synlab/api/results"],
    color: "#0f766e",
    icon: "database",
    by: "Samify",
  },
  {
    id: "sharepoint",
    name: "SharePoint (Geosyntec)",
    category: "Intern dokumenthantering",
    description:
      "Synkning av interna PM, mallar och kundprojekt · 1 247 interna dokument indexerade",
    status: "aktiv",
    latency: "76 ms",
    lastSync: "nightly · 03:00",
    apiCallsToday: 4,
    endpoints: ["graph.microsoft.com/sites/geosyntec"],
    color: "#475569",
    icon: "file",
    by: "Geosyntec",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude API",
    category: "AI / LLM",
    description:
      "Claude opus 4.7 (1M kontext) · vision för PDF-extraktion · prompt caching aktiv",
    status: "aktiv",
    latency: "1.4 s",
    lastSync: "kontinuerlig",
    apiCallsToday: 873,
    endpoints: ["api.anthropic.com/v1/messages"],
    color: "#1A1814",
    icon: "layers",
    by: "Samify",
  },
];

const statusBadge: Record<IntegrationStatus, { bg: string; color: string; dot: string }> = {
  aktiv: { bg: "rgba(4, 120, 87, 0.12)", color: "#047857", dot: "#047857" },
  begränsad: { bg: "rgba(180, 83, 9, 0.12)", color: "#b45309", dot: "#b45309" },
  frånkopplad: {
    bg: "rgba(185, 28, 28, 0.12)",
    color: "#b91c1c",
    dot: "#b91c1c",
  },
};

export const IntegrationsPage = () => {
  const { demo, toast } = useToast();

  const totalCalls = integrations.reduce((a, i) => a + i.apiCallsToday, 0);
  const activeCount = integrations.filter((i) => i.status === "aktiv").length;

  const byCategory = integrations.reduce(
    (acc, i) => {
      acc[i.category] = acc[i.category] || [];
      acc[i.category].push(i);
      return acc;
    },
    {} as Record<string, Integration[]>,
  );

  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[1320px] mx-auto px-8 py-6">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
              Integrationer
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight leading-tight">
              Datakällor & API-anslutningar
            </h1>
            <div className="text-[12px] text-ink-muted mt-0.5">
              {activeCount} av {integrations.length} integrationer aktiva ·{" "}
              <span className="font-mono text-ink">
                {totalCalls.toLocaleString("sv-SE")}
              </span>{" "}
              API-anrop idag
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
                demo("Lägg till integration · OAuth / API-nyckel / custom adapter")
              }
              className="btn-accent px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="zap" size={12} strokeWidth={2} />
              Lägg till
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          <StatCard
            label="API-anrop idag"
            value={totalCalls.toLocaleString("sv-SE")}
          />
          <StatCard
            label="Genomsnittlig latens"
            value="324 ms"
            sub="över alla integrationer"
          />
          <StatCard
            label="Aktiva integrationer"
            value={`${activeCount} / ${integrations.length}`}
            sub={
              integrations.length - activeCount > 0
                ? `${integrations.length - activeCount} begränsade`
                : "alla aktiva"
            }
          />
          <StatCard
            label="Uptime (30 dagar)"
            value="99.94%"
            sub="senaste incident: 2026-04-28"
            ok
          />
        </div>

        <div className="space-y-5">
          {Object.entries(byCategory).map(([category, list]) => (
            <div key={category}>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2 px-1">
                {category}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {list.map((int) => {
                  const st = statusBadge[int.status];
                  return (
                    <button
                      key={int.id}
                      onClick={() =>
                        toast(`${int.name} · ${int.status}`, {
                          detail: `${int.apiCallsToday} anrop idag · senaste sync ${int.lastSync}`,
                          kind: int.status === "aktiv" ? "success" : "info",
                        })
                      }
                      className="hairline rounded bg-paper p-4 text-left hover:bg-cream transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center text-white flex-shrink-0"
                          style={{ background: int.color }}
                        >
                          <Icon name={int.icon} size={16} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[14px] font-medium">{int.name}</span>
                            <span
                              className="rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1"
                              style={{ background: st.bg, color: st.color }}
                            >
                              <div
                                className={`w-1 h-1 rounded-full ${
                                  int.status === "aktiv" ? "pulse-soft" : ""
                                }`}
                                style={{ background: st.dot }}
                              />
                              {int.status}
                            </span>
                            {int.by === "Geosyntec" && (
                              <span className="hairline-soft rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                                kund
                              </span>
                            )}
                          </div>
                          <div className="text-[11.5px] text-ink-soft leading-snug">
                            {int.description}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-line-soft mb-2">
                        <Cell label="Latens" value={int.latency} mono />
                        <Cell
                          label="Anrop idag"
                          value={int.apiCallsToday.toLocaleString("sv-SE")}
                        />
                        <Cell label="Senaste sync" value={int.lastSync} />
                      </div>

                      <div className="text-[10px] font-mono text-ink-muted leading-snug">
                        <span className="uppercase tracking-wider mr-2">Endpoints:</span>
                        {int.endpoints.slice(0, 2).join(" · ")}
                        {int.endpoints.length > 2 && ` +${int.endpoints.length - 2}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="hairline rounded bg-paper p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-cream-2 flex items-center justify-center text-ink-muted flex-shrink-0">
              <Icon name="info" size={14} />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium mb-0.5">
                Övervakning & felhantering
              </div>
              <div className="text-[11.5px] text-ink-soft leading-snug">
                Vid integrationsfel återställs systemet automatiskt till cachelagrade
                data och varnar ansvarig konsult inom 5 min via e-post.
              </div>
            </div>
          </div>
          <div className="hairline rounded bg-paper p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-cream-2 flex items-center justify-center text-ink-muted flex-shrink-0">
              <Icon name="cpu" size={14} />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium mb-0.5">
                Anpassade integrationer
              </div>
              <div className="text-[11.5px] text-ink-soft leading-snug">
                Saknar du en integration? Samify bygger custom-anslutningar mot
                kundspecifika system (LIMS, GIS, projektmiljö) på 1–3 veckor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  sub,
  ok,
}: {
  label: string;
  value: string;
  sub?: string;
  ok?: boolean;
}) => (
  <div className="hairline rounded bg-paper px-4 py-3">
    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
      {label}
    </div>
    <div
      className={`text-[20px] font-semibold leading-none tracking-tight ${
        ok ? "text-green-brand" : "text-ink"
      }`}
    >
      {value}
    </div>
    {sub && <div className="text-[10.5px] text-ink-muted mt-1">{sub}</div>}
  </div>
);

const Cell = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div>
    <div className="font-mono text-[9px] uppercase tracking-wider text-ink-muted mb-0.5">
      {label}
    </div>
    <div className={`text-[11.5px] ${mono ? "font-mono" : ""} font-medium`}>
      {value}
    </div>
  </div>
);
