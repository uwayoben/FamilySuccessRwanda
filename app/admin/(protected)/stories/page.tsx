"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Upload, Quote, User } from "lucide-react";

type Story = {
  id: number;
  name: string;
  subtitle: string;
  quote: string;
  story: string;
  image_url: string;
  display_order: number;
  is_active: number;
};

type StoryForm = Omit<Story, "id"> & { id?: number };

const empty: StoryForm = {
  name: "",
  subtitle: "",
  quote: "",
  story: "",
  image_url: "",
  display_order: 99,
  is_active: 1,
};

const fieldCls = "mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400";
const labelCls = "text-xs font-bold text-slate-500 uppercase tracking-wider";

export default function StoriesAdmin() {
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState<StoryForm>(empty);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stories");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems(await res.json());
      setLoadError("");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...empty }); setModal("new"); };
  const openEdit = (item: Story) => {
    setForm({
      ...item,
      subtitle: item.subtitle ?? "",
      quote: item.quote ?? "",
      story: item.story ?? "",
      image_url: item.image_url ?? "",
    });
    setModal("edit");
  };
  const closeModal = () => setModal(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "stories");
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

  const save = async () => {
    if (!form.name.trim()) { alert("Please enter a name."); return; }
    setSaving(true);
    try {
      const editing = modal === "edit" && form.id;
      const res = await fetch(editing ? `/api/admin/stories/${form.id}` : "/api/admin/stories", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      closeModal();
      load();
    } catch (err) {
      alert("Save failed: " + (err instanceof Error ? err.message : "Network error"));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: Story) => {
    await fetch(`/api/admin/stories/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    load();
  };

  const del = async (item: Story) => {
    if (!confirm(`Delete the story of "${item.name}"?`)) return;
    setDeleting(item.id);
    await fetch(`/api/admin/stories/${item.id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Success Stories</h1>
          <p className="text-slate-500 text-sm mt-1">Stories of people whose lives have changed, shown on the website</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Add Story
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
        </div>
      ) : loadError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700">
          Could not load stories ({loadError}). If this section was just installed, restart the website server so the stories table is created.
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
          <Quote className="w-12 h-12 opacity-30" />
          <p className="text-sm">No stories yet. Click &ldquo;Add Story&rdquo; to publish the first one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {items.map(item => (
            <div key={item.id} className={`flex items-center gap-4 p-4 ${item.is_active ? "" : "opacity-60"}`}>
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                <p className="text-slate-400 text-xs mt-0.5 truncate">
                  {item.subtitle || "—"}
                  <span className="ml-2">· Order {item.display_order}</span>
                  {!item.is_active && <span className="ml-2 font-bold text-slate-500">· Hidden</span>}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleActive(item)}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                  aria-label={item.is_active ? "Hide" : "Show"}
                >
                  {item.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => del(item)}
                  disabled={deleting === item.id}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-40"
                  aria-label="Delete"
                >
                  {deleting === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
              <h2 className="text-lg font-extrabold text-slate-800">
                {modal === "new" ? "Add Story" : "Edit Story"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className={labelCls}>Name *</span>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={fieldCls}
                    placeholder="Person, family, or group"
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Who They Are</span>
                  <input
                    value={form.subtitle}
                    onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                    className={fieldCls}
                    placeholder="e.g. Tailoring graduate, Faina Jerusalem"
                  />
                </label>
              </div>

              {/* Photo */}
              <div>
                <span className={`${labelCls} block mb-2`}>Photo</span>
                <div className="space-y-3">
                  {form.image_url && (
                    <div className="relative rounded-xl overflow-hidden w-40 aspect-[4/5] bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setForm(f => ({ ...f, image_url: "" }))}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <label className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${uploading ? "border-slate-200 text-slate-400 cursor-not-allowed" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`}>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Uploading…" : form.image_url ? "Replace Photo" : "Upload Photo"}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
                  </label>
                  <p className="text-slate-400 text-xs">JPG, PNG, WebP — max 5 MB. A portrait photo works best. Only use photos you have permission to publish.</p>
                </div>
              </div>

              <label className="block">
                <span className={labelCls}>Quote</span>
                <textarea
                  value={form.quote}
                  onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                  rows={3}
                  className={`${fieldCls} resize-none`}
                  placeholder="A sentence or two in their own words (optional)…"
                />
              </label>

              <label className="block">
                <span className={labelCls}>Full Story</span>
                <textarea
                  value={form.story}
                  onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                  rows={9}
                  className={fieldCls}
                  placeholder="Tell the story here. Leave an empty line between paragraphs."
                />
              </label>

              {/* Order & visibility */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className={labelCls}>Display Order</span>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))}
                    className={fieldCls}
                  />
                </label>
                <label className="flex items-center gap-3 mt-5">
                  <input
                    type="checkbox"
                    checked={!!form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked ? 1 : 0 }))}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Visible on website</span>
                </label>
              </div>
              <p className="text-slate-400 text-xs">Lower numbers appear first. The first three visible stories are shown on the homepage.</p>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || uploading || !form.name.trim()}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Story"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
