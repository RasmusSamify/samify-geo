import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import { Link, useNavigate } from "react-router-dom";

type KPI = {
  label: string;
  labelEn: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  unit?: string;
  icon: "clock" | "edit" | "alert" | "database" | "scale" | "chart";
  sparkline: number[];
};

const kpis: KPI[] = [
  {
    label: "Tid sparad denna månad",
    labelEn: "Hours saved · MTD",
    value: "1 247",
    unit: "h",
    delta: "+18%",
    deltaPositive: true,
    icon: "clock",
    sparkline: [12, 18, 14, 22, 28, 24, 32, 36, 42, 38, 47, 52, 58, 64],
  },
  {
    label: "PM levererade YTD",
    labelEn: "Reports delivered · YTD",
    value: "84",
    delta: "+12 vs. 2025",
    deltaPositive: true,
    icon: "edit",
    sparkline: [4, 6, 5, 8, 9, 11, 10, 14, 12, 16, 18, 22, 24, 26],
  },
  {
    label: "Hotspots identifierade",
    labelEn: "Hotspots flagged",
    value: "127",
    delta: "+9 senaste 30d",
    deltaPositive: false,
    icon: "alert",
    sparkline: [8, 12, 10, 14, 16, 13, 18, 20, 17, 22, 24, 21, 26, 28],
  },
  {
    label: "Dokument i kunskapsbas",
    labelEn: "Documents indexed",
    value: "14 312",
    delta: "+847 denna vecka",
    deltaPositive: true,
    icon: "database",
    sparkline: [120, 132, 140, 155, 168, 174, 182, 195, 210, 224, 238, 252, 268, 281],
  },
];

type Project = {
  id: string;
  name: string;
  client: string;
  country: string;
  flag: string;
  status: "running" | "review" | "done";
  progress: number;
  deadline: string;
  hotspots: number;
};

const activeProjects: Project[] = [
  {
    id: "GS-2026-0417",
    name: "Norra Lainas",
    client: "Boliden Mineral AB",
    country: "Sweden · Pajala",
    flag: "SE",
    status: "running",
    progress: 64,
    deadline: "Jun 04",
    hotspots: 3,
  },
  {
    id: "GS-2026-0416",
    name: "Höganäs sediment",
    client: "Höganäs kommun",
    country: "Sweden · Skåne",
    flag: "SE",
    status: "running",
    progress: 38,
    deadline: "Jun 12",
    hotspots: 1,
  },
  {
    id: "GS-2026-0419",
    name: "Spillepengen",
    client: "VA Syd",
    country: "Sweden · Malmö",
    flag: "SE",
    status: "running",
    progress: 81,
    deadline: "Jun 20",
    hotspots: 6,
  },
  {
    id: "GS-2026-0411",
    name: "Råstasjön",
    client: "Solna stad",
    country: "Sweden · Stockholm",
    flag: "SE",
    status: "review",
    progress: 92,
    deadline: "May 26",
    hotspots: 2,
  },
  {
    id: "GS-2026-0415",
    name: "Klippan f.d. impr.",
    client: "Klippans kommun",
    country: "Sweden · Skåne",
    flag: "SE",
    status: "review",
    progress: 95,
    deadline: "May 22",
    hotspots: 4,
  },
];

type Activity = {
  when: string;
  who: string;
  initials: string;
  action: string;
  target: string;
  kind: "agent" | "user" | "system";
};

