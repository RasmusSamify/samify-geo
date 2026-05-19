import { Icon } from "./Icon";
import { OverviewTab } from "./tabs/OverviewTab";
import { SamplesTab } from "./tabs/SamplesTab";
import { GeologyTab } from "./tabs/GeologyTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { ReportTab } from "./tabs/ReportTab";
import type { Tab } from "../hooks/useDemoState";
import { useToast } from "./Toast";

type Props = {
  tab: Tab;
  setTab: (t: Tab) => void;
};

export const Stage3 = ({ tab, setTab }: Props) => {
  const { toast, demo } = useToast();
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Översikt" },
    { id: "samples", label: "Provpunkter" },
    { id: "geology", label: "Geologi" },
    { id: "history", label: "Historik" },
    { id: "report", label: "PM-utkast" },
  ];

  return (
    <div className="flex-1 main-scroll overflow-y-auto">
      <div className="bg-paper border-b border-line px-8 py-5">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
                Steg 03 · Rapport
              </div>
              <h1 className="font-display text-[22px] leading-tight font-semibold tracking-tight mb-1">
                Analysresultat
              </h1>
              <div className="text-[12px] text-ink-muted">
                Genererat{" "}
                <span className="font-mono">
                  {new Date().toLocaleString("sv-SE")}
                </span>{" "}
                · Anna Lindqvist · Geosyntec
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast("Länk kopierad", {
                    detail: window.location.href,
                    kind: "success",
                  });
                }}
                className="btn-ghost hairline-soft px-3 py-1.5 rounded text-[12px] flex items-center gap-1.5"
                title="Kopiera länk till denna vy"
              >
                <Icon name="copy" size={12} />
                Dela
              </button>
              <button
                onClick={() => demo("Exportera PM som .docx")}
                className="btn-accent px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5"
              >
                <Icon name="download" size={12} strokeWidth={2} />
                Exportera PM (.docx)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-0 -mb-5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-2 text-[12.5px] border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-gold text-ink font-medium"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-8 py-6">
        {tab === "overview" && <OverviewTab />}
        {tab === "samples" && <SamplesTab />}
        {tab === "geology" && <GeologyTab />}
        {tab === "history" && <HistoryTab />}
        {tab === "report" && <ReportTab />}
      </div>
    </div>
  );
};
