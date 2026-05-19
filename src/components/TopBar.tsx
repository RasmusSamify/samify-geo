import { PROJECT } from "../data/project";
import type { Stage } from "../hooks/useDemoState";
import { useToast } from "./Toast";
import { NavLink, useNavigate } from "react-router-dom";

type Props = {
  stage: Stage;
  onResetDemo: () => void;
};

export const TopBar = ({ stage, onResetDemo }: Props) => {
  const { demo } = useToast();
  const navigate = useNavigate();

  return (
    <div className="border-b border-line bg-paper" style={{ flexShrink: 0 }}>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/")}
            className="btn-ghost flex items-center gap-2.5 -mx-1.5 px-1.5 py-1 rounded"
            title="Tillbaka till aktivt projekt"
          >
            <img
              src="/geosyntec-logo.svg"
              alt="Geosyntec"
              className="h-[28px] w-auto"
            />
            <div className="hairline-soft rounded px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-ink-muted">
              Geo · v0.3.1
            </div>
          </button>
          <nav className="flex items-center gap-0.5 text-[12.5px]">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `btn-ghost px-2.5 py-1 rounded ${isActive ? "bg-cream-2 text-ink font-medium" : "text-ink-soft"}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `btn-ghost px-2.5 py-1 rounded ${isActive ? "bg-cream-2 text-ink font-medium" : "text-ink-soft"}`
              }
            >
              Projekt
            </NavLink>
            <NavLink
              to="/knowledge"
              className={({ isActive }) =>
                `btn-ghost px-2.5 py-1 rounded ${isActive ? "bg-cream-2 text-ink font-medium" : "text-ink-soft"}`
              }
            >
              Kunskapsbas
            </NavLink>
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                `btn-ghost px-2.5 py-1 rounded ${isActive ? "bg-cream-2 text-ink font-medium" : "text-ink-soft"}`
              }
            >
              Mallar
            </NavLink>
            <NavLink
              to="/integrations"
              className={({ isActive }) =>
                `btn-ghost px-2.5 py-1 rounded ${isActive ? "bg-cream-2 text-ink font-medium" : "text-ink-soft"}`
              }
            >
              Integrationer
            </NavLink>
            <NavLink
              to="/roadmap"
              className={({ isActive }) =>
                `btn-ghost px-2.5 py-1 rounded ${isActive ? "bg-cream-2 text-ink font-medium" : "text-ink-soft"}`
              }
            >
              Roadmap
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/integrations")}
            className="btn-ghost flex items-center gap-2 px-2 py-1 rounded text-[11px] text-ink-muted"
            title="Visa integrationsstatus"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-brand pulse-soft" />
            SGU · EBH-stödet · NV · uppkopplad
          </button>
          <div className="w-px h-5 bg-line" />
          <button
            onClick={onResetDemo}
            className="btn-ghost px-2 py-1 rounded text-[11px] text-ink-muted"
          >
            Återställ demo
          </button>
          <div className="w-px h-5 bg-line" />
          <button
            onClick={() => demo("Användarinställningar")}
            className="btn-ghost flex items-center gap-2 px-1 py-1 rounded"
          >
            <div className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center text-[10.5px] font-medium">
              {PROJECT.consultantInitials}
            </div>
            <div className="text-[12px] leading-tight text-left">
              <div className="font-medium">{PROJECT.consultant}</div>
              <div className="text-ink-muted text-[10px]">Geosyntec · Stockholm</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 px-6 py-2 bg-cream-2 border-t border-line-soft text-[11.5px]">
        <button
          onClick={() => demo(`Projekt · ${PROJECT.id}`)}
          className="btn-ghost flex items-center gap-1.5 -mx-1 px-1 py-0.5 rounded"
        >
          <span className="font-mono text-ink-muted uppercase tracking-wider text-[10px]">
            Projekt
          </span>
          <span className="font-medium">{PROJECT.id}</span>
          <span className="text-ink-muted">·</span>
          <span>{PROJECT.name}</span>
        </button>
        <button
          onClick={() => demo(`Beställare · ${PROJECT.client}`)}
          className="btn-ghost flex items-center gap-1.5 -mx-1 px-1 py-0.5 rounded text-ink-muted"
        >
          <span className="font-mono uppercase tracking-wider text-[10px]">
            Beställare
          </span>
          <span className="text-ink">{PROJECT.client}</span>
        </button>
        <button
          onClick={() => demo(`Provtagning · ${PROJECT.samplingDate}`)}
          className="btn-ghost flex items-center gap-1.5 -mx-1 px-1 py-0.5 rounded text-ink-muted"
        >
          <span className="font-mono uppercase tracking-wider text-[10px]">
            Provtagning
          </span>
          <span className="text-ink">{PROJECT.samplingDate}</span>
        </button>
        <button
          onClick={() => demo(`Labbrapport · ${PROJECT.labReportId}`)}
          className="btn-ghost flex items-center gap-1.5 -mx-1 px-1 py-0.5 rounded text-ink-muted"
        >
          <span className="font-mono uppercase tracking-wider text-[10px]">Labb</span>
          <span className="text-ink">Eurofins · {PROJECT.labReportId}</span>
        </button>
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
};
