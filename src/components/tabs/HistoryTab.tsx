import { Icon } from "../Icon";

const ebh = [
  {
    year: "1947–1991",
    name: "Anrikningsverk Lainas",
    branch: "Gruvverksamhet",
    mifo: 2,
    note: "Bedömd som potentiellt förorenad. Avfallshantering ej dokumenterad innan 1970.",
  },
  {
    year: "1953–1988",
    name: "Slamdamm söder",
    branch: "Avfallshantering",
    mifo: 1,
    note: "Identifierad som primärkälla. Inläckage till grundvatten misstänks.",
  },
  {
    year: "1962–1979",
    name: "Verkstadsindustri",
    branch: "Metallbearbetning",
    mifo: 3,
    note: "Mindre verksamhet. Avgränsad till nordlig fastighetsdel.",
  },
];

export const HistoryTab = () => (
  <div className="grid grid-cols-3 gap-6">
    <div className="col-span-2 space-y-4">
      <div className="hairline rounded-md bg-paper">
        <div className="px-5 py-3 border-b border-line-soft">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Länsstyrelsen Norrbotten · EBH-stödet
          </div>
          <div className="text-[13px] font-medium">Identifierade verksamhetshistorik</div>
        </div>
        <div className="divide-y divide-line-soft">
          {ebh.map((e, i) => (
            <div key={i} className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[14px] font-medium">{e.name}</div>
                  <div className="text-[11.5px] text-ink-muted font-mono mt-0.5">
                    {e.year} · {e.branch}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`hairline-soft rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
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
              </div>
              <div className="text-[12.5px] text-ink-soft mt-2">{e.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-5">
      <div className="hairline rounded-md bg-paper p-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
          Tidslinje · verksamhet
        </div>
        <Timeline />
      </div>

      <div className="hairline rounded-md bg-paper p-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
          Historiska flygfoton
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1962, 1975, 1988, 2001].map((year) => (
            <div
              key={year}
              className="aspect-square bg-cream-2 rounded relative overflow-hidden hairline-soft flex items-end p-2"
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
            </div>
          ))}
        </div>
        <button className="mt-3 w-full text-[11.5px] text-ink-muted hover:text-ink flex items-center justify-center gap-1.5 py-2">
          <Icon name="external" size={11} />
          Öppna i Lantmäteriets historiska kartor
        </button>
      </div>
    </div>
  </div>
);

const Timeline = () => {
  const events = [
    { year: 1947, label: "Anrikningsverk öppnar", current: false },
    { year: 1953, label: "Slamdamm anläggs", current: false },
    { year: 1962, label: "Verkstad etableras", current: false },
    { year: 1979, label: "Verkstad upphör", current: false },
    { year: 1988, label: "Slamdamm stängs", current: false },
    { year: 1991, label: "Anrikningsverk stängs", current: false },
    { year: 2026, label: "Provtagning", current: true },
  ];
  return (
    <div className="relative pl-4 space-y-2.5">
      <div className="absolute left-1 top-1.5 bottom-1.5 w-px bg-line" />
      {events.map((e) => (
        <div key={e.year} className="relative flex items-baseline gap-3 text-[12px]">
          <div
            className={`absolute -left-3 top-1.5 w-2 h-2 rounded-full ${
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
        </div>
      ))}
    </div>
  );
};
