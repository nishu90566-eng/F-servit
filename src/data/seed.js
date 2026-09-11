export const CLIENT = {
  name: "Sunita Sharma",
  address: "Block C, Sector 14, City Center",
};

export const MERCHANT = {
  name: "Gupta Electrical Store",
  distanceKm: 0.8,
};

/** Sector 14, City Center — used for Rapido-style live tracking */
export const PLACES = {
  client: { lat: 30.7422, lng: 76.7794, label: "Client home" },
  merchant: { lat: 30.7368, lng: 76.771, label: "Gupta Electrical Store" },
  worker: { lat: 30.751, lng: 76.788, label: "Worker" },
};

export const DEMO_ACCOUNTS = [
  { email: "client@sewasetu.in", password: "Sewa@123", role: "client", name: "Sunita Sharma" },
  { email: "worker@sewasetu.in", password: "Sewa@123", role: "worker", name: "Suresh Verma" },
  { email: "merchant@sewasetu.in", password: "Sewa@123", role: "merchant", name: "Gupta Electrical Store" },
  { email: "admin@sewasetu.in", password: "Sewa@123", role: "admin", name: "Cooperative Admin" },
];

export function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function etaMinutes(km) {
  return Math.max(1, Math.round((km / 18) * 60));
}

export const DEMO_TRANSCRIPT =
  "My switchboard sparked and main circuit breaker tripped";

export const DEMO_CODE = "1234";
export const DEMO_JOB_ID = "JOB-1042";
export const DEMO_DISTANCE = "~1.2 km";
export const DEMO_AREA = "Sector 14, City Center";

export const FEES = {
  materialTotal: 300,
  labourFee: 350,
  platformFee: 50,
  welfareFee: 28,
  workerPayout: 272,
  clientPaid: 650,
};

export const DEMO_MATERIALS = [
  { name: "16A MCB Switch", cost: 180 },
  { name: "1.5mm Copper Wire (2m)", cost: 120 },
];

export const CATEGORY_MATERIALS = {
  Electrical: DEMO_MATERIALS,
  Plumbing: [
    { name: "Tap cartridge", cost: 180 },
    { name: "Teflon tape + washers", cost: 120 },
  ],
  Carpentry: [
    { name: "Hinge set", cost: 180 },
    { name: "Wood filler + screws", cost: 120 },
  ],
  Appliance: [
    { name: "Universal capacitor", cost: 180 },
    { name: "Service kit", cost: 120 },
  ],
  Painting: [
    { name: "Emulsion 1L", cost: 180 },
    { name: "Brush + masking tape", cost: 120 },
  ],
  Other: DEMO_MATERIALS,
};

export const CATALOG = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Appliance",
  "Other",
];

export const TRACKER_STEPS = [
  { key: "requested", label: "Requested", match: ["INITIATED", "PAYMENT_HELD"] },
  { key: "matched", label: "Matched", match: ["OFFERED", "ACCEPTED"] },
  { key: "pickup", label: "Pickup", match: ["MATERIALS_COLLECTED"] },
  { key: "repair", label: "Repair", match: ["EN_ROUTE", "AWAITING_CODE"] },
  { key: "complete", label: "Complete", match: ["COMPLETED"] },
];

export const WORKFLOW_STEPS = [
  { n: 1, key: "INITIATED", label: "Client initiates a job" },
  { n: 2, key: "OFFERED", label: "Worker alert" },
  { n: 3, key: "ACCEPTED", label: "Worker accepts" },
  { n: 4, key: "MATERIALS_COLLECTED", label: "Merchant scans QR" },
  { n: 5, key: "EN_ROUTE", label: "Worker travels" },
  { n: 6, key: "AWAITING_CODE", label: "Client shares code" },
  { n: 7, key: "CODE", label: "Worker enters code" },
  { n: 8, key: "COMPLETED", label: "Service completed" },
];

