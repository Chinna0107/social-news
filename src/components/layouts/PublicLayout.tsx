import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "../news/Header";
import { Footer } from "../news/Footer";
import { BreakingNewsTicker } from "../news/BreakingNewsTicker";
import { ProgramPopup } from "../news/ProgramPopup";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Header />
      <BreakingNewsTicker />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm min-h-[500px]">
          <Outlet />
        </div>
      </main>

      <Footer />
      <ProgramPopup />
      <ScrollRestoration />
    </div>
  );
}
