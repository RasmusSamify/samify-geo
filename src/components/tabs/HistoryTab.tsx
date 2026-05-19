import { useState } from "react";
import { Icon } from "../Icon";
import { useToast } from "../Toast";

type EBHEntry = {
  year: string;
  name: string;
  branch: string;
  mifo: number;
  note: string;
  extra: string[];
};

const ebh: EBHEntry[] = [
  {
    year: "1947–1991",
    name: "Anrikningsverk Lainas",
    branch: "Gruvverksamhet",
    mifo: 2,
    note: "Bedömd som potentiellt förorenad. Avfallshantering ej dokumenterad innan 1970.",
    extra: [
      "Verksamhetsperiod: 44 år",
      "Beräknad mängd processat material: 12,4 miljoner ton",
      "Kommunalt beslut om nedläggning: 1991-06-14",
      "Senast inventerad: 2017 (MIFO fas 2)",
    ],
  },
  {
    year: "1953–1988",
    name: "Slamdamm söder",
    branch: "Avfallshantering",
    mifo: 1,
    note: "Identifierad som primärkälla. Inläckage till grundvatten misstänks.",
    extra: [
      "Yta vid stängning: ~2,1 ha",
      "Deponerat material: process- och rejektslam",
      "Stängning utan täckning: 1988",
      "Bedömd primärkälla för B04, B09, B13",
    ],
  },
  {
    year: "1962–1979",
    name: "Verkstadsindustri",
    branch: "Metallbearbetning",
    mifo: 3,
    note: "Mindre verksamhet. Avgränsad till nordlig fastighetsdel.",
    extra: [
      "Yta: ~0,3 ha",
      "Verksamhet: reparation & svetsning av gruvutrustning",
      "Lågt riskvärde — utanför hotspot-områden",
    ],
  },
];

const timelineEvents = [
  { year: 1947, label: "Anrikningsverk öppnar" },
  { year: 1953, label: "Slamdamm anläggs" },
  { year: 1962, label: "Verkstad etableras" },
  { year: 1979, label: "Verkstad upphör" },
  { year: 1988, label: "Slamdamm stängs" },
  { year: 1991, label: "Anrikningsverk stängs" },
  { year: 2017, label: "MIFO fas 2 genomförd" },
  { year: 2026, label: "Provtagning", current: true },
];

