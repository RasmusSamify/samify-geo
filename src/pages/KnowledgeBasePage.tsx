import { useState } from "react";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import { Link } from "react-router-dom";

type Doc = {
  id: string;
  title: string;
  category: string;
  type: "PDF" | "DOCX" | "HTML" | "XML";
  size: string;
  pages: number;
  indexed: string;
  tags: string[];
};

const docs: Doc[] = [
  {
    id: "doc-1",
    title: "NV 2009:1867 – Riktvärden för förorenad mark",
    category: "Riktvärden",
    type: "PDF",
    size: "4.2 MB",
    pages: 184,
    indexed: "2026-05-18",
    tags: ["NV", "KM", "MKM", "FA", "metaller"],
  },
  {
    id: "doc-2",
    title: "SGI Vägledning – Riskbedömning av förorenade områden (2009)",
    category: "Branschstandarder",
    type: "PDF",
    size: "8.7 MB",
    pages: 312,
    indexed: "2026-05-18",
    tags: ["SGI", "riskbedömning", "spridning"],
  },
  {
    id: "doc-3",
    title: "SS-EN ISO 17294-2:2016 – Vattenanalys ICP-MS",
    category: "Branschstandarder",
    type: "PDF",
    size: "1.4 MB",
    pages: 48,
    indexed: "2026-05-15",
    tags: ["ICP-MS", "metaller", "analysmetod"],
  },
  {
    id: "doc-4",
    title: "GS-2025-0287 PM Markmiljö – Bolidens Aitik",
    category: "Interna PM",
    type: "DOCX",
    size: "2.1 MB",
    pages: 64,
    indexed: "2026-05-12",
    tags: ["gruva", "Norrbotten", "anrikningsverk"],
  },
  {
    id: "doc-5",
    title: "Förordning (1998:899) om miljöfarlig verksamhet och hälsoskydd",
    category: "Lagstiftning",
    type: "HTML",
    size: "180 KB",
    pages: 0,
    indexed: "2026-05-10",
    tags: ["FMH", "28§", "anmälan"],
  },
  {
    id: "doc-6",
    title: "GS-2024-0612 Avgränsande provtagning – Klippan",
    category: "Interna PM",
    type: "DOCX",
    size: "3.8 MB",
    pages: 78,
    indexed: "2026-05-09",
    tags: ["tryckimpregnering", "PAH", "Skåne"],
  },
  {
    id: "doc-7",
    title: "SGU rapport 2024:08 – Grundvattenmagasin Norrbotten",
    category: "Vetenskapliga artiklar",
    type: "PDF",
    size: "12.4 MB",
    pages: 156,
    indexed: "2026-05-04",
    tags: ["SGU", "grundvatten", "Norrbotten"],
  },
  {
    id: "doc-8",
    title: "Avfallsförordning (2020:614) bilaga 3 – farligt avfall",
    category: "Lagstiftning",
    type: "HTML",
    size: "92 KB",
    pages: 0,
    indexed: "2026-04-28",
    tags: ["avfall", "klassificering"],
  },
];

const categories = [
  { name: "Riktvärden", count: 87, color: "#047857", icon: "scale" as const },
  { name: "Branschstandarder", count: 412, count_label: "SS-EN, ISO", color: "#0369a1", icon: "layers" as const },
  { name: "Interna PM", count: 1247, color: "#7c3aed", icon: "archive" as const },
  { name: "Lagstiftning", count: 156, color: "#b91c1c", icon: "scale" as const },
  { name: "Vetenskapliga artiklar", count: 8932, color: "#475569", icon: "file" as const },
  { name: "Datablad & SDS", count: 3478, color: "#b45309", icon: "database" as const },
];

const recentSearches = [
  { q: "MIFO klass 2 sulfidmalm spridning grundvatten", hits: 14, when: "för 4 min" },
  { q: "bly arsenik kadmium hotspot grundvattenrör", hits: 27, when: "för 12 min" },
  { q: "FA-klassificering Naturvårdsverket 2016 revision", hits: 9, when: "för 38 min" },
  { q: "DBSCAN clustering provpunkter SWEREF99TM", hits: 6, when: "för 1 tim" },
  { q: "Lainas anrikningsverk historik 1947", hits: 3, when: "för 2 tim" },
];

