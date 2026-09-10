import type { Dispute, Job, Kpis, MaterialStock, Sku, UserAccount, WorkerProfile } from "./types";

export const HOUSE = { lat: 28.4089, lng: 77.3178 };

export const CATALOG: Sku[] = [
  { id: "tap-cartridge", name: "Tap cartridge", qty: 1, unitRate: 620, counterId: "A" },
  { id: "washer-set", name: "Washer set", qty: 1, unitRate: 150, counterId: "A" },
  { id: "teflon-tape", name: "Teflon tape", qty: 1, unitRate: 80, counterId: "A" },
  { id: "pvc-elbow", name: "PVC elbow", qty: 1, unitRate: 35, counterId: "B" },
  { id: "mcb", name: "MCB 16A", qty: 1, unitRate: 180, counterId: "B" },
  { id: "led-bulb", name: "LED bulb 9W", qty: 1, unitRate: 90, counterId: "B" },
  { id: "pipe-clamp", name: "Pipe clamp", qty: 1, unitRate: 45, counterId: "A" },
  { id: "sealant", name: "Thread sealant", qty: 1, unitRate: 70, counterId: "A" },
];

export const USERS: UserAccount[] = [
  {
    id: "c1",
    email: "client@servit.in",
    password: "Servit@123",
    name: "Ravi Sharma",
    role: "client",
    address: "Sector 21, Faridabad",
  },
  {
    id: "w1",
    email: "worker@servit.in",
    password: "Servit@123",
    name: "Kuldeep Singh",
    role: "worker",
  },
  {
    id: "a1",
    email: "admin@servit.in",
    password: "Servit@123",
    name: "Secretary",
    role: "admin",
    society: "Balaji Nagar Cooperative Society",
  },
];

export const WORKERS: WorkerProfile[] = [
  {
    id: "w1",
    name: "Kuldeep Singh",
    cooperativeId: "C-4419",
    skills: ["Plumbing"],
    lat: 28.4258,
    lng: 77.3284,
    available: true,
    takeHomeThisWeek: 4200,
    hoursThisWeek: 18,
    kyc: "verified",
    rating: 4.8,
    photo: "KS",
    distanceKm: 2.1,
  },
  {
    id: "w2",
    name: "Amit Verma",
    cooperativeId: "C-4420",
    skills: ["Electrical"],
    lat: 28.4221,
    lng: 77.3301,
    available: true,
    takeHomeThisWeek: 3600,
    hoursThisWeek: 16,
    kyc: "verified",
    rating: 4.6,
    photo: "AV",
    distanceKm: 1.8,
  },
  {
    id: "w3",
    name: "Suresh Yadav",
    cooperativeId: "C-4421",
    skills: ["Plumbing"],
    lat: 28.4304,
    lng: 77.3092,
    available: false,
    takeHomeThisWeek: 0,
    hoursThisWeek: 0,
    kyc: "pending",
    rating: 0,
    photo: "SY",
    distanceKm: 2.8,
  },
];

const tapKit: Sku[] = [
  { ...CATALOG[0], qty: 1 },
  { ...CATALOG[2], qty: 1 },
  { ...CATALOG[1], qty: 1 },
];

function iso(h: number) {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
}

