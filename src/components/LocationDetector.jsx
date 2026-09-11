import { Crosshair, Navigation, Satellite } from "lucide-react";
import { LiveMap } from "./LiveMap";
import { PLACES, distanceKm, etaMinutes, formatDistance } from "../data/seed";
import { setGpsMode, useStore } from "../store";

export function LocationDetector() {
  const { gpsMode, gpsError, workerLat, workerLng, gpsAccuracy, gpsUpdatedAt } = useStore();
  const km = distanceKm({ lat: workerLat, lng: workerLng }, PLACES.client);
  const sharing = gpsMode !== "off";

  return (
    <section className="sewa-card mb-4 overflow-hidden border border-forest/20 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-slate-900">Live location detector</p>
          <p className="text-xs text-slate-500">Rapido-style GPS so the client can see how far you are</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${sharing ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
          {gpsMode === "live" ? "GPS LIVE" : gpsMode === "demo" ? "DEMO GPS" : "OFF"}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setGpsMode(gpsMode === "live" ? "off" : "live")}
          className="flex items-center justify-center gap-1 rounded-md bg-forest py-2.5 text-sm font-semibold text-white"
        >
          <Satellite className="h-4 w-4" />
          {gpsMode === "live" ? "Stop GPS" : "Detect my GPS"}
        </button>
        <button
          type="button"
          onClick={() => setGpsMode(gpsMode === "demo" ? "off" : "demo")}
          className="flex items-center justify-center gap-1 rounded-md bg-accent py-2.5 text-sm font-semibold text-slate-900"
        >
          <Navigation className="h-4 w-4" />
          Demo GPS
        </button>
      </div>

      {gpsError ? <p className="mb-2 text-sm text-red-600">{gpsError}</p> : null}

      {sharing ? (
        <>
          <div className="mb-2 rounded-lg bg-forest px-3 py-2 text-white">
            <p className="text-lg font-bold">{formatDistance(km)} from client</p>
            <p className="text-sm text-emerald-100">Arriving in ~{etaMinutes(km)} min · like Rapido live tracking</p>
            <p className="mt-1 text-[11px] text-emerald-100">
              <Crosshair className="mr-1 inline h-3 w-3" />
              {workerLat.toFixed(5)}, {workerLng.toFixed(5)}
              {gpsAccuracy ? ` · ±${Math.round(gpsAccuracy)} m` : ""}
              {gpsUpdatedAt ? ` · ${new Date(gpsUpdatedAt).toLocaleTimeString()}` : ""}
            </p>
          </div>
          <LiveMap workerLat={workerLat} workerLng={workerLng} height={260} />
        </>
      ) : (
        <p className="text-sm text-slate-500">Turn on Detect my GPS (phone) or Demo GPS to show the client your live distance.</p>
      )}
    </section>
  );
}
