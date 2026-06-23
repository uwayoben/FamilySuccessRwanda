"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Upload } from "lucide-react";

type Partner = {
  id: number; abbr: string; name: string; logo_url: string; website_url: string;
  bg_gradient: string; display_order: number; is_active: number;
};

const GRADIENTS = [
  { label: "Slate",   value: "from-slate-800 to-slate-600" },
  { label: "Emerald", value: "from-emerald-700 to-emerald-500" },
  { label: "Blue",    value: "from-blue-700 to-blue-500" },
  { label: "Orange",  value: "from-orange-600 to-orange-400" },
  { label: "Purple",  value: "from-purple-700 to-purple-500" },
  { label: "Rose",    value: "from-rose-700 to-rose-500" },
  { label: "Teal",    value: "from-teal-700 to-teal-500" },
  { label: "Gray",    value: "from-gray-800 to-gray-600" },
];

const empty: Omit<Partner, "id"> = {
  abbr: "", name: "", logo_url: "", website_url: "", bg_gradient: "from-slate-800 to-slate-600",
  display_order: 99, is_active: 1,
};

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"edit" | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Partner, "id"> & { id?: number }>(empty);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/partners");
    setPartners(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...empty }); setModal("new"); };
  const openEdit = (p: Partner) => { setForm({ ...p }); setModal("edit"); };
  const closeModal = () => setModal(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "partners");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setForm(f => ({ ...f, logo_url: data.url }));
      else alert("Upload error: " + (data.error ?? `HTTP ${res.status}`));
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : "Network error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    if (modal === "edit" && form.id) {
      await fetch(`/api/admin/partners/${form.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    closeModal();
    load();
  };

  const toggleActive = async (p: Partner) => {
    await fetch(`/api/admin/partners/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: p.is_active ? 0 : 1 }) });
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Delete this partner?")) return;
    setDeleting(id);
    await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Partners</h1>
          <p className="text-slate-500 text-sm mt-1">Manage partner logos shown in the homepage slider</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all ${p.is_active ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
              {/* Logo preview */}
              <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${p.bg_gradient} flex items-center justify-center`}>
                {p.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <span className="text-white font-extrabold text-sm">{p.abbr}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">{p.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{p.abbr} · Order {p.display_order}</p>
                {!p.is_active && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Hidden</span>}
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => toggleActive(p)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors">
                  {p.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => del(p.id)} disabled={deleting === p.id} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-40">
                  {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-800">{modal === "new" ? "Add Partner" : "Edit Partner"}</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Logo Upload */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Logo</span>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${form.bg_gradient} flex items-center justify-center`}>
                    {form.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.logo_url} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-white font-extrabold text-lg">{form.abbr || "?"}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${uploading ? "border-slate-200 text-slate-400 cursor-not-allowed" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading ? "Uploading…" : "Upload Logo"}
                      <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleLogoUpload} />
                    </label>
                    <p className="text-slate-400 text-xs mt-1.5">PNG, SVG, WebP — max 5 MB</p>
                    {form.logo_url && (
                      <button onClick={() => setForm(f => ({ ...f, logo_url: "" }))} className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors">
                        Remove logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name & Abbr */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Name *</span>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="UNICEF Rwanda" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Abbreviation *</span>
                  <input value={form.abbr} onChange={e => setForm(f => ({ ...f, abbr: e.target.value.toUpperCase() }))} maxLength={10} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="UNICEF" />
                  <p className="text-slate-400 text-xs mt-1">Shown if no logo uploaded</p>
                </label>
              </div>

              {/* Website URL */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website URL</span>
                <input value={form.website_url} onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="https://www.partnerwebsite.org" />
                <p className="text-slate-400 text-xs mt-1">Logo and name become clickable links on the website</p>
              </label>

              {/* Background gradient */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Card Background</span>
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.map(g => (
                    <button key={g.value} onClick={() => setForm(f => ({ ...f, bg_gradient: g.value }))}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${form.bg_gradient === g.value ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <span className={`w-4 h-4 rounded bg-gradient-to-br ${g.value}`} />
                      {g.label}
                    </button>
                  ))}
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
              <button onClick={save} disabled={saving || !form.name || !form.abbr} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Partner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
