import { useEffect, useState } from "react";
import { Pencil, Trash2, ToggleLeft, ToggleRight, Search, X } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  impact_points: number;
  level: string;
  is_active: boolean;
  created_at: string;
}

const ROLES = ["student", "user", "civic_leader", "volunteer", "moderator", "admin"];
const API = "http://localhost:5000/api/admin/users";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (filterRole) params.set("role", filterRole);
    if (filterStatus) params.set("status", filterStatus);
    const r = await fetch(`${API}?${params}`, { headers: headers() });
    const data = await r.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, filterRole, filterStatus]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); load(); };

  const toggle = async (id: number) => {
    await fetch(`${API}/${id}/toggle`, { method: "PATCH", headers: headers() });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: headers() });
    load();
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    await fetch(`${API}/${editUser.id}`, { method: "PUT", headers: headers(), body: JSON.stringify(editUser) });
    setEditUser(null); load();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">User Management</h1>
        <span className="text-sm text-foreground/50 font-semibold">{total.toLocaleString()} total users</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
              className="pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 w-56" />
          </div>
          <button type="submit" className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold">Search</button>
        </form>
        <select value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20">
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
              <tr>{["User", "Role", "Points", "Status", "Joined", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-sm text-foreground/40">Loading...</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[10px]">
                        {u.name?.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-secondary text-xs">{u.name}</p>
                        <p className="text-[10px] text-foreground/50">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="bg-slate-100 text-secondary text-[10px] font-bold px-2 py-0.5 rounded capitalize">{u.role}</span></td>
                  <td className="px-4 py-3 text-xs font-bold text-secondary">{u.impact_points?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/50">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => toggle(u.id)} title="Toggle status" className="p-1.5 border rounded hover:bg-slate-50">
                      {u.is_active ? <ToggleRight className="w-3.5 h-3.5 text-green-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setEditUser(u)} className="p-1.5 border rounded hover:bg-slate-50"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(u.id)} className="p-1.5 border rounded hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-foreground/50">
          <span>Showing {users.length} of {total.toLocaleString()}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={saveEdit} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-secondary">Edit User</h2>
              <button type="button" onClick={() => setEditUser(null)}><X className="w-4 h-4" /></button>
            </div>
            {[{ key: "name", label: "Name" }, { key: "email", label: "Email", type: "email" }, { key: "phone", label: "Phone" }].map(({ key, label, type = "text" }) => (
              <div key={key}>
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">{label}</label>
                <input type={type} value={(editUser as any)[key] || ""} onChange={e => setEditUser({ ...editUser, [key]: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">Role</label>
              <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20">
                {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" checked={editUser.is_active} onChange={e => setEditUser({ ...editUser, is_active: e.target.checked })} className="w-4 h-4" />
              <label htmlFor="is_active" className="text-sm font-semibold">Active</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-secondary text-white py-2 rounded-lg font-semibold text-sm">Save</button>
              <button type="button" onClick={() => setEditUser(null)} className="px-4 border rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
