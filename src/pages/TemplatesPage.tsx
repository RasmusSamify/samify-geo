import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import { Link } from "react-router-dom";

type Template = {
  id: string;
  name: string;
  category: string;
  description: string;
  sections: number;
  pages: string;
  version: string;
  lastUpdated: string;
  uses: number;
  default?: boolean;
  icon: "scale" | "map" | "archive" | "edit" | "file" | "database";
  color: string;
};

const templates: Template[] = [
  {
    id: "tpl-markmiljo",
    name: "PM Markmiljö",
    category: "Föroreningsundersökning",
    description:
      "Föroreningsundersökning av mark · klassificering mot NV 2009:1867 · hotspot-analys · åtgärdsförslag",
    sections: 8,
    pages: "30–60",
    version: "v3.4",
    lastUpdated: "2026-04-22",
    uses: 1247,
    default: true,
    icon: "scale",
    color: "#047857",
  },
  {
    id: "tpl-vattenkemi",
    name: "PM Vattenkemi",
    category: "Föroreningsundersökning",
    description:
      "Yt- och grundvattenanalys · jämförelse mot dricksvattenföreskrifter · trendanalys",
    sections: 7,
    pages: "20–40",
    version: "v2.8",
    lastUpdated: "2026-03-15",
    uses: 612,
    icon: "map",
    color: "#0369a1",
  },
  {
    id: "tpl-anmalan-28",
    name: "Anmälan 28§ FMH",
    category: "Tillstånd & anmälan",
    description:
      "Anmälan om efterbehandling enligt 28 § förordning (1998:899) · åtgärdsbeskrivning · riskbedömning",
    sections: 6,
    pages: "15–25",
    version: "v2.1",
    lastUpdated: "2026-02-08",
    uses: 384,
    icon: "edit",
    color: "#b45309",
  },
  {
    id: "tpl-riskbedomning",
    name: "Riskbedömning enligt SGI",
    category: "Riskbedömning",
    description:
      "Strukturerad riskbedömning · spridningsmodellering · prioritering · konceptuell modell",
    sections: 9,
    pages: "40–80",
    version: "v3.1",
    lastUpdated: "2026-01-30",
    uses: 287,
    icon: "scale",
    color: "#7c3aed",
  },
  {
    id: "tpl-avfall",
    name: "Avfallsklassificering",
    category: "Klassificering",
    description:
      "Klassificering av schaktmassor · IFA-bedömning · FA-gränser · uttagsplan",
    sections: 5,
    pages: "10–20",
    version: "v2.3",
    lastUpdated: "2025-12-12",
    uses: 521,
    icon: "archive",
    color: "#475569",
  },
  {
    id: "tpl-mifo-fas2",
    name: "MIFO fas 2",
    category: "Inventering",
    description:
      "Systematisk inventering enligt Naturvårdsverkets metodik · MIFO-klassning · prioritering",
    sections: 7,
    pages: "25–50",
    version: "v1.9",
    lastUpdated: "2025-11-04",
    uses: 198,
    icon: "database",
    color: "#b91c1c",
  },
  {
    id: "tpl-baseline",
    name: "Baseline-rapport (Industriutsläppsdirektivet)",
    category: "Industri",
    description:
      "Statusrapport mark & grundvatten inför tillståndsprocess · IED-krav · referenspunkter",
    sections: 8,
    pages: "30–55",
    version: "v1.4",
    lastUpdated: "2025-10-18",
    uses: 76,
    icon: "file",
    color: "#334155",
  },
  {
    id: "tpl-slutredovisning",
    name: "Slutredovisning efterbehandling",
    category: "Efterbehandling",
    description:
      "Dokumentation av genomförd åtgärd · kontrollprovtagning · slutsatser · uppföljning",
    sections: 6,
    pages: "20–35",
    version: "v2.0",
    lastUpdated: "2025-09-22",
    uses: 142,
    icon: "edit",
    color: "#047857",
  },
];

export const TemplatesPage = () => {
  const { demo, toast } = useToast();

  const groupedByCategory = templates.reduce(
    (acc, t) => {
      acc[t.category] = acc[t.category] || [];
      acc[t.category].push(t);
      return acc;
    },
    {} as Record<string, Template[]>,
  );

  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[1320px] mx-auto px-8 py-6">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
              Mallar
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight leading-tight">
              Rapportmallar för Geosyntec
            </h1>
            <div className="text-[12px] text-ink-muted mt-0.5">
              {templates.length} mallar · samtliga versionshanterade i Git · senaste
              uppdatering 2026-04-22
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
              onClick={() => demo("Skapa ny mall · från grunden eller från befintlig")}
              className="btn-accent px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="zap" size={12} strokeWidth={2} />
              Ny mall
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {Object.entries(groupedByCategory).map(([category, tpls]) => (
            <div key={category}>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2 px-1">
                {category}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {tpls.map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      t.default
                        ? toast(`${t.name} · ${t.version}`, {
                            detail: "Aktiv mall i pågående projekt GS-2026-0417",
                            kind: "success",
                          })
                        : demo(`Öppna mall · ${t.name}`)
                    }
                    className="hairline rounded bg-paper p-4 text-left hover:bg-cream transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className="w-9 h-9 rounded flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: t.color }}
                      >
                        <Icon name={t.icon} size={15} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[14px] font-medium leading-tight">
                            {t.name}
                          </span>
                          {t.default && (
                            <span
                              className="hairline-soft rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                              style={{ background: "rgba(4, 120, 87, 0.12)", color: "#047857" }}
                            >
                              Aktiv
                            </span>
                          )}
                        </div>
                        <div className="text-[11.5px] text-ink-soft leading-snug">
                          {t.description}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-line-soft">
                      <Cell label="Sektioner" value={String(t.sections)} />
                      <Cell label="Sidor" value={t.pages} />
                      <Cell label="Version" value={t.version} mono />
                      <Cell
                        label="Användningar"
                        value={t.uses.toLocaleString("sv-SE")}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2.5 text-[10.5px] text-ink-muted font-mono">
                      <span>Uppdaterad {t.lastUpdated}</span>
                      <div className="flex items-center gap-1">
                        <Icon name="external" size={10} />
                        <span>Öppna mall</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 hairline rounded bg-paper p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-cream-2 flex items-center justify-center text-ink-muted flex-shrink-0">
            <Icon name="info" size={14} />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium mb-0.5">
              Versionshantering via Git
            </div>
            <div className="text-[11.5px] text-ink-soft leading-snug">
              Alla mallar är versionshanterade i Geosyntecs interna Git-repository.
              Ändringar synkas automatiskt till Samify Geo inom 5 minuter. Tidigare
              versioner kan återställas från historiken.
            </div>
          </div>
          <button
            onClick={() => demo("Öppna mall-repository i Git")}
            className="btn-ghost hairline-soft px-3 py-1.5 rounded text-[11.5px] flex items-center gap-1.5"
          >
            <Icon name="external" size={11} />
            Git-repo
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className={`text-[12px] ${mono ? "font-mono" : ""} font-medium`}>{value}</div>
  </div>
);
