import { useRef, useState } from "react";
import {
  Bell,
  Droplets,
  Hammer,
  LayoutGrid,
  MapPin,
  Mic,
  PaintBucket,
  Store,
  Tv,
  Video,
  Zap,
} from "lucide-react";
import { CentralFund } from "../components/CentralFund";
import { JobStepper } from "../components/JobStepper";
import { LiveMap } from "../components/LiveMap";
import { Receipt } from "../components/Receipt";
import { WorkerEtaBanner } from "../components/WorkerEtaBanner";
import { CATALOG, CLIENT, DEMO_TRANSCRIPT, inr, MERCHANT } from "../data/seed";
import { createRequest, payToCentralFund, useStore } from "../store";

const CATALOG_META = {
  Plumbing: { icon: Droplets, short: "Plumber", color: "text-forest" },
  Electrical: { icon: Zap, iconColor: "text-accent", short: "Electrician" },
  Carpentry: { icon: Hammer, iconColor: "text-slate-600", short: "Carpenter" },
  Painting: { icon: PaintBucket, iconColor: "text-red-500", short: "Painter" },
  Appliance: { icon: Tv, iconColor: "text-sky-500", short: "Appliance" },
  Other: { icon: LayoutGrid, iconColor: "text-navy", short: "Other" },
};

function statusCopy(job) {
  if (!job) return "";
  if (job.status === "INITIATED") return "Awaiting payment";
  if (job.status === "PAYMENT_HELD" || job.status === "OFFERED") return "Dispatching worker";
  if (job.status === "ACCEPTED") return "Worker collecting material";
  if (job.status === "MATERIALS_COLLECTED") return "Materials packed";
  if (job.status === "EN_ROUTE") return "Worker En Route";
  if (job.status === "AWAITING_CODE") return "Share unique code";
  if (job.status === "COMPLETED") return "Completed ✓";
  return job.status;
}