export const HistoryTab = () => {
  const { demo, toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [photoYear, setPhotoYear] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="hairline rounded bg-paper">
            <div className="px-5 py-3 border-b border-line-soft">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Länsstyrelsen Norrbotten · EBH-stödet
              </div>
              <div className="text-[13px] font-medium">
                Identifierad verksamhetshistorik
              </div>
            </div>
            <div className="divide-y divide-line-soft">
              {ebh.map((e) => {
                const open = expanded === e.name;
                return (
                  <div key={e.name}>
                    <button
                      onClick={() => setExpanded(open ? null : e.name)}
                      className="w-full text-left p-4 hover:bg-cream-2 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-medium flex items-center gap-2">
                            <Icon
                              name="chevronRight"
                              size={11}
                              className={`text-ink-muted transition-transform ${
                                open ? "rotate-90" : ""
                              }`}
                              strokeWidth={2}
                            />
                            {e.name}
                          </div>
                          <div className="text-[11px] text-ink-muted font-mono mt-0.5 ml-[19px]">
                            {e.year} · {e.branch}
                          </div>
                        </div>
                        <div
                          className={`hairline-soft rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                            e.mifo === 1
                              ? "text-rust"
                              : e.mifo === 2
                                ? "text-amber-brand"
                                : "text-ink-muted"
                          }`}
                        >
                          MIFO {e.mifo}
                        </div>
                      </div>
                      <div className="text-[12px] text-ink-soft ml-[19px]">{e.note}</div>
                    </button>
                    {open && (
                      <div className="fade-up px-4 pb-4 ml-[19px]">
                        <div className="hairline-soft rounded bg-cream-2/40 p-3 space-y-1.5">
                          {e.extra.map((line, i) => (
                            <div
                              key={i}
                              className="text-[11.5px] text-ink-soft flex items-start gap-2"
                            >
                              <span className="text-ink-muted font-mono text-[10px] mt-0.5">
                                •
                              </span>
                              {line}
                            </div>
                          ))}
                          <button
                            onClick={() => demo(`Öppna EBH-objekt · ${e.name}`)}
                            className="mt-2 text-[11.5px] text-gold font-medium hover:underline flex items-center gap-1"
                          >
                            <Icon name="external" size={10} />
                            Öppna i EBH-stödet
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="hairline rounded bg-paper p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
              Tidslinje · verksamhet
            </div>
            <div className="relative pl-4 space-y-1">
              <div className="absolute left-1 top-1.5 bottom-1.5 w-px bg-line" />
              {timelineEvents.map((e) => (
                <button
                  key={e.year}
                  onClick={() =>
                    toast(`${e.year} · ${e.label}`, {
                      detail: e.current
                        ? "Pågående föroreningsundersökning"
                        : "Klicka för att se händelsens betydelse",
                      kind: "info",
                    })
                  }
                  className="relative w-full flex items-baseline gap-3 text-[12px] -mx-1 px-1 py-0.5 rounded hover:bg-cream-2 transition-colors text-left"
                >
                  <div
                    className={`absolute -left-3 top-2 w-2 h-2 rounded-full ${
                      e.current ? "bg-purple-brand" : "bg-ink-muted"
                    }`}
                  />
                  <span
                    className={`font-mono ${
                      e.current ? "text-purple-brand font-medium" : "text-ink-muted"
                    }`}
                  >
                    {e.year}
                  </span>
                  <span className={e.current ? "text-ink font-medium" : "text-ink-soft"}>
                    {e.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline rounded bg-paper p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
              Historiska flygfoton
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[1962, 1975, 1988, 2001].map((year) => (
                <button
                  key={year}
                  onClick={() => setPhotoYear(year)}
                  className="aspect-square bg-cream-2 rounded relative overflow-hidden hairline-soft flex items-end p-2 hover:ring-2 hover:ring-gold transition-all"
                >
                  <div className="font-mono text-[10px] text-paper bg-ink rounded px-1.5 py-0.5 z-10">
                    {year}
                  </div>
                  <svg className="absolute inset-0 opacity-60" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="#8B7A55" />
                    <path
                      d={`M 0 ${30 + (year % 10)} Q 50 ${40 + (year % 5)} 100 ${35 + (year % 8)} L 100 100 L 0 100 Z`}
                      fill="#5A4F35"
                    />
                    <circle cx="50" cy="50" r={(year % 10) + 4} fill="#3D3528" />
                  </svg>
                </button>
              ))}
            </div>
            <button
              onClick={() => demo("Öppna Lantmäteriets historiska kartor")}
              className="mt-3 w-full text-[11.5px] text-ink-muted hover:text-ink flex items-center justify-center gap-1.5 py-2"
            >
              <Icon name="external" size={11} />
              Öppna i Lantmäteriets historiska kartor
            </button>
          </div>
        </div>
      </div>

      {photoYear !== null && (
        <PhotoModal year={photoYear} onClose={() => setPhotoYear(null)} />
      )}
    </>
  );
};

const PhotoModal = ({ year, onClose }: { year: number; onClose: () => void }) => (
  <>
    <div className="drawer-overlay" onClick={onClose} />
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-paper rounded-lg hairline overflow-hidden fade-up"
      style={{ width: 560, maxWidth: "92vw" }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-line-soft">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Historiskt flygfoto · Lantmäteriet
          </div>
          <div className="text-[15px] font-semibold tracking-tight mt-0.5">
            Lainas 1:14 · {year}
          </div>
        </div>
        <button
          onClick={onClose}
          className="btn-ghost rounded-full w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
      <div className="p-5">
        <div className="aspect-[4/3] bg-cream-2 rounded relative overflow-hidden hairline-soft">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <rect width="400" height="300" fill="#8B7A55" />
            <path
              d={`M 0 ${100 + (year % 20)} Q 200 ${130 + (year % 10)} 400 ${110 + (year % 15)} L 400 300 L 0 300 Z`}
              fill="#5A4F35"
            />
            <circle cx="200" cy="150" r={(year % 10) + 14} fill="#3D3528" />
            <rect
              x={80 + (year % 30)}
              y={130}
              width="40"
              height="20"
              fill="#1A1814"
              opacity="0.7"
            />
            <path
              d="M 0 240 Q 100 235 200 245 Q 300 250 400 240"
              fill="none"
              stroke="#7AA5B8"
              strokeWidth="2"
              opacity="0.7"
            />
            <text
              x="380"
              y="290"
              fontSize="8"
              fontFamily="IBM Plex Mono"
              fill="#F5F1E8"
              textAnchor="end"
            >
              © Lantmäteriet · skala ca 1:8 000
            </text>
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-[11.5px]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-0.5">
              Skala
            </div>
            <div>1:8 000</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-0.5">
              Upplösning
            </div>
            <div>0,5 m/pixel</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-0.5">
              Källa
            </div>
            <div>Lantmäteriet</div>
          </div>
        </div>
      </div>
    </div>
  </>
);
