import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeSeed } from "./seed";
import type {
  Dispute,
  Job,
  JobStatus,
  Kpis,
  MaterialStock,
  Role,
  Sku,
  UserAccount,
  WorkerProfile,
} from "./types";

export type Locale = "en" | "hi";

function nowIso() {
  return new Date().toISOString();
}

function stamp(job: Job, status: JobStatus, note: string) {
  job.status = status;
  job.timeline = [...job.timeline, { status, at: nowIso(), note }];
}

const seed = makeSeed();

type Session = { role: Role; userId: string; name: string };

type ServitState = {
  locale: Locale;
  session: Session | null;
  hydrated: boolean;
  users: UserAccount[];
  workers: WorkerProfile[];
  jobs: Job[];
  materials: MaterialStock[];
  disputes: Dispute[];
  kpis: Kpis;
  catalog: Sku[];
  setLocale: (locale: Locale) => void;
  login: (email: string, password: string) => string | null;
  loginAs: (role: Role) => void;
  switchRole: (role: Role) => void;
  logout: () => void;
  resetSeed: () => void;
  setHydrated: () => void;
  updateSkus: (jobId: string, skus: Sku[]) => void;
  diagnose: (jobId: string, transcript: string) => void;
  holdPayment: (jobId: string) => void;
  acceptJob: (jobId: string, workerId: string) => void;
  scanQr: (jobId: string) => void;
  markArrived: (jobId: string) => void;
  addProof: (jobId: string, photo: string, notes?: string) => void;
  verifyOtp: (jobId: string, otp: string) => string | null;
  toggleAvailable: (workerId: string) => void;
  setKyc: (workerId: string, kyc: WorkerProfile["kyc"]) => void;
  resolveDispute: (id: string, note: string) => void;
  addDisputeMessage: (id: string, body: string) => void;
  toggleClientCollect: (skuId: string) => void;
};

export const useServit = create<ServitState>()(
  persist(
    (set, get) => ({
      locale: "en",
      session: null,
      hydrated: false,
      ...seed,
      setHydrated: () => set({ hydrated: true }),
      setLocale: (locale) => set({ locale }),
      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );
        if (!user) return "Unknown demo account";
        set({ session: { role: user.role, userId: user.id, name: user.name } });
        return null;
      },
      loginAs: (role) => {
        const user = get().users.find((u) => u.role === role);
        if (!user) return;
        set({ session: { role: user.role, userId: user.id, name: user.name } });
      },
      switchRole: (role) => {
        const user = get().users.find((u) => u.role === role);
        if (!user) return;
        set({ session: { role: user.role, userId: user.id, name: user.name } });
      },
      logout: () => set({ session: null }),
      resetSeed: () => set({ ...makeSeed(), session: get().session }),
      updateSkus: (jobId, skus) =>
        set({
          jobs: get().jobs.map((job) => {
            if (job.id !== jobId) return job;
            const materialsInr = skus.reduce((sum, s) => sum + s.qty * s.unitRate, 0);
            return { ...job, skus, materialsInr, totalInr: materialsInr + job.labourInr + 50 };
          }),
        }),
      diagnose: (jobId, transcript) =>
        set({
          jobs: get().jobs.map((job) => {
            if (job.id !== jobId) return job;
            const next = { ...job, voiceTranscript: transcript, materialsInr: 850, labourInr: 600, totalInr: 1500 };
            stamp(next, "DIAGNOSED", "AI extracted Plumbing, medium urgency, and SKUs.");
            return next;
          }),
        }),
      holdPayment: (jobId) =>
        set({
          jobs: get().jobs.map((job) => {
            if (job.id !== jobId) return job;
            const next = { ...job, escrowStatus: "held" as const };
            stamp(next, "PAYMENT_HELD", "Mock UPI servit@upi collected Rs 1500. Vault locked.");
            return next;
          }),
        }),
      acceptJob: (jobId, workerId) =>
        set({
          jobs: get().jobs.map((job) => {
            if (job.id !== jobId) return job;
            const worker = get().workers.find((w) => w.id === workerId);
            const next = { ...job, workerId };
            stamp(next, "EN_ROUTE", `${worker?.name ?? "Member"} accepted at ${worker?.distanceKm ?? 2.1} km.`);
            return next;
          }),
        }),
      scanQr: (jobId) =>
        set({
          jobs: get().jobs.map((job) =>
            job.id === jobId ? { ...job, qrScanned: true } : job,
          ),
        }),
      markArrived: (jobId) =>
        set({
          jobs: get().jobs.map((job) => (job.id === jobId ? { ...job, arrived: true } : job)),
        }),
      addProof: (jobId, photo, notes) =>
        set({
          jobs: get().jobs.map((job) =>
            job.id === jobId
              ? { ...job, photos: [...job.photos, photo].slice(0, 2), notes: notes ?? job.notes }
              : job,
          ),
        }),
      verifyOtp: (jobId, otp) => {
        const job = get().jobs.find((j) => j.id === jobId);
        if (!job) return "Job missing";
        if (otp !== job.otp) return "OTP does not match";
        set({
          jobs: get().jobs.map((item) => {
            if (item.id !== jobId) return item;
            const next = { ...item, escrowStatus: "released" as const, otpVerifiedAt: nowIso() };
            stamp(next, "COMPLETED", "OTP verified. Rs 600 released to worker, Rs 850 to society, Rs 50 platform.");
            return next;
          }),
        });
        return null;
      },
      toggleAvailable: (workerId) =>
        set({
          workers: get().workers.map((w) =>
            w.id === workerId ? { ...w, available: !w.available } : w,
          ),
        }),
      setKyc: (workerId, kyc) =>
        set({
          workers: get().workers.map((w) => (w.id === workerId ? { ...w, kyc } : w)),
        }),
      resolveDispute: (id, note) =>
        set({
          disputes: get().disputes.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: "resolved",
                  thread: [...d.thread, { at: nowIso(), author: "Secretary", body: note }],
                }
              : d,
          ),
          jobs: get().jobs.map((job) => {
            const d = get().disputes.find((x) => x.id === id);
            if (!d || job.id !== d.jobId) return job;
            const next = { ...job };
            stamp(next, "CANCELLED", "Grievance closed by society secretary.");
            return next;
          }),
        }),
      addDisputeMessage: (id, body) =>
        set({
          disputes: get().disputes.map((d) =>
            d.id === id
              ? { ...d, thread: [...d.thread, { at: nowIso(), author: "Secretary", body }] }
              : d,
          ),
        }),
      toggleClientCollect: (skuId) =>
        set({
          materials: get().materials.map((m) =>
            m.skuId === skuId ? { ...m, clientCollect: !m.clientCollect } : m,
          ),
        }),
    }),
    {
      name: "servit-sih-store",
      skipHydration: true,
      partialize: (s) => ({
        locale: s.locale,
        session: s.session,
        users: s.users,
        workers: s.workers,
        jobs: s.jobs,
        materials: s.materials,
        disputes: s.disputes,
        kpis: s.kpis,
        catalog: s.catalog,
      }),
    },
  ),
);

export function jobById(id: string) {
  return useServit.getState().jobs.find((j) => j.id === id);
}
