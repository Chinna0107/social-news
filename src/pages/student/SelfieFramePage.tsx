import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Download, Upload, Image as ImageIcon, Loader2 } from "lucide-react";

const SETTINGS_API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/selfie-settings";

interface SelfieSettings {
  campaign_title: string;
  campaign_subtitle: string;
  accent_color: string;
  frame_color: string;
  watermark_text: string;
  hashtag: string;
  is_active: boolean;
}

const DEFAULT_SETTINGS: SelfieSettings = {
  campaign_title: "Proud Supporter",
  campaign_subtitle: "Social News Campaign",
  accent_color: "#E31B23",
  frame_color: "#011B4A",
  watermark_text: "SOCIALNEWS.ORG",
  hashtag: "#SocialNewsCampaign",
  is_active: true,
};

export default function SelfieFramePage() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [settings, setSettings] = useState<SelfieSettings>(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetch(SETTINGS_API)
      .then(r => r.json())
      .then(d => {
        if (d && d.campaign_title) setSettings(d);
      })
      .catch(console.error)
      .finally(() => setLoadingSettings(false));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!frameRef.current || !userImage) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(frameRef.current, {
        scale: 2,
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Campaign_Selfie.png`;
      link.click();
    } catch (error) {
      console.error("Error generating selfie:", error);
      alert("Failed to download selfie. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!settings.is_active) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ImageIcon className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-secondary mb-2">No Active Selfie Frame</h2>
        <p className="text-muted-foreground">The selfie frame feature is currently unavailable. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 py-8">
      
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Selfie Frame</h1>
          <p className="text-foreground/60">
            Show your support for our campaigns by generating a custom selfie with our official overlay frame.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4">1. Upload your photo</h3>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border hover:border-primary rounded-xl cursor-pointer bg-slate-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-foreground/50 hover:text-primary">
              <Upload className="w-8 h-8 mb-2" />
              <p className="text-sm font-semibold">Click to upload image</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </label>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-2">2. Download &amp; Share</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Once you're happy with how it looks, download your image and share it with {settings.hashtag}!
          </p>
          <button 
            onClick={handleDownload}
            disabled={!userImage || isDownloading}
            className="w-full flex justify-center items-center gap-2 bg-destructive hover:bg-destructive/90 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isDownloading ? "Processing..." : "Download Selfie"} <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Hashtag info */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 text-center">
          <p className="text-sm font-bold text-secondary">{settings.hashtag}</p>
          <p className="text-xs text-muted-foreground mt-1">Share this hashtag when posting your selfie!</p>
        </div>
      </div>

      <div className="lg:w-2/3 flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-border p-8 min-h-[500px]">
        {userImage ? (
          <div className="relative shadow-2xl w-full max-w-[400px] mx-auto" ref={frameRef}>
            <div className="w-full aspect-square relative overflow-hidden bg-white">
              <img 
                src={userImage} 
                alt="User Upload" 
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              
              {/* Border overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ border: `16px solid ${settings.frame_color}` }}
              />
              
              {/* Bottom gradient panel */}
              <div
                className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none pt-12 pb-6 px-6"
                style={{
                  background: `linear-gradient(to top, ${settings.frame_color}EE, ${settings.frame_color}BB, transparent)`
                }}
              >
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{settings.campaign_title}</p>
                    <h2 className="text-white font-black text-2xl leading-none">
                      {settings.campaign_subtitle.split(" ").slice(0, 2).join(" ")}&nbsp;
                      <br />
                      <span style={{ color: settings.accent_color }}>
                        {settings.campaign_subtitle.split(" ").slice(2).join(" ") || "Campaign"}
                      </span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-[10px] font-bold">{settings.watermark_text}</p>
                  </div>
                </div>
              </div>
              
              {/* Top-left logo badge */}
              <div className="absolute top-4 left-4 z-20 bg-white px-3 py-1.5 rounded shadow-lg pointer-events-none">
                <p className="font-black text-sm tracking-tighter" style={{ color: settings.frame_color }}>
                  SOCIAL<span style={{ color: settings.accent_color }}>NEWS</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-foreground/40 flex flex-col items-center">
            <ImageIcon className="w-20 h-20 mb-4 opacity-50" />
            <p className="font-medium text-lg">Upload an image to see the preview</p>
            <p className="text-sm mt-2 text-muted-foreground">The campaign frame "{settings.campaign_subtitle}" will be applied</p>
          </div>
        )}
      </div>

    </div>
  );
}
