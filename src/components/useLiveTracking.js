import { useEffect } from "react";
import { setGpsError, tickDemoGps, updateWorkerGps, useStore } from "../store";

export function useLiveTracking() {
  const { gpsMode } = useStore();

  useEffect(() => {
    if (gpsMode !== "live" || !navigator.geolocation) return undefined;
    const id = navigator.geolocation.watchPosition(
      (pos) => updateWorkerGps(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
      (err) => setGpsError(err.message || "Location permission denied. Use Demo GPS instead."),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 12000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [gpsMode]);

  useEffect(() => {
    if (gpsMode !== "demo") return undefined;
    const id = window.setInterval(() => tickDemoGps(), 1200);
    return () => window.clearInterval(id);
  }, [gpsMode]);
}
