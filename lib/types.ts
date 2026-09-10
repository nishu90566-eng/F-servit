export type Role = "client" | "worker" | "admin";

export type JobStatus =
  | "INITIATED"
  | "DIAGNOSED"
  | "PAYMENT_HELD"
  | "EN_ROUTE"
  | "COMPLETED"
  | "DISPUTED"
  | "CANCELLED";

export type Urgency = "low" | "medium" | "high" | "emergency";

export type EscrowStatus = "none" | "held" | "released" | "refunded";

export type KycStatus = "pending" | "verified" | "rejected";

export interface Sku {
  id: string;
  name: string;
  qty: number;
  unitRate: number;
  counterId?: string;
}

export interface Job {
  id: string;
  clientId: string;
  workerId?: string;
  status: JobStatus;
  voiceTranscript: string;
  skill: string;
  urgency: Urgency;
  address: string;
  lat: number;
  lng: number;
  skus: Sku[];
  materialsInr: number;
  labourInr: number;
  platformFeeInr: 50;
  totalInr: number;
  escrowStatus: EscrowStatus;
  otp: string;
  otpVerifiedAt?: string;
  qrMaterialCode?: string;
  qrScanned?: boolean;
  arrived?: boolean;
  photos: string[];
  notes?: string;
  timeline: { status: JobStatus; at: string; note: string }[];
}

export interface WorkerProfile {
  id: string;
  name: string;
  cooperativeId: string;
  skills: string[];
  lat: number;
  lng: number;
  available: boolean;
  takeHomeThisWeek: number;
  hoursThisWeek: number;
  kyc: KycStatus;
  rating: number;
  photo: string;
  distanceKm?: number;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  address?: string;
  society?: string;
}

export interface MaterialStock {
  skuId: string;
  name: string;
  counters: { id: string; name: string; qty: number }[];
  clientCollect: boolean;
}

export interface Dispute {
  id: string;
  jobId: string;
  from: string;
  status: "open" | "resolved";
  thread: { at: string; author: string; body: string }[];
  evidence: string[];
}

export interface Kpis {
  timeToAcceptMin: number;
  otpSuccessRate: number;
  hoursPerWeek: number;
  takeHomeVsPrivatePct: number;
  repeatRate: number;
  grievanceHours: number;
}

export const FLOW: JobStatus[] = [
  "INITIATED",
  "DIAGNOSED",
  "PAYMENT_HELD",
  "EN_ROUTE",
  "COMPLETED",
];
