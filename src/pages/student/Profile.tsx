import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { studentApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Award, IdCard } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  student_id: string;
  avatar: string;
  impact_points: number;
  level: number;
  bio: string;
  joined: string;
  age?: number;
  gender?: string;
  college?: string;
  address?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.profile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const data = profile || user;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-secondary to-[#011B4A]" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-6">
              <img
                src={(data as any)?.avatar || "https://i.pravatar.cc/150?u=student"}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
              />
              <div className="mb-2">
                <h2 className="text-xl font-extrabold">{(data as any)?.name}</h2>
                <p className="text-sm text-muted-foreground capitalize">{(data as any)?.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold">{(data as any)?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border">
                <IdCard className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Student ID</p>
                  <p className="text-sm font-semibold">{(data as any)?.student_id || `SN-${(data as any)?.id}`}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border">
                <Award className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Impact Points</p>
                  <p className="text-sm font-semibold">{(data as any)?.impact_points?.toLocaleString() || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border">
                <User className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Level</p>
                  <p className="text-sm font-semibold">Level {(data as any)?.level || 1}</p>
                </div>
              </div>

              {(data as any)?.age && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border">
                  <User className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Age / Gender</p>
                    <p className="text-sm font-semibold capitalize">{(data as any)?.age} / {(data as any)?.gender || 'N/A'}</p>
                  </div>
                </div>
              )}

              {(data as any)?.college && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border sm:col-span-2">
                  <Award className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">College</p>
                    <p className="text-sm font-semibold">{(data as any)?.college}</p>
                  </div>
                </div>
              )}
              
              {(data as any)?.address && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border sm:col-span-2">
                  <Mail className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Address</p>
                    <p className="text-sm font-semibold">{(data as any)?.address}</p>
                  </div>
                </div>
              )}
            </div>

            {(profile as any)?.bio && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Bio</p>
                <p className="text-sm">{(profile as any).bio}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
