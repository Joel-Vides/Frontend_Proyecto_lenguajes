import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
    latitude: number;
    longitude: number;
}

interface BusMapProps {
    start: Location;
    end: Location;
}

export const BusMap = ({ start, end }: BusMapProps) => {
    useEffect(() => {
        const mapContainerId = "bus-map";
        const existingMap = L.DomUtil.get(mapContainerId);

        if (existingMap && (existingMap as any)._leaflet_id) {
            (existingMap as any)._leaflet_id = null;
        }

        const map = L.map(mapContainerId).setView([start.latitude, start.longitude], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Marcadores de inicio y fin
        L.marker([start.latitude, start.longitude]).addTo(map).bindPopup("Inicio").openPopup();
        L.marker([end.latitude, end.longitude]).addTo(map).bindPopup("Destino");

        // Línea entre los puntos
        L.polyline([
            [start.latitude, start.longitude],
            [end.latitude, end.longitude],
        ], { color: "cyan" }).addTo(map);
    }, [start, end]);

    return <div id="bus-map" className="h-64 rounded-md shadow-md" />;
};