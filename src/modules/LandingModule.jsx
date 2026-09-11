import { useState } from "react";
import { Building2, Store, User, Wrench } from "lucide-react";
import { DEMO_ACCOUNTS } from "../data/seed";
import { login, setRole } from "../store";

const ROLES = [
  {
    id: "client",
    title: "Customer",
    copy: "Request repairs via Voice/AI & track job live.",
    cta: "Open App",
    icon: User,
    iconClass: "text-forest",
    btn: "bg-forest text-white",
    border: "border-forest",
  },
  {
    id: "worker",
    title: "Worker",
    copy: "Accept jobs, pick up parts on route, earn income.",
    cta: "Open App",
    icon: Wrench,
    iconClass: "text-emerald-600",
    btn: "bg-emerald-600 text-white",
    border: "border-emerald-500",
  },
  {
    id: "merchant",
    title: "Local Shop",
    copy: "Confirm required inventory & prepare pickup.",
    cta: "Open App",
    icon: Store,
    iconClass: "text-accent",
    btn: "bg-accent text-slate-900",
    border: "border-accent",
  },
  {
    id: "admin",
    title: "Cooperative",
    copy: "Governance, welfare, job fair distribution & analytics.",
    cta: "Open Dashboard",
    icon: Building2,
    iconClass: "text-navy",
    btn: "bg-navy text-white",
    border: "border-navy",
  },
];

export function LandingModule() {
  const [email, setEmail] = useState("client@sewasetu.in");
  const [password, setPassword] = useState("Sewa@123");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const msg = login(email, password);
    setError(msg || "");
  }

  return (
    <div>
      <div className="py-4 text-center">
        <h1 className="mb-2 text-4xl font-bold text-forest">SEWA-SETU</h1>
        <p className="text-lg font-semibold text-slate-600">One request. One coordinated service.</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          Connecting households, local skilled workers, and neighborhood hardware merchants in a unified, cooperative workflow.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ROLES.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setRole(role.id)}
              className={`sewa-card sewa-card-hover border p-3 text-center transition ${role.border}`}
            >
              <Icon className={`mx-auto h-10 w-10 ${role.iconClass}`} />
              <h5 className="mt-2 font-bold">{role.title}</h5>
              <p className="mt-1 text-xs text-slate-500">{role.copy}</p>
              <span className={`mt-3 inline-block w-full rounded-md px-3 py-1.5 text-sm font-semibold ${role.btn}`}>
                {role.cta}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sewa-card mb-4 p-4">
        <h4 className="mb-1 text-center text-lg font-bold">Demo accounts</h4>
        <p className="mb-3 text-center text-sm text-slate-500">Password for all: <strong>Sewa@123</strong></p>
        <form onSubmit={submit} className="mx-auto max-w-md space-y-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Password"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-md bg-forest py-2.5 font-semibold text-white">
            Login
          </button>
        </form>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => {
                setEmail(acc.email);
                setPassword(acc.password);
                login(acc.email, acc.password);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-left text-xs"
            >
              <strong className="block capitalize">{acc.role === "client" ? "Customer" : acc.role}</strong>
              <span className="text-slate-500">{acc.email}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sewa-card mb-4 p-4">
        <h4 className="mb-4 text-center text-xl font-bold">Why SEWA-SETU is Different</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:border-r md:border-slate-100 md:pr-4">
            <span className="mb-2 inline-block rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              Traditional Fragmented Model
            </span>
            <ul className="mt-2 space-y-2 text-sm text-slate-500">
              <li>❌ Customer calls worker manually.</li>
              <li>❌ Worker inspects problem at customer's place.</li>
              <li>❌ Worker discovers parts are needed.</li>
              <li>❌ Worker travels to hardware shop & returns.</li>
              <li>❌ Significant delay, lost hours & uncoordinated costs.</li>
            </ul>
          </div>
          <div>
            <span className="mb-2 inline-block rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              SEWA-SETU Coordinated Workflow
            </span>
            <ul className="mt-2 space-y-2 text-sm font-semibold text-slate-700">
              <li>✅ Voice/AI diagnoses job & suggests materials.</li>
              <li>✅ Local shop packs items in advance.</li>
              <li>✅ Worker collects packed items on the way.</li>
              <li>✅ Single visit completion with unique code.</li>
              <li>✅ Cooperative backing guarantees worker welfare.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-navy p-3 text-center text-white">
        <p className="mb-1 font-bold text-accent">Interactive Presentation Mode</p>
        <p className="text-sm text-white/75">
          Use the bottom navigation bar at any time to switch roles and experience the live synchronized state for Job #1042.
        </p>
      </div>
    </div>
  );
}
