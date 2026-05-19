import { useState } from "react";
import { Icon } from "../Icon";
import { SampleMap } from "../SampleMap";
import { SamplePointDrawer } from "../SamplePointDrawer";
import type { SamplePoint } from "../../data/project";
import { useToast } from "../Toast";
import { useDemoState } from "../../hooks/useDemoState";

export const OverviewTab = () => {
  const [selected, setSelected] = useState<SamplePoint | null>(null);
  const { setTab } = useDemoState();
  const { demo, toast } = useToast();
  const totalMeasurements = 564;
  const breakdown = { ok: 387, km: 142, mkm: 31, fa: 4 };

  return (
    <div className="grid grid-cols-3 gap-6">
      <KpiCard
        label="Provpunkter"
        value="47"
        sub="varav 18 visualiserade"
        onClick={() => setTab("samples")}
      />
      <KpiCard
        label="Mätvärden över MKM"
        value="35"
        sub="5.5% av totalt 564"
        warn
        onClick={() =>
          toast("Filtrerar provpunkter över MKM", {
            detail: "Hoppar till Provpunkter-fliken",
            kind: "info",
          })
        }
      />
      <KpiCard
        label="Identifierade hotspots"
        value="3"
        sub="B04 · B09 · B13"
        warn
        onClick={() => setTab("samples")}
      />

      <div className="col-span-2 hairline rounded bg-paper overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line-soft">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Karta
            </div>
            <div className="text-[13px] font-medium">
              Provpunkter med klassificering — klicka för detaljer
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10.5px] font-mono">
            <LegendDot color="#2D5F3F" label="< KM" />
            <LegendDot color="#B8945F" label="> KM" />
            <LegendDot color="#B8845F" label="> MKM" />
            <LegendDot color="#8B3A3A" label="> FA" />
          </div>
        </div>
        <SampleMap selectedId={selected?.id} onSelect={setSelected} />
      </div>

      <div className="hairline rounded bg-paper">
        <div className="px-4 py-2.5 border-b border-line-soft flex items-center gap-2">
          <Icon name="cpu" size={12} className="text-gold" />
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            AI-tolkning
          </div>
        </div>
        <div className="p-5 text-[13.5px] leading-[1.65] text-ink-soft">
          <p className="mb-3">
            Undersökningsområdet vid <strong className="text-ink">Norra Lainas</strong>{" "}
            uppvisar förhöjda halter av{" "}
            <strong className="text-ink">bly, arsenik och kadmium</strong> i centrala
            delar, sannolikt kopplade till det historiska anrikningsverket (1947–1991,
            MIFO klass 2).
          </p>
          <p className="mb-3">
            Tre tydliga hotspots — <span className="font-mono">B04</span>,{" "}
            <span className="font-mono">B09</span> och{" "}
            <span className="font-mono">B13</span> — ligger inom 80 m radie från den
            tidigare slamdammen och överskrider MKM med faktor 1.8–3.2.
          </p>
          <p className="mb-3">
            Givet dominerande jordart (sandig morän) och grundvattennivå (4–7 m u.my)
            bedöms spridningsrisk till närmaste vattendrag som{" "}
            <strong className="text-ink">måttlig</strong>.
          </p>
          <div className="mt-4 pt-3 border-t border-line-soft text-[11px] text-ink-muted font-mono">
            Källor: Stage 02 · Compliance + Historical Context Agents
          </div>
        </div>
      </div>

      <div className="col-span-2 hairline rounded bg-paper">
        <div className="px-5 py-3 border-b border-line-soft">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Fördelning
          </div>
          <div className="text-[13px] font-medium">
            Klassificering av {totalMeasurements} mätvärden
          </div>
        </div>
        <div className="p-5">
          <DistributionBar breakdown={breakdown} total={totalMeasurements} />
          <div className="grid grid-cols-4 gap-4 mt-5">
            <DistributionItem
              color="#2D5F3F"
              label="Under KM"
              value={breakdown.ok}
              total={totalMeasurements}
            />
            <DistributionItem
              color="#B8945F"
              label="KM → MKM"
              value={breakdown.km}
              total={totalMeasurements}
            />
            <DistributionItem
              color="#B8845F"
              label="Över MKM"
              value={breakdown.mkm}
              total={totalMeasurements}
            />
            <DistributionItem
              color="#8B3A3A"
              label="Över FA"
              value={breakdown.fa}
              total={totalMeasurements}
            />
          </div>
        </div>
      </div>

      <div className="hairline rounded bg-paper">
        <div className="px-5 py-3 border-b border-line-soft">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Källspårning
          </div>
          <div className="text-[13px] font-medium">Datakällor & versioner</div>
        </div>
        <div className="p-5 space-y-1 text-[11.5px]">
          <SourceRow
            icon="file"
            label="Eurofins EUSE-2026-009834"
            sub="ack.nr 1125 · 2026-04-30"
            onClick={() => demo("Öppna labbrapport")}
          />
          <SourceRow
            icon="map"
            label="SGU jordartskartan 1:25 000"
            sub="version 2026-02-14"
            onClick={() => demo("Öppna SGU jordartskartan")}
          />
          <SourceRow
            icon="map"
            label="SGU berggrundskartan 1:50 000"
            sub="version 2025-11-08"
            onClick={() => demo("Öppna SGU berggrundskartan")}
          />
          <SourceRow
            icon="archive"
            label="EBH-stödet · Norrbotten"
            sub="hämtad 2026-05-19"
            onClick={() => demo("Öppna EBH-stödet")}
          />
          <SourceRow
            icon="scale"
            label="NV 2009:1867 riktvärden"
            sub="senaste revision 2016-09-30"
            onClick={() => demo("Öppna NV-riktvärden")}
          />
          <SourceRow
            icon="database"
            label="Geosyntec interna PM"
            sub="12 referenser · pgvector"
            onClick={() => demo("Visa RAG-träffar")}
          />
        </div>
      </div>

      <SamplePointDrawer point={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

const KpiCard = ({
  label,
  value,
  sub,
  warn,
  onClick,
}: {
  label: string;
  value: string;
  sub: string;
  warn?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="hairline rounded bg-paper px-4 py-3.5 text-left hover:bg-cream transition-colors"
  >
    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
      {label}
    </div>
    <div
      className={`text-[28px] font-semibold leading-none tracking-tight ${
        warn ? "text-rust" : "text-ink"
      }`}
    >
      {value}
    </div>
    <div className="text-[11px] text-ink-muted mt-1.5">{sub}</div>
  </button>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
    <span className="text-ink-muted">{label}</span>
  </div>
);

const DistributionBar = ({
  breakdown,
  total,
}: {
  breakdown: { ok: number; km: number; mkm: number; fa: number };
  total: number;
}) => {
  const segments = [
    { key: "ok", color: "#2D5F3F", value: breakdown.ok },
    { key: "km", color: "#B8945F", value: breakdown.km },
    { key: "mkm", color: "#B8845F", value: breakdown.mkm },
    { key: "fa", color: "#8B3A3A", value: breakdown.fa },
  ];
  return (
    <div className="flex h-3 rounded-full overflow-hidden hairline-soft">
      {segments.map((s) => (
        <div
          key={s.key}
          style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
          title={`${s.value} mätvärden`}
        />
      ))}
    </div>
  );
};

const DistributionItem = ({
  color,
  label,
  value,
  total,
}: {
  color: string;
  label: string;
  value: number;
  total: number;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
        {label}
      </span>
    </div>
    <div className="text-[20px] font-semibold leading-none tracking-tight">
      {value}
    </div>
    <div className="text-[10.5px] text-ink-muted mt-1 font-mono">
      {((value / total) * 100).toFixed(1)}%
    </div>
  </div>
);

const SourceRow = ({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: "file" | "map" | "archive" | "scale" | "database";
  label: string;
  sub: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-start gap-2.5 text-left -mx-1.5 px-1.5 py-1 rounded hover:bg-cream-2 transition-colors"
  >
    <div className="w-6 h-6 rounded bg-cream-2 flex items-center justify-center text-ink-muted flex-shrink-0 mt-0.5">
      <Icon name={icon} size={11} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[12px] text-ink truncate">{label}</div>
      <div className="text-[10.5px] text-ink-muted font-mono">{sub}</div>
    </div>
  </button>
);
