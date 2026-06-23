"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Mail, Upload } from "lucide-react";

type StaffMember = {
  id: number; name: string; slug: string; role: string; department: string;
  photo: string; short_bio: string; full_bio: string; email: string; phone: string;
  joined_year: string; education: string | string[]; expertise: string | string[];
  display_order: number; is_active: number;
};

const DEPARTMENTS = ["Leadership", "Programs", "Faina Jerusalem Village", "Healthcare", "Administration"];

function parseArr(val: string | string[]): string[] {
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

const empty: Omit<StaffMember, "id"> = {
  name: "", slug: "", role: "", department: "Leadership", photo: "", short_bio: "",
  full_bio: "", email: "", phone: "", joined_year: "", education: [], expertise: [],
  display_order: 99, is_active: 1,
};

export default function StaffAdmin() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"edit" | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Omit<StaffMember, "id"> & { id?: number }>(empty);
  const [eduInput, setEduInput] = useState("");
  const [expInput, setExpInput] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/staff");
    setStaff(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...empty }); setEduInput(""); setExpInput(""); setModal("new"); };
  const openEdit = (m: StaffMember) => {
    setForm({ ...m, education: parseArr(m.education), expertise: parseArr(m.expertise) });
    setEduInput(""); setExpInput(""); setModal("edit");
  };
  const closeModal = () => setModal(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "staff");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setForm(f => ({ ...f, photo: data.url }));
      } else {
        alert("Upload error: " + (data.error ?? `HTTP ${res.status}`));
      }
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : "Network error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addItem = (field: "education" | "expertise", value: string) => {
    const v = value.trim();
    if (!v) return;
    setForm(f => ({ ...f, [field]: [...parseArr(f[field] as string[]), v] }));
  };
  const removeItem = (field: "education" | "expertise", i: number) => {
    setForm(f => ({ ...f, [field]: parseArr(f[field] as string[]).filter((_, idx) => idx !== i) }));
  };

  const save = async () => {
    setSaving(true);
    const body = { ...form, education: parseArr(form.education as string[]), expertise: parseArr(form.expertise as string[]) };
    if (modal === "edit" && form.id) {
      await fetch(`/api/admin/staff/${form.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setSaving(false);
    closeModal();
    load();
  };

  const toggleActive = async (m: StaffMember) => {
    await fetch(`/api/admin/staff/${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: m.is_active ? 0 : 1 }) });
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Delete this staff member?")) return;
    setDeleting(id);
    await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const deptColors: Record<string, string> = {
    Leadership: "bg-emerald-100 text-emerald-700",
    Programs: "bg-blue-100 text-blue-700",
    "Faina Jerusalem Village": "bg-orange-100 text-orange-700",
    Healthcare: "bg-red-100 text-red-700",
    Administration: "bg-purple-100 text-purple-700",
  };

  const education = parseArr(form.education as string[]);
  const expertise = parseArr(form.expertise as string[]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Staff</h1>
          <p className="text-slate-500 text-sm mt-1">Manage team members shown on the website</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
        </div>
      ) : (
        <div className="space-y-3">
          {staff.map(m => (
            <div key={m.id} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 transition-all ${m.is_active ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-extrabold">{m.name.split(" ").slice(0,2).map(n=>n[0]).join("")}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-800">{m.name}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${deptColors[m.department] ?? "bg-gray-100 text-gray-600"}`}>{m.department}</span>
                  {!m.is_active && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <p className="text-orange-600 text-sm font-medium">{m.role}</p>
                <p className="text-slate-400 text-xs mt-0.5 truncate">{m.email || "No email"} · Order {m.display_order}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => toggleActive(m)} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors">
                  {m.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(m)} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => del(m.id)} disabled={deleting === m.id} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-40">
                  {deleting === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-800">{modal === "new" ? "Add Staff Member" : "Edit Staff Member"}</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Name & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</span>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slug *</span>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="john-doe" />
                </label>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title *</span>
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</span>
                  <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
              </div>

              {/* Email, Phone, Joined */}
              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</span>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</span>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year Joined</span>
                  <input value={form.joined_year} onChange={e => setForm(f => ({ ...f, joined_year: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="2022" />
                </label>
              </div>

              {/* Photo Upload */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Photo</span>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
                    {form.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-2xl font-extrabold">
                        {form.name ? form.name.split(" ").slice(0,2).map(n=>n[0]).join("") : "?"}
                      </span>
                    )}
                  </div>
                  {/* Upload button */}
                  <div className="flex-1">
                    <label className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${uploading ? "border-slate-200 text-slate-400 cursor-not-allowed" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading ? "Uploading…" : "Upload Photo"}
                      <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handlePhotoUpload} />
                    </label>
                    <p className="text-slate-400 text-xs mt-1.5">JPG, PNG, WebP — max 5 MB</p>
                    {form.photo && (
                      <button onClick={() => setForm(f => ({ ...f, photo: "" }))} className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors">
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Short bio */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Short Bio (card preview) *</span>
                <textarea value={form.short_bio} onChange={e => setForm(f => ({ ...f, short_bio: e.target.value }))} rows={2} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </label>

              {/* Full bio */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Biography</span>
                <textarea value={form.full_bio} onChange={e => setForm(f => ({ ...f, full_bio: e.target.value }))} rows={4} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </label>

              {/* Education */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Education</span>
                <div className="space-y-2 mb-3">
                  {education.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-slate-700 flex-1">{e}</span>
                      <button onClick={() => removeItem("education", i)} className="text-slate-400 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={eduInput} onChange={e => setEduInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { addItem("education", eduInput); setEduInput(""); } }} placeholder="e.g. BSc Education, Kigali University" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <button onClick={() => { addItem("education", eduInput); setEduInput(""); }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">Add</button>
                </div>
              </div>

              {/* Expertise */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Areas of Expertise</span>
                <div className="flex flex-wrap gap-2 mb-3">
                  {expertise.map((e, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {e}
                      <button onClick={() => removeItem("expertise", i)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={expInput} onChange={e => setExpInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { addItem("expertise", expInput); setExpInput(""); } }} placeholder="e.g. Community Development" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <button onClick={() => { addItem("expertise", expInput); setExpInput(""); }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">Add</button>
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Order</span>
                  <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="flex items-center gap-3 mt-5">
                  <input type="checkbox" checked={!!form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked ? 1 : 0 }))} className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm font-medium text-slate-700">Visible on website</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.name || !form.slug || !form.role} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
