import { useMemo, useState } from "react";
import {
  classColors,
  classifyValue,
  LIMITS,
  SAMPLE_POINTS,
  SUBSTANCES,
  worstClassification,
} from "../../data/project";
import type { SamplePoint, Substance } from "../../data/project";
import { SamplePointDrawer } from "../SamplePointDrawer";

const displaySubstances: Substance[] = ["Pb", "As", "Cd", "Zn", "Cu", "Cr"];

type Filter = "all" | "hotspot" | "over_km" | "over_mkm";

export const SamplesTab = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<SamplePoint | null>(null);

  const filteredPoints = useMemo(() => {
    let pts = [...SAMPLE_POINTS];
    if (filter === "hotspot") pts = pts.filter((p) => p.hotspot);
    if (filter === "over_km") {
      pts = pts.filter((p) =>
        SUBSTANCES.some((s) =>
          ["km", "mkm", "fa"].includes(classifyValue(p.measurements[s], LIMITS[s])),
        ),
      );
    }
    if (filter === "over_mkm") {
      pts = pts.filter((p) =>
        SUBSTANCES.some((s) =>
          ["mkm", "fa"].includes(classifyValue(p.measurements[s], LIMITS[s])),
        ),
      );
    }
    return pts;
  }, [filter]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: `Alla (${SAMPLE_POINTS.length})` },
    { id: "hotspot", label: "Hotspots" },
    { id: "over_km", label: "Över KM" },
    { id: "over_mkm", label: "Över MKM" },
  ];

  return (
    <div>
      <div className="hairline-soft rounded-md bg-paper p-3 mb-5 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mr-2 ml-1">
          Filter
        </span>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded text-[12px] ${
              filter === f.id ? "bg-ink text-paper" : "hover:bg-cream-2 text-ink-soft"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto text-[11.5px] text-ink-muted font-mono">
          {filteredPoints.length} av {SAMPLE_POINTS.length} punkter
        </div>
      </div>

      <div className="hairline rounded-md bg-paper overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Djup (m)</th>
              {displaySubstances.map((s) => (
                <th key={s} className="text-right">
                  <div>{s}</div>
                  <div className="text-[8.5px] normal-case opacity-70">mg/kg TS</div>
                </th>
              ))}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPoints.map((pt) => {
              const worst = worstClassification(pt);
              return (
                <tr
                  key={pt.id}
                  onClick={() => setSelected(pt)}
                  className={`cursor-pointer ${selected?.id === pt.id ? "selected" : ""}`}
                >
                  <td>
                    <span className="font-mono font-medium">{pt.id}</span>
                    {pt.hotspot && (
                      <span className="ml-2 hairline-soft rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-rust">
                        hotspot
                      </span>
                    )}
                  </td>
                  <td className="font-mono text-[12px] text-ink-soft">{pt.depth}</td>
                  {displaySubstances.map((s) => {
                    const cls = classifyValue(pt.measurements[s], LIMITS[s]);
                    const col = classColors[cls];
                    return (
                      <td
                        key={s}
                        className="text-right font-mono text-[12px]"
                        style={{
                          color: col.text,
                          background: cls !== "ok" ? col.bg : "transparent",
                        }}
                      >
                        {pt.measurements[s]}
                      </td>
                    );
                  })}
                  <td>
                    <span
                      className="hairline-soft rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider"
                      style={{
                        color: classColors[worst].text,
                        background: classColors[worst].bg,
                      }}
                    >
                      {classColors[worst].label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 hairline-soft rounded-md bg-paper p-4 grid grid-cols-7 gap-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted col-span-1">
          Riktvärden
          <br />
          NV 2009:1867
        </div>
        {displaySubstances.map((s) => (
          <div key={s}>
            <div className="font-mono text-[11px] font-medium mb-1">{s}</div>
            <div className="text-[10.5px] font-mono space-y-0.5">
              <div className="text-green-brand">KM &lt; {LIMITS[s].km}</div>
              <div className="text-amber-brand">MKM &lt; {LIMITS[s].mkm}</div>
              <div className="text-rust">FA &lt; {LIMITS[s].fa}</div>
            </div>
          </div>
        ))}
      </div>

      <SamplePointDrawer point={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
