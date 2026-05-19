import { useEffect, useRef } from "react";
import L from "leaflet";
import {
  classColors,
  PROJECT,
  SAMPLE_POINTS,
  worstClassification,
} from "../data/project";
import type { SamplePoint } from "../data/project";

type Props = {
  selectedId?: string | null;
  onSelect: (point: SamplePoint) => void;
  height?: number;
};

export const SampleMap = ({ selectedId, onSelect, height = 440 }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      attributionControl: false,
      zoomControl: true,
    }).setView([PROJECT.coordinates.lat, PROJECT.coordinates.lng], 14);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    SAMPLE_POINTS.forEach((pt) => {
      const worst = worstClassification(pt);
      const color = classColors[worst].dot;
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div class="pp-marker" data-id="${pt.id}" style="background:${color}">${pt.id.replace("B", "")}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon }).addTo(map);
      marker.bindTooltip(
        `
        <div style="font-family: 'Montserrat'; font-size: 12px;">
          <div style="font-family: 'IBM Plex Mono'; font-size: 10px; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em;">Provpunkt</div>
          <div style="font-weight: 600; margin-bottom: 4px;">${pt.id}</div>
          <div style="font-size: 11px; color: #334155;">Djup ${pt.depth} m · ${classColors[worst].label}</div>
          <div style="font-size: 10px; color: #64748B; margin-top: 4px;">Klicka för detaljer</div>
        </div>
      `,
      );
      marker.on("click", () => onSelectRef.current(pt));
      markersRef.current[pt.id] = marker;
    });

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const dot = el?.querySelector(".pp-marker");
      if (dot) {
        if (id === selectedId) dot.classList.add("selected");
        else dot.classList.remove("selected");
      }
    });
  }, [selectedId]);

  return <div ref={containerRef} style={{ height, width: "100%" }} />;
};
