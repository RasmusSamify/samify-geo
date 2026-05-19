export type LogLine = {
  t: number;
  line: string;
  muted?: boolean;
  success?: boolean;
};

export type AgentOutput = { label: string; value: string };

export type Agent = {
  id: string;
  name: string;
  icon: string;
  purpose: string;
  tech: string;
  duration: number;
  delay: number;
  logs: LogLine[];
  outputs: AgentOutput[];
};

export const AGENTS: Agent[] = [
  {
    id: "extract",
    name: "Data Extraction Agent",
    icon: "file",
    purpose: "Extraherar strukturerad data från labbrapport",
    tech: "claude-opus-4.7 · vision",
    duration: 4200,
    delay: 0,
    logs: [
      { t: 0, line: "→ POST /v1/messages [claude-opus-4.7]", muted: true },
      { t: 200, line: "Parsing PDF: Eurofins_EUSE-2026-009834_Lainas.pdf" },
      { t: 600, line: "  page_count=28  pdf_version=1.7  encrypted=false", muted: true },
      { t: 900, line: "OCR pass... confidence=0.987" },
      { t: 1300, line: "Identifying analysparameters table..." },
      { t: 1700, line: "  detected: 'Halt mg/kg TS' · 'Provpunkt' · 'Djup (m)'", muted: true },
      { t: 2100, line: "✓ 47 provpunkter identifierade" },
      { t: 2400, line: "✓ 12 analyserade ämnen per punkt" },
      { t: 2700, line: "✓ Koordinatsystem: SWEREF 99 TM (auto-detekterat)" },
      { t: 3000, line: "Extraherar metadata..." },
      { t: 3300, line: "  ackrediteringsnr=1125  metod=SS-EN 16174:2012", muted: true },
      { t: 3700, line: "Validering mot schema... ✓" },
      { t: 4000, line: "✓ 564 mätvärden strukturerade", success: true },
    ],
    outputs: [
      { label: "Provpunkter", value: "47" },
      { label: "Mätvärden", value: "564" },
      { label: "Ämnen", value: "12" },
      { label: "OCR-konfidens", value: "98.7%" },
    ],
  },
  {
    id: "geo",
    name: "Geological Context Agent",
    icon: "map",
    purpose: "Hämtar geologisk och hydrogeologisk kontext",
    tech: "SGU WFS · brunnsarkivet · RAG",
    duration: 5200,
    delay: 800,
    logs: [
      { t: 0, line: "→ GET sgu.se/wfs/jordart_25k?bbox=...", muted: true },
      { t: 400, line: "Hämtar SGU jordartskartan (1:25 000)..." },
      { t: 1100, line: "  responseTime=86ms  features=14", muted: true },
      { t: 1500, line: "✓ Dominerande jordart: Sandig morän (Mn)" },
      { t: 1900, line: "  sekundär: Glacial sand (Gs) i sydsluttning", muted: true },
      { t: 2300, line: "→ GET sgu.se/wfs/berggrund_50k", muted: true },
      { t: 2700, line: "✓ Berggrund: Granit, paleoproterozoisk (~1.8 Ga)" },
      { t: 3100, line: "→ GET sgu.se/wfs/brunnsarkivet?radius=500m", muted: true },
      { t: 3500, line: "✓ 7 brunnar inom 500 m" },
      { t: 3800, line: "  djup=12–87 m  vattennivå=4.2–6.8 m u.my", muted: true },
      { t: 4200, line: "→ GET sgu.se/wfs/grundvattenmagasin", muted: true },
      { t: 4500, line: "✓ Sand- och grusavlagring · uttagsmöjlighet 2–10 l/s" },
      { t: 4800, line: "Korsrefererar med fastighetsgränser..." },
      { t: 5000, line: "✓ Geologisk kontext klar", success: true },
    ],
    outputs: [
      { label: "Jordart", value: "Mn / Gs" },
      { label: "Berggrund", value: "Granit" },
      { label: "Brunnar (<500m)", value: "7" },
      { label: "GV-nivå", value: "4–7 m" },
    ],
  },
  {
    id: "hist",
    name: "Historical Context Agent",
    icon: "archive",
    purpose: "Söker historiska föroreningskällor och verksamhetshistorik",
    tech: "EBH-stödet · Lantmäteriet · RAG",
    duration: 4800,
    delay: 1400,
    logs: [
      { t: 0, line: "→ POST lansstyrelsen.se/ebh/api/query", muted: true },
      { t: 500, line: "Söker EBH-stödet för Lainas 1:14..." },
      { t: 1100, line: "  responseTime=231ms  hits=3", muted: true },
      { t: 1500, line: "✓ 3 EBH-poster funna" },
      { t: 1900, line: "  · Anrikningsverk Lainas (1947–1991) · MIFO klass 2" },
      { t: 2200, line: "  · Slamdamm söder (1953–1988) · MIFO klass 1" },
      { t: 2500, line: "  · Verkstadsindustri (1962–1979) · MIFO klass 3" },
      { t: 2900, line: "→ GET lantmateriet.se/historiska-flygfoton", muted: true },
      { t: 3300, line: "✓ Flygfoton 1962, 1975, 1988, 2001 hämtade" },
      { t: 3700, line: "RAG-sökning: liknande gruvfastigheter..." },
      { t: 4100, line: "  matchningar=14  threshold=0.84", muted: true },
      { t: 4500, line: "✓ Historisk kontext klar", success: true },
    ],
    outputs: [
      { label: "EBH-poster", value: "3" },
      { label: "Högsta MIFO", value: "Klass 1" },
      { label: "Flygfoton", value: "4 år" },
      { label: "RAG-träffar", value: "14" },
    ],
  },
  {
    id: "compliance",
    name: "Compliance Agent",
    icon: "scale",
    purpose: "Jämför mätvärden mot riktvärden, identifierar hotspots",
    tech: "NV 2009:1867 · regelmotor",
    duration: 3400,
    delay: 4500,
    logs: [
      { t: 0, line: "Laddar NV 2009:1867 (KM/MKM/FA)..." },
      { t: 300, line: "  ämnen=12  riktvärden=36", muted: true },
      { t: 600, line: "Iteration över 564 mätvärden..." },
      { t: 1200, line: "✓ 387 mätvärden under KM (känslig markanvändning)" },
      { t: 1500, line: "⚠ 142 mätvärden över KM, under MKM" },
      { t: 1900, line: "⚠ 31 mätvärden över MKM" },
      { t: 2200, line: "✕ 4 mätvärden över FA-gräns (farligt avfall)" },
      { t: 2500, line: "Hotspot-detektion via DBSCAN..." },
      { t: 2800, line: "✓ 3 hotspots: B04, B09, B13" },
      { t: 3100, line: "Korsvalidering mot SGI vägledning 2009..." },
      { t: 3300, line: "✓ Klassificering klar", success: true },
    ],
    outputs: [
      { label: "Över KM", value: "31%" },
      { label: "Över MKM", value: "5.5%" },
      { label: "Över FA", value: "0.7%" },
      { label: "Hotspots", value: "3" },
    ],
  },
  {
    id: "synth",
    name: "Report Synthesis Agent",
    icon: "edit",
    purpose: "Genererar PM-utkast enligt Geosyntecs mall",
    tech: "claude-opus-4.7 · pgvector RAG",
    duration: 6200,
    delay: 8200,
    logs: [
      { t: 0, line: "Laddar mall: Geosyntec_PM_Markmiljo_v3.docx" },
      { t: 400, line: "RAG-fråga: 'liknande gruvfastigheter Norrbotten'..." },
      { t: 900, line: "  retrieved=12  rerank_threshold=0.78", muted: true },
      { t: 1300, line: "✓ 12 historiska PM som referens" },
      { t: 1700, line: "→ Genererar sektion: 1. Sammanfattning" },
      { t: 2200, line: "→ Genererar sektion: 2. Bakgrund och syfte" },
      { t: 2700, line: "→ Genererar sektion: 3. Områdesbeskrivning" },
      { t: 3200, line: "→ Genererar sektion: 4. Metodik" },
      { t: 3700, line: "→ Genererar sektion: 5. Resultat" },
      { t: 4200, line: "→ Genererar sektion: 6. Tolkning och riskbedömning" },
      { t: 4700, line: "→ Genererar sektion: 7. Slutsatser" },
      { t: 5100, line: "→ Genererar sektion: 8. Rekommendationer" },
      { t: 5500, line: "Korsvalidering mot compliance-fynd..." },
      { t: 5800, line: "✓ Utkast: 8 sektioner · 6 800 ord · 14 figurer", success: true },
      { t: 6000, line: "✓ Redo för granskning av Anna Lindqvist", success: true },
    ],
    outputs: [
      { label: "Sektioner", value: "8" },
      { label: "Ord", value: "6 800" },
      { label: "Figurer", value: "14" },
      { label: "Referenser", value: "12" },
    ],
  },
];
