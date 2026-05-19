import { Icon } from "./Icon";
import type { Stage } from "../hooks/useDemoState";

type Props = {
  stage: Stage;
  setStage: (s: Stage) => void;
  agentsComplete: boolean;
};

export const StageNav = ({ stage, setStage, agentsComplete }: Props) => {
  const stages: { n: Stage; label: string; sub: string }[] = [
    { n: 1, label: "Källdata", sub: "Provtagning & metadata" },
    { n: 2, label: "Orkestrering", sub: "Agentbaserad analys" },
    { n: 3, label: "Rapport", sub: "Granskning & export" },
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
        <div className="space-y-1.5 text-[11px] font-mono">
          <SystemRow label="Claude opus 4.7" status="aktiv" />
          <SystemRow label="pgvector / RAG" status="14 312 doc" />
          <SystemRow label="SGU WFS" status="86 ms" />
          <SystemRow label="EBH-stödet" status="231 ms" />
          <SystemRow label="NV riktvärden" status="2009:1867" />
        </div>
      </div>

      <div className="mt-auto px-5 py-4 border-t border-line-soft">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">
          Senaste projekt
        </div>
        <div className="space-y-1 text-[11.5px]">
          <RecentProject
            id="GS-2026-0411"
            name="Råstasjön efterbehandling"
            status="Granskad"
          />
          <RecentProject
            id="GS-2026-0398"
            name="Sandviken industriområde"
            status="Levererad"
          />
          <RecentProject id="GS-2026-0383" name="Aitik utfallsdamm" status="Levererad" />
        </div>
      </div>
    </aside>
  );
};

const SystemRow = ({ label, status }: { label: string; status: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-ink-soft">{label}</span>
    <span className="text-ink-muted">{status}</span>
  </div>
);

const RecentProject = ({
  id,
  name,
}: {
  id: string;
  name: string;
  status: string;
}) => (
  <button className="w-full text-left px-2 py-1.5 -mx-2 rounded hover:bg-cream-2 transition-colors">
    <div className="flex items-baseline justify-between gap-2">
      <div className="truncate">
        <span className="font-mono text-[10px] text-ink-muted">{id}</span>
        <div className="text-ink text-[12px] truncate">{name}</div>
      </div>
    </div>
  </button>
);
