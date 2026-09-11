import { useRef } from "react";
import { Camera, QrCode } from "lucide-react";
import { Receipt } from "../components/Receipt";
import { inr, MERCHANT } from "../data/seed";
import { approveMaterials, simulateMerchantScan, useStore } from "../store";

export function MerchantModule() {
  const { job, merchantScanned } = useStore();
  const camRef = useRef(null);
  const ready = job && ["ACCEPTED", "MATERIALS_COLLECTED", "EN_ROUTE", "AWAITING_CODE", "COMPLETED"].includes(job.status);
  const canScan = job?.status === "ACCEPTED";
  const scanned = merchantScanned || job?.qrScanned;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="mb-0 text-xl font-bold">{MERCHANT.name}</h4>
          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">🟢 SHOP OPEN</span>
          <span className="ms-1 text-sm text-slate-500">Sector 14 Branch</span>
        </div>
        <div className="text-end">
          <span className="block text-sm text-slate-500">Today's Supply</span>
          <strong className="text-xl text-forest">{job?.merchantPaidAt ? inr(job.materialTotal) : "Rs 0"}</strong>
        </div>
      </div>

      <h6 className="mb-3 font-bold">Incoming Service Pickup Requests</h6>

      {!ready ? (
        <div className="sewa-card p-8 text-center text-sm text-slate-500">
          Waiting for a worker to accept and bring a pickup QR.
        </div>
      ) : (
        <div className="sewa-card mb-4 border border-accent p-3 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <span className="mb-1 inline-block rounded-full bg-slate-700 px-2 py-0.5 text-xs text-white">{job.id}</span>
              <h5 className="font-bold">{job.category} Repair Kit</h5>
            </div>
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${job.merchantPaidAt ? "bg-emerald-600 text-white" : "bg-accent text-slate-900"}`}>
              {job.merchantPaidAt ? "Picked Up by Worker" : scanned ? "Packed & Ready" : "Action Required"}
            </span>
          </div>
          <p className="mb-2 text-sm text-slate-500">
            Assigned Worker: <strong>{job.workerName}</strong> (Arriving in ~8 mins)
          </p>
          <div className="mb-3 rounded-lg bg-slate-50 p-3">
            <h6 className="mb-2 text-sm font-bold">Requested Inventory Items:</h6>
            {job.materials.map((sku) => (
              <label key={sku.name} className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked readOnly className="accent-forest" />
                  {sku.name}
                </span>
                <span className="font-bold">{inr(sku.cost)}</span>
              </label>
            ))}
            <hr className="my-2 border-slate-200" />
            <div className="flex justify-between text-sm font-bold">
              <span>Total Materials Billed:</span>
              <span className="text-forest">{inr(job.materialTotal)}</span>
            </div>
          </div>

          {canScan ? (
            <>
              <button
                type="button"
                onClick={simulateMerchantScan}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 font-bold text-slate-900"
              >
                <QrCode className="h-5 w-5" />
                Simulate QR Scan
              </button>
              <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={simulateMerchantScan} />
              <button
                type="button"
                onClick={() => camRef.current?.click()}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 py-2 text-sm font-semibold"
              >
                <Camera className="h-4 w-4" />
                Optional camera
              </button>
            </>
          ) : null}

          {canScan && scanned ? (
            <button type="button" onClick={approveMaterials} className="w-full rounded-md bg-forest py-3 font-bold text-white">
              Approve & Release Material
            </button>
          ) : null}

          {job.merchantPaidAt ? (
            <div className="rounded-lg border bg-slate-50 p-3 text-center">
              <span className="mb-2 block text-sm font-bold text-emerald-700">✓ PACKED & READY — {inr(job.materialTotal)} received from Central Fund</span>
              <p className="text-sm text-slate-500">Paid at QR pickup · not at job end</p>
            </div>
          ) : null}
        </div>
      )}

      {job?.status === "COMPLETED" ? <Receipt job={job} /> : null}

      <h6 className="mb-2 mt-4 font-bold">Recent Completed Supplies</h6>
      <div className="sewa-card flex flex-row items-center justify-between p-2 text-sm">
        <div>
          <strong>Job #JOB-1038</strong> — LED holder
          <div className="text-slate-500">Worker: Ramesh Kumar</div>
        </div>
        <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">Rs 180 Paid</span>
      </div>
    </div>
  );
}
