import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, ShieldCheck } from "lucide-react";
import { LocationDetector } from "../components/LocationDetector";
import { LiveMap } from "../components/LiveMap";
import { Receipt } from "../components/Receipt";
import { DEMO_AREA, inr, MERCHANT, PLACES, distanceKm, formatDistance } from "../data/seed";
import {
  toggleDuty,
  useStore,
  workerEnterCode,
  workerGoingToClient,
  workerJobFinished,
  workerRespond,
} from "../store";

export function WorkerModule() {
  const { job, workers, codeError, workerLat, workerLng } = useStore();
  const [code, setCode] = useState("");
  const offered = job?.status === "OFFERED" ? workers.find((w) => w.id === job.offeredWorkerId) : null;
  const assigned = job?.workerId ? workers.find((w) => w.id === job.workerId) : workers.find((w) => w.id === "w2");
  const focus = offered || assigned || workers[1];

  const kmToClient = distanceKm({ lat: workerLat, lng: workerLng }, PLACES.client);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="mb-0 text-xl font-bold">{focus?.name || "Cooperative electrician"}</h4>
          <p className="mt-1 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => focus && toggleDuty(focus.id)}
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${focus?.onDuty ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}
            >
              {focus?.onDuty ? "● ON DUTY" : "OFF DUTY"}
            </button>
            <span className="text-sm text-slate-500">Electrical Specialist</span>
          </p>
        </div>
        <div className="text-end">
          <span className="block text-sm text-slate-500">Guaranteed take-home</span>
          <strong className="text-xl text-emerald-600">{job ? inr(job.workerPayout) : "Rs 272"}</strong>
        </div>
      </div>

      <LocationDetector />

      <div className="mb-3 space-y-2">
        {workers.map((worker) => (
          <div key={worker.id} className="sewa-card flex items-center justify-between px-3 py-2">
            <div>
              <p className="font-semibold">{worker.name}</p>
              <p className="text-xs text-slate-500">
                {worker.phone} · jobsToday {worker.jobsToday}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleDuty(worker.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                worker.onDuty ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {worker.onDuty ? "On duty" : "Off duty"}
            </button>
          </div>
        ))}
      </div>

      {offered ? (
        <div className="sewa-card mb-4 border border-forest p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-forest px-2 py-1 text-xs text-white">Your service requested in this area. YES or NO</span>
            <span className="text-sm text-slate-500">{formatDistance(kmToClient)} from client</span>
          </div>
          <h5 className="mb-1 font-bold">{job.category} repair</h5>
          <p className="mb-2 text-sm text-slate-500">
            <MapPin className="mr-1 inline h-3.5 w-3.5" />
            Area: {DEMO_AREA} · {offered.name}
          </p>
          <p className="mb-2 text-sm">Guaranteed take-home {inr(job.workerPayout)} after cutoff</p>
          <ul className="mb-3 rounded-lg bg-slate-50 p-2 text-sm">
            {job.materials.map((sku) => (
              <li key={sku.name} className="flex justify-between">
                <span>{sku.name}</span>
                <span>{inr(sku.cost)}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => workerRespond(false)} className="rounded-md border border-slate-300 py-3 font-semibold">
              NO
            </button>
            <button type="button" onClick={() => workerRespond(true)} className="rounded-md bg-forest py-3 font-semibold text-white">
              YES
            </button>
          </div>
        </div>
      ) : null}

      {job && ["ACCEPTED", "MATERIALS_COLLECTED", "EN_ROUTE", "AWAITING_CODE"].includes(job.status) ? (
        <div className="sewa-card mb-4 border border-forest p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-forest px-2 py-1 text-xs text-white">Active Assigned Job</span>
            <span className="text-sm text-slate-500">{formatDistance(kmToClient)} away</span>
          </div>
          <h5 className="mb-1 font-bold">{job.category} repair</h5>
          <p className="mb-2 text-sm text-slate-500">Customer: {job.clientName} • {DEMO_AREA}</p>
          <div className="mb-3 rounded-lg bg-slate-50 p-2 text-sm">
            <div className="mb-1 flex items-center font-bold text-forest">
              <span className="me-2 flex h-6 w-6 items-center justify-center rounded-full bg-forest text-xs text-white">1</span>
              STOP 1: {MERCHANT.name} ({MERCHANT.distanceKm} km)
            </div>
            <div className="mb-2 ps-8 text-slate-500">
              Collect: {job.materials.map((m) => m.name).join(", ")}
              <br />
              Status:{" "}
              <span className={`rounded-full px-2 py-0.5 text-xs ${job.status === "ACCEPTED" ? "bg-accent text-slate-900" : "bg-emerald-600 text-white"}`}>
                {job.status === "ACCEPTED" ? "Ready for pickup QR" : "Collected ✓"}
              </span>
            </div>
            <div className="flex items-center font-bold">
              <span className="me-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs text-white">2</span>
              STOP 2: Customer Location ({formatDistance(kmToClient)})
            </div>
          </div>

          {job.status === "EN_ROUTE" ? (
            <div className="mb-3">
              <LiveMap workerLat={workerLat} workerLng={workerLng} height={220} />
            </div>
          ) : null}

          {job.qrPayload && job.status === "ACCEPTED" ? (
            <div className="mb-3 flex flex-col items-center">
              <QRCodeSVG value={JSON.stringify(job.qrPayload)} size={160} />
              <p className="mt-2 text-center text-sm font-medium">Show this QR to {MERCHANT.name}</p>
            </div>
          ) : null}

          {job.status === "MATERIALS_COLLECTED" ? (
            <button type="button" onClick={workerGoingToClient} className="w-full rounded-md bg-accent py-3 font-bold text-slate-900">
              I am going to client
            </button>
          ) : null}
          {job.status === "EN_ROUTE" ? (
            <button type="button" onClick={workerJobFinished} className="w-full rounded-md bg-emerald-600 py-3 font-bold text-white">
              Job finished, waiting for client code
            </button>
          ) : null}
          {job.status === "AWAITING_CODE" ? (
            <div>
              <p className="text-sm font-semibold">Enter unique code from the client</p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="4-digit code"
                className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-3 text-center text-2xl tracking-[0.4em]"
              />
              {codeError ? <p className="mt-2 text-sm text-red-600">{codeError}</p> : null}
              <button type="button" onClick={() => workerEnterCode(code)} className="mt-3 w-full rounded-md bg-emerald-600 py-3 font-bold text-white">
                Confirm complete delivery
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {job?.status === "COMPLETED" ? (
        <div className="space-y-3">
          <div className="rounded-xl bg-emerald-50 p-2 text-center text-sm font-bold text-emerald-800">
            <ShieldCheck className="mr-1 inline h-4 w-4" />
            Job Completed & Earnings Credited {inr(job.workerPayout)}
          </div>
          <Receipt job={job} />
        </div>
      ) : null}

      <h6 className="mb-3 font-bold">Nearby Cooperative Job Feed</h6>
      <div className="sewa-card mb-2 p-3">
        <div className="flex justify-between">
          <h6 className="font-bold">Bathroom Tap Replacement</h6>
          <span className="font-bold text-emerald-600">₹350</span>
        </div>
        <p className="mb-1 text-sm text-slate-500">Location: Sector 14 (1.5 km away)</p>
        <button type="button" disabled className="rounded-md border border-slate-200 px-3 py-1 text-sm">
          Available after current job
        </button>
      </div>
      <div className="sewa-card mb-2 p-3">
        <div className="flex justify-between">
          <h6 className="font-bold">Water Tank Valve Leak</h6>
          <span className="font-bold text-emerald-600">₹600</span>
        </div>
        <p className="mb-1 text-sm text-slate-500">Location: City Center (3.2 km away)</p>
        <button type="button" disabled className="rounded-md border border-slate-200 px-3 py-1 text-sm">
          Available after current job
        </button>
      </div>
    </div>
  );
}
