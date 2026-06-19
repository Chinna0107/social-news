import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Download, Share2, CheckCircle2, X, ExternalLink, BookOpen, ClipboardList } from "lucide-react";
import { studentApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import html2canvas from "html2canvas";

interface Certificate {
  id: string;
  _id?: string;
  title: string;
  issued_at?: string;
  verifiedDate?: string;
  score?: number;
  type?: string;
  is_verified?: boolean;
}

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || JSON.parse(localStorage.getItem("user") || "{}").name || "Student";

  useEffect(() => {
    studentApi.certificates()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : [];
        setCertificates(list.map((c: any) => ({
          ...c,
          id: c.id || c._id,
          verifiedDate: c.issued_at || c.verifiedDate,
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  const handleDownload = async (cert: Certificate) => {
    setPreview(cert);
    // Wait for render
    await new Promise(r => setTimeout(r, 400));
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 3, useCORS: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `${cert.title.replace(/\s+/g, "_")}_Certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async (cert: Certificate) => {
    const text = `🎓 I just earned the "${cert.title}" certificate from Social News! ${cert.score ? `Score: ${cert.score}%` : ""}`;
    if (navigator.share) {
      await navigator.share({ title: cert.title, text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="space-y-8 max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Certificates</h1>
          <p className="text-muted-foreground mt-1">Verified credentials earned from completed quizzes and tasks.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Earned", value: certificates.length, color: "text-secondary", bg: "bg-secondary/5" },
            { label: "Verified", value: certificates.filter(c => c.is_verified !== false).length, color: "text-success", bg: "bg-success/10" },
            { label: "Avg Score", value: certificates.filter(c => c.score).length ? Math.round(certificates.filter(c => c.score).reduce((a, c) => a + (c.score || 0), 0) / certificates.filter(c => c.score).length) + "%" : "—", color: "text-amber-600", bg: "bg-amber-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border flex items-center gap-4`}>
              <Award className={`w-8 h-8 ${s.color} shrink-0`} />
              <div>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Award className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg">No certificates yet</p>
            <p className="text-sm mt-1">Complete quizzes to earn your first certificate.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => setPreview(cert)}
              >
                {/* Certificate Card */}
                <div className="bg-gradient-to-br from-[#011638] via-[#012060] to-[#011B4A] p-7 text-white relative overflow-hidden aspect-[1.7/1] flex flex-col justify-between">
                  {/* bg decorations */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-destructive/10 rounded-full" />
                    <Award className="absolute right-6 top-1/2 -translate-y-1/2 w-28 h-28 opacity-[0.06]" />
                  </div>

                  {/* Top row */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <img src="/logo.png" alt="Social News" className="h-5 w-auto object-contain brightness-0 invert opacity-80 mb-3" />
                      <p className="text-[9px] font-black tracking-[0.2em] text-white/50 uppercase">
                        {cert.type === 'task' ? 'Certificate of Task Completion' : 'Certificate of Quiz Completion'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full border ${
                        cert.type === 'task'
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                          : 'bg-blue-400/20 text-blue-300 border-blue-400/30'
                      }`}>
                        {cert.type === 'task' ? <ClipboardList className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                        {cert.type === 'task' ? 'Task' : 'Quiz'}
                      </div>
                      {cert.is_verified !== false && (
                        <div className="flex items-center gap-1 bg-success/20 text-success text-[9px] font-black px-2 py-1 rounded-full border border-success/30">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Name */}
                  <div className="relative z-10">
                    <h2 className="text-lg font-extrabold leading-tight mb-1 group-hover:text-white/90 transition-colors">
                      {cert.title}
                    </h2>
                    <p className="text-white/60 text-xs font-semibold">Awarded to <span className="text-white font-bold">{userName}</span></p>
                  </div>

                  {/* Bottom row */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Issued On</p>
                      <p className="text-xs font-mono font-bold text-white/80">{formatDate(cert.verifiedDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cert.score != null && (
                        <div className={`px-3 py-1 rounded-full text-xs font-black border ${cert.score >= 70 ? "bg-success/20 border-success/40 text-success" : "bg-amber-400/20 border-amber-400/40 text-amber-300"}`}>
                          {cert.score}% Score
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      onClick={e => { e.stopPropagation(); handleDownload(cert); }}
                      className="flex flex-col items-center gap-1.5 bg-white text-secondary px-5 py-3 rounded-2xl font-bold text-xs shadow-xl hover:bg-slate-50 transition-colors"
                    >
                      <Download className="w-5 h-5" /> Download
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      onClick={e => { e.stopPropagation(); handleShare(cert); }}
                      className="flex flex-col items-center gap-1.5 bg-white/10 text-white border border-white/20 px-5 py-3 rounded-2xl font-bold text-xs shadow-xl hover:bg-white/20 transition-colors"
                    >
                      <Share2 className="w-5 h-5" /> Share
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Full Certificate Preview Modal */}
      <AnimatePresence>
        {preview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={() => setPreview(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-2xl space-y-4">
                {/* Close */}
                <div className="flex justify-end">
                  <button onClick={() => setPreview(null)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Printable Certificate */}
                <div ref={certRef} className="bg-gradient-to-br from-[#011638] via-[#012060] to-[#011B4A] rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
                  {/* Decorative borders */}
                  <div className="absolute inset-3 border border-white/10 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-5 border border-white/5 rounded-xl pointer-events-none" />
                  {/* bg circles */}
                  <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-destructive/10 rounded-full pointer-events-none" />
                  <Award className="absolute right-10 top-1/2 -translate-y-1/2 w-52 h-52 opacity-[0.04] pointer-events-none" />

                  <div className="relative z-10 text-center space-y-6">
                    {/* Logo & title */}
                    <div className="flex flex-col items-center gap-3">
                      <img src="/logo.png" alt="Social News" className="h-8 w-auto object-contain brightness-0 invert opacity-80" />
                      <div className="w-16 h-px bg-white/20" />
                      <p className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">
                        {preview.type === 'task' ? 'Certificate of Task Completion' : 'Certificate of Quiz Completion'}
                      </p>
                    </div>

                    {/* Presentation line */}
                    <div>
                      <p className="text-white/50 text-sm mb-2">This is to certify that</p>
                      <h1 className="text-4xl font-extrabold tracking-tight text-white">{userName}</h1>
                      <p className="text-white/50 text-sm mt-2">has successfully completed</p>
                    </div>

                    {/* Course name */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5">
                      <h2 className="text-2xl font-extrabold text-white leading-tight">{preview.title}</h2>
                    </div>

                    {/* Score & Date */}
                    <div className="flex items-center justify-center gap-8">
                      {preview.score != null && (
                        <div className="text-center">
                          <p className={`text-3xl font-extrabold ${preview.score >= 70 ? "text-success" : "text-amber-400"}`}>{preview.score}%</p>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-0.5">Final Score</p>
                        </div>
                      )}
                      <div className="w-px h-10 bg-white/10" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-white/80">{formatDate(preview.verifiedDate)}</p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-0.5">Issue Date</p>
                      </div>
                      <div className="w-px h-10 bg-white/10" />
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-success font-black text-sm">
                          <CheckCircle2 className="w-4 h-4" /> Verified
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-0.5">Status</p>
                      </div>
                    </div>

                    {/* Certificate ID */}
                    <p className="text-[10px] font-mono text-white/25 tracking-widest">
                      CERT-ID: {(preview.id || "").toUpperCase().slice(0, 16)}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(preview)}
                    disabled={downloading}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-secondary py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-lg disabled:opacity-60"
                  >
                    {downloading ? <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                    {downloading ? "Generating..." : "Download PNG"}
                  </button>
                  <button
                    onClick={() => handleShare(preview)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 py-3.5 rounded-2xl font-bold hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button
                    onClick={() => window.open(preview.verifiedDate ? `https://socialnews.org/verify/${preview.id}` : "#", "_blank")}
                    className="w-14 flex items-center justify-center bg-white/10 text-white border border-white/20 rounded-2xl hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