export const KnowledgeBasePage = () => {
  const { demo, toast } = useToast();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = docs.filter((d) => {
    if (activeCategory && d.category !== activeCategory) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(s) ||
        d.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    return true;
  });

  const totalDocs = categories.reduce((a, c) => a + c.count, 0);

  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[1320px] mx-auto px-8 py-6">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
              Kunskapsbas
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight leading-tight">
              RAG-index för Geosyntec
            </h1>
            <div className="text-[12px] text-ink-muted mt-0.5">
              <span className="font-mono text-ink">{totalDocs.toLocaleString("sv-SE")}</span>{" "}
              dokument · pgvector · senaste indexering 2026-05-18 03:14
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
              onClick={() => demo("Ladda upp dokument till kunskapsbasen")}
              className="btn-accent px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="upload" size={12} strokeWidth={2} />
              Ladda upp
            </button>
          </div>
        </div>

        <div className="hairline rounded bg-paper p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="search" size={16} className="text-ink-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Semantisk sökning, t.ex. "spridning av tungmetaller i sandig morän"'
              className="flex-1 bg-transparent outline-none text-[13.5px]"
            />
            <button
              onClick={() =>
                toast("RAG-sökning körd", {
                  detail: "12 dokument · rerank threshold 0.78",
                  kind: "success",
                })
              }
              className="btn-accent px-3 py-1.5 rounded text-[11.5px] flex items-center gap-1.5"
            >
              Sök
              <span className="font-mono text-[10px] opacity-75">⏎</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mr-1">
              Förslag
            </span>
            {[
              "MIFO klass 2 spridning",
              "DBSCAN hotspot detection",
              "NV revision 2016",
              "SGI vägledning åtgärd",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setSearch(q)}
                className="hairline-soft rounded-full px-2 py-0.5 text-ink-soft hover:bg-cream-2"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-5">
          <div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() =>
                    setActiveCategory(activeCategory === c.name ? null : c.name)
                  }
                  className={`hairline rounded bg-paper text-left px-3.5 py-3 hover:bg-cream transition-colors ${
                    activeCategory === c.name ? "ring-2 ring-gold" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: c.color }}
                    >
                      <Icon name={c.icon} size={11} strokeWidth={2} />
                    </div>
                    <span className="text-[12.5px] font-medium">{c.name}</span>
                  </div>
                  <div className="text-[18px] font-semibold leading-none tracking-tight">
                    {c.count.toLocaleString("sv-SE")}
                  </div>
                  <div className="text-[10.5px] text-ink-muted mt-0.5">dokument</div>
                </button>
              ))}
            </div>

            <div className="hairline rounded bg-paper overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-line-soft">
                <div className="text-[12.5px] font-medium">
                  {activeCategory ?? "Senast indexerade"}{" "}
                  <span className="text-ink-muted font-normal">
                    ({filtered.length})
                  </span>
                </div>
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="text-[11px] text-ink-muted hover:text-ink flex items-center gap-1"
                  >
                    <Icon name="close" size={10} />
                    Rensa filter
                  </button>
                )}
              </div>
              <div className="divide-y divide-line-soft">
                {filtered.map((d) => (
                  <button
                    key={d.id}
                    onClick={() =>
                      toast(d.title, {
                        detail: `${d.type} · ${d.size}${d.pages ? " · " + d.pages + " sidor" : ""}`,
                        kind: "info",
                      })
                    }
                    className="w-full text-left px-4 py-3 hover:bg-cream-2 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-cream-2 flex items-center justify-center text-ink-muted flex-shrink-0">
                        <Icon name="file" size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium leading-snug">
                          {d.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10.5px] text-ink-muted font-mono">
                          <span className="hairline-soft rounded px-1.5 py-0.5">
                            {d.type}
                          </span>
                          <span>{d.size}</span>
                          {d.pages > 0 && <span>· {d.pages} sidor</span>}
                          <span>· indexerad {d.indexed}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          {d.tags.map((t) => (
                            <span
                              key={t}
                              className="hairline-soft rounded-full px-1.5 py-0 text-[9.5px] text-ink-muted font-mono"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[10.5px] text-ink-muted font-mono">
                        {d.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="hairline rounded bg-paper p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="cpu" size={12} className="text-gold" />
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Index-status
                </div>
              </div>
              <div className="space-y-2 text-[11.5px]">
                <Row label="Embedding-modell" value="text-embedding-3-large" />
                <Row label="Vektordatabas" value="pgvector 0.7.0" />
                <Row label="Dimensioner" value="3 072" />
                <Row label="Avstånd" value="cosine" />
                <Row label="Rerank-modell" value="cohere rerank-3" />
                <Row label="Senaste indexering" value="2026-05-18 03:14" />
              </div>
            </div>

            <div className="hairline rounded bg-paper p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="search" size={12} className="text-ink-muted" />
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Senaste sökningar
                </div>
              </div>
              <div className="space-y-1">
                {recentSearches.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSearch(s.q)}
                    className="w-full text-left -mx-1 px-1 py-1 rounded hover:bg-cream-2 transition-colors"
                  >
                    <div className="text-[11.5px] text-ink-soft leading-snug line-clamp-2">
                      {s.q}
                    </div>
                    <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                      {s.hits} träffar · {s.when}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="hairline rounded bg-cream-2/40 p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon name="info" size={11} className="text-ink-muted" />
                <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                  Daglig sync
                </div>
              </div>
              <div className="text-[11.5px] text-ink-soft leading-snug">
                Nya interna PM från SharePoint indexeras automatiskt 03:00 varje natt.
                Externa källor (NV, SGI, SGU) synkas veckovis.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-ink-muted">{label}</span>
    <span className="font-mono text-ink">{value}</span>
  </div>
);
