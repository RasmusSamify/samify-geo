export const PROJECT = {
  id: "GS-2026-0417",
  name: "Norra Lainas Gruvområde",
  client: "Boliden Mineral AB",
  consultant: "Anna Lindqvist",
  consultantInitials: "AL",
  location: "Pajala kommun, Norrbottens län",
  coordinates: {
    lat: 67.2134,
    lng: 23.6712,
    sweref_n: 7456823,
    sweref_e: 832145,
  },
  fastighet: "Lainas 1:14",
  reportType: "PM Markmiljö — Föroreningsundersökning",
  lab: "Eurofins Environment Testing Sweden AB",
  labReportId: "EUSE-2026-009834",
  samplingDate: "2026-04-22",
  sampleCount: 47,
  measurementCount: 564,
  area: "12.4 ha",
} as const;

export const SUBSTANCES = [
  "Pb",
  "As",
  "Cd",
  "Zn",
  "Cu",
  "Cr",
  "Ni",
  "Hg",
  "Co",
  "V",
] as const;

export type Substance = (typeof SUBSTANCES)[number];

export type Limit = { km: number; mkm: number; fa: number };

export const LIMITS: Record<Substance, Limit> = {
  Pb: { km: 50, mkm: 400, fa: 2500 },
  As: { km: 10, mkm: 25, fa: 1000 },
  Cd: { km: 0.8, mkm: 12, fa: 1000 },
  Zn: { km: 250, mkm: 500, fa: 2500 },
  Cu: { km: 80, mkm: 200, fa: 2500 },
  Cr: { km: 80, mkm: 150, fa: 1000 },
  Ni: { km: 40, mkm: 120, fa: 1000 },
  Hg: { km: 0.25, mkm: 2.5, fa: 1000 },
  Co: { km: 15, mkm: 35, fa: 1000 },
  V: { km: 100, mkm: 200, fa: 10000 },
};

export type SamplePoint = {
  id: string;
  lat: number;
  lng: number;
  depth: string;
  measurements: Record<Substance, number>;
  hotspot: boolean;
  moderate: boolean;
};

const seed = (i: number, k: number) => {
  const s = Math.sin(i * 9973 + k * 31) * 10000;
  return s - Math.floor(s);
};

const generatePoints = (): SamplePoint[] => {
  const baseLat = PROJECT.coordinates.lat;
  const baseLng = PROJECT.coordinates.lng;
  const points: SamplePoint[] = [];

  for (let i = 0; i < 18; i++) {
    const id = "B" + String(i + 1).padStart(2, "0");
    const lat = baseLat + (seed(i, 1) - 0.5) * 0.018;
    const lng = baseLng + (seed(i, 2) - 0.5) * 0.024;
    const depth = (0.5 + seed(i, 3) * 2.5).toFixed(1);

    const hotspot = [3, 8, 12, 15].includes(i);
    const moderate = [1, 5, 9, 14, 17].includes(i);

    const measurements = {} as Record<Substance, number>;
    SUBSTANCES.forEach((s, k) => {
      const lim = LIMITS[s];
      let val: number;
      if (hotspot && (["Pb", "As", "Cd"] as const).includes(s as "Pb")) {
        val = lim.mkm * (1 + seed(i, k + 10) * 1.8);
      } else if (
        moderate &&
        (["Pb", "Zn", "Cu"] as const).includes(s as "Pb")
      ) {
        val = lim.km * (1 + seed(i, k + 10) * 2);
      } else {
        val = lim.km * seed(i, k + 10) * 0.9;
      }
      measurements[s] = parseFloat(val.toFixed(s === "Cd" || s === "Hg" ? 2 : 1));
    });

    points.push({ id, lat, lng, depth, measurements, hotspot, moderate });
  }
  return points;
};

export const SAMPLE_POINTS: SamplePoint[] = generatePoints();

export type Classification = "ok" | "km" | "mkm" | "fa";

export const classifyValue = (val: number, lim: Limit): Classification => {
  if (val >= lim.fa) return "fa";
  if (val >= lim.mkm) return "mkm";
  if (val >= lim.km) return "km";
  return "ok";
};

export const classColors: Record<
  Classification,
  { bg: string; text: string; label: string; dot: string }
> = {
  ok: { bg: "rgba(45, 95, 63, 0.1)", text: "#2D5F3F", label: "< KM", dot: "#2D5F3F" },
  km: { bg: "rgba(184, 132, 95, 0.15)", text: "#8B6F3F", label: "> KM", dot: "#B8945F" },
  mkm: { bg: "rgba(184, 132, 95, 0.25)", text: "#8B5A30", label: "> MKM", dot: "#B8845F" },
  fa: { bg: "rgba(139, 58, 58, 0.18)", text: "#8B3A3A", label: "> FA", dot: "#8B3A3A" },
};

export const worstClassification = (pt: SamplePoint): Classification => {
  const order: Record<Classification, number> = { ok: 0, km: 1, mkm: 2, fa: 3 };
  let worst: Classification = "ok";
  SUBSTANCES.forEach((s) => {
    const cls = classifyValue(pt.measurements[s], LIMITS[s]);
    if (order[cls] > order[worst]) worst = cls;
  });
  return worst;
};
