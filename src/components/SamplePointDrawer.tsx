import { useEffect } from "react";
import { Icon } from "./Icon";
import { useToast } from "./Toast";
import {
  classColors,
  classifyValue,
  LIMITS,
  SUBSTANCES,
  worstClassification,
} from "../data/project";
import type { SamplePoint } from "../data/project";

type Props = {
  point: SamplePoint | null;
  onClose: () => void;
};

export const SamplePointDrawer = ({ point, onClose }: Props) => {
  const { demo } = useToast();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!point) return null;

  const worst = worstClassification(point);
  const worstCol = classColors[worst];

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-panel">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-line-soft">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
              Provpunkt
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-[24px] font-semibold leading-none tracking-tight">
                {point.id}
              </h2>
              <span
                className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider hairline-soft"
                style={{ color: worstCol.text, background: worstCol.bg }}
              >
                {worstCol.label}
              </span>
              {point.hotspot && (
                <span className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-rust hairline-soft">
                  Hotspot
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost rounded-full w-9 h-9 flex items-center justify-center text-ink-muted hover:text-ink"
            aria-label="Stäng"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-line-soft">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <Field label="Djup" value={`${point.depth} m`} mono />
            <Field
              label="Koordinater"
              value={`${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`}
              mono
            />
            <Field
              label="Status"
              value={worstCol.label}
              valueClassName="font-mono"
              valueStyle={{ color: worstCol.text }}
            />
            <Field
              label="Klassificering"
              value={point.hotspot ? "Hotspot" : point.moderate ? "Måttlig" : "Bakgrund"}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto main-scroll px-6 py-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
            Mätvärden (mg/kg TS)
          </div>
          <div className="space-y-1">
            {SUBSTANCES.map((s) => {
              const v = point.measurements[s];
              const lim = LIMITS[s];
              const cls = classifyValue(v, lim);
              const col = classColors[cls];
              const overKm = v / lim.km;
              return (
                <div
                  key={s}
                  className="flex items-center gap-3 px-3 py-2.5 rounded hairline-soft"
                  style={{ background: cls !== "ok" ? col.bg : "transparent" }}
                >
                  <div className="font-mono text-[12px] w-8 font-medium">{s}</div>
                  <div
                    className="font-mono text-[14px] flex-shrink-0 w-20 text-right"
                    style={{ color: col.text }}
                  >
                    {v}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                      <span>0</span>
                      <span>KM {lim.km}</span>
                      <span>MKM {lim.mkm}</span>
                    </div>
                    <div className="relative h-1.5 bg-cream rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: `${Math.min(100, (v / lim.mkm) * 100)}%`,
                          background: col.dot,
                        }}
                      />
                      <div
                        className="absolute inset-y-0 w-px bg-ink-muted/50"
                        style={{ left: `${(lim.km / lim.mkm) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div
                    className="font-mono text-[10px] uppercase tracking-wider w-14 text-right"
                    style={{ color: col.text }}
                  >
                    {cls === "ok"
                      ? `${overKm.toFixed(2)}×`
                      : `${overKm.toFixed(1)}× KM`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-line-soft px-6 py-4 flex items-center gap-2">
          <button
            onClick={() => demo(`Trendanalys · ${point.id}`)}
            className="btn-ghost hairline-soft flex-1 py-2 rounded text-[12px] flex items-center justify-center gap-2"
          >
            <Icon name="chart" size={12} className="text-gold" />
            Trendanalys
          </button>
          <button
            onClick={() => demo(`Öppna ${point.id} i kartvy`)}
            className="btn-accent flex-1 py-2 rounded text-[12px] flex items-center justify-center gap-2"
          >
            <Icon name="external" size={12} strokeWidth={2} />
            Öppna i karta
          </button>
        </div>
      </div>
    </>
  );
};

const Field = ({
  label,
  value,
  mono,
  valueClassName,
  valueStyle,
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClassName?: string;
  valueStyle?: React.CSSProperties;
}) => (
  <div>
    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
      {label}
    </div>
    <div
      className={`text-[13px] ${mono ? "font-mono" : ""} ${valueClassName ?? ""}`}
      style={valueStyle}
    >
      {value}
    </div>
  </div>
);