export function ClientModule() {
  const { job, workerLat, workerLng } = useStore();
  const [tracking, setTracking] = useState(false);
  const [modal, setModal] = useState(null);
  const [listening, setListening] = useState(false);
  const [upiOpen, setUpiOpen] = useState(false);
  const fileRef = useRef(null);

  const showCode = job && ["EN_ROUTE", "AWAITING_CODE", "COMPLETED"].includes(job.status);

  function diagnose(payload) {
    createRequest({
      intakeType: payload.intakeType,
      transcript: payload.transcript || DEMO_TRANSCRIPT,
      videoName: payload.videoName || "",
      category: payload.category || "Electrical",
      urgency: "High",
    });
    setModal("quote");
  }

  function startAudio() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      diagnose({ intakeType: "audio", transcript: DEMO_TRANSCRIPT, category: "Electrical" });
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => {
      setListening(false);
      diagnose({ intakeType: "audio", transcript: DEMO_TRANSCRIPT, category: "Electrical" });
    };
    rec.onresult = (event) => {
      diagnose({
        intakeType: "audio",
        transcript: event.results[0]?.[0]?.transcript || DEMO_TRANSCRIPT,
        category: "Electrical",
      });
    };
    rec.start();
  }

  function onVideoFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    diagnose({ intakeType: "video", videoName: file.name, category: "Electrical" });
  }

  return (
    <div>
      {!tracking ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="mb-0 text-xl font-bold">Good morning, Sunita 👋</h4>
              <span className="text-sm text-slate-500">
                <MapPin className="mr-1 inline h-3.5 w-3.5 text-red-500" />
                {CLIENT.address}
              </span>
            </div>
            <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-600">
              <Bell className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 rounded-xl bg-forest p-3 text-white shadow-sm">
            <div className="flex items-center">
              <div className="w-2/3">
                <h5 className="mb-1 font-bold">Have a home repair issue?</h5>
                <p className="mb-2 text-sm text-white/75">Speak in your language or capture a quick video.</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModal("voice")}
                    className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-slate-900"
                  >
                    <Mic className="mr-1 inline h-4 w-4" /> Speak
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal("voice")}
                    className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-slate-900"
                  >
                    <Video className="mr-1 inline h-4 w-4" /> Video
                  </button>
                </div>
              </div>
              <div className="w-1/3 text-center">
                <Mic className="mx-auto h-16 w-16 text-accent opacity-75" />
              </div>
            </div>
          </div>

          <h6 className="mb-3 font-bold">Or select a service</h6>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {CATALOG.map((category) => {
              const meta = CATALOG_META[category] || CATALOG_META.Other;
              const Icon = meta.icon;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    diagnose({
                      intakeType: "catalog",
                      category: category === "Other" ? "Electrical" : category,
                      transcript: category === "Electrical" || category === "Other" ? DEMO_TRANSCRIPT : `${category} service requested from catalog`,
                    })
                  }
                  className="sewa-card sewa-card-hover p-3 text-center"
                >
                  <Icon className={`mx-auto mb-1 h-8 w-8 ${meta.iconColor || meta.color || "text-forest"}`} />
                  <span className="text-sm font-bold">{meta.short}</span>
                </button>
              );
            })}
          </div>

          {job ? (
            <>
              <div className="mb-2 flex items-center justify-between">
                <h6 className="font-bold">Active Request Tracking</h6>
                <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">Live Job #{job.id.replace("JOB-", "")}</span>
              </div>
              <div className="sewa-card mb-3 border-l-4 border-emerald-500 p-3">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h6 className="font-bold">{job.category} repair</h6>
                    <small className="text-slate-500">
                      Job ID: #{job.id}{job.workerName ? ` • Assigned: ${job.workerName}` : ""}
                    </small>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${job.status === "COMPLETED" ? "bg-emerald-600 text-white" : "bg-accent text-slate-900"}`}>
                    {statusCopy(job)}
                  </span>
                </div>
                <div className="mb-3 flex items-center gap-2 rounded-lg border-2 border-dashed border-forest bg-[rgba(15,81,50,0.03)] p-2">
                  <Store className="h-8 w-8 shrink-0 text-forest" />
                  <div className="text-sm">
                    <strong className="block text-forest">On-the-way Material Pickup</strong>
                    <span>
                      {MERCHANT.name} is packing: {job.materials.map((m) => m.name).join(", ")}.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTracking(true)}
                  className="w-full rounded-md border border-forest py-2 text-sm font-bold text-forest"
                >
                  View Full Live Tracker & unique code
                </button>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div>
          <button type="button" onClick={() => setTracking(false)} className="mb-2 font-bold text-slate-800">
            ← Back to Home
          </button>
          {job?.status === "COMPLETED" ? (
            <Receipt job={job} />
          ) : job ? (
            <div className="sewa-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <h5 className="font-bold">{job.id}</h5>
                <span className="rounded-full bg-forest px-2 py-1 text-xs text-white">{statusCopy(job)}</span>
              </div>
              <p className="mb-3 text-sm text-slate-500">
                {job.category} · material pickup coordination.
              </p>
              {(job.status === "EN_ROUTE" || job.status === "AWAITING_CODE" || job.status === "ACCEPTED" || job.status === "MATERIALS_COLLECTED") ? (
                <WorkerEtaBanner workerName={job.workerName} />
              ) : null}
              <div className="mb-3">
                <LiveMap workerLat={workerLat} workerLng={workerLng} height={300} />
              </div>
              <JobStepper job={job} variant="track" />
              <div className="mb-3 mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong>Assigned Worker:</strong>
                    <br />
                    {job.workerName || "Fair queue dispatch"}
                  </div>
                  <div>
                    <strong>Local Shop:</strong>
                    <br />
                    {MERCHANT.name}
                  </div>
                  <div className="col-span-2 mt-1">
                    <strong>Required Materials:</strong>
                    <span className="block text-slate-500">{job.materials.map((m) => m.name).join(", ")}</span>
                  </div>
                </div>
              </div>
              {showCode ? (
                <div className="mb-3 rounded-xl border border-accent bg-amber-50 p-3 text-center">
                  <span className="text-xs font-bold uppercase text-slate-500">Unique code</span>
                  <h2 className="my-1 text-4xl font-bold tracking-[0.35em] text-slate-900">{job.uniqueCode}</h2>
                  <span className="text-sm text-slate-500">Share this code only after work is done</span>
                </div>
              ) : null}
              <div className="rounded-xl bg-slate-50 p-2 text-center text-sm">
                <span className="text-slate-500">
                  Estimated Total: <strong>₹{job.clientPaid}</strong> (Material: ₹{job.materialTotal} | Labour: ₹{job.labourFee})
                </span>
                <span className="mt-1 block text-emerald-700">Payment held securely by SEWA-SETU Cooperative</span>
              </div>
              {job.status === "INITIATED" ? (
                <button
                  type="button"
                  onClick={() => setUpiOpen(true)}
                  className="mt-3 w-full rounded-md bg-forest py-3 font-semibold text-white"
                >
                  Pay Rs 650 to SEWA Central Fund
                </button>
              ) : (
                <div className="mt-3">
                  <CentralFund job={job} />
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {modal === "voice" || modal === "quote" ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between bg-forest px-4 py-3 text-white">
              <h5 className="font-bold">
                <Mic className="mr-1 inline h-4 w-4" /> Voice & AI Request Diagnosis
              </h5>
              <button type="button" className="text-white" onClick={() => setModal(null)}>
                ×
              </button>
            </div>
            <div className="p-4 text-center">
              {modal === "voice" ? (
                <>
                  <button
                    type="button"
                    onClick={startAudio}
                    className="pulse-mic mb-3 rounded-full bg-red-500 p-5 text-white"
                  >
                    <Mic className="h-10 w-10" />
                  </button>
                  <h6 className="font-bold">{listening ? "Listening…" : "Tap microphone and describe your issue"}</h6>
                  <p className="text-sm text-slate-500">Example: “{DEMO_TRANSCRIPT}”</p>
                  <button
                    type="button"
                    onClick={() => diagnose({ intakeType: "audio", transcript: DEMO_TRANSCRIPT, category: "Electrical" })}
                    className="mt-3 text-sm font-medium text-forest underline"
                  >
                    {DEMO_TRANSCRIPT}
                  </button>
                  <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onVideoFile} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 w-full rounded-md border border-slate-200 py-2 text-sm font-semibold"
                  >
                    Attach video instead
                  </button>
                </>
              ) : job ? (
                <div className="text-left">
                  <div className="mb-3 rounded-md bg-emerald-50 p-2 text-sm text-emerald-800">Speech Transcribed Successfully</div>
                  {job.transcript ? (
                    <blockquote className="mb-3 rounded-lg bg-slate-50 p-2 text-sm">“{job.transcript}”</blockquote>
                  ) : null}
                  <div className="mb-3 rounded-xl border border-forest bg-slate-50 p-3 text-sm">
                    <h6 className="mb-2 font-bold text-forest">AI Request Diagnosis</h6>
                    <div>
                      <strong>Detected Service:</strong> {job.category} · {job.urgency}
                    </div>
                    <div className="mt-1">
                      <strong>Suggested Required Materials:</strong>
                      <ul className="mb-0 list-disc ps-4">
                        {job.materials.map((sku) => (
                          <li key={sku.name}>
                            {sku.name} · {inr(sku.cost)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Labour {inr(job.labourFee)} · Total {inr(job.clientPaid)} · Worker {inr(job.workerPayout)} after cutoff
                    </p>
                  </div>
                  {job.status === "INITIATED" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setModal(null);
                        setUpiOpen(true);
                      }}
                      className="w-full rounded-md bg-forest py-3 font-bold text-white"
                    >
                      Pay Rs 650 to SEWA Central Fund
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setModal(null);
                        setTracking(true);
                      }}
                      className="w-full rounded-md bg-forest py-3 font-bold text-white"
                    >
                      Confirm & Request Coordinated Job
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {upiOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <p className="text-sm font-semibold text-forest">Mock UPI</p>
            <p className="mt-1 text-lg font-bold">Pay {inr(650)} to sewasetu@upi</p>
            <p className="mt-1 text-sm text-slate-500">SEWA Central Fund · escrow vault</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setUpiOpen(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  payToCentralFund();
                  setUpiOpen(false);
                  setTracking(true);
                }}
                className="flex-1 rounded-xl bg-forest py-3 text-sm font-semibold text-white"
              >
                Pay now
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

