import { SAMPLE_POINTS } from "../../data/project";

export const GeologyTab = () => (
  <div className="grid grid-cols-3 gap-6">
    <div className="col-span-2 hairline rounded-md bg-paper">
      <div className="px-5 py-3 border-b border-line-soft">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
          SGU · Jordartskartan 1:25 000
        </div>
        <div className="text-[13px] font-medium">Områdets jordartsfördelning</div>
      </div>
      <div className="p-6">
        <svg viewBox="0 0 600 360" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="moranPattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill="#C7B895" />
              <circle cx="2" cy="2" r="0.8" fill="#8B7A55" />
              <circle cx="6" cy="6" r="0.8" fill="#8B7A55" />
            </pattern>
            <pattern id="sandPattern" patternUnits="userSpaceOnUse" width="6" height="6">
              <rect width="6" height="6" fill="#E8DAB8" />
              <circle cx="3" cy="3" r="0.5" fill="#B8A372" />
            </pattern>
            <pattern id="berg" patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill="#9A8F7A" />
              <path d="M0 5 L10 5" stroke="#6B6253" strokeWidth="0.5" />
              <path d="M5 0 L5 10" stroke="#6B6253" strokeWidth="0.5" />
            </pattern>
          </defs>
          <path d="M 0 0 L 600 0 L 600 360 L 0 360 Z" fill="url(#moranPattern)" />
          <path
            d="M 320 0 Q 380 80 360 180 Q 340 280 420 360 L 600 360 L 600 0 Z"
            fill="url(#sandPattern)"
          />
          <ellipse cx="220" cy="200" rx="90" ry="60" fill="url(#berg)" />
          <path
            d="M 0 280 Q 100 290 200 285 Q 300 280 400 290 L 400 360 L 0 360 Z"
            fill="#D5E8E8"
            opacity="0.6"
          />

          <path
            d="M 50 320 Q 200 310 350 340 Q 450 350 600 330"
            fill="none"
            stroke="#7AA5B8"
            strokeWidth="3"
          />

          {SAMPLE_POINTS.slice(0, 10).map((pt, i) => (
            <circle
              key={pt.id}
              cx={100 + (i % 5) * 100 + (i % 3) * 18}
              cy={120 + Math.floor(i / 5) * 90 + (i % 2) * 24}
              r="6"
              fill="#1A1814"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          <g transform="translate(20, 20)">
            <rect width="180" height="100" fill="white" stroke="#D8D2C4" rx="3" />
            <text
              x="10"
              y="18"
              fontSize="9"
              fontFamily="JetBrains Mono"
              fill="#7A736A"
              letterSpacing="0.06em"
            >
              JORDARTER
            </text>
            <rect x="10" y="26" width="14" height="10" fill="url(#moranPattern)" />
            <text x="30" y="35" fontSize="11" fontFamily="IBM Plex Sans" fill="#1A1814">
              Sandig morän (Mn)
            </text>
            <rect x="10" y="42" width="14" height="10" fill="url(#sandPattern)" />
            <text x="30" y="51" fontSize="11" fontFamily="IBM Plex Sans" fill="#1A1814">
              Glacial sand (Gs)
            </text>
            <rect x="10" y="58" width="14" height="10" fill="url(#berg)" />
            <text x="30" y="67" fontSize="11" fontFamily="IBM Plex Sans" fill="#1A1814">
              Berg i dagen
            </text>
            <rect x="10" y="74" width="14" height="10" fill="#D5E8E8" />
            <text x="30" y="83" fontSize="11" fontFamily="IBM Plex Sans" fill="#1A1814">
              Torv / våtmark
            </text>
          </g>

          <text
            x="580"
            y="350"
            fontSize="9"
            fontFamily="JetBrains Mono"
            fill="#7A736A"
            textAnchor="end"
          >
            © SGU · återgivet 2026-05-19
          </text>
        </svg>
      </div>
    </div>

    <div className="space-y-5">
      <div className="hairline rounded-md bg-paper p-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
          Stratigrafi (uppskattad)
        </div>
        <div className="space-y-2">
          <StratLayer
            depth="0–0.4 m"
            mat="Mulljord / organiskt material"
            color="#6B5B45"
          />
          <StratLayer depth="0.4–2.8 m" mat="Sandig morän (Mn)" color="#C7B895" />
          <StratLayer depth="2.8–5.6 m" mat="Glacial sand (Gs)" color="#E8DAB8" />
          <StratLayer depth="5.6+ m" mat="Granit (paleoproterozoisk)" color="#9A8F7A" />
        </div>
      </div>

      <div className="hairline rounded-md bg-paper p-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-3">
          Hydrogeologi
        </div>
        <div className="space-y-3 text-[12.5px]">
          <Row label="Grundvattennivå" value="4.2–6.8 m u.my" />
          <Row label="Brunnar (< 500 m)" value="7 st" />
          <Row label="GV-magasin" value="Sand & grus" />
          <Row label="Uttagskapacitet" value="2–10 l/s" />
          <Row label="Strömningsriktning" value="SE → vattendrag" />
        </div>
      </div>
    </div>
  </div>
);

const StratLayer = ({
  depth,
  mat,
  color,
}: {
  depth: string;
  mat: string;
  color: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-3 h-7 rounded-sm" style={{ background: color }} />
    <div className="flex-1 flex items-baseline justify-between text-[12px]">
      <span className="font-mono text-ink-muted">{depth}</span>
      <span className="text-ink">{mat}</span>
    </div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-ink-muted">{label}</span>
    <span className="font-mono">{value}</span>
  </div>
);
