"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Upload, CheckCircle } from "lucide-react";

export default function HomePageAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedUrl, setSavedUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setImageUrl(data.who_we_are_image ?? "");
        setSavedUrl(data.who_we_are_image ?? "");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSaved(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "home");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
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
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "who_we_are_image", value: imageUrl }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSavedUrl(imageUrl);
      setSaved(true);
    } catch (err) {
      alert("Save failed: " + (err instanceof Error ? err.message : "Network error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Home Page</h1>
        <p className="text-slate-500 text-sm mt-1">Manage images shown on the homepage</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl">
          <h2 className="text-lg font-extrabold text-slate-800">&quot;Who We Are&quot; Image</h2>
          <p className="text-slate-500 text-sm mt-1 mb-5">Shown beside the Who We Are text. A landscape photo (4:3) works best.</p>

          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-5">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Who We Are preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                No image uploaded — the default photo is shown on the website
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${uploading ? "border-slate-200 text-slate-400 cursor-not-allowed" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading…" : "Upload Image"}
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
            </label>
            {imageUrl && (
              <button onClick={() => { setImageUrl(""); setSaved(false); }} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                Remove image
              </button>
            )}
            <div className="flex-1" />
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> Saved
              </span>
            )}
            <button onClick={save} disabled={saving || uploading || imageUrl === savedUrl} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-3">JPG, PNG, WebP — max 5 MB</p>
        </div>
      )}
    </div>
  );
}
