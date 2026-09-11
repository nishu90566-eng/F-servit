import { useSyncExternalStore } from "react";
import {
  buildJob,
  DEMO_ACCOUNTS,
  FEES,
  makeEmptyState,
  MERCHANT,
  nowIso,
  pickFairWorker,
  PLACES,
} from "./data/seed";

let state = makeEmptyState();
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function patch(partial) {
  state = { ...state, ...partial };
  emit();
}

function stamp(job, status, note) {
  return {
    ...job,
    status,
    timeline: [...job.timeline, { status, at: nowIso(), note }],
  };
}

function offerToNext(job, workers) {
  const next = pickFairWorker(workers, job.declinedWorkerIds);
  if (!next) {
    return stamp(
      { ...job, offeredWorkerId: null, status: "PAYMENT_HELD" },
      "PAYMENT_HELD",
      "No on-duty worker available. Central funds stay locked.",
    );
  }
  return stamp(
    { ...job, offeredWorkerId: next.id, status: "OFFERED" },
    "OFFERED",
    `Alert sent to ${next.name} (fair queue, jobsToday ${next.jobsToday}).`,
  );
}

export function setRole(role) {
  patch({ role, codeError: "" });
}

export function login(email, password) {
  const acc = DEMO_ACCOUNTS.find(
    (item) => item.email.toLowerCase() === String(email).trim().toLowerCase() && item.password === password,
  );
  if (!acc) return "Unknown demo account. Use Sewa@123.";
  patch({
    session: { email: acc.email, role: acc.role, name: acc.name },
    role: acc.role,
  });
  return null;
}

export function logout() {
  patch({ session: null, role: "landing" });
}

export function resetDemo() {
  const session = state.session;
  state = { ...makeEmptyState(), session, role: session?.role || "landing" };
  emit();
}

export function setGpsMode(mode) {
  patch({ gpsMode: mode, gpsError: mode === "live" ? "" : state.gpsError });
}

export function updateWorkerGps(lat, lng, accuracy) {
  patch({
    workerLat: lat,
    workerLng: lng,
    gpsAccuracy: accuracy ?? state.gpsAccuracy,
    gpsUpdatedAt: nowIso(),
    gpsError: "",
  });
}

export function setGpsError(message) {
  patch({ gpsError: message });
}

export function tickDemoGps() {
  if (state.gpsMode !== "demo") return;
  const job = state.job;
  let target = PLACES.worker;
  if (job?.status === "ACCEPTED") target = PLACES.merchant;
  else if (job?.status === "MATERIALS_COLLECTED") target = PLACES.merchant;
  else if (job?.status === "EN_ROUTE" || job?.status === "AWAITING_CODE") target = PLACES.client;
  else if (job?.status === "COMPLETED") target = PLACES.client;
  const lat = state.workerLat + (target.lat - state.workerLat) * 0.14;
  const lng = state.workerLng + (target.lng - state.workerLng) * 0.14;
  patch({
    workerLat: lat,
    workerLng: lng,
    gpsAccuracy: 12,
    gpsUpdatedAt: nowIso(),
  });
}

export function toggleDuty(workerId) {
  const workers = state.workers.map((w) =>
    w.id === workerId ? { ...w, onDuty: !w.onDuty } : w,
  );
  patch({ workers });
}

export function createRequest(payload) {
  const job = buildJob(payload);
  patch({ job, merchantScanned: false, codeError: "", ledger: state.ledger });
}

export function payToCentralFund() {
  if (!state.job || state.job.status !== "INITIATED") return;
  let job = {
    ...state.job,
    centralFundBalance: FEES.clientPaid,
  };
  job = stamp(
    job,
    "PAYMENT_HELD",
    `Client paid Rs ${FEES.clientPaid} to SEWA Central Fund (sewasetu@upi). Vault = ${FEES.clientPaid}.`,
  );
  job = offerToNext(job, state.workers);
  patch({ job });
}

export function workerRespond(yes) {
  const job = state.job;
  if (!job || job.status !== "OFFERED" || !job.offeredWorkerId) return;
  const worker = state.workers.find((w) => w.id === job.offeredWorkerId);
  if (!worker) return;

  if (!yes) {
    const declined = {
      ...job,
      declinedWorkerIds: [...job.declinedWorkerIds, worker.id],
      offeredWorkerId: null,
    };
    const nextJob = offerToNext(declined, state.workers);
    patch({ job: nextJob });
    return;
  }

  const workers = state.workers.map((w) =>
    w.id === worker.id ? { ...w, jobsToday: w.jobsToday + 1 } : w,
  );
  const qrPayload = {
    jobId: job.id,
    items: job.materials.map((m) => m.name),
  };
  const accepted = stamp(
    {
      ...job,
      workerId: worker.id,
      workerName: worker.name,
      qrPayload,
      status: "ACCEPTED",
    },
    "ACCEPTED",
    `${worker.name} accepted. Connected to ${MERCHANT.name}. Pickup QR issued.`,
  );
  patch({ job: accepted, workers, merchantScanned: false });
}

export function simulateMerchantScan() {
  if (!state.job || state.job.status !== "ACCEPTED") return;
  patch({
    merchantScanned: true,
    job: { ...state.job, qrScanned: true },
  });
}

export function approveMaterials() {
  const job = state.job;
  if (!job || job.status !== "ACCEPTED") return;
  if (!job.qrScanned && !state.merchantScanned) return;
  const next = stamp(
    {
      ...job,
      merchantPaidAt: nowIso(),
      centralFundBalance: FEES.clientPaid - FEES.materialTotal,
      qrScanned: true,
    },
    "MATERIALS_COLLECTED",
    `${MERCHANT.name} scanned QR. Rs ${FEES.materialTotal} released to merchant. Vault = ${FEES.clientPaid - FEES.materialTotal}.`,
  );
  patch({ job: next, merchantScanned: true });
}

export function workerGoingToClient() {
  const job = state.job;
  if (!job || job.status !== "MATERIALS_COLLECTED") return;
  patch({
    job: stamp(
      job,
      "EN_ROUTE",
      `${job.workerName} collected materials and is on the way to ${job.clientAddress}.`,
    ),
    gpsMode: state.gpsMode === "off" ? "demo" : state.gpsMode,
  });
}

export function workerJobFinished() {
  const job = state.job;
  if (!job || job.status !== "EN_ROUTE") return;
  patch({
    job: stamp(
      job,
      "AWAITING_CODE",
      "Work finished. Waiting for the client unique code.",
    ),
    codeError: "",
  });
}

export function workerEnterCode(code) {
  const job = state.job;
  if (!job || job.status !== "AWAITING_CODE") return false;
  if (String(code).trim() !== job.uniqueCode) {
    patch({ codeError: "Invalid code. Ask the client to read the unique code." });
    return false;
  }
  const completed = stamp(
    {
      ...job,
      workerPaidAt: nowIso(),
      centralFundBalance: FEES.platformFee + FEES.welfareFee,
    },
    "COMPLETED",
    `Unique code verified. Rs ${FEES.workerPayout} released to ${job.workerName} after platform Rs ${FEES.platformFee} and welfare Rs ${FEES.welfareFee}. SERVICE COMPLETED.`,
  );
  const row = {
    jobId: completed.id,
    worker: completed.workerName,
    status: completed.status,
    clientPaid: completed.clientPaid,
    merchant: completed.materialTotal,
    workerPayout: completed.workerPayout,
    platform: completed.platformFee,
    welfare: completed.welfareFee,
  };
  patch({ job: completed, codeError: "", ledger: [row] });
  return true;
}

export function useStore() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}