export const STATUS_STEP = {
  INITIATED: 1,
  PAYMENT_HELD: 1,
  OFFERED: 2,
  ACCEPTED: 3,
  MATERIALS_COLLECTED: 4,
  EN_ROUTE: 5,
  AWAITING_CODE: 6,
  COMPLETED: 8,
};

export function inr(n) {
  return `Rs ${n}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function seedWorkers() {
  return [
    {
      id: "w1",
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      jobsToday: 1,
      onDuty: true,
      skill: "Electrical",
    },
    {
      id: "w2",
      name: "Suresh Verma",
      phone: "+91 98765 43211",
      jobsToday: 0,
      onDuty: true,
      skill: "Electrical",
    },
  ];
}

export function makeEmptyState() {
  return {
    role: "landing",
    session: null,
    job: null,
    workers: seedWorkers(),
    ledger: [],
    codeError: "",
    merchantScanned: false,
    gpsMode: "off",
    gpsError: "",
    workerLat: PLACES.worker.lat,
    workerLng: PLACES.worker.lng,
    gpsAccuracy: null,
    gpsUpdatedAt: null,
  };
}

export function buildJob({ intakeType, transcript, videoName, category, urgency }) {
  const materials = CATEGORY_MATERIALS[category] || DEMO_MATERIALS;
  const createdAt = nowIso();
  return {
    id: DEMO_JOB_ID,
    clientName: CLIENT.name,
    clientAddress: CLIENT.address,
    intakeType,
    transcript: transcript || "",
    videoName: videoName || "",
    category,
    urgency: urgency || "High",
    materials,
    materialTotal: FEES.materialTotal,
    labourFee: FEES.labourFee,
    platformFee: FEES.platformFee,
    welfareFee: FEES.welfareFee,
    workerPayout: FEES.workerPayout,
    clientPaid: FEES.clientPaid,
    centralFundBalance: 0,
    merchantPaidAt: null,
    workerPaidAt: null,
    workerId: null,
    workerName: "",
    offeredWorkerId: null,
    declinedWorkerIds: [],
    status: "INITIATED",
    uniqueCode: DEMO_CODE,
    qrPayload: null,
    qrScanned: false,
    createdAt,
    timeline: [
      {
        status: "INITIATED",
        at: createdAt,
        note: `${CLIENT.name} created a ${intakeType} request (${category}).`,
      },
    ],
  };
}

export function fundBreakdown(job) {
  if (!job || job.status === "INITIATED") {
    return { locked: 0, merchant: 0, worker: 0, cooperative: 0, vault: 0 };
  }
  const merchantReleased = Boolean(job.merchantPaidAt);
  const workerReleased = Boolean(job.workerPaidAt);
  return {
    locked: workerReleased ? 0 : job.centralFundBalance,
    merchant: merchantReleased ? job.materialTotal : 0,
    worker: workerReleased ? job.workerPayout : 0,
    cooperative: workerReleased ? job.platformFee + job.welfareFee : 0,
    vault: job.centralFundBalance,
  };
}

export function trackerPhase(job, stepIndex) {
  if (!job) return "todo";
  const current =
    job.status === "INITIATED" || job.status === "PAYMENT_HELD"
      ? 0
      : job.status === "OFFERED" || job.status === "ACCEPTED"
        ? 1
        : job.status === "MATERIALS_COLLECTED"
          ? 2
          : job.status === "EN_ROUTE" || job.status === "AWAITING_CODE"
            ? 3
            : 4;
  if (job.status === "COMPLETED") return "done";
  if (stepIndex < current) return "done";
  if (stepIndex === current) return "active";
  return "todo";
}

export function pickFairWorker(workers, declinedIds = []) {
  const eligible = workers
    .filter((w) => w.onDuty && !declinedIds.includes(w.id))
    .sort((a, b) => a.jobsToday - b.jobsToday || a.id.localeCompare(b.id));
  return eligible[0] || null;
}
