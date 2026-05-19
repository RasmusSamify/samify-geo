import { useEffect, useRef, useState } from "react";
import { AGENTS } from "../data/agents";
import type { Agent } from "../data/agents";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

type Props = {
  onAgentsComplete: () => void;
  onProceed: () => void;
  speed: number;
  setSpeed: (s: number) => void;
};

export const Stage2 = ({ onAgentsComplete, onProceed, speed, setSpeed }: Props) => {
  const [elapsed, setElapsed] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const baseElapsedRef = useRef(0);
  const skipRef = useRef(false);

  const totalDuration = Math.max(...AGENTS.map((a) => a.delay + a.duration));

  useEffect(() => {
    skipRef.current = false;
    startTimeRef.current = performance.now();
    baseElapsedRef.current = elapsed;

    const tick = (now: number) => {
      if (skipRef.current) return;
      const dt = (now - (startTimeRef.current ?? now)) * speed;
      const e = baseElapsedRef.current + dt;
      if (e >= totalDuration + 200) {
        setElapsed(totalDuration + 200);
        setAllDone(true);
        return;
      }
      setElapsed(e);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  useEffect(() => {
    if (allDone) onAgentsComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  const handleSkip = () => {
    skipRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setElapsed(totalDuration + 200);
    setAllDone(true);
  };

  const overallProgress = Math.min(100, (elapsed / totalDuration) * 100);
  const agentsClear = AGENTS.filter((a) => elapsed >= a.delay + a.duration).length;

  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[1280px] mx-auto px-10 py-8">
        <div className="mb-7">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
                Steg 02 · Orkestrering
              </div>
              <h1 className="font-display text-[22px] leading-tight font-semibold tracking-tight">
                Analys pågår
              </h1>
            </div>
            <div className="flex items-start gap-5">
              <SpeedControl
                speed={speed}
                setSpeed={setSpeed}
                onSkip={handleSkip}
                disabled={allDone}
              />
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-0.5">
                  Förfluten tid
                </div>
                <div className="font-mono text-[18px] tabular-nums font-medium">
                  {(elapsed / 1000).toFixed(1)}
                  <span className="text-ink-muted text-[12px]">s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 hairline-soft rounded-full h-1.5 bg-paper overflow-hidden">
            <div
              className="h-full bg-ink transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-ink-muted">
            <div>
              {agentsClear} / {AGENTS.length} agenter klara
            </div>
            <div>{Math.round(overallProgress)}%</div>
          </div>
        </div>

        <div className="space-y-3">
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} elapsed={elapsed} index={i} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <div className="flex items-center gap-3 text-[12px] text-ink-muted">
            {allDone ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-brand" />
                <span>Alla agenter klara. Rapportutkast tillgängligt för granskning.</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-brand pulse-soft" />
                <span>
                  Orkestrering pågår... agenterna kör parallellt och delar data via state
                  graph.
                </span>
              </>
            )}
          </div>
          {allDone && (
            <button
              onClick={onProceed}
              className="btn-accent px-5 py-2 rounded text-[12.5px] font-medium flex items-center gap-1.5 fade-up"
            >
              Granska rapport
              <Icon name="chevronRight" size={13} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SpeedControl = ({
  speed,
  setSpeed,
  onSkip,
  disabled,
}: {
  speed: number;
  setSpeed: (s: number) => void;
  onSkip: () => void;
  disabled: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div className="hairline-soft rounded bg-paper p-0.5 flex items-center">
      {[1, 2, 4].map((s) => (
        <button
          key={s}
          onClick={() => setSpeed(s)}
          disabled={disabled}
          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
            speed === s
              ? "bg-ink text-paper"
              : "text-ink-muted hover:text-ink disabled:opacity-50"
          }`}
        >
          {s}×
        </button>
      ))}
    </div>
    <button
      onClick={onSkip}
      disabled={disabled}
      className="btn-ghost hairline-soft px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider text-ink-muted flex items-center gap-1.5 disabled:opacity-50"
    >
      <Icon name="skip" size={11} />
      Hoppa över
    </button>
  </div>
);

const AgentCard = ({
  agent,
  elapsed,
  index,
}: {
  agent: Agent;
  elapsed: number;
  index: number;
}) => {
  const { toast } = useToast();
  const localElapsed = elapsed - agent.delay;
  const progress = Math.max(0, Math.min(100, (localElapsed / agent.duration) * 100));
  const status: "waiting" | "running" | "done" =
    localElapsed < 0
      ? "waiting"
      : localElapsed >= agent.duration
        ? "done"
        : "running";
  const visibleLogs = agent.logs.filter((l) => l.t <= localElapsed);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [visibleLogs.length]);

  const statusBadge = {
    waiting: { label: "Köad", classes: "text-ink-muted hairline-soft" },
    running: {
      label: "Kör",
      classes: "text-amber-brand diag-stripe hairline-soft pulse-soft",
    },
    done: { label: "Klar", classes: "text-green-brand bg-paper hairline-soft" },
  }[status];

  return (
    <div
      className={`hairline rounded bg-paper overflow-hidden transition-opacity ${
        status === "waiting" ? "opacity-55" : ""
      }`}
    >
      <div className="grid grid-cols-[1fr_300px]">
        <div className="p-4 border-r border-line-soft">
          <button
            onClick={() =>
              toast(agent.name, {
                detail: `${agent.purpose} · ${agent.tech}`,
                kind: "info",
              })
            }
            className="w-full text-left flex items-start gap-2.5 mb-2.5 -m-1 p-1 rounded hover:bg-cream-2 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded flex items-center justify-center ${
                status === "running"
                  ? "bg-ink text-paper"
                  : status === "done"
                    ? "bg-green-brand text-paper"
                    : "bg-cream-2 text-ink-muted"
              }`}
            >
              <Icon name={agent.icon as never} size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-0.5">
                <span className="font-mono text-[10px] text-ink-muted">
                  A{String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[15px] font-medium leading-none">{agent.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${statusBadge.classes}`}
                >
                  {statusBadge.label}
                </span>
              </div>
              <div className="text-[12px] text-ink-muted">{agent.purpose}</div>
            </div>
            <div className="text-right font-mono text-[10px] text-ink-muted">
              <div className="uppercase tracking-wider mb-0.5">Runtime</div>
              <div className="tabular-nums">
                {status === "waiting"
                  ? "—"
                  : `${Math.min(localElapsed, agent.duration).toFixed(0)} ms`}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1.5 mb-3">
            <Icon name="cpu" size={11} className="text-ink-muted" />
            <span className="font-mono text-[10.5px] text-ink-muted">{agent.tech}</span>
          </div>

          <div className="mb-3 hairline-soft rounded-full h-1 bg-cream overflow-hidden">
            <div
              className={`h-full transition-all ${
                status === "done" ? "bg-green-brand" : "bg-ink"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            ref={logContainerRef}
            className="bg-ink rounded p-3 h-[160px] overflow-y-auto log-scroll"
          >
            {visibleLogs.map((log, i) => (
              <div
                key={i}
                className={`log-line fade-up ${
                  log.success
                    ? "text-green-400"
                    : log.muted
                      ? "text-stone-500"
                      : "text-stone-200"
                }`}
              >
                {log.line}
              </div>
            ))}
            {status === "running" && (
              <div className="log-line text-stone-400">
                <span className="blink">▊</span>
              </div>
            )}
            {status === "waiting" && (
              <div className="log-line text-stone-600 italic">
                väntar på fas {index}...
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-cream/60">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2.5">
            Utdata
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {agent.outputs.map((o, i) => (
              <button
                key={i}
                onClick={() =>
                  toast(`${o.label}: ${o.value}`, {
                    detail: `Beräknat av ${agent.name}`,
                    kind: "info",
                  })
                }
                disabled={status === "waiting"}
                className={`text-left -m-1 p-1 rounded hover:bg-paper transition-colors ${
                  status === "waiting" ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <div className="font-mono text-[9.5px] uppercase tracking-wider text-ink-muted mb-0.5">
                  {o.label}
                </div>
                <div
                  className={`text-[18px] font-semibold leading-tight tracking-tight ${
                    status === "done"
                      ? "text-ink"
                      : status === "running"
                        ? "text-ink shimmer"
                        : "text-ink-muted"
                  }`}
                >
                  {status === "waiting" ? "—" : o.value}
                </div>
              </button>
            ))}
          </div>

          {status === "done" && (
            <div className="fade-up mt-3 pt-2.5 border-t border-line-soft">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-ink-muted uppercase tracking-wider text-[9.5px]">
                  Konfidens
                </span>
                <span className="font-mono text-green-brand font-medium">
                  0.{91 + index}
                  {4 + index}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
