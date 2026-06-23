"use client";

import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, GripVertical,
  GraduationCap, Users, TrendingUp, Baby, Activity, Home, X, Save, Loader2,
} from "lucide-react";

type Program = {
  id: number; title: string; slug: string; description: string; summary: string;
  icon: string; beneficiaries: string; bg_color: string; text_color: string;
  border_color: string; light_bg: string; tag: string; impact_items: string | string[];
  display_order: number; is_active: number;
};

const ICONS = [
  "graduation-cap", "users", "trending-up", "baby", "activity", "home",
];
const COLORS = [
  { label: "Blue",   bg: "bg-blue-600",   text: "text-blue-600",   border: "border-blue-200",   light: "bg-blue-50" },
  { label: "Pink",   bg: "bg-pink-600",   text: "text-pink-600",   border: "border-pink-200",   light: "bg-pink-50" },
  { label: "Indigo", bg: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-200", light: "bg-indigo-50" },
  { label: "Green",  bg: "bg-green-600",  text: "text-green-600",  border: "border-green-200",  light: "bg-green-50" },
  { label: "Red",    bg: "bg-red-600",    text: "text-red-600",    border: "border-red-200",    light: "bg-red-50" },
  { label: "Orange", bg: "bg-orange-600", text: "text-orange-600", border: "border-orange-200", light: "bg-orange-50" },
];

const empty: Omit<Program, "id"> = {
  title: "", slug: "", description: "", summary: "", icon: "graduation-cap",
  beneficiaries: "", bg_color: "bg-blue-600", text_color: "text-blue-600",
  border_color: "border-blue-200", light_bg: "bg-blue-50", tag: "",
  impact_items: [], display_order: 99, is_active: 1,
};

function parseItems(val: string | string[]): string[] {
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

export default function ProgramsAdmin() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"edit" | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Program, "id"> & { id?: number }>(empty);
  const [impactInput, setImpactInput] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/programs");
    const data = await res.json();
    setPrograms(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...empty });
    setImpactInput("");
    setModal("new");
  };

  const openEdit = (p: Program) => {
    setForm({ ...p, impact_items: parseItems(p.impact_items) });
    setImpactInput("");
    setModal("edit");
  };

  const closeModal = () => setModal(null);

  const handleColorPick = (c: typeof COLORS[0]) => {
    setForm(f => ({ ...f, bg_color: c.bg, text_color: c.text, border_color: c.border, light_bg: c.light }));
  };

  const addImpact = () => {
    const v = impactInput.trim();
    if (!v) return;
    setForm(f => ({ ...f, impact_items: [...parseItems(f.impact_items as string[]), v] }));
    setImpactInput("");
  };

  const removeImpact = (i: number) => {
    setForm(f => ({ ...f, impact_items: parseItems(f.impact_items as string[]).filter((_, idx) => idx !== i) }));
  };

  const save = async () => {
    setSaving(true);
    const body = { ...form, impact_items: parseItems(form.impact_items as string[]) };
    if (modal === "edit" && form.id) {
      await fetch(`/api/admin/programs/${form.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/programs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setSaving(false);
    closeModal();
    load();
  };

  const toggleActive = async (p: Program) => {
    await fetch(`/api/admin/programs/${p.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: p.is_active ? 0 : 1 }),
    });
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Delete this program? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const impactItems = parseItems(form.impact_items as string[]);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Programs</h1>
          <p className="text-slate-500 text-sm mt-1">Manage FSR program content shown on the website</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
          <Plus className="w-4 h-4" /> New Program
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading programs…
        </div>
      ) : (
        <div className="space-y-3">
          {programs.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 transition-all ${p.is_active ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
              <GripVertical className="w-5 h-5 text-slate-300 flex-shrink-0" />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.light_bg}`}>
                <GraduationCap className={`w-5 h-5 ${p.text_color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-800">{p.title}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.light_bg} ${p.text_color}`}>{p.tag}</span>
                  {!p.is_active && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <p className="text-slate-500 text-sm truncate mt-0.5">{p.summary || p.description}</p>
                <p className="text-slate-400 text-xs mt-1">/{p.slug} · {parseItems(p.impact_items).length} activities · order {p.display_order}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(p)} title={p.is_active ? "Hide" : "Show"} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors">
                  {p.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(p)} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => del(p.id)} disabled={deleting === p.id} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-40">
                  {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
              <h2 className="text-lg font-extrabold text-slate-800">{modal === "new" ? "New Program" : "Edit Program"}</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Title & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title *</span>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slug *</span>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="url-friendly-name" />
                </label>
              </div>

              {/* Tag & Beneficiaries */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tag Label</span>
                  <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Education Support" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Beneficiaries</span>
                  <input value={form.beneficiaries} onChange={e => setForm(f => ({ ...f, beneficiaries: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Children & Youth" />
                </label>
              </div>

              {/* Summary */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Short Summary</span>
                <input value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </label>

              {/* Description */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Description</span>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </label>

              {/* Icon */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Icon</span>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(ic => (
                    <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${form.icon === ic ? "border-orange-400 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-600 hover:border-orange-300"}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Color Theme</span>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c.label} onClick={() => handleColorPick(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${form.bg_color === c.bg ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Items */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Key Activities</span>
                <div className="space-y-2 mb-3">
                  {impactItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-slate-700 flex-1">{item}</span>
                      <button onClick={() => removeImpact(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={impactInput} onChange={e => setImpactInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addImpact()}
                    placeholder="Type activity and press Enter" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <button onClick={addImpact} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">Add</button>
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
              <button onClick={save} disabled={saving || !form.title || !form.slug} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Program"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
