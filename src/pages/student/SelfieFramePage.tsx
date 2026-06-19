import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Upload, Image as ImageIcon } from "lucide-react";

export default function SelfieFramePage() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  return (
    <div className="flex flex-col lg:flex-row gap-12 py-8">
      
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Selfie Frame</h1>
          <p className="text-foreground/60">
            Show your support for our ongoing campaigns by generating a custom selfie with our official overlay frame.
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
          <h3 className="font-bold text-lg mb-4">2. Download & Share</h3>
          <p className="text-sm text-foreground/60 mb-6">
            Once you're happy with how it looks, download your image and share it on social media with #SocialNewsCampaign!
          </p>
          <button 
            onClick={handleDownload}
            disabled={!userImage || isDownloading}
            className="w-full flex justify-center items-center gap-2 bg-destructive hover:bg-destructive/90 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isDownloading ? "Processing..." : "Download Selfie"} <Download className="w-5 h-5" />
          </button>
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
              
              <div className="absolute inset-0 z-10 pointer-events-none border-[16px] border-primary mix-blend-normal"></div>
              
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-primary/90 via-primary/80 to-transparent pt-12 pb-6 px-6 pointer-events-none">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">PROUD SUPPORTER</p>
                    <h2 className="text-white font-black text-2xl leading-none">Reforest <br/><span className="text-destructive">The Amazon</span></h2>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-[10px] font-bold">SOCIALNEWS.ORG</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 z-20 bg-white px-3 py-1.5 rounded shadow-lg pointer-events-none">
                 <p className="text-primary font-black text-sm tracking-tighter">SOCIAL<span className="text-destructive">NEWS</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-foreground/40 flex flex-col items-center">
            <ImageIcon className="w-20 h-20 mb-4 opacity-50" />
            <p className="font-medium text-lg">Upload an image to see the preview</p>
          </div>
        )}
      </div>

    </div>
  );
}
