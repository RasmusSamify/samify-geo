import { useState } from "react";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import { Link, useNavigate } from "react-router-dom";

type Status = "pågående" | "granskning" | "levererad" | "ny";

type Project = {
  id: string;
  name: string;
  client: string;
  region: string;
  reportType: string;
  status: Status;
  deadline: string;
  responsible: string;
  initials: string;
  hotspots: number;
};

const projects: Project[] = [
  {
    id: "GS-2026-0417",
    name: "Norra Lainas Gruvområde",
    client: "Boliden Mineral AB",
    region: "Norrbotten",
    reportType: "PM Markmiljö",
    status: "pågående",
    deadline: "2026-06-04",
    responsible: "Anna Lindqvist",
    initials: "AL",
    hotspots: 3,
  },
  {
    id: "GS-2026-0416",
    name: "Höganäs hamninlopp · sediment",
    client: "Höganäs kommun",
    region: "Skåne",
    reportType: "PM Vattenkemi",
    status: "pågående",
    deadline: "2026-06-12",
    responsible: "Markus Berg",
    initials: "MB",
    hotspots: 1,
  },
  {
    id: "GS-2026-0415",
    name: "Klippan f.d. tryckimpregnering",
    client: "Klippans kommun",
    region: "Skåne",
    reportType: "PM Markmiljö",
    status: "granskning",
    deadline: "2026-05-22",
    responsible: "Anna Lindqvist",
    initials: "AL",
    hotspots: 4,
  },
  {
    id: "GS-2026-0411",
    name: "Råstasjön efterbehandling",
    client: "Solna stad",
    region: "Stockholm",
    reportType: "PM Markmiljö",
    status: "granskning",
    deadline: "2026-05-26",
    responsible: "Karin Sundberg",
    initials: "KS",
    hotspots: 2,
  },
  {
    id: "GS-2026-0408",
    name: "Vänernhamn · oljespill 2025",
    client: "Karlstads kommun",
    region: "Värmland",
    reportType: "PM Vattenkemi",
    status: "granskning",
    deadline: "2026-05-30",
    responsible: "Markus Berg",
    initials: "MB",
    hotspots: 0,
  },
  {
    id: "GS-2026-0398",
    name: "Sandviken industriområde",
    client: "Sandviken AB",
    region: "Gävleborg",
    reportType: "PM Markmiljö",
    status: "levererad",
    deadline: "2026-04-30",
    responsible: "Anna Lindqvist",
    initials: "AL",
    hotspots: 2,
  },
  {
    id: "GS-2026-0392",
    name: "Lomma f.d. eternitfabrik",
    client: "Länsstyrelsen Skåne",
    region: "Skåne",
    reportType: "Anmälan 28§ FMH",
    status: "levererad",
    deadline: "2026-04-22",
    responsible: "Karin Sundberg",
    initials: "KS",
    hotspots: 1,
  },
  {
    id: "GS-2026-0383",
    name: "Aitik utfallsdamm",
    client: "Boliden Mineral AB",
    region: "Norrbotten",
    reportType: "PM Markmiljö",
    status: "levererad",
    deadline: "2026-04-08",
    responsible: "Anna Lindqvist",
    initials: "AL",
    hotspots: 5,
  },
  {
    id: "GS-2026-0376",
    name: "Trelleborg deponi · slutsanering",
    client: "Trelleborgs kommun",
    region: "Skåne",
    reportType: "Riskbedömning",
    status: "levererad",
    deadline: "2026-03-28",
    responsible: "Karin Sundberg",
    initials: "KS",
    hotspots: 3,
  },
  {
    id: "GS-2026-0425",
    name: "Skellefteå batterifabrik · markundersökning",
    client: "Northvolt Ett AB",
    region: "Västerbotten",
    reportType: "PM Markmiljö",
    status: "ny",
    deadline: "2026-07-15",
    responsible: "Anna Lindqvist",
    initials: "AL",
    hotspots: 0,
  },
  {
    id: "GS-2026-0423",
    name: "Storsjön reglering · sedimentprover",
    client: "Vattenfall AB",
    region: "Jämtland",
    reportType: "PM Vattenkemi",
    status: "ny",
    deadline: "2026-07-30",
    responsible: "Markus Berg",
    initials: "MB",
    hotspots: 0,
  },
  {
    id: "GS-2026-0419",
    name: "Spillepengen f.d. avfallsanl.",
    client: "VA Syd",
    region: "Skåne",
    reportType: "Avfallsklassificering",
    status: "pågående",
    deadline: "2026-06-20",
    responsible: "Karin Sundberg",
    initials: "KS",
    hotspots: 6,
  },
];

