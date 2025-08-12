import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Arregla los iconos en Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

type LatLng = { latitude: number; longitude: number };

interface Props {
  start: LatLng;
  end: LatLng;
  onChangeStart: (p: LatLng) => void;
  onChangeEnd: (p: LatLng) => void;
}

export const PickRouteMap = ({ start, end, onChangeStart, onChangeEnd }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);

  const [mode, setMode] = useState<"start" | "end">("start");

  const isValid = (p: LatLng) =>
    Number.isFinite(p.latitude) &&
    Number.isFinite(p.longitude) &&
    p.latitude <= 90 && p.latitude >= -90 &&
    p.longitude <= 180 && p.longitude >= -180;

  // Init
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] = isValid(start)
      ? [start.latitude, start.longitude]
      : [14.0818, -87.2068];

    const map = L.map(containerRef.current, { center, zoom: 13 });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Coloca el punto en el mapa
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (mode === "start") onChangeStart({ latitude: lat, longitude: lng });
      else onChangeEnd({ latitude: lat, longitude: lng });
    });

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      startMarkerRef.current = null;
      endMarkerRef.current = null;
      lineRef.current = null;
    };
  }, [mode, onChangeStart, onChangeEnd]);

  // Propiedades
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const A = isValid(start) ? start : { latitude: 14.0818, longitude: -87.2068 };
    const B = isValid(end) ? end : A;

    if (!startMarkerRef.current) {
      startMarkerRef.current = L.marker([A.latitude, A.longitude], { icon: defaultIcon, title: "Inicio" })
        .addTo(map).bindPopup("Inicio");
    } else {
      startMarkerRef.current.setLatLng([A.latitude, A.longitude]);
    }

    if (!endMarkerRef.current) {
      endMarkerRef.current = L.marker([B.latitude, B.longitude], { icon: defaultIcon, title: "Destino" })
        .addTo(map).bindPopup("Destino");
    } else {
      endMarkerRef.current.setLatLng([B.latitude, B.longitude]);
    }

    const path: [number, number][] = [
      [A.latitude, A.longitude],
      [B.latitude, B.longitude],
    ];

    if (!lineRef.current) {
      lineRef.current = L.polyline(path, { color: "cyan", weight: 4 }).addTo(map);
    } else {
      lineRef.current.setLatLngs(path);
    }

    const bounds = L.latLngBounds(path);
    map.fitBounds(bounds, { padding: [20, 20] });
    setTimeout(() => map.invalidateSize(), 0);
  }, [start, end]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("start")}
          className={`px-3 py-1 rounded-md border ${mode === "start" ? "bg-cyan-700 text-white border-cyan-700" : "bg-white text-gray-700 border-gray-300"}`}
        >
          Marcar Inicio
        </button>
        <button
          type="button"
          onClick={() => setMode("end")}
          className={`px-3 py-1 rounded-md border ${mode === "end" ? "bg-cyan-700 text-white border-cyan-700" : "bg-white text-gray-700 border-gray-300"}`}
        >
          Marcar Destino
        </button>
        <span className="text-sm text-gray-500 ml-2">
          (Haz click en el mapa para colocar el punto seleccionado)
        </span>
      </div>
      <div ref={containerRef} className="h-64 rounded-md shadow-md overflow-hidden" />
    </div>
  );
};
