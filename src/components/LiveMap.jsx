import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { PLACES } from "../data/seed";

function pin(color, emoji) {
  return L.divIcon({
    className: "sewa-pin",
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="background:${color};color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);font-size:16px;">${emoji}</div>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 32],
  });
}

function Follow({ workerLat, workerLng }) {
  const map = useMap();
  useEffect(() => {
    map.panTo([workerLat, workerLng], { animate: true });
  }, [map, workerLat, workerLng]);
  return null;
}

export function LiveMap({ workerLat, workerLng, showMerchant = true, height = 280 }) {
  const worker = [workerLat, workerLng];
  const client = [PLACES.client.lat, PLACES.client.lng];
  const merchant = [PLACES.merchant.lat, PLACES.merchant.lng];

  return (
    <div className="live-map overflow-hidden rounded-xl" style={{ height }}>
      <MapContainer center={worker} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Follow workerLat={workerLat} workerLng={workerLng} />
        <Marker position={worker} icon={pin("#0f5132", "🔧")}>
          <Popup>Worker live location</Popup>
        </Marker>
        {showMerchant ? (
          <Marker position={merchant} icon={pin("#f59e0b", "🏪")}>
            <Popup>{PLACES.merchant.label}</Popup>
          </Marker>
        ) : null}
        <Marker position={client} icon={pin("#ef4444", "🏠")}>
          <Popup>Client home · Sector 14</Popup>
        </Marker>
        <Polyline positions={[worker, client]} pathOptions={{ color: "#0f5132", weight: 4, dashArray: "8 8" }} />
      </MapContainer>
    </div>
  );
}