export const JOBS: Job[] = [
  {
    id: "JOB-1042",
    clientId: "c1",
    status: "INITIATED",
    voiceTranscript: "",
    skill: "Plumbing",
    urgency: "medium",
    address: "Sector 21, Faridabad",
    lat: HOUSE.lat,
    lng: HOUSE.lng,
    skus: tapKit,
    materialsInr: 850,
    labourInr: 600,
    platformFeeInr: 50,
    totalInr: 1500,
    escrowStatus: "none",
    otp: "482917",
    qrMaterialCode: "SRV-MAT-1042",
    photos: [],
    timeline: [{ status: "INITIATED", at: iso(0.1), note: "Household opened a voice request." }],
  },
  {
    id: "JOB-1038",
    clientId: "c1",
    workerId: "w2",
    status: "COMPLETED",
    voiceTranscript: "Fan not starting, sparking at the switch.",
    skill: "Electrical",
    urgency: "low",
    address: "Sector 21, Faridabad",
    lat: HOUSE.lat,
    lng: HOUSE.lng,
    skus: [{ ...CATALOG[4], qty: 1 }],
    materialsInr: 180,
    labourInr: 400,
    platformFeeInr: 50,
    totalInr: 630,
    escrowStatus: "released",
    otp: "110229",
    otpVerifiedAt: iso(26),
    qrMaterialCode: "SRV-MAT-1038",
    qrScanned: true,
    arrived: true,
    photos: ["after-fan.jpg"],
    timeline: [
      { status: "INITIATED", at: iso(30), note: "Voice intake" },
      { status: "DIAGNOSED", at: iso(29), note: "AI quote" },
      { status: "PAYMENT_HELD", at: iso(28), note: "UPI escrow" },
      { status: "EN_ROUTE", at: iso(27), note: "Amit accepted at 1.8 km" },
      { status: "COMPLETED", at: iso(26), note: "OTP released wage" },
    ],
  },
  {
    id: "JOB-1040",
    clientId: "c1",
    workerId: "w1",
    status: "DISPUTED",
    voiceTranscript: "Bathroom drain slow after last visit.",
    skill: "Plumbing",
    urgency: "medium",
    address: "Sector 21, Faridabad",
    lat: HOUSE.lat,
    lng: HOUSE.lng,
    skus: [{ ...CATALOG[7], qty: 1 }],
    materialsInr: 70,
    labourInr: 350,
    platformFeeInr: 50,
    totalInr: 470,
    escrowStatus: "held",
    otp: "773310",
    qrMaterialCode: "SRV-MAT-1040",
    photos: ["drain-before.jpg"],
    timeline: [
      { status: "INITIATED", at: iso(10), note: "Voice intake" },
      { status: "PAYMENT_HELD", at: iso(9), note: "Escrow locked" },
      { status: "DISPUTED", at: iso(4), note: "Household opened a grievance" },
    ],
  },
  {
    id: "JOB-1041",
    clientId: "c1",
    status: "PAYMENT_HELD",
    voiceTranscript: "Main line burst, water flooding parking.",
    skill: "Plumbing",
    urgency: "emergency",
    address: "Balaji Nagar society gate",
    lat: 28.4112,
    lng: 77.321,
    skus: [
      { ...CATALOG[3], qty: 2 },
      { ...CATALOG[6], qty: 2 },
    ],
    materialsInr: 160,
    labourInr: 900,
    platformFeeInr: 50,
    totalInr: 1110,
    escrowStatus: "held",
    otp: "900011",
    qrMaterialCode: "SRV-MAT-1041",
    photos: [],
    timeline: [
      { status: "INITIATED", at: iso(1), note: "Emergency voice" },
      { status: "DIAGNOSED", at: iso(0.9), note: "Roster pinged" },
      { status: "PAYMENT_HELD", at: iso(0.8), note: "Escrow locked, 30-min roster live" },
    ],
  },
];

export const MATERIALS: MaterialStock[] = CATALOG.map((sku) => ({
  skuId: sku.id,
  name: sku.name,
  clientCollect: sku.id === "led-bulb",
  counters: [
    { id: "A", name: "Counter A — plumbing", qty: sku.counterId === "A" ? 18 : 4 },
    { id: "B", name: "Counter B — electrical", qty: sku.counterId === "B" ? 22 : 3 },
  ],
}));

export const DISPUTES: Dispute[] = [
  {
    id: "D-12",
    jobId: "JOB-1040",
    from: "Ravi Sharma",
    status: "open",
    evidence: ["drain-before.jpg"],
    thread: [
      { at: iso(4), author: "Ravi Sharma", body: "Drain is still slow after the last visit." },
      { at: iso(3.5), author: "Secretary", body: "Holding escrow. Asking Kuldeep for a second visit." },
    ],
  },
];

export const KPIS: Kpis = {
  timeToAcceptMin: 4.2,
  otpSuccessRate: 98,
  hoursPerWeek: 17.4,
  takeHomeVsPrivatePct: 33,
  repeatRate: 64,
  grievanceHours: 6.5,
};

export function makeSeed() {
  return {
    users: structuredClone(USERS),
    workers: structuredClone(WORKERS),
    jobs: structuredClone(JOBS),
    materials: structuredClone(MATERIALS),
    disputes: structuredClone(DISPUTES),
    kpis: { ...KPIS },
    catalog: structuredClone(CATALOG),
  };
}
