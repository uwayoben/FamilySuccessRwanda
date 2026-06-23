"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Upload } from "lucide-react";

type Slide = {
  id: number; tag: string; title: string; highlight: string; subtitle: string;
  cta1_label: string; cta1_href: string; cta2_label: string; cta2_href: string;
  image_url: string; overlay: string; stat_value: string; stat_label: string;
  bullets: string | string[]; icon_name: string; display_order: number; is_active: number;
};

const OVERLAYS = [
  { label: "Green Dark",  value: "from-emerald-950/95 via-emerald-900/70 to-transparent" },
  { label: "Blue Dark",   value: "from-blue-950/95 via-blue-900/70 to-transparent" },
  { label: "Slate Dark",  value: "from-slate-950/95 via-slate-900/70 to-transparent" },
  { label: "Purple Dark", value: "from-purple-950/95 via-purple-900/70 to-transparent" },
];

const ICONS = ["graduation-cap", "users", "trending-up", "baby", "activity", "home", "globe", "heart", "star"];

function parseBullets(val: string | string[]): string[] {
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

const empty: Omit<Slide, "id"> = {
  tag: "", title: "", highlight: "", subtitle: "",
  cta1_label: "Donate Now", cta1_href: "/donate",
  cta2_label: "Learn More", cta2_href: "/about",
  image_url: "", overlay: "from-emerald-950/95 via-emerald-900/70 to-transparent",
  stat_value: "", stat_label: "", bullets: [], icon_name: "graduation-cap",
  display_order: 99, is_active: 1,
};

export default function SlidesAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"edit" | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Slide, "id"> & { id?: number }>(empty);
  const [bulletInput, setBulletInput] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/slides");
    setSlides(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...empty }); setBulletInput(""); setModal("new"); };
  const openEdit = (s: Slide) => { setForm({ ...s, bullets: parseBullets(s.bullets) }); setBulletInput(""); setModal("edit"); };
  const closeModal = () => setModal(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "slides");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setForm(f => ({ ...f, image_url: data.url }));
      else alert("Upload error: " + (data.error ?? `HTTP ${res.status}`));
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : "Network error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addBullet = () => {
    const v = bulletInput.trim();
    if (!v) return;
    setForm(f => ({ ...f, bullets: [...parseBullets(f.bullets as string[]), v] }));
    setBulletInput("");
  };
  const removeBullet = (i: number) => setForm(f => ({ ...f, bullets: parseBullets(f.bullets as string[]).filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    const body = { ...form, bullets: parseBullets(form.bullets as string[]) };
    if (modal === "edit" && form.id) {
      await fetch(`/api/admin/slides/${form.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/slides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setSaving(false);
    closeModal();
    load();
  };

  const toggleActive = async (s: Slide) => {
    await fetch(`/api/admin/slides/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: s.is_active ? 0 : 1 }) });
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Delete this slide?")) return;
    setDeleting(id);
    await fetch(`/api/admin/slides/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const bullets = parseBullets(form.bullets as string[]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Hero Slides</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the homepage slideshow</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
          <Plus className="w-4 h-4" /> New Slide
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading slides…
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map(s => (
            <div key={s.id} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 transition-all ${s.is_active ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
              {/* Thumbnail */}
              <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                {s.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-800">{s.title} <span className="text-orange-500">{s.highlight}</span></p>
                  {!s.is_active && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{s.tag} · {s.stat_value} {s.stat_label}</p>
                <p className="text-slate-400 text-xs mt-0.5">Order {s.display_order} · {parseBullets(s.bullets).length} bullets</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(s)} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors">
                  {s.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(s)} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => del(s.id)} disabled={deleting === s.id} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-40">
                  {deleting === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
              <h2 className="text-lg font-extrabold text-slate-800">{modal === "new" ? "New Slide" : "Edit Slide"}</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Tag & Icon */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tag / Badge</span>
                  <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Featured Program" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Icon Name</span>
                  <select value={form.icon_name} onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </label>
              </div>

              {/* Title & Highlight */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title *</span>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Highlight (orange)</span>
                  <input value={form.highlight} onChange={e => setForm(f => ({ ...f, highlight: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
              </div>

              {/* Subtitle */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtitle</span>
                <textarea value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} rows={2} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </label>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CTA 1 Label</span>
                  <input value={form.cta1_label} onChange={e => setForm(f => ({ ...f, cta1_label: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CTA 1 Link</span>
                  <input value={form.cta1_href} onChange={e => setForm(f => ({ ...f, cta1_href: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CTA 2 Label</span>
                  <input value={form.cta2_label} onChange={e => setForm(f => ({ ...f, cta2_label: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CTA 2 Link</span>
                  <input value={form.cta2_href} onChange={e => setForm(f => ({ ...f, cta2_href: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Background Image *</span>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                    {form.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${uploading ? "border-slate-200 text-slate-400 cursor-not-allowed" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading ? "Uploading…" : "Upload Image"}
                      <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleImageUpload} />
                    </label>
                    <p className="text-slate-400 text-xs mt-1.5">JPG, PNG, WebP — max 5 MB</p>
                    {form.image_url && (
                      <button onClick={() => setForm(f => ({ ...f, image_url: "" }))} className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors">
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Overlay */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Overlay Color</span>
                <div className="flex flex-wrap gap-2">
                  {OVERLAYS.map(o => (
                    <button key={o.value} onClick={() => setForm(f => ({ ...f, overlay: o.value }))}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${form.overlay === o.value ? "border-orange-400 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-600 hover:border-orange-300"}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stat Card */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stat Value</span>
                  <input value={form.stat_value} onChange={e => setForm(f => ({ ...f, stat_value: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="320+" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stat Label</span>
                  <input value={form.stat_label} onChange={e => setForm(f => ({ ...f, stat_label: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Students Enrolled" />
                </label>
              </div>

              {/* Bullets */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Stat Card Bullets</span>
                <div className="space-y-2 mb-3">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-slate-700 flex-1">{b}</span>
                      <button onClick={() => removeBullet(i)} className="text-slate-400 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={bulletInput} onChange={e => setBulletInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addBullet()} placeholder="Add a bullet point" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <button onClick={addBullet} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">Add</button>
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
                  <span className="text-sm font-medium text-slate-700">Active (shown on site)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.title || !form.image_url || uploading} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Slide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