const activities: Activity[] = [
  {
    when: "för 2 min",
    who: "Report Synthesis Agent",
    initials: "AI",
    action: "genererade sektion 3 i",
    target: "GS-2026-0417",
    kind: "agent",
  },
  {
    when: "för 14 min",
    who: "Anna Lindqvist",
    initials: "AL",
    action: "granskade hotspot B04 i",
    target: "GS-2026-0417",
    kind: "user",
  },
  {
    when: "för 38 min",
    who: "Compliance Agent",
    initials: "AI",
    action: "flaggade 4 mätvärden över FA-gräns i",
    target: "GS-2026-0419",
    kind: "agent",
  },
  {
    when: "för 1 tim",
    who: "Karin Sundberg",
    initials: "KS",
    action: "exporterade PM (v3.2) för",
    target: "GS-2026-0411",
    kind: "user",
  },
  {
    when: "för 2 tim",
    who: "SGU WFS",
    initials: "SY",
    action: "synkade brunnsarkivet · 7 nya brunnar i",
    target: "Norrbotten",
    kind: "system",
  },
  {
    when: "för 3 tim",
    who: "Markus Berg",
    initials: "MB",
    action: "startade nytt projekt",
    target: "GS-2026-0425 · Northvolt Ett",
    kind: "user",
  },
  {
    when: "för 4 tim",
    who: "EBH-stödet",
    initials: "SY",
    action: "uppdaterade MIFO-klassningar för",
    target: "Lainas 1:14",
    kind: "system",
  },
];

const benchmarks = [
  {
    label: "Genomsnittlig PM-tid",
    labelEn: "Avg. report turnaround",
    samify: "4.2 days",
    industry: "21 days",
    delta: "−80%",
    positive: true,
  },
  {
    label: "Tid per PM-sektion",
    labelEn: "Time per section",
    samify: "26 min",
    industry: "3.4 h",
    delta: "−87%",
    positive: true,
  },
  {
    label: "Källspårning per påstående",
    labelEn: "Citations per claim",
    samify: "100%",
    industry: "~30%",
    delta: "+233%",
    positive: true,
  },
  {
    label: "Fel hittade i granskning",
    labelEn: "Issues caught in review",
    samify: "0.3 / PM",
    industry: "2.7 / PM",
    delta: "−89%",
    positive: true,
  },
];

