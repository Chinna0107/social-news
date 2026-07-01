import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, UserPlus, X } from "lucide-react";

const POPUP_STORAGE_KEY = "social_voice_program_popup_dismissed";

export function ProgramPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (dismissed) return;

    const timer = window.setTimeout(() => setIsVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const closePopup = () => {
    sessionStorage.setItem(POPUP_STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden border border-white/20">
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close program popup"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 text-secondary hover:bg-white flex items-center justify-center shadow"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-44 bg-secondary overflow-hidden">
          <img
            src="https://picsum.photos/seed/social-voice-program/900/500"
            alt="Ongoing program"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
          <div className="absolute left-5 bottom-5 right-14">
            <span className="inline-flex items-center gap-2 bg-destructive text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Registration Open
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">Ongoing Program</h2>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-black text-secondary mb-2">Social Voice Community Program</h3>
          <p className="text-sm text-foreground/70 leading-relaxed mb-5">
            Join the current program for public updates, volunteer activities, student participation, certificates, and campaign registrations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 border border-border rounded-lg p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Status</p>
              <p className="text-sm font-bold text-secondary">Ongoing</p>
            </div>
            <div className="bg-slate-50 border border-border rounded-lg p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Mode</p>
              <p className="text-sm font-bold text-secondary">Online Registration</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              onClick={closePopup}
              className="flex-1 bg-destructive text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Register Now
            </Link>
            <Link
              to="/campaigns"
              onClick={closePopup}
              className="flex-1 border border-border text-secondary px-5 py-3 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-4 h-4" /> View Program
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
