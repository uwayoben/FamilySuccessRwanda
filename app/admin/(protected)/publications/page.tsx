"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Upload, FileText, ExternalLink } from "lucide-react";

type Publication = {
  id: number;
  title: string;
  description: string;
  file_url: string;
  cover_url: string;
  published_at: string;
  is_active: number;
};

type PublicationForm = Omit<Publication, "id"> & { id?: number };

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const empty = (): PublicationForm => ({
  title: "",
  description: "",
  file_url: "",
  cover_url: "",
  published_at: today(),
  is_active: 1,
});

export default function PublicationsAdmin() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"file" | "cover" | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState<PublicationForm>(empty());

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/publications");
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

  const openNew = () => { setForm(empty()); setModal("new"); };
  const openEdit = (item: Publication) => {
    setForm({ ...item, description: item.description ?? "", cover_url: item.cover_url ?? "" });
    setModal("edit");
  };
  const closeModal = () => setModal(null);

  const handleUpload = (kind: "file" | "cover") => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(kind);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "publications");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setForm(f => ({
          ...f,
          ...(kind === "file" ? { file_url: data.url } : { cover_url: data.url }),
          // Pre-fill the title from the file name when it is still empty
          ...(kind === "file" && !f.title.trim() ? { title: file.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ") } : {}),
        }));
      } else alert("Upload error: " + (data.error ?? `HTTP ${res.status}`));
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : "Network error"));
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const save = async () => {
    if (!form.title.trim()) { alert("Please enter a title."); return; }
    if (!form.file_url) { alert("Please upload the PDF document first."); return; }
    setSaving(true);
    try {
      const editing = modal === "edit" && form.id;
      const res = await fetch(editing ? `/api/admin/publications/${form.id}` : "/api/admin/publications", {
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

  const toggleActive = async (item: Publication) => {
    await fetch(`/api/admin/publications/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    load();
  };

  const del = async (item: Publication) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeleting(item.id);
    await fetch(`/api/admin/publications/${item.id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const uploadBtnCls = (busy: boolean) =>
    `inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${busy ? "border-slate-200 text-slate-400 cursor-not-allowed" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Publications</h1>
          <p className="text-slate-500 text-sm mt-1">Upload reports and documents (PDF) that visitors can view and download</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Add Publication
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
        </div>
      ) : loadError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700">
          Could not load publications ({loadError}). If this section was just installed, restart the website server so the publications table is created.
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
          <FileText className="w-12 h-12 opacity-30" />
          <p className="text-sm">No publications yet. Click &ldquo;Add Publication&rdquo; to upload the first document.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {items.map(item => (
            <div key={item.id} className={`flex items-center gap-4 p-4 ${item.is_active ? "" : "opacity-60"}`}>
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                {item.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 text-sm truncate">{item.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {item.published_at}
                  {!item.is_active && <span className="ml-2 font-bold text-slate-500">· Hidden</span>}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={item.file_url}
                  target="_blank"
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:border-orange-300 transition-colors"
                  aria-label="Open document"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
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
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-800">
                {modal === "new" ? "Add Publication" : "Edit Publication"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Document */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Document (PDF) *</span>
                <div className="space-y-3">
                  {form.file_url && (
                    <a href={form.file_url} target="_blank" className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 hover:border-orange-300 transition-colors">
                      <FileText className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span className="truncate flex-1">{form.file_url.split("/").pop()}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </a>
                  )}
                  <label className={uploadBtnCls(uploading === "file")}>
                    {uploading === "file" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading === "file" ? "Uploading…" : form.file_url ? "Replace PDF" : "Upload PDF"}
                    <input type="file" accept="application/pdf" className="hidden" disabled={!!uploading} onChange={handleUpload("file")} />
                  </label>
                  <p className="text-slate-400 text-xs">PDF only — max 9 MB</p>
                </div>
              </div>

              {/* Title */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title *</span>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. Annual Report 2025"
                />
              </label>

              {/* Description */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</span>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  placeholder="Short description of this document (optional)…"
                />
              </label>

              {/* Cover image */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Cover Image (optional)</span>
                <div className="space-y-3">
                  {form.cover_url && (
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.cover_url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setForm(f => ({ ...f, cover_url: "" }))}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <label className={uploadBtnCls(uploading === "cover")}>
                    {uploading === "cover" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading === "cover" ? "Uploading…" : form.cover_url ? "Replace Cover" : "Upload Cover"}
                    <input type="file" accept="image/*" className="hidden" disabled={!!uploading} onChange={handleUpload("cover")} />
                  </label>
                  <p className="text-slate-400 text-xs">JPG, PNG, WebP — max 5 MB. Without a cover, a document icon is shown.</p>
                </div>
              </div>

              {/* Date & visibility */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</span>
                  <input
                    type="date"
                    value={form.published_at}
                    onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !!uploading || !form.title.trim() || !form.file_url}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Publication"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
