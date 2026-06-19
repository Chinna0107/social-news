import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { studentApi } from "@/utils/api";
import {
  ArrowLeft, Upload, FileText, CheckCircle2,
  Paperclip, X, Award, Calendar, Send
} from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  points: number;
  dueDate?: string;
  instructions?: string;
  attachments?: { name: string; url: string }[];
}

export default function TaskSubmission() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    studentApi.task(taskId!)
      .then(setTask)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [taskId]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() && files.length === 0) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("note", note);
      files.forEach(f => formData.append("files", f));
      await studentApi.submitTask(taskId!, formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/2" />
      <div className="h-48 bg-slate-100 rounded-2xl" />
      <div className="h-32 bg-slate-100 rounded-2xl" />
    </div>
  );

  if (!task) return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <p className="text-muted-foreground">Task not found.</p>
      <button onClick={() => navigate("/student/tasks")} className="mt-4 text-secondary font-semibold hover:underline">
        Back to Tasks
      </button>
    </div>
  );

  if (submitted) return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-12 h-12 text-success" />
      </motion.div>
      <h2 className="text-3xl font-extrabold text-secondary mb-3">Submitted!</h2>
      <p className="text-muted-foreground mb-2">Your task <span className="font-semibold text-secondary">"{task.title}"</span> has been submitted for review.</p>
      <p className="text-sm text-muted-foreground mb-8">You'll earn <span className="font-bold text-secondary">+{task.points} points</span> once approved.</p>
      <div className="flex gap-4 justify-center">
        <button onClick={() => navigate("/student/tasks")} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-destructive transition-colors">
          Back to Tasks
        </button>
        <button onClick={() => navigate("/student/dashboard")} className="bg-white border px-6 py-3 rounded-xl font-bold text-secondary hover:bg-slate-50 transition-colors">
          Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => navigate("/student/tasks")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tasks
      </button>

      {/* Task Info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
            task.priority === "High" ? "bg-destructive/10 text-destructive" :
            task.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
          }`}>{task.priority} Priority</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-secondary/10 text-secondary">
            {task.status.replace("_", " ")}
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-secondary mb-2">{task.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        <div className="flex gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-1.5 font-bold text-secondary">
            <Award className="w-4 h-4" /> +{task.points} Points on Approval
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" /> Due {task.dueDate}
            </div>
          )}
        </div>
      </motion.div>

      {/* Instructions */}
      {task.instructions && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-slate-50 rounded-2xl border p-6">
          <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-destructive" /> Instructions
          </h3>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{task.instructions}</p>
          {task.attachments && task.attachments.length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reference Files</p>
              {task.attachments.map(a => (
                <a key={a.name} href={a.url} className="flex items-center gap-2 text-sm text-secondary hover:text-destructive font-medium transition-colors">
                  <Paperclip className="w-4 h-4" /> {a.name}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Submission Form */}
      <motion.form
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border shadow-sm p-6 space-y-5"
      >
        <h3 className="font-bold text-secondary flex items-center gap-2">
          <Send className="w-4 h-4 text-destructive" /> Your Submission
        </h3>

        {/* Note */}
        <div>
          <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Submission Notes *</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Describe what you've done, any challenges faced, and key highlights of your work..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">{note.length} / 1000 characters</p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Upload Files</label>
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border hover:border-secondary rounded-xl cursor-pointer bg-slate-50 hover:bg-secondary/5 transition-colors">
            <Upload className="w-7 h-7 text-muted-foreground mb-1" />
            <p className="text-sm font-semibold text-muted-foreground">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground mt-0.5">PDF, DOC, MP4, ZIP — max 50MB each</p>
            <input type="file" className="hidden" multiple onChange={handleFiles} />
          </label>

          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5 border">
                  <div className="flex items-center gap-2 text-sm">
                    <Paperclip className="w-4 h-4 text-secondary" />
                    <span className="font-medium text-secondary truncate max-w-[300px]">{f.name}</span>
                    <span className="text-muted-foreground text-xs">({(f.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: submitting ? 1 : 1.01 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          type="submit"
          disabled={submitting || (!note.trim() && files.length === 0)}
          className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-destructive transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
          ) : (
            <><Send className="w-4 h-4" /> Submit Task</>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
}
