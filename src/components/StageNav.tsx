import { Icon } from "./Icon";
import type { Stage } from "../hooks/useDemoState";
import { useToast } from "./Toast";
import { useNavigate } from "react-router-dom";

type Props = {
  stage: Stage;
  setStage: (s: Stage) => void;
  agentsComplete: boolean;
};

export const StageNav = ({ stage, setStage, agentsComplete }: Props) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const stages: { n: Stage; label: string; sub: string }[] = [
    { n: 1, label: "Källdata", sub: "Provtagning & metadata" },
    { n: 2, label: "Orkestrering", sub: "Agentbaserad analys" },
    { n: 3, label: "Rapport", sub: "Granskning & export" },
  ];

  const systems: { label: string; status: string; detail: string }[] = [
    {
      label: "Claude opus 4.7",
      status: "aktiv",
      detail: "Anthropic SDK · 1M kontext · prompt-cache aktiv",
    },
    {
      label: "pgvector / RAG",
      status: "14 312 doc",
      detail: "Interna PM, riktvärden, branschstandarder · senast indexerad 2026-05-18",
    },
    {
      label: "SGU WFS",
      status: "86 ms",
      detail: "Jordart 1:25k · Berggrund 1:50k · Brunnsarkivet · Grundvattenmagasin",
    },
    {
      label: "EBH-stödet",
      status: "231 ms",
      detail: "Länsstyrelsens databas över förorenade områden · uppkopplad",
    },
    {
      label: "NV riktvärden",
      status: "2009:1867",
      detail: "Generella riktvärden för förorenad mark · revision 2016-09-30",
    },
  ];

  const recentProjects = [
    { id: "GS-2026-0411", name: "Råstasjön efterbehandling", status: "Granskad" },
    { id: "GS-2026-0398", name: "Sandviken industriområde", status: "Levererad" },
    { id: "GS-2026-0383", name: "Aitik utfallsdamm", status: "Levererad" },
  ];

  return (
    <aside
      className="bg-paper border-r border-line w-[260px] flex flex-col"
      style={{ flexShrink: 0 }}
    >
      <div className="px-5 pt-6 pb-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
          Arbetsflöde
        </div>
        <div className="space-y-1">
          {stages.map((s) => {
            const active = stage === s.n;
            const done = s.n < stage || (s.n === 2 && agentsComplete);
            const accessible =
              s.n === 1 ||
              (s.n === 2 && stage >= 2) ||
              (s.n === 3 && agentsComplete);
            return (
              <button
                key={s.n}
                onClick={() => accessible && setStage(s.n)}
                disabled={!accessible}
                className={`w-full text-left px-3 py-2.5 rounded transition-colors ${
                  active ? "bg-cream-2" : "hover:bg-cream-2"
                } ${!accessible ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`step-circle ${
                      active
                        ? "bg-ink text-paper"
                        : done
                          ? "bg-green-brand text-paper"
                          : "hairline-soft bg-paper text-ink-muted"
                    }`}
                  >
                    {done && !active ? (
                      <Icon name="check" size={12} strokeWidth={2.5} />
                    ) : (
                      `0${s.n}`
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[13px] font-medium ${
                        active ? "text-ink" : "text-ink-soft"
                      }`}
                    >
                      {s.label}
                    </div>
                    <div className="text-[10.5px] text-ink-muted leading-tight">
                      {s.sub}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-line-soft">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
          Systemstatus
        </div>
        <div className="space-y-0.5 text-[11px] font-mono">
          {systems.map((s) => (
            <button
              key={s.label}
              onClick={() =>
                toast(s.label, { detail: s.detail, kind: "success" })
              }
              className="w-full flex items-center justify-between px-1.5 -mx-1.5 py-1 rounded hover:bg-cream-2 transition-colors"
            >
              <span className="text-ink-soft">{s.label}</span>
              <span className="text-ink-muted">{s.status}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="px-5 py-4 border-t border-line-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Senaste projekt
            </div>
            <button
              onClick={() => navigate("/projects")}
              className="text-[10px] text-ink-muted hover:text-ink font-mono uppercase tracking-wider"
            >
              Alla →
            </button>
          </div>
          <div className="space-y-1 text-[11.5px]">
            {recentProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate("/projects")}
                className="w-full text-left px-2 py-1.5 -mx-2 rounded hover:bg-cream-2 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="truncate min-w-0">
                    <span className="font-mono text-[10px] text-ink-muted">{p.id}</span>
                    <div className="text-ink text-[12px] truncate">{p.name}</div>
                  </div>
                  <span className="font-mono text-[9.5px] text-ink-muted flex-shrink-0">
                    {p.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <a
          href="https://samify.se"
          target="_blank"
          rel="noopener noreferrer"
          className="block px-5 py-3 border-t border-line-soft hover:bg-cream-2 transition-colors"
          title="Levereras av Samify"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-0">
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-ink-muted mr-2">
                Powered by
              </span>
              <span
                className="text-[15px] font-bold tracking-tight text-ink leading-none"
                style={{ letterSpacing: "-0.02em" }}
              >
                Samify
              </span>
              <span
                className="text-[15px] font-bold leading-none"
                style={{ color: "var(--samify-purple)" }}
              >
                .
              </span>
            </div>
            <Icon name="external" size={10} className="text-ink-muted" />
          </div>
        </a>
      </div>
    </aside>
  );
};
