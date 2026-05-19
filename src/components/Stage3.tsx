import { Icon } from "./Icon";
import { OverviewTab } from "./tabs/OverviewTab";
import { SamplesTab } from "./tabs/SamplesTab";
import { GeologyTab } from "./tabs/GeologyTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { ReportTab } from "./tabs/ReportTab";
import type { Tab } from "../hooks/useDemoState";

type Props = {
  tab: Tab;
  setTab: (t: Tab) => void;
};

export const Stage3 = ({ tab, setTab }: Props) => {
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Översikt" },
    { id: "samples", label: "Provpunkter" },
    { id: "geology", label: "Geologi" },
    { id: "history", label: "Historik" },
    { id: "report", label: "PM-utkast" },
  ];

  return (
    <div className="flex-1 main-scroll overflow-y-auto">
      <div className="bg-paper border-b border-line px-10 py-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
                Steg 03 · Rapport
              </div>
              <h1 className="font-display text-[36px] leading-none font-medium mb-2">
                Analysresultat — granskning
              </h1>
              <div className="text-[13px] text-ink-muted">
                Genererat{" "}
                <span className="font-mono">
                  {new Date().toLocaleString("sv-SE")}
                </span>{" "}
                · Anna Lindqvist · Geosyntec
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="btn-ghost hairline-soft px-4 py-2 rounded text-[13px] flex items-center gap-2"
                title="Kopiera länk till denna vy"
              >
                <Icon name="copy" size={13} />
                Dela
              </button>
              <button className="btn-primary px-4 py-2 rounded text-[13px] flex items-center gap-2">
                <Icon name="download" size={13} strokeWidth={2} />
                Exportera PM (.docx)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 -mb-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-[13px] border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-ink text-ink font-medium"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-10 py-8">
        {tab === "overview" && <OverviewTab />}
        {tab === "samples" && <SamplesTab />}
        {tab === "geology" && <GeologyTab />}
        {tab === "history" && <HistoryTab />}
        {tab === "report" && <ReportTab />}
      </div>
    </div>
  );
};
