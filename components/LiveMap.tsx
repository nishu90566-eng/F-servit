"use client";

import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOUSE } from "@/lib/seed";
import type { Job, WorkerProfile } from "@/lib/types";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LiveMap({ job, worker }: { job: Job; worker?: WorkerProfile }) {
  const workerPos = useMemo(() => {
    if (!worker) return null;
    if (job.status === "COMPLETED" || job.arrived) return [job.lat, job.lng] as [number, number];
    if (job.status === "EN_ROUTE" && job.qrScanned) {
      return [(worker.lat + job.lat) / 2, (worker.lng + job.lng) / 2] as [number, number];
    }
    return [worker.lat, worker.lng] as [number, number];
  }, [job, worker]);

  return (
    <div className="h-56 overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer
        center={[job.lat, job.lng]}
        zoom={14}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle center={[HOUSE.lat, HOUSE.lng]} radius={3000} pathOptions={{ color: "#16A34A", fillOpacity: 0.05 }} />
        <Marker position={[job.lat, job.lng]}>
          <Popup>Household</Popup>
        </Marker>
        {worker && workerPos ? (
          <>
            <Marker position={workerPos}>
              <Popup>
                {worker.name} + material bag
              </Popup>
            </Marker>
            <Polyline positions={[[worker.lat, worker.lng], [job.lat, job.lng]]} color="#0F172A" dashArray="6 6" />
          </>
        ) : null}
      </MapContainer>
    </div>
  );
}
