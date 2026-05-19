import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import type { IconName } from "../components/Icon";

type PhaseStatus = "klar" | "pågående" | "nästa" | "planerad";

type Feature = {
  text: string;
  highlight?: boolean;
};

type Phase = {
  n: number;
  name: string;
  tagline: string;
  status: PhaseStatus;
  timeline: string;
  duration: string;
  icon: IconName;
  features: Feature[];
};

const phases: Phase[] = [
  {
    n: 0,
    name: "Demo & validering",
    tagline: "Visa konceptet, validera arbetsflödet med Geosyntec",
    status: "klar",
    timeline: "Maj 2026",
    duration: "Klar",
    icon: "play",
    features: [
      { text: "Interaktiv demo av 3-stegs arbetsflöde" },
      { text: "Simulerad agentorkestrering med 5 agenter" },
      { text: "Mockdata för 1 projekt (Norra Lainas)" },
      { text: "Mockade sidor: Projekt · Kunskapsbas · Mallar · Integrationer" },
      { text: "Visuell prototyp & samtal kring innehåll i PM" },
    ],
  },
  {
    n: 1,
    name: "MVP / Pilotprojekt",
    tagline: "Första riktiga PM genereras skarpt — ett kundprojekt körs end-to-end",
    status: "nästa",
    timeline: "Juni 2026",
    duration: "3–4 veckor",
    icon: "zap",
    features: [
      { text: "Microsoft Entra SSO (Geosyntecs befintliga inloggning)", highlight: true },
      { text: "Riktig PDF/XLSX-parser för Eurofins, ALS, SYNLAB" },
      { text: "Data Extraction Agent skarpt mot Claude opus 4.7" },
      { text: "Supabase backend med pgvector (svensk region)" },
      { text: "PM Markmiljö-mallen färdig + Geosyntec branding" },
      { text: "1 pilotprojekt genereras helt: Klippan eller liknande" },
      { text: "Mätbar tidsbesparing: timmar/PM dokumenterad", highlight: true },
    ],
  },
  {
    n: 2,
    name: "Full agentpipeline",
    tagline: "Alla 5 agenter kör skarpt mot externa datakällor",
    status: "planerad",
    timeline: "Juli 2026",
    duration: "4 veckor",
    icon: "cpu",
    features: [
      { text: "SGU WFS (jordart, berggrund, brunnsarkiv, grundvatten)" },
      { text: "EBH-stödet skarp anslutning · MIFO-klassning" },
      { text: "Lantmäteriet historiska flygfoton + fastighetskartan" },
      { text: "NV riktvärden-katalog med automatisk revision" },
      { text: "Hotspot-detektion (DBSCAN) skarp på riktiga koordinater" },
      { text: "Claude opus 4.7 med prompt caching för agent-orkestrering" },
      { text: "Geosyntecs SharePoint synkas till RAG-index nattligt" },
      { text: "Källspårning på varje påstående i PM (clickable refs)", highlight: true },
    ],
  },
  {
    n: 3,
    name: "Granskning & samarbete",
    tagline: "PM kan redigeras inline, kommenteras, versionshanteras",
    status: "planerad",
    timeline: "Augusti 2026",
    duration: "3 veckor",
    icon: "edit",
    features: [
      { text: "Inline-redigering av PM-utkast (Word-likt)" },
      { text: "Track changes + kommentarer per sektion" },
      { text: "Versionshantering: jämför utkast över tid" },
      { text: "Multi-user collaboration (flera konsulter samtidigt)" },
      { text: '"Generera om sektion" med justerade instruktioner', highlight: true },
      { text: "Export till .docx med Geosyntec mall + sidnumrering" },
      { text: "Klientportal: Boliden m.fl. kommenterar i webbläsare" },
      { text: "PDF-export med signaturer & granskningsstämpel" },
    ],
  },
  {
    n: 4,
    name: "Skalning · nya rapporttyper",
    tagline: "Geo blir en plattform för fler typer av miljötekniska PM",
    status: "planerad",
    timeline: "September 2026",
    duration: "4 veckor",
    icon: "layers",
    features: [
      { text: "PM Vattenkemi (yt- & grundvatten)" },
      { text: "Anmälan 28§ FMH (förordningsanmälan)" },
      { text: "Riskbedömning enligt SGI" },
      { text: "MIFO fas 2 (systematisk inventering)" },
      { text: "Avfallsklassificering (IFA-bedömning)" },
      { text: "Kundspecifika rapportmallar (per kommun/myndighet)" },
      { text: "Trendanalys: jämför pågående projekt mot historiska", highlight: true },
      { text: "Geosyntec-dashboard: portfolio-vy över alla pågående projekt" },
    ],
  },
  {
    n: 5,
    name: "AI-djupare · självförbättrande",
    tagline: "Agenter lär av redigerade utkast, fältarbete via mobil",
    status: "planerad",
    timeline: "Oktober 2026 →",
    duration: "Löpande",
    icon: "sparkle",
    features: [
      { text: "Reasoning trace: visa varje agents tankegångar steg för steg" },
      { text: "Auto-flagga osäkerheter för manuell granskning" },
      { text: "Self-improvement: lär av redigerade utkast inom Geosyntec", highlight: true },
      { text: "Custom agents byggda av Geosyntec själva (no-code)" },
      { text: "Forecast: estimera framtida behov från historisk data" },
      { text: "Mobil-app för fältprovtagning (foto, GPS, anteckningar)" },
      { text: "Voice-input direkt till PM-sektion under besiktning" },
    ],
  },
];