const statusStyles: Record<Status, { bg: string; color: string; label: string }> = {
  ny: { bg: "rgba(100, 116, 139, 0.12)", color: "#475569", label: "Ny" },
  pågående: { bg: "rgba(4, 120, 87, 0.12)", color: "#047857", label: "Pågående" },
  granskning: {
    bg: "rgba(180, 83, 9, 0.12)",
    color: "#b45309",
    label: "Granskning",
  },
  levererad: {
    bg: "rgba(15, 23, 42, 0.08)",
    color: "#334155",
    label: "Levererad",
  },
};

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { demo, toast } = useToast();
  const [filter, setFilter] = useState<Status | "alla">("alla");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    if (filter !== "alla" && p.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(s) ||
        p.client.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const counts = {
    alla: projects.length,
    ny: projects.filter((p) => p.status === "ny").length,
    pågående: projects.filter((p) => p.status === "pågående").length,
    granskning: projects.filter((p) => p.status === "granskning").length,
    levererad: projects.filter((p) => p.status === "levererad").length,
  };

  const filters: { id: Status | "alla"; label: string }[] = [
    { id: "alla", label: "Alla" },
    { id: "ny", label: "Ny" },
    { id: "pågående", label: "Pågående" },
    { id: "granskning", label: "Granskning" },
    { id: "levererad", label: "Levererad" },
  ];

  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[1320px] mx-auto px-8 py-6">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
              Projekt
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight leading-tight">
              Översikt
            </h1>
            <div className="text-[12px] text-ink-muted mt-0.5">
              {projects.length} aktiva projekt · {counts.pågående + counts.granskning}{" "}
              i pågående analys
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
              onClick={() => demo("Skapa nytt projekt")}
              className="btn-accent px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="zap" size={12} strokeWidth={2} />
              Nytt projekt
            </button>
          </div>
        </div>

        <div className="hairline rounded bg-paper p-3 mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 flex-1 max-w-[320px] hairline-soft rounded px-2.5 py-1">
            <Icon name="search" size={12} className="text-ink-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sök projekt, kund eller ID..."
              className="flex-1 bg-transparent outline-none text-[12.5px]"
            />
          </div>
          <div className="w-px h-5 bg-line mx-1" />
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2.5 py-1 rounded text-[11.5px] transition-colors ${
                filter === f.id
                  ? "bg-ink text-paper"
                  : "hover:bg-cream-2 text-ink-soft"
              }`}
            >
              {f.label}
              <span
                className={`ml-1.5 font-mono text-[10px] ${filter === f.id ? "text-paper/70" : "text-ink-muted"}`}
              >
                {counts[f.id]}
              </span>
            </button>
          ))}
          <div className="ml-auto text-[11px] text-ink-muted font-mono">
            {filtered.length} av {projects.length}
          </div>
        </div>

        <div className="hairline rounded bg-paper overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Projekt-ID</th>
                <th>Namn</th>
                <th>Beställare</th>
                <th>Region</th>
                <th>Rapporttyp</th>
                <th className="text-right">Hotspots</th>
                <th>Deadline</th>
                <th>Ansvarig</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const st = statusStyles[p.status];
                const isActive = p.id === "GS-2026-0417";
                return (
                  <tr
                    key={p.id}
                    onClick={() => {
                      if (isActive) navigate("/");
                      else toast(`${p.id} · ${p.name}`, { kind: "info" });
                    }}
                    className="cursor-pointer"
                  >
                    <td>
                      <span className="font-mono font-medium">{p.id}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {p.name}
                        {isActive && (
                          <span className="hairline-soft rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold">
                            aktivt
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-ink-soft">{p.client}</td>
                    <td className="text-ink-muted">{p.region}</td>
                    <td className="text-ink-soft">{p.reportType}</td>
                    <td className="text-right font-mono">
                      {p.hotspots > 0 ? (
                        <span className={p.hotspots >= 3 ? "text-rust" : "text-amber-brand"}>
                          {p.hotspots}
                        </span>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                    <td className="font-mono text-[12px] text-ink-soft">{p.deadline}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-ink text-paper flex items-center justify-center text-[9px] font-medium">
                          {p.initials}
                        </div>
                        <span className="text-[12px] text-ink-soft">
                          {p.responsible}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="hairline-soft rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-[11px] text-ink-muted text-center">
          Klicka på <span className="font-mono">GS-2026-0417</span> för att fortsätta
          demon, eller på övriga projekt för en förhandsvisning.
        </div>
      </div>
    </div>
  );
};
