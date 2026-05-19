import { useEffect, useRef, useState } from "react";
import { PROJECT } from "../data/project";
import type { Stage } from "../hooks/useDemoState";
import { useToast } from "./Toast";
import { NavLink, useNavigate } from "react-router-dom";
import { ROLES, useRole } from "../hooks/useRole";
import { Icon } from "./Icon";

type Props = {
  stage: Stage;
  onResetDemo: () => void;
};

export const TopBar = ({ stage, onResetDemo }: Props) => {
  const { demo } = useToast();
  const navigate = useNavigate();
  const { role, setRole, profile } = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [menuOpen]);

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
            {(role === "vd" || role === "owner") && (
              <NavLink
                to="/billing"
                className={({ isActive }) =>
                  `btn-ghost px-2.5 py-1 rounded flex items-center gap-1.5 ${isActive ? "bg-cream-2 text-ink font-medium" : "text-ink-soft"}`
                }
              >
                Kostnader
                {role === "vd" ? (
                  <span className="hairline-soft rounded px-1 py-px font-mono text-[8.5px] uppercase tracking-wider text-purple-brand">
                    VD
                  </span>
                ) : (
                  <span
                    className="hairline-soft rounded px-1 py-px font-mono text-[8.5px] uppercase tracking-wider"
                    style={{ color: "var(--samify-purple)" }}
                  >
                    Samify
                  </span>
                )}
              </NavLink>
            )}
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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-ghost flex items-center gap-2 px-1 py-1 rounded"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-medium ${
                  role === "vd"
                    ? "bg-purple-brand text-paper"
                    : role === "owner"
                      ? "text-paper"
                      : "bg-ink text-paper"
                }`}
                style={role === "owner" ? { background: "var(--samify-purple)" } : {}}
              >
                {profile.initials}
              </div>
              <div className="text-[12px] leading-tight text-left">
                <div className="font-medium flex items-center gap-1.5">
                  {profile.name}
                  {role === "vd" && (
                    <span className="hairline-soft rounded px-1 py-px font-mono text-[8.5px] uppercase tracking-wider text-purple-brand">
                      VD
                    </span>
                  )}
                  {role === "owner" && (
                    <span
                      className="hairline-soft rounded px-1 py-px font-mono text-[8.5px] uppercase tracking-wider"
                      style={{ color: "var(--samify-purple)" }}
                    >
                      Samify
                    </span>
                  )}
                </div>
                <div className="text-ink-muted text-[10px]">{profile.department}</div>
              </div>
              <Icon
                name="chevronDown"
                size={11}
                className={`text-ink-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-[300px] hairline rounded bg-paper shadow-lg z-50 fade-up overflow-hidden">
                <div className="px-3 py-2.5 border-b border-line-soft bg-cream/40">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-0.5">
                    Inloggad som
                  </div>
                  <div className="text-[12.5px] font-medium">{profile.name}</div>
                  <div className="text-[10.5px] text-ink-muted font-mono">
                    {profile.email}
                  </div>
                </div>
                <div className="px-3 py-2 border-b border-line-soft">
                  <div className="font-mono text-[9.5px] uppercase tracking-wider text-ink-muted mb-2">
                    Växla roll (demo)
                  </div>
                  <div className="space-y-1">
                    {(Object.keys(ROLES) as ("konsult" | "vd" | "owner")[]).map((r) => {
                      const p = ROLES[r];
                      const active = r === role;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            setRole(r);
                            setMenuOpen(false);
                          }}
                          className={`w-full text-left flex items-center gap-2.5 px-2 py-1.5 -mx-1 rounded transition-colors ${
                            active ? "bg-cream-2" : "hover:bg-cream-2"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-medium ${
                              r === "vd"
                                ? "bg-purple-brand text-paper"
                                : r === "owner"
                                  ? "text-paper"
                                  : "bg-ink text-paper"
                            }`}
                            style={
                              r === "owner"
                                ? { background: "var(--samify-purple)" }
                                : {}
                            }
                          >
                            {p.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium flex items-center gap-1.5">
                              {p.name}
                              {r === "vd" && (
                                <span className="hairline-soft rounded px-1 py-px font-mono text-[8.5px] uppercase tracking-wider text-purple-brand">
                                  VD
                                </span>
                              )}
                              {r === "owner" && (
                                <span
                                  className="hairline-soft rounded px-1 py-px font-mono text-[8.5px] uppercase tracking-wider"
                                  style={{ color: "var(--samify-purple)" }}
                                >
                                  Samify
                                </span>
                              )}
                            </div>
                            <div className="text-[10.5px] text-ink-muted">
                              {p.title}
                            </div>
                          </div>
                          {active && (
                            <Icon
                              name="check"
                              size={12}
                              strokeWidth={2.5}
                              className="text-green-brand"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => {
                    demo("Användarinställningar");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[12px] text-ink-soft hover:bg-cream-2 flex items-center gap-2"
                >
                  <Icon name="edit" size={12} />
                  Inställningar
                </button>
                <button
                  onClick={() => demo("Logga ut")}
                  className="w-full text-left px-3 py-2 text-[12px] text-ink-soft hover:bg-cream-2 border-t border-line-soft flex items-center gap-2"
                >
                  <Icon name="external" size={12} />
                  Logga ut
                </button>
              </div>
            )}
          </div>
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