const statusConfig: Record<
  PhaseStatus,
  { label: string; bg: string; color: string; ring?: string }
> = {
  klar: {
    label: "Klar",
    bg: "rgba(4, 120, 87, 0.12)",
    color: "#047857",
  },
  pågående: {
    label: "Pågående",
    bg: "rgba(180, 83, 9, 0.12)",
    color: "#b45309",
    ring: "ring-2 ring-amber-brand/40",
  },
  nästa: {
    label: "Nästa upp",
    bg: "rgba(107, 91, 149, 0.18)",
    color: "#5b4a8a",
    ring: "ring-2 ring-purple-brand/40",
  },
  planerad: {
    label: "Planerad",
    bg: "rgba(100, 116, 139, 0.12)",
    color: "#475569",
  },
};

export const RoadmapPage = () => {
  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[1320px] mx-auto px-8 py-6">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
              Roadmap
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight leading-tight">
              Vägen från demo till verksamhetssystem
            </h1>
            <div className="text-[12px] text-ink-muted mt-0.5">
              6 faser · ca 4 månader från start till produktion · Geosyntec som
              pilot- och referenskund
            </div>
          </div>
          <Link
            to="/"
            className="btn-ghost hairline-soft px-3 py-1.5 rounded text-[12px] flex items-center gap-1.5"
          >
            <Icon name="chevronRight" size={12} className="rotate-180" />
            Tillbaka till demo
          </Link>
        </div>

        {/* Horisontell tidslinje */}
        <div className="hairline rounded bg-paper p-5 mb-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
            Tidslinje
          </div>
          <div className="relative">
            <div className="absolute top-3 left-0 right-0 h-px bg-line" />
            <div
              className="absolute top-3 left-0 h-px bg-green-brand"
              style={{ width: `${(1 / phases.length) * 100}%` }}
            />
            <div className="grid grid-cols-6 gap-0">
              {phases.map((p) => {
                const cfg = statusConfig[p.status];
                return (
                  <div key={p.n} className="text-center">
                    <div
                      className="w-6 h-6 mx-auto rounded-full flex items-center justify-center text-white text-[10px] font-mono font-semibold"
                      style={{
                        background: p.status === "klar" ? "#047857" : "#cbd5e1",
                      }}
                    >
                      {p.status === "klar" ? (
                        <Icon name="check" size={11} strokeWidth={3} />
                      ) : (
                        p.n
                      )}
                    </div>
                    <div className="mt-2.5 text-[11px] font-medium text-ink leading-tight px-2">
                      {p.name}
                    </div>
                    <div className="mt-0.5 text-[10px] text-ink-muted font-mono">
                      {p.timeline}
                    </div>
                    <div
                      className="mt-1.5 mx-auto inline-block rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detaljerade fas-kort */}
        <div className="grid grid-cols-2 gap-4">
          {phases.map((p) => {
            const cfg = statusConfig[p.status];
            return (
              <div
                key={p.n}
                className={`hairline rounded bg-paper p-5 ${cfg.ring ?? ""}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    <Icon name={p.icon} size={16} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="font-mono text-[10px] text-ink-muted">
                        Fas {p.n}
                      </span>
                      <span
                        className="rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <span className="font-mono text-[10px] text-ink-muted ml-auto">
                        {p.duration}
                      </span>
                    </div>
                    <div className="text-[15px] font-semibold tracking-tight leading-tight">
                      {p.name}
                    </div>
                    <div className="text-[12px] text-ink-muted mt-0.5 leading-snug">
                      {p.tagline}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-line-soft">
                  <div className="font-mono text-[9.5px] uppercase tracking-wider text-ink-muted mb-2">
                    Innefattar
                  </div>
                  <ul className="space-y-1.5">
                    {p.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[12px] leading-snug"
                      >
                        <div className="mt-1 w-1 h-1 rounded-full bg-ink-muted flex-shrink-0" />
                        <span
                          className={
                            f.highlight ? "text-ink font-medium" : "text-ink-soft"
                          }
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-3 border-t border-line-soft flex items-center justify-between text-[11px]">
                  <div className="text-ink-muted font-mono">{p.timeline}</div>
                  <div className="text-ink-muted">
                    <span className="font-mono">{p.features.length}</span>{" "}
                    leveransområden
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Affärscase: konkurrentmatris */}
        <div className="mt-6 hairline rounded bg-paper overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line-soft">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Marknadsläge
            </div>
            <div className="text-[15px] font-semibold tracking-tight mt-0.5">
              Geosyntec vs. konkurrenter — vad får ni som de inte har
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="!text-left">Funktion</th>
                  <th className="text-center">
                    <div className="text-gold font-medium normal-case tracking-normal">
                      Samify Geo
                    </div>
                  </th>
                  <th className="text-center">Tyréns / WSP / Sweco</th>
                  <th className="text-center">Ramboll / Niras / COWI</th>
                  <th className="text-center">EQuIS / ESdat (LIMS)</th>
                  <th className="text-center">Excel / Word-mall</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow
                  feature="AI-genererat PM end-to-end"
                  cells={["yes", "no", "no", "no", "no"]}
                />
                <ComparisonRow
                  feature="5 specialiserade agenter i pipeline"
                  cells={["yes", "no", "no", "no", "no"]}
                />
                <ComparisonRow
                  feature="Källspårning per påstående"
                  cells={["yes", "partial", "partial", "no", "no"]}
                />
                <ComparisonRow
                  feature="Svenska riktvärden (NV 2009:1867) inbyggt"
                  cells={["yes", "partial", "partial", "no", "partial"]}
                />
                <ComparisonRow
                  feature="SGU / EBH / Lantmäteriet · skarpt"
                  cells={["yes", "no", "no", "no", "no"]}
                />
                <ComparisonRow
                  feature="pgvector RAG mot interna PM"
                  cells={["yes", "no", "no", "no", "no"]}
                />
                <ComparisonRow
                  feature="Klientportal (Boliden m.fl. kommenterar)"
                  cells={["yes", "no", "no", "partial", "no"]}
                />
                <ComparisonRow
                  feature="Strukturerad miljödatahantering"
                  cells={["yes", "partial", "partial", "yes", "no"]}
                />
                <ComparisonRow
                  feature="Versionshantering av PM"
                  cells={["yes", "partial", "partial", "no", "no"]}
                />
                <ComparisonRow
                  feature="Multi-tenant (vita-label per kund)"
                  cells={["yes", "no", "no", "no", "no"]}
                />
                <ComparisonRow
                  feature="Self-improvement (lär av redigeringar)"
                  cells={["yes", "no", "no", "no", "no"]}
                  highlight
                />
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-line-soft bg-cream/40 text-[11px] text-ink-muted flex items-center gap-2">
            <Icon name="info" size={11} />
            <span>
              Tyréns/WSP/Sweco/Ramboll använder traditionella konsultprocesser med
              manuella PM. EQuIS/ESdat är LIMS-system för miljödata men genererar inte
              PM. Geosyntec får ett verktyg ingen konkurrent har.
            </span>
          </div>
        </div>

        {/* ROI-kalkyl */}
        <div className="mt-4 hairline rounded bg-paper overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line-soft">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              ROI-kalkyl
            </div>
            <div className="text-[15px] font-semibold tracking-tight mt-0.5">
              Vad Geosyntec sparar per år
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2.5">
                  Antaganden
                </div>
                <div className="space-y-2 text-[12.5px]">
                  <RoiRow label="PM Markmiljö per år" value="~120 st" />
                  <RoiRow label="Konsulttid per PM (idag)" value="60 timmar" />
                  <RoiRow label="Konsulttid per PM (med Samify Geo)" value="8 timmar" />
                  <RoiRow label="Genomsnittlig debiteringskostnad" value="1 650 kr/h" mono />
                  <RoiRow label="Tidsbesparing per PM" value="52 timmar (87%)" highlight />
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2.5">
                  Resultat
                </div>
                <div className="space-y-2 text-[12.5px]">
                  <RoiRow
                    label="Frigjord konsulttid / år"
                    value="6 240 timmar"
                    mono
                  />
                  <RoiRow
                    label="Motsvarar"
                    value="~3,5 heltidskonsulter"
                  />
                  <RoiRow
                    label="Värde av frigjord tid"
                    value="10,3 mkr / år"
                    mono
                    highlight
                  />
                  <RoiRow
                    label="Eller: kapacitet för extra projekt"
                    value="+90 PM / år"
                    mono
                  />
                  <RoiRow
                    label="ROI vid Samify-kostnad 0,5–1 mkr/år"
                    value="10–20×"
                    highlight
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-line-soft">
              <div className="grid grid-cols-4 gap-3">
                <Bigstat
                  value="87%"
                  label="Tidsbesparing per PM"
                  sub="60h → 8h"
                />
                <Bigstat
                  value="3,5×"
                  label="Konsultkapacitet"
                  sub="utan nya anställningar"
                />
                <Bigstat
                  value="−14d"
                  label="Snabbare leverans"
                  sub="21d → 5–7d per PM"
                />
                <Bigstat
                  value="10–20×"
                  label="ROI år 1"
                  sub="vid normalvolym"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Konkurrensfördelar */}
        <div className="mt-4 hairline rounded bg-paper overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line-soft">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Konkurrensfördelar
            </div>
            <div className="text-[15px] font-semibold tracking-tight mt-0.5">
              Vad Geosyntec vinner i marknaden
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-5">
            <Advantage
              icon="clock"
              title="Snabbare än Tyréns / WSP / Sweco"
              body="Geosyntec kan offerera 5–7 dagars leverans där konkurrenter offererar 3 veckor. Vinner anbud på tid utan att sänka pris."
            />
            <Advantage
              icon="chart"
              title="Skalbart utan fler anställningar"
              body="Med samma 12-person-team levererar Geosyntec 3,5× fler PM. Kapaciteten kan riktas mot komplexa projekt med högre marginal."
            />
            <Advantage
              icon="check"
              title="Färre fel · högre granskning-kvalitet"
              body="Källspårning per påstående gör granskningen snabbare och mer trovärdig. AI flaggar avvikelser från standardvärden automatiskt."
            />
            <Advantage
              icon="database"
              title="Kunskapsbevaring"
              body="Senior konsulters expertis fångas i agenter och mallar. När Anna går i pension stannar 80% av hennes process kvar i systemet."
            />
            <Advantage
              icon="sparkle"
              title="Talangmagnet"
              body="Yngre konsulter söker sig till bolag med modern teknik. Geosyntec blir förstahandsvalet bland miljötekniker som inte vill skriva Word-rapporter manuellt."
            />
            <Advantage
              icon="external"
              title="Klientportal som differentiering"
              body="Boliden, kommuner och länsstyrelser kommenterar utkast i webbläsare istället för via mejl. Snabbare återkoppling, högre kundnöjdhet."
            />
          </div>
        </div>

        {/* Affärsmodell-sektion (transparent men utan pris) */}
        <div className="mt-4 hairline rounded bg-paper p-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
            Affärsmodell & samarbete
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded bg-cream-2 flex items-center justify-center text-ink-soft">
                  <Icon name="zap" size={13} strokeWidth={2} />
                </div>
                <div className="text-[13.5px] font-medium">Pilot</div>
              </div>
              <div className="text-[12px] text-ink-soft leading-snug">
                Subventionerad pilotavgift under fas 1. Geosyntec får tidigt access
                och vi får riktig feedback att bygga ifrån.
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded bg-cream-2 flex items-center justify-center text-ink-soft">
                  <Icon name="layers" size={13} strokeWidth={2} />
                </div>
                <div className="text-[13.5px] font-medium">Produktion</div>
              </div>
              <div className="text-[12px] text-ink-soft leading-snug">
                Månadsavgift baserad på antal konsulter eller antal PM. Inkluderar
                infrastruktur, alla API-anrop och löpande support.
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded bg-cream-2 flex items-center justify-center text-ink-soft">
                  <Icon name="sparkle" size={13} strokeWidth={2} />
                </div>
                <div className="text-[13.5px] font-medium">Skräddarsytt</div>
              </div>
              <div className="text-[12px] text-ink-soft leading-snug">
                Custom agents, kundspecifika mallar och integrationer mot
                Geosyntecs interna system faktureras som projekt.
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-line-soft text-[11.5px] text-ink-muted leading-snug max-w-[820px]">
            Vi förordar en hybrid prissättning som gör att Geosyntec aldrig
            överbetalar vid låga volymer — och som ger oss förutsägbara intäkter att
            bygga vidare på. Konkreta siffror tas i separat dialog när scope för
            pilot är överenskommet.
          </div>
        </div>

        <div className="mt-5 text-center text-[11px] text-ink-muted">
          Roadmapen är indikativ — prioritering sker tillsammans med Geosyntec
          baserat på vad som ger störst affärsnytta först.
        </div>
      </div>
    </div>
  );
};

const ComparisonRow = ({
  feature,
  cells,
  highlight,
}: {
  feature: string;
  cells: ("yes" | "no" | "partial")[];
  highlight?: boolean;
}) => (
  <tr className={highlight ? "selected" : ""}>
    <td className="!text-left">
      <span className={highlight ? "font-medium text-ink" : "text-ink-soft"}>
        {feature}
      </span>
    </td>
    {cells.map((c, i) => (
      <td key={i} className="text-center">
        {c === "yes" ? (
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full"
            style={{ background: "rgba(4, 120, 87, 0.18)", color: "#047857" }}
            title="Stöds fullt ut"
          >
            <Icon name="check" size={11} strokeWidth={3} />
          </span>
        ) : c === "partial" ? (
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full"
            style={{ background: "rgba(180, 83, 9, 0.15)", color: "#b45309" }}
            title="Delvis · workaround"
          >
            <span className="font-mono text-[10px] font-bold">~</span>
          </span>
        ) : (
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full"
            style={{ background: "rgba(148, 163, 184, 0.18)", color: "#94a3b8" }}
            title="Saknas"
          >
            <Icon name="close" size={11} strokeWidth={2.5} />
          </span>
        )}
      </td>
    ))}
  </tr>
);

const RoiRow = ({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) => (
  <div
    className={`flex justify-between items-baseline gap-3 ${
      highlight ? "pt-2 mt-1 border-t border-line-soft" : ""
    }`}
  >
    <span className={`text-ink-soft ${highlight ? "font-medium text-ink" : ""}`}>
      {label}
    </span>
    <span
      className={`${mono ? "font-mono" : ""} ${highlight ? "text-gold font-semibold" : "text-ink"}`}
    >
      {value}
    </span>
  </div>
);

const Bigstat = ({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub: string;
}) => (
  <div className="hairline-soft rounded bg-cream/40 px-4 py-3">
    <div className="text-[24px] font-semibold tracking-tight leading-none text-gold">
      {value}
    </div>
    <div className="text-[11.5px] text-ink mt-1.5 font-medium leading-tight">
      {label}
    </div>
    <div className="text-[10.5px] text-ink-muted mt-0.5 font-mono">{sub}</div>
  </div>
);

const Advantage = ({
  icon,
  title,
  body,
}: {
  icon: IconName;
  title: string;
  body: string;
}) => (
  <div className="flex items-start gap-3">
    <div
      className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(4, 120, 87, 0.1)", color: "#047857" }}
    >
      <Icon name={icon} size={15} strokeWidth={2} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[13px] font-medium mb-0.5">{title}</div>
      <div className="text-[11.5px] text-ink-soft leading-snug">{body}</div>
    </div>
  </div>
);
