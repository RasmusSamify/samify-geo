import { PROJECT } from "../data/project";
import type { Stage } from "../hooks/useDemoState";

type Props = {
  stage: Stage;
  onResetDemo: () => void;
};

export const TopBar = ({ stage, onResetDemo }: Props) => (
  <div className="border-b border-line bg-paper" style={{ flexShrink: 0 }}>
    <div className="flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="font-display text-[22px] font-semibold tracking-tight leading-none">
            Samify<span className="text-purple-brand">.</span>
          </div>
          <div className="hairline-soft rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Geo · v0.3.1-beta
          </div>
        </div>
        <nav className="flex items-center gap-1 text-[13px]">
          <button className="btn-ghost px-3 py-1.5 rounded text-ink-muted">Projekt</button>
          <button className="btn-ghost px-3 py-1.5 rounded text-ink-muted">
            Kunskapsbas
          </button>
          <button className="btn-ghost px-3 py-1.5 rounded text-ink-muted">Mallar</button>
          <button className="btn-ghost px-3 py-1.5 rounded text-ink-muted">
            Integrationer
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[11px] text-ink-muted font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-green-brand pulse-soft" />
          SGU · EBH-stödet · Naturvårdsverket · uppkopplad
        </div>
        <div className="w-px h-5 bg-line" />
        <button
          onClick={onResetDemo}
          className="btn-ghost px-2.5 py-1 rounded text-[11px] font-mono text-ink-muted uppercase tracking-wider"
        >
          Återställ demo
        </button>
        <div className="w-px h-5 bg-line" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center font-mono text-[10px]">
            {PROJECT.consultantInitials}
          </div>
          <div className="text-[12px] leading-tight">
            <div className="font-medium">{PROJECT.consultant}</div>
            <div className="text-ink-muted text-[10px]">Geosyntec · Stockholm</div>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6 px-6 py-2.5 bg-cream-2 border-t border-line-soft text-[11.5px]">
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-ink-muted uppercase tracking-wider text-[10px]">
          Projekt
        </span>
        <span className="font-medium">{PROJECT.id}</span>
        <span className="text-ink-muted">·</span>
        <span>{PROJECT.name}</span>
      </div>
      <div className="flex items-center gap-1.5 text-ink-muted">
        <span className="font-mono uppercase tracking-wider text-[10px]">Beställare</span>
        <span className="text-ink">{PROJECT.client}</span>
      </div>
      <div className="flex items-center gap-1.5 text-ink-muted">
        <span className="font-mono uppercase tracking-wider text-[10px]">Provtagning</span>
        <span className="text-ink">{PROJECT.samplingDate}</span>
      </div>
      <div className="flex items-center gap-1.5 text-ink-muted">
        <span className="font-mono uppercase tracking-wider text-[10px]">Labb</span>
        <span className="text-ink">Eurofins · {PROJECT.labReportId}</span>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="font-mono text-ink-muted uppercase tracking-wider text-[10px]">
          Status
        </span>
        <span className="hairline-soft rounded-full px-2 py-0.5 font-mono text-[10px]">
          {stage === 1 && "Förberedelse"}
          {stage === 2 && "Analys pågår"}
          {stage === 3 && "Klar för granskning"}
        </span>
      </div>
    </div>
  </div>
);
