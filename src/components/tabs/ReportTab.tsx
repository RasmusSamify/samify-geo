import { useState } from "react";
import { Icon } from "../Icon";
import { PM_SECTIONS } from "../../data/pmSections";
import { useToast } from "../Toast";

export const ReportTab = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const totalWords = PM_SECTIONS.reduce((a, s) => a + s.words, 0);
  const section = PM_SECTIONS[selectedIdx];
  const { demo } = useToast();

  return (
    <div className="grid grid-cols-[280px_1fr] gap-6">
      <div className="hairline rounded-md bg-paper p-3 self-start sticky top-0">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted px-2 py-2 mb-1">
          Sektioner · {totalWords.toLocaleString("sv-SE")} ord
        </div>
        {PM_SECTIONS.map((s, i) => (
          <button
            key={s.n}
            onClick={() => setSelectedIdx(i)}
            className={`w-full text-left px-2.5 py-2 rounded text-[12.5px] flex items-baseline justify-between gap-2 transition-colors ${
              selectedIdx === i ? "bg-cream-2 text-ink" : "hover:bg-cream-2 text-ink-soft"
            }`}
          >
            <span className="truncate">
              <span className="font-mono text-[10px] text-ink-muted mr-2">{s.n}.</span>
              {s.name}
            </span>
            <span className="font-mono text-[10px] text-ink-muted">{s.words}</span>
          </button>
        ))}
      </div>

      <div className="hairline rounded-md bg-paper">
        <div className="px-6 py-4 border-b border-line-soft flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Sektion {section.n} av {PM_SECTIONS.length}
            </div>
            <div className="text-[18px] font-semibold leading-tight tracking-tight mt-1">
              {section.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => demo(`Generera om sektion · ${section.name}`)}
              className="btn-ghost hairline-soft px-2.5 py-1.5 rounded text-[11.5px] flex items-center gap-1.5"
            >
              <Icon name="cpu" size={11} className="text-gold" />
              Generera om
            </button>
            <button
              onClick={() => demo(`Redigera sektion · ${section.name}`)}
              className="btn-ghost hairline-soft px-2.5 py-1.5 rounded text-[11.5px] flex items-center gap-1.5"
            >
              <Icon name="edit" size={11} />
              Redigera
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="text-[13.5px] leading-[1.7] text-ink-soft space-y-3.5 max-w-[720px]">
            {section.content}
          </div>

          {section.refs && section.refs.length > 0 && (
            <div className="mt-8 pt-6 border-t border-line-soft">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
                Källhänvisningar (auto-genererade)
              </div>
              <div className="space-y-1.5 text-[11.5px] font-mono text-ink-muted">
                {section.refs.map((r, i) => (
                  <div key={i}>{r}</div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-line-soft flex items-center justify-between">
            <button
              onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
              disabled={selectedIdx === 0}
              className="btn-ghost px-3 py-1.5 rounded text-[12px] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="chevronRight" size={12} className="rotate-180" />
              Föregående
            </button>
            <span className="font-mono text-[10.5px] text-ink-muted">
              {selectedIdx + 1} / {PM_SECTIONS.length}
            </span>
            <button
              onClick={() =>
                setSelectedIdx(Math.min(PM_SECTIONS.length - 1, selectedIdx + 1))
              }
              disabled={selectedIdx === PM_SECTIONS.length - 1}
              className="btn-ghost px-3 py-1.5 rounded text-[12px] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Nästa
              <Icon name="chevronRight" size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
