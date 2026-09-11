import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { useLiveTracking } from "./components/useLiveTracking";
import { AdminModule } from "./modules/AdminModule";
import { ClientModule } from "./modules/ClientModule";
import { LandingModule } from "./modules/LandingModule";
import { MerchantModule } from "./modules/MerchantModule";
import { WorkerModule } from "./modules/WorkerModule";
import { useStore } from "./store";

export default function App() {
  const { role } = useStore();
  useLiveTracking();

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-3 py-3">
        {role === "landing" ? <LandingModule /> : null}
        {role === "client" ? <ClientModule /> : null}
        {role === "worker" ? <WorkerModule /> : null}
        {role === "merchant" ? <MerchantModule /> : null}
        {role === "admin" ? <AdminModule /> : null}
      </main>
      <BottomNav />
    </div>
  );
}
