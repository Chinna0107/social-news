import { useState, useEffect, useRef } from "react";
import { Save, RefreshCw, Image as ImageIcon, Loader2 } from "lucide-react";

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/selfie-settings";
const token = () => localStorage.getItem("token");

interface SelfieSettings {
  campaign_title: string;
  campaign_subtitle: string;
  accent_color: string;
  frame_color: string;
  watermark_text: string;
  hashtag: string;
  is_active: boolean;
}

const DEFAULT: SelfieSettings = {
  campaign_title: "Proud Supporter",
  campaign_subtitle: "Social News Campaign",
  accent_color: "#E31B23",
  frame_color: "#011B4A",
  watermark_text: "SOCIALNEWS.ORG",
  hashtag: "#SocialNewsCampaign",
  is_active: true,
};

export default function AdminSelfieManagement() {
  const [settings, setSettings] = useState<SelfieSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(d => {
        if (d && d.campaign_title) setSettings(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save settings. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof SelfieSettings, placeholder?: string) => (
    <div>
      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">{label}</label>
      {key === "is_active" ? (
        <div className="flex items-center gap-3 mt-1">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!settings[key]}
              onChange={e => setSettings(s => ({ ...s, [key]: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
          <span className="text-sm font-semibold text-secondary">{settings.is_active ? "Active" : "Disabled"}</span>
        </div>
      ) : key === "accent_color" || key === "frame_color" ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={String(settings[key])}
            onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
            className="w-10 h-10 rounded-lg border border-border cursor-pointer"
          />
          <input
            type="text"
            value={String(settings[key])}
            onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 font-mono"
          />
        </div>
      ) : (
        <input
          type="text"
          value={String(settings[key])}
          onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Selfie Frame Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure the selfie frame content. Changes reflect instantly in both <strong>Student</strong> and <strong>User</strong> selfie pages.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSettings(DEFAULT)}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
              saved ? "bg-success text-white" : "bg-secondary text-white hover:bg-secondary/90"
            } disabled:opacity-60`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-secondary text-base border-b pb-2">Campaign Text</h3>
              {field("Campaign Title (Supporter Label)", "campaign_title", "e.g. Proud Supporter")}
              {field("Campaign Subtitle / Name", "campaign_subtitle", "e.g. Reforest The Amazon")}
              {field("Watermark Text", "watermark_text", "e.g. SOCIALNEWS.ORG")}
              {field("Hashtag", "hashtag", "e.g. #SocialNewsCampaign")}
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-secondary text-base border-b pb-2">Frame Colors</h3>
              {field("Frame Border Color", "frame_color")}
              {field("Accent / Highlight Color", "accent_color")}
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h3 className="font-bold text-secondary text-base border-b pb-2 mb-4">Visibility</h3>
              {field("Frame Active", "is_active")}
              <p className="text-xs text-muted-foreground mt-3">
                When disabled, users will see a "No active frame" message on the selfie page.
              </p>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h3 className="font-bold text-secondary text-base border-b pb-2 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Live Preview
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                This is how the selfie frame overlay looks to users. Upload a photo to see the full effect.
              </p>

              {/* Preview Frame */}
              <div className="flex justify-center">
                <div ref={frameRef} className="relative w-[280px] h-[280px] overflow-hidden bg-slate-200 shadow-xl rounded-sm">
                  {/* Placeholder photo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white/50" />
                  </div>

                  {/* Border overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ border: `16px solid ${settings.frame_color}` }}
                  />

                  {/* Bottom gradient panel */}
                  <div
                    className="absolute bottom-0 left-0 right-0 pointer-events-none pt-12 pb-4 px-4"
                    style={{
                      background: `linear-gradient(to top, ${settings.frame_color}EE, ${settings.frame_color}CC, transparent)`
                    }}
                  >
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/80 text-[9px] font-bold uppercase tracking-widest mb-0.5">
                          {settings.campaign_title}
                        </p>
                        <h2 className="text-white font-black text-base leading-none">
                          {settings.campaign_subtitle.split(" ").slice(0, 2).join(" ")}<br />
                          <span style={{ color: settings.accent_color }}>
                            {settings.campaign_subtitle.split(" ").slice(2).join(" ") || "Campaign"}
                          </span>
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-[8px] font-bold">{settings.watermark_text}</p>
                      </div>
                    </div>
                  </div>

                  {/* Top-left logo badge */}
                  <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded shadow-lg pointer-events-none">
                    <p className="font-black text-xs tracking-tighter" style={{ color: settings.frame_color }}>
                      SOCIAL<span style={{ color: settings.accent_color }}>NEWS</span>
                    </p>
                  </div>

                  {/* Inactive overlay */}
                  {!settings.is_active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded">Frame Disabled</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                {settings.hashtag}
              </p>
            </div>

            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
              <h4 className="font-bold text-secondary text-sm mb-2">📌 How it works</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Save your changes here — they take effect immediately.</li>
                <li>Student and User selfie pages automatically load these settings.</li>
                <li>Users upload their photo, which gets overlaid with this frame.</li>
                <li>They can download and share their selfie with the hashtag.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
