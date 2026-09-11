import { distanceKm, etaMinutes, formatDistance, PLACES } from "../data/seed";
import { LiveMap } from "./LiveMap";
import { useStore } from "../store";

export function WorkerEtaBanner({ workerName }) {
  const { workerLat, workerLng, gpsMode } = useStore();
  const km = distanceKm({ lat: workerLat, lng: workerLng }, PLACES.client);
  const live = gpsMode !== "off";

  return (
    <div className="mb-3 rounded-xl bg-forest px-3 py-3 text-white shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Live tracking</p>
      <p className="text-xl font-bold">
        {workerName || "Worker"} is {formatDistance(km)} away
      </p>
      <p className="text-sm text-emerald-100">
        Arriving in about {etaMinutes(km)} min · {live ? (gpsMode === "live" ? "Phone GPS" : "Demo GPS") : "Waiting for worker GPS"}
      </p>
    </div>
  );
}
