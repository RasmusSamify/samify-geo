import { useState } from "react";
import { Icon } from "./Icon";
import { PROJECT } from "../data/project";
import { useToast } from "./Toast";

type Props = { onAdvance: () => void };

const AGENTS_PREVIEW = [
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
];

export const Stage1 = ({ onAdvance }: Props) => {
  const [uploaded, setUploaded] = useState(false);
  const { toast, demo } = useToast();

  return (
    <div className="flex-1 main-scroll overflow-y-auto">
      <div className="max-w-[1080px] mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">
            Steg 01 · Källdata
          </div>
          <h1 className="font-display text-[26px] leading-[1.15] font-semibold mb-2 tracking-tight">
            {PROJECT.name}
          </h1>
          <p className="text-ink-soft text-[13.5px] max-w-[680px] leading-relaxed">
            Läser in labbrapport, hämtar geologisk kontext från SGU, korsrefererar mot
            EBH-stödet och NV:s riktvärden — och syntetiserar resultaten till
            PM-utkast enligt Geosyntecs interna mall.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-8 pb-8 border-b border-line">
          <MetaField
            label="Projekt-ID"
            value={PROJECT.id}
            mono
            onClick={() => demo(`Projekt ${PROJECT.id}`)}
          />
          <MetaField
            label="Ansvarig konsult"
            value={PROJECT.consultant}
            onClick={() => demo(`Profil · ${PROJECT.consultant}`)}
          />
          <MetaField
            label="Beställare"
            value={PROJECT.client}
            onClick={() => demo(`Beställare · ${PROJECT.client}`)}
          />
          <MetaField
            label="Rapporttyp"
            value={PROJECT.reportType}
            onClick={() => demo("Välj rapporttyp")}
          />
          <MetaField
            label="Fastighet"
            value={PROJECT.fastighet}
            onClick={() => demo(`Fastighetsinfo · ${PROJECT.fastighet}`)}
          />
          <MetaField
            label="Kommun & län"
            value={PROJECT.location}
            onClick={() => demo("Öppna i karta")}
          />
          <MetaField
            label="Koordinater (SWEREF 99 TM)"
            value={`N ${PROJECT.coordinates.sweref_n} · E ${PROJECT.coordinates.sweref_e}`}
            mono
            onClick={() =>
              toast("Koordinater kopierade", {
                detail: `N ${PROJECT.coordinates.sweref_n} · E ${PROJECT.coordinates.sweref_e}`,
                kind: "success",
              })
            }
          />
          <MetaField
            label="Område"
            value={PROJECT.area}
            onClick={() => demo("Områdesavgränsning")}
          />
        </div>

        <div className="mb-8">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">
            Labbrapport
          </div>
          {!uploaded ? (
            <button
              onClick={() => {
                setUploaded(true);
                toast("Labbrapport uppladdad", {
                  detail: "Eurofins EUSE-2026-009834 · ackrediteringsnr 1125",
                  kind: "success",
                });
              }}
              className="w-full hairline rounded bg-paper py-7 px-6 flex flex-col items-center gap-2 hover:bg-cream transition-colors group"
            >
              <div className="w-10 h-10 rounded bg-cream-2 flex items-center justify-center text-ink-muted group-hover:text-ink transition-colors">
                <Icon name="upload" size={18} />
              </div>
              <div className="text-center">
                <div className="text-[13.5px] font-medium mb-0.5">
                  Dra labbrapport hit eller klicka för att ladda upp
                </div>
                <div className="text-[11.5px] text-ink-muted">
                  PDF, XLSX, CSV · Eurofins, ALS, SYNLAB stöds direkt
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => demo("Förhandsgranska labbrapport")}
              className="w-full fade-up hairline rounded bg-paper p-4 flex items-center gap-3 hover:bg-cream transition-colors text-left"
            >
              <div className="w-9 h-9 rounded bg-cream-2 flex items-center justify-center text-ink">
                <Icon name="file" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium">
                  Eurofins_EUSE-2026-009834_Lainas.pdf
                </div>
                <div className="text-[11px] text-ink-muted font-mono">
                  4.7 MB · 28 sidor · ackrediteringsnr 1125 · {PROJECT.sampleCount}{" "}
                  provpunkter
                </div>
              </div>
              <div className="hairline-soft rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-green-brand">
                Verifierad
              </div>
            </button>
          )}
        </div>

        <div className="mb-8">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">
            Analysprocess
          </div>
          <div className="hairline-soft rounded bg-paper overflow-hidden">
            {AGENTS_PREVIEW.map((agent, idx) => (
              <button
                key={agent.i}
                onClick={() =>
                  toast(agent.name, {
                    detail: `${agent.desc} · ${agent.tech}`,
                    kind: "info",
                  })
                }
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-cream-2 transition-colors ${
                  idx > 0 ? "border-t border-line-soft" : ""
                }`}
              >
                <div className="font-mono text-[10px] text-ink-muted w-5">
                  {String(agent.i).padStart(2, "0")}
                </div>
                <div className="w-7 h-7 rounded bg-cream-2 flex items-center justify-center text-ink-soft">
                  <Icon name={agent.icon as never} size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium">{agent.name}</div>
                  <div className="text-[11px] text-ink-muted">{agent.desc}</div>
                </div>
                <div className="font-mono text-[10px] text-ink-muted">{agent.tech}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[11.5px] text-ink-muted">
            {uploaded ? (
              <>
                Klart att starta. Estimerad körtid:{" "}
                <span className="font-mono">~14 sekunder</span>.
              </>
            ) : (
              <>Ladda upp labbrapport för att fortsätta.</>
            )}
          </div>
          <button
            onClick={onAdvance}
            disabled={!uploaded}
            className={`btn-accent px-5 py-2 rounded text-[12.5px] font-medium flex items-center gap-1.5 ${
              !uploaded ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            Starta analys
            <Icon name="chevronRight" size={13} strokeWidth={2} />
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
  onClick,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-left -mx-2 px-2 py-1 rounded hover:bg-cream-2 transition-colors"
  >
    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-0.5">
      {label}
    </div>
    <div className={`text-[13px] ${mono ? "font-mono" : ""}`}>{value}</div>
  </button>
);
