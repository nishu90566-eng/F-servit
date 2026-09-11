import { House, Package, Store, User } from "lucide-react";

export function MockMap({ status }) {
  const workerLeft = status === "EN_ROUTE" || status === "AWAITING_CODE" || status === "COMPLETED" ? "72%" : status === "MATERIALS_COLLECTED" ? "50%" : "20%";

  return (
    <div className="map-mock mb-3">
      <div className="map-route-line" />
      <div className="map-pin" style={{ left: workerLeft, top: "40%" }}>
        <User className="mx-auto h-7 w-8 text-emerald-600" />
        <div className="rounded bg-white px-1 shadow-sm">Worker</div>
      </div>
      <div className="map-pin" style={{ left: "50%", top: "35%" }}>
        <Store className="mx-auto h-7 w-8 text-accent" />
        <div className="rounded bg-white px-1 shadow-sm">Hardware</div>
      </div>
      <div className="map-pin" style={{ left: "80%", top: "45%" }}>
        <House className="mx-auto h-7 w-8 text-red-500" />
        <div className="rounded bg-white px-1 shadow-sm">You</div>
      </div>
      {status === "ACCEPTED" || status === "MATERIALS_COLLECTED" ? (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-white px-2 py-1 text-[11px] font-semibold text-forest shadow">
          <Package className="mr-1 inline h-3 w-3" />
          Pickup stop
        </div>
      ) : null}
    </div>
  );
}
