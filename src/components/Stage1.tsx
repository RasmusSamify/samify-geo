import { useState } from "react";
import { Icon } from "./Icon";
import { PROJECT } from "../data/project";

type Props = { onAdvance: () => void };

export const Stage1 = ({ onAdvance }: Props) => {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="flex-1 main-scroll overflow-y-auto">
      <div className="max-w-[1080px] mx-auto px-10 py-10">
        <div className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">
            Steg 01 · Källdata
          </div>
          <h1 className="font-display text-[42px] leading-[1.05] font-medium mb-3">
            Initiera PM-process för
            <br />
            <span className="italic font-normal text-gold-deep">{PROJECT.name}</span>
          </h1>
          <p className="text-ink-soft text-[15px] max-w-[640px] leading-relaxed">
            Samify Geo läser in labbrapport, hämtar geologisk kontext från SGU,
            korsrefererar mot EBH-stödet och NV:s riktvärden — och syntetiserar
            resultaten till en PM-utkast enligt Geosyntecs interna mall.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-5 mb-10 pb-10 border-b border-line">
          <MetaField label="Projekt-ID" value={PROJECT.id} mono />
          <MetaField label="Ansvarig konsult" value={PROJECT.consultant} />
          <MetaField label="Beställare" value={PROJECT.client} />
          <MetaField label="Rapporttyp" value={PROJECT.reportType} />
          <MetaField label="Fastighet" value={PROJECT.fastighet} />
          <MetaField label="Kommun & län" value={PROJECT.location} />
          <MetaField
            label="Koordinater (SWEREF 99 TM)"
            value={`N ${PROJECT.coordinates.sweref_n} · E ${PROJECT.coordinates.sweref_e}`}
            mono
          />
          <MetaField label="Område" value={PROJECT.area} />
        </div>

        <div className="mb-8">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
            Labbrapport
          </div>
          {!uploaded ? (
            <button
              onClick={() => setUploaded(true)}
              className="w-full hairline rounded-md bg-paper py-10 px-8 flex flex-col items-center gap-3 hover:bg-cream-2 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-cream-2 flex items-center justify-center text-ink-muted group-hover:text-ink transition-colors">
                <Icon name="upload" size={20} />
              </div>
              <div className="text-center">
                <div className="text-[14px] font-medium mb-0.5">
                  Dra labbrapport hit eller klicka för att ladda upp
                </div>
                <div className="text-[12px] text-ink-muted">
                  PDF, XLSX, CSV · Eurofins, ALS, SYNLAB stöds direkt
                </div>
              </div>
            </button>
          ) : (
            <div className="fade-up hairline rounded-md bg-paper p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded bg-cream-2 flex items-center justify-center text-ink">
                <Icon name="file" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium">
                  Eurofins_EUSE-2026-009834_Lainas.pdf
                </div>
                <div className="text-[11.5px] text-ink-muted font-mono">
                  4.7 MB · 28 sidor · ackrediteringsnr 1125 · {PROJECT.sampleCount}{" "}
                  provpunkter
                </div>
              </div>
              <div className="hairline-soft rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-green-brand">
                Verifierad
              </div>
            </div>
          )}
        </div>

        <div className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
            Analysprocess
          </div>
          <div className="hairline-soft rounded-md bg-paper overflow-hidden">
            {[
              {
                i: 1,
                icon: "file",
                name: "Data Extraction Agent",
                desc: "OCR + tabellparser · extraherar provpunkter, mätvärden, metadata",
                tech: "claude-opus-4.7",
              },
              {
                i: 2,
                icon: "map",
                name: "Geological Context Agent",
                desc: "SGU WFS/WMS · jordart, berggrund, brunnsarkivet, grundvattenmagasin",
                tech: "SGU API + RAG",
              },
              {
                i: 3,
                icon: "archive",
                name: "Historical Context Agent",
                desc: "Länsstyrelsens EBH-stöd · historiska flygfoton · Lantmäteriet",
                tech: "EBH + Lantmäteriet",
              },
              {
                i: 4,
                icon: "scale",
                name: "Compliance Agent",
                desc: "NV 2009:1867 · KM/MKM/FA-gränser · hotspot-detektion",
                tech: "Rule engine",
              },
              {
                i: 5,
                icon: "edit",
                name: "Report Synthesis Agent",
                desc: "Genererar PM enligt Geosyntecs mall · refererar interna historiska PM",
                tech: "claude-opus-4.7 + RAG",
              },
            ].map((agent, idx) => (
              <div
                key={agent.i}
                className={`flex items-center gap-4 px-5 py-3.5 ${
                  idx > 0 ? "border-t border-line-soft" : ""
                }`}
              >
                <div className="font-mono text-[10px] text-ink-muted w-6">
                  {String(agent.i).padStart(2, "0")}
                </div>
                <div className="w-8 h-8 rounded bg-cream-2 flex items-center justify-center text-ink-soft">
                  <Icon name={agent.icon as never} size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{agent.name}</div>
                  <div className="text-[11.5px] text-ink-muted">{agent.desc}</div>
                </div>
                <div className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
                  {agent.tech}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-[12px] text-ink-muted">
            {uploaded ? (
              <>
                Allt är redo. Estimerad körtid:{" "}
                <span className="font-mono">~14 sekunder</span>.
              </>
            ) : (
              <>Ladda upp labbrapport för att fortsätta.</>
            )}
          </div>
          <button
            onClick={onAdvance}
            disabled={!uploaded}
            className={`btn-primary px-6 py-3 rounded text-[13px] font-medium flex items-center gap-2 ${
              !uploaded ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            Starta orkestrering
            <Icon name="zap" size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

const MetaField = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div>
    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1">
      {label}
    </div>
    <div className={`text-[14px] ${mono ? "font-mono" : ""}`}>{value}</div>
  </div>
);