const statusColors = {
  running: { bg: "rgba(4, 120, 87, 0.12)", color: "#047857", label: "Running" },
  review: { bg: "rgba(180, 83, 9, 0.12)", color: "#b45309", label: "In review" },
  done: { bg: "rgba(100, 116, 139, 0.12)", color: "#475569", label: "Done" },
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const now = new Date();
  const time = now.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[1360px] mx-auto px-8 py-6">
        {/* Hero / greeting */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-ink-muted mb-1">
              <span className="font-mono uppercase tracking-wider">Dashboard</span>
              <span>·</span>
              <span className="font-mono">{now.toLocaleDateString("sv-SE")}</span>
              <span>·</span>
              <span className="font-mono">{time} CET</span>
            </div>
            <h1 className="text-[24px] font-semibold tracking-tight leading-tight">
              Good morning, Anna
            </h1>
            <div className="text-[12.5px] text-ink-muted mt-0.5">
              Geosyntec Sweden · 5 aktiva projekt · 2 i granskning ·{" "}
              <span className="text-amber-brand">3 deadlines denna vecka</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                toast("Veckorapport genererad", {
                  detail: "Skickas till Anna · måndag 08:00",
                  kind: "success",
                })
              }
              className="btn-ghost hairline-soft px-3 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="download" size={12} />
              Veckorapport
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="btn-accent px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="zap" size={12} strokeWidth={2} />
              Nytt projekt
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {kpis.map((k) => (
            <button
              key={k.label}
              onClick={() =>
                toast(`${k.label}: ${k.value}${k.unit ? " " + k.unit : ""}`, {
                  detail: `${k.delta} · jämfört med föregående period`,
                  kind: "info",
                })
              }
              className="hairline rounded bg-paper p-4 text-left hover:bg-cream transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded bg-cream-2 flex items-center justify-center text-ink-soft">
                  <Icon name={k.icon} size={13} strokeWidth={2} />
                </div>
                <div
                  className={`text-[10px] font-mono font-medium ${
                    k.deltaPositive ? "text-green-brand" : "text-amber-brand"
                  }`}
                >
                  {k.delta}
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-0.5">
                <div className="text-[26px] font-semibold leading-none tracking-tight">
                  {k.value}
                </div>
                {k.unit && (
                  <span className="text-[14px] text-ink-muted font-mono">{k.unit}</span>
                )}
              </div>
              <div className="text-[11.5px] text-ink-soft leading-tight">
                {k.label}
              </div>
              <div className="text-[9.5px] text-ink-muted font-mono mt-0.5 uppercase tracking-wider">
                {k.labelEn}
              </div>
              <div className="mt-2">
                <Sparkline points={k.sparkline} />
              </div>
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* World map */}
          <div className="col-span-2 hairline rounded bg-paper overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line-soft">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Project map
                </div>
                <div className="text-[13px] font-medium">Aktiva projekt globalt</div>
              </div>
              <div className="flex items-center gap-2 text-[10.5px] font-mono">
                <Pin color="#047857" label="Running" />
                <Pin color="#b45309" label="Review" />
                <Pin color="#94a3b8" label="Planned" />
              </div>
            </div>
            <div className="p-4">
              <WorldMap />
              <div className="mt-3 grid grid-cols-4 gap-3">
                <RegionStat region="Nordics" projects={9} value="78%" />
                <RegionStat region="Western Europe" projects={3} value="14%" />
                <RegionStat region="North America" projects={1} value="6%" />
                <RegionStat region="APAC (planned)" projects={0} value="—" />
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="hairline rounded bg-paper overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line-soft">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Activity feed
                </div>
                <div className="text-[13px] font-medium">Senaste händelser</div>
              </div>
              <button
                onClick={() =>
                  toast("Aktivitetslogg · senaste 7 dagar", { kind: "info" })
                }
                className="text-[10px] text-ink-muted hover:text-ink font-mono uppercase tracking-wider"
              >
                Allt →
              </button>
            </div>
            <div className="divide-y divide-line-soft max-h-[460px] overflow-y-auto log-scroll">
              {activities.map((a, i) => (
                <div key={i} className="px-4 py-2.5 flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[9.5px] font-medium ${
                      a.kind === "agent"
                        ? "bg-ink text-paper"
                        : a.kind === "system"
                          ? "bg-cream-2 text-ink-muted"
                          : "bg-purple-brand text-paper"
                    }`}
                  >
                    {a.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] leading-snug">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-ink-soft">{a.action}</span>{" "}
                      <span className="font-mono text-ink">{a.target}</span>
                    </div>
                    <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                      {a.when}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active projects + benchmarks */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 hairline rounded bg-paper overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line-soft">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Active projects
                </div>
                <div className="text-[13px] font-medium">
                  Pågående och i granskning
                </div>
              </div>
              <Link
                to="/projects"
                className="text-[10px] text-ink-muted hover:text-ink font-mono uppercase tracking-wider"
              >
                Alla projekt →
              </Link>
            </div>
            <div className="divide-y divide-line-soft">
              {activeProjects.map((p) => {
                const st = statusColors[p.status];
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (p.id === "GS-2026-0417") navigate("/");
                      else toast(`${p.id} · ${p.name}`, { kind: "info" });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-cream-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10.5px] text-ink-muted w-[78px] flex-shrink-0">
                        {p.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-medium leading-tight">
                          {p.name}
                        </div>
                        <div className="text-[10.5px] text-ink-muted font-mono mt-0.5">
                          {p.client} · {p.country}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                            <span>Progress</span>
                            <span>{p.progress}%</span>
                          </div>
                          <div className="h-1 bg-cream-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-ink rounded-full"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right w-14">
                          <div className="text-[10px] text-ink-muted font-mono uppercase tracking-wider mb-0.5">
                            Hotspots
                          </div>
                          <div
                            className={`font-mono text-[12px] font-medium ${
                              p.hotspots >= 3
                                ? "text-rust"
                                : p.hotspots > 0
                                  ? "text-amber-brand"
                                  : "text-ink-muted"
                            }`}
                          >
                            {p.hotspots || "—"}
                          </div>
                        </div>
                        <div className="text-right w-16">
                          <div className="text-[10px] text-ink-muted font-mono uppercase tracking-wider mb-0.5">
                            Deadline
                          </div>
                          <div className="font-mono text-[11.5px]">{p.deadline}</div>
                        </div>
                        <span
                          className="rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider w-16 text-center"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hairline rounded bg-paper overflow-hidden">
            <div className="px-4 py-3 border-b border-line-soft">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Benchmarks
              </div>
              <div className="text-[13px] font-medium">
                vs. industristandard
              </div>
            </div>
            <div className="divide-y divide-line-soft">
              {benchmarks.map((b) => (
                <div key={b.label} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[11.5px] text-ink-soft">{b.label}</div>
                    <div
                      className={`font-mono text-[11px] font-medium ${
                        b.positive ? "text-green-brand" : "text-rust"
                      }`}
                    >
                      {b.delta}
                    </div>
                  </div>
                  <div className="text-[9.5px] text-ink-muted font-mono uppercase tracking-wider mb-1.5">
                    {b.labelEn}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="hairline-soft rounded px-2 py-1">
                      <div className="text-[9px] text-ink-muted font-mono uppercase tracking-wider">
                        Samify
                      </div>
                      <div className="font-mono font-medium text-ink">
                        {b.samify}
                      </div>
                    </div>
                    <div className="hairline-soft rounded px-2 py-1 opacity-60">
                      <div className="text-[9px] text-ink-muted font-mono uppercase tracking-wider">
                        Industry
                      </div>
                      <div className="font-mono text-ink-soft">{b.industry}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: meta-stats */}
        <div className="mt-5 hairline rounded bg-paper p-3 flex items-center justify-between text-[11px] text-ink-muted">
          <div className="flex items-center gap-5">
            <FootStat label="System uptime · 30d" value="99.94%" mono />
            <FootStat label="API-anrop idag" value="2 947" mono />
            <FootStat label="Aktiva användare" value="12" mono />
            <FootStat label="Data sovereignty" value="🇸🇪 SE-region" />
            <FootStat label="Compliance" value="GDPR · ISO 27001" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-brand pulse-soft" />
            <span className="font-mono">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sparkline = ({ points }: { points: number[] }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 100;
  const h = 24;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i * step},${h - ((p - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-6" preserveAspectRatio="none">
      <polyline
        points={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={`0,${h} ${path} ${w},${h}`}
        fill="var(--accent-soft)"
        opacity="0.5"
      />
    </svg>
  );
};

const Pin = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1">
    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
    <span className="text-ink-muted uppercase tracking-wider">{label}</span>
  </div>
);

const WorldMap = () => (
  <svg viewBox="0 0 800 360" className="w-full" xmlns="http://www.w3.org/2000/svg">
    {/* Stylized continents — minimal silhouettes */}
    <defs>
      <pattern id="land" patternUnits="userSpaceOnUse" width="4" height="4">
        <rect width="4" height="4" fill="#e2e8f0" />
        <circle cx="2" cy="2" r="0.4" fill="#cbd5e1" />
      </pattern>
    </defs>
    {/* Background */}
    <rect width="800" height="360" fill="#f8fafc" />

    {/* North America */}
    <path
      d="M 60 80 Q 80 60 130 70 L 180 75 Q 200 90 195 130 L 180 170 L 140 200 L 100 195 L 70 170 L 55 130 Z"
      fill="url(#land)"
      stroke="#e2e8f0"
      strokeWidth="0.5"
    />
    {/* South America */}
    <path
      d="M 160 210 Q 180 200 195 220 L 200 280 L 180 320 L 165 310 L 155 270 Z"
      fill="url(#land)"
      stroke="#e2e8f0"
      strokeWidth="0.5"
    />
    {/* Europe */}
    <path
      d="M 360 70 Q 380 60 420 70 L 450 85 Q 460 100 445 130 L 420 145 L 380 140 L 360 120 Z"
      fill="url(#land)"
      stroke="#e2e8f0"
      strokeWidth="0.5"
    />
    {/* Scandinavia (highlighted) */}
    <path
      d="M 400 40 Q 410 30 425 35 L 435 50 L 432 80 L 420 90 L 410 85 L 405 70 Z"
      fill="rgba(4, 120, 87, 0.18)"
      stroke="#047857"
      strokeWidth="0.8"
    />
    {/* Africa */}
    <path
      d="M 380 150 Q 400 140 430 155 L 445 180 L 440 240 L 420 270 L 395 265 L 380 240 L 375 200 Z"
      fill="url(#land)"
      stroke="#e2e8f0"
      strokeWidth="0.5"
    />
    {/* Asia */}
    <path
      d="M 470 70 Q 540 55 620 75 L 690 100 Q 720 110 715 150 L 690 180 L 620 175 L 540 160 L 480 140 L 465 110 Z"
      fill="url(#land)"
      stroke="#e2e8f0"
      strokeWidth="0.5"
    />
    {/* Australia */}
    <path
      d="M 640 240 Q 670 230 700 245 L 715 270 L 690 285 L 655 280 L 638 265 Z"
      fill="url(#land)"
      stroke="#e2e8f0"
      strokeWidth="0.5"
    />

    {/* Project pins */}
    {/* Sweden — many projects */}
    {[
      { x: 415, y: 50, n: "Pajala", color: "#047857" },
      { x: 410, y: 65, n: "Skellefteå", color: "#94a3b8" },
      { x: 412, y: 78, n: "Sandviken", color: "#94a3b8" },
      { x: 414, y: 82, n: "Stockholm", color: "#b45309" },
      { x: 408, y: 88, n: "Skåne", color: "#047857" },
      { x: 410, y: 86, n: "Karlstad", color: "#047857" },
    ].map((p, i) => (
      <g key={i}>
        <circle cx={p.x} cy={p.y} r="5" fill={p.color} opacity="0.25" />
        <circle cx={p.x} cy={p.y} r="2.5" fill={p.color} stroke="white" strokeWidth="0.8" />
      </g>
    ))}
    {/* Norway (planned) */}
    <g>
      <circle cx="395" cy="55" r="4" fill="#94a3b8" opacity="0.25" />
      <circle cx="395" cy="55" r="2" fill="#94a3b8" stroke="white" strokeWidth="0.8" />
    </g>
    {/* Finland */}
    <g>
      <circle cx="438" cy="50" r="4" fill="#94a3b8" opacity="0.25" />
      <circle cx="438" cy="50" r="2" fill="#94a3b8" stroke="white" strokeWidth="0.8" />
    </g>
    {/* Germany */}
    <g>
      <circle cx="405" cy="105" r="5" fill="#b45309" opacity="0.3" />
      <circle cx="405" cy="105" r="2.5" fill="#b45309" stroke="white" strokeWidth="0.8" />
    </g>
    {/* Netherlands */}
    <g>
      <circle cx="395" cy="100" r="4" fill="#047857" opacity="0.3" />
      <circle cx="395" cy="100" r="2" fill="#047857" stroke="white" strokeWidth="0.8" />
    </g>
    {/* UK */}
    <g>
      <circle cx="378" cy="95" r="4" fill="#047857" opacity="0.3" />
      <circle cx="378" cy="95" r="2" fill="#047857" stroke="white" strokeWidth="0.8" />
    </g>
    {/* USA */}
    <g>
      <circle cx="135" cy="125" r="5" fill="#047857" opacity="0.25" />
      <circle cx="135" cy="125" r="2.5" fill="#047857" stroke="white" strokeWidth="0.8" />
    </g>

    {/* Scandinavia label */}
    <text
      x="430"
      y="42"
      fontSize="9"
      fontFamily="Montserrat"
      fill="#047857"
      fontWeight="600"
    >
      Nordics · 9 active
    </text>
  </svg>
);

const RegionStat = ({
  region,
  projects,
  value,
}: {
  region: string;
  projects: number;
  value: string;
}) => (
  <div className="hairline-soft rounded px-3 py-2">
    <div className="text-[9.5px] text-ink-muted font-mono uppercase tracking-wider mb-0.5">
      {region}
    </div>
    <div className="flex items-baseline justify-between">
      <span className="text-[15px] font-semibold tracking-tight">
        {projects}
      </span>
      <span className="text-[10.5px] font-mono text-ink-muted">{value}</span>
    </div>
  </div>
);

const FootStat = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex items-center gap-1.5">
    <span className="font-mono uppercase tracking-wider text-[9.5px]">{label}</span>
    <span className={`text-ink ${mono ? "font-mono" : ""}`}>{value}</span>
  </div>
);
