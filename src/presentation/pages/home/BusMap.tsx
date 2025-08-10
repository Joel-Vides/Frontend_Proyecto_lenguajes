import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Evita el bug de los íconos con Vite
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

interface Location {
  latitude: number;
  longitude: number;
}

interface BusMapProps {
  start: Location;
  end: Location;
}

export const BusMap = ({ start, end }: BusMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);

  const isValid = (p: Location) =>
    Number.isFinite(p.latitude) &&
    Number.isFinite(p.longitude) &&
    p.latitude <= 90 &&
    p.latitude >= -90 &&
    p.longitude <= 180 &&
    p.longitude >= -180;

  // Crea el mapa
  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const center = isValid(start)
      ? [start.latitude, start.longitude]
      : [14.0818, -87.2068]; // Coordenadas por defecto (Tegucigalpa)

    const map = L.map(el, {
      center: center as L.LatLngExpression,
      zoom: 13,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      startMarkerRef.current = null;
      endMarkerRef.current = null;
      lineRef.current = null;
    };
  }, []);

  // Actualiza marcadores y línea cuando cambian coords
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const A = isValid(start) ? start : { latitude: 14.0818, longitude: -87.2068 };
    const B = isValid(end) ? end : A;

    if (!startMarkerRef.current) {
      startMarkerRef.current = L.marker([A.latitude, A.longitude], { icon: defaultIcon, title: "Inicio" })
        .addTo(map)
        .bindPopup("Inicio");
    } else {
      startMarkerRef.current.setLatLng([A.latitude, A.longitude]);
    }

    if (!endMarkerRef.current) {
      endMarkerRef.current = L.marker([B.latitude, B.longitude], { icon: defaultIcon, title: "Destino" })
        .addTo(map)
        .bindPopup("Destino");
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

  return <div ref={containerRef} className="h-64 rounded-md shadow-md overflow-hidden" />;
};
