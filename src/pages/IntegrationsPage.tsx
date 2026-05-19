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
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2 px-1 flex items-center gap-2">
                {category}
                <span className="text-ink-muted/60">·</span>
                <span className="text-ink-muted normal-case font-mono text-[10px]">
                  {list.length}{" "}
                  {list.length === 1 ? "integration" : "integrationer"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {list.map((int, idx) => {
                  const st = statusBadge[int.status];
                  const isLastInOddList =
                    idx === list.length - 1 && list.length % 2 === 1;
                  return (
                    <button
                      key={int.id}
                      onClick={() =>
                        toast(`${int.name} · ${int.status}`, {
                          detail: `${int.apiCallsToday} anrop idag · senaste sync ${int.lastSync}`,
                          kind: int.status === "aktiv" ? "success" : "info",
                        })
                      }
                      className={`hairline rounded bg-paper p-4 text-left hover:bg-cream transition-colors ${
                        isLastInOddList ? "col-span-2" : ""
                      }`}
                    >
                      {isLastInOddList ? (
                        // Horisontell layout för full-bredd kort
                        <div className="flex items-center gap-4">
                          <div
                            className="w-11 h-11 rounded flex items-center justify-center text-white flex-shrink-0"
                            style={{ background: int.color }}
                          >
                            <Icon name={int.icon} size={18} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[14px] font-medium">
                                {int.name}
                              </span>
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
                            <div className="text-[10px] font-mono text-ink-muted leading-snug mt-1">
                              <span className="uppercase tracking-wider mr-2">
                                Endpoints:
                              </span>
                              {int.endpoints.slice(0, 3).join(" · ")}
                              {int.endpoints.length > 3 &&
                                ` +${int.endpoints.length - 3}`}
                            </div>
                          </div>
                          <div className="hairline-soft rounded bg-cream/40 px-3 py-2 grid grid-cols-3 gap-x-5 gap-y-0 flex-shrink-0">
                            <Cell label="Latens" value={int.latency} mono />
                            <Cell
                              label="Anrop idag"
                              value={int.apiCallsToday.toLocaleString("sv-SE")}
                            />
                            <Cell label="Senaste sync" value={int.lastSync} />
                          </div>
                        </div>
                      ) : (
                        // Standard kort-layout för dubbla rader
                        <>
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="w-10 h-10 rounded flex items-center justify-center text-white flex-shrink-0"
                              style={{ background: int.color }}
                            >
                              <Icon name={int.icon} size={16} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <span className="text-[14px] font-medium">
                                  {int.name}
                                </span>
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
                              value={int.apiCallsToday.toLocaleString(
                                "sv-SE",
                              )}
                            />
                            <Cell label="Senaste sync" value={int.lastSync} />
                          </div>

                          <div className="text-[10px] font-mono text-ink-muted leading-snug">
                            <span className="uppercase tracking-wider mr-2">
                              Endpoints:
                            </span>
                            {int.endpoints.slice(0, 2).join(" · ")}
                            {int.endpoints.length > 2 &&
                              ` +${int.endpoints.length - 2}`}
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Datakällor utan Microsoft Graph — adresserar IT-restriktioner från US-HK */}
        <div className="mt-6 hairline rounded bg-paper overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line-soft flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Dataingestion
              </div>
              <div className="text-[15px] font-semibold tracking-tight mt-0.5">
                Datakällor utan Microsoft Graph-access
              </div>
              <div className="text-[11.5px] text-ink-muted mt-1 leading-snug max-w-[680px]">
                Vissa kunder har M365 centralt styrt från huvudkontor utomlands och
                kan inte godkänna Graph API-integrationer. Samify Geo levererar
                fullt värde ändå via fyra alternativa kanaler — utan att Geosyntecs
                US-IT behöver godkänna en tenant-app.
              </div>
            </div>
            <span
              className="hairline-soft rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-green-brand flex items-center gap-1.5"
              style={{ background: "rgba(4, 120, 87, 0.08)" }}
            >
              <Icon name="check" size={10} strokeWidth={3} />
              MVP-redo
            </span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-line-soft">
            <IngressMethod
              num="01"
              title="Manuell uppladdning"
              priority="Default"
              priorityColor="#047857"
              body="Drag-and-drop i Samify Geo. Konsulten väljer PM, mall eller riktlinje från sin laptop. Vi parsar och embeddar direkt till pgvector. Inga IT-godkännanden behövs."
              meta="Kräver: ingenting · Klar i: Fas 1"
            />
            <IngressMethod
              num="02"
              title="Seed-batch vid pilotstart"
              priority="Engångsinsats"
              priorityColor="#b45309"
              body="Geosyntec exporterar 200–500 historiska PM/mallar som .zip från SharePoint (en person, läsbehörighet räcker). Vi importerar engångsvis och RAG-grunden är satt."
              meta="Kräver: 1–2 h från kund · Klar i: Fas 1"
            />
            <IngressMethod
              num="03"
              title="Watch-folder agent"
              priority="Rekommenderas"
              priorityColor="#6b5b95"
              body="Liten lokal app på en svensk konsults laptop som övervakar den OneDrive-synkade mappen (filsystem-events, inte Graph). Pushar ändringar via HTTPS till Samify. US-IT kan inte stoppa det — samma princip som Spotifys musik-mapp."
              meta="Kräver: 1 svensk konsult-laptop · Klar i: Fas 2"
            />
            <IngressMethod
              num="04"
              title="Workflow-indexering"
              priority="Automatisk"
              priorityColor="#047857"
              body="När konsulten godkänner och exporterar ett PM från Samify Geo indexeras det direkt. Detta är dessutom det viktigaste — färska, granskade PM ger störst RAG-värde framåt."
              meta="Kräver: ingenting · Klar i: Fas 1"
            />
          </div>
          <div className="px-5 py-3.5 border-t border-line-soft bg-cream/40 flex items-start gap-3">
            <Icon name="info" size={13} className="text-ink-muted mt-0.5 flex-shrink-0" />
            <div className="text-[11.5px] text-ink-soft leading-snug">
              <strong className="text-ink">Säkerhetsargument:</strong> Många stora
              bolag är skeptiska till Graph-integrationer just för att de exponerar
              hela tenanten. Vår modell — manuell upload + lokala filsystem-events +
              workflow-integration — innebär att <strong className="text-ink">ingen
              dataaccess sker via Microsoft</strong>. All datatransport går direkt
              från Geosyntecs konsulter till Samify, krypterad in transit och vilande
              i SE-region.
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
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

const IngressMethod = ({
  num,
  title,
  priority,
  priorityColor,
  body,
  meta,
}: {
  num: string;
  title: string;
  priority: string;
  priorityColor: string;
  body: string;
  meta: string;
}) => (
  <div className="bg-paper p-4">
    <div className="flex items-baseline gap-3 mb-2">
      <span className="font-mono text-[11px] text-ink-muted">{num}</span>
      <span className="text-[13.5px] font-medium flex-1">{title}</span>
      <span
        className="hairline-soft rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider"
        style={{ color: priorityColor, background: `${priorityColor}14` }}
      >
        {priority}
      </span>
    </div>
    <div className="text-[12px] text-ink-soft leading-snug mb-2">{body}</div>
    <div className="text-[10.5px] text-ink-muted font-mono">{meta}</div>
  </div>
);

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
