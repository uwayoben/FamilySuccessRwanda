"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Upload, CheckCircle, Plus, Trash2, ExternalLink } from "lucide-react";
import {
  SPONSOR_CHILD_SETTING_KEY,
  DEFAULT_SPONSOR_CHILD_CONTENT,
  parseSponsorChildContent,
  type SponsorChildContent,
} from "@/lib/sponsorChild";

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-orange-400 transition-colors";
const labelCls = "block text-sm font-bold text-slate-700 mb-1.5";

async function uploadImage(file: File): Promise<string | null> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "sponsor");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) return data.url;
    alert("Upload error: " + (data.error ?? `HTTP ${res.status}`));
  } catch (err) {
    alert("Upload failed: " + (err instanceof Error ? err.message : "Network error"));
  }
  return null;
}

function ImageField({ value, onChange, emptyText }: { value: string; onChange: (url: string) => void; emptyText: string }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) onChange(url);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div>
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center px-4 text-slate-400 text-sm">
            {emptyText}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${uploading ? "border-slate-200 text-slate-400 cursor-not-allowed" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading…" : "Upload Image"}
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-400 hover:text-red-600 transition-colors">
            Remove image
          </button>
        )}
      </div>
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-lg font-extrabold text-slate-800">{title}</h2>
      {hint && <p className="text-slate-500 text-sm mt-1">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

export default function SponsorAChildAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [content, setContent] = useState<SponsorChildContent>(DEFAULT_SPONSOR_CHILD_CONTENT);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setContent(parseSponsorChildContent(data[SPONSOR_CHILD_SETTING_KEY]));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = <K extends keyof SponsorChildContent>(key: K, value: SponsorChildContent[K]) => {
    setContent((c) => ({ ...c, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const cleaned: SponsorChildContent = {
        ...content,
        provisions: content.provisions.map((p) => p.trim()).filter(Boolean),
        actions: content.actions.map((a) => a.trim()).filter(Boolean),
        costs: content.costs.filter((c) => c.amount.trim() || c.desc.trim()),
        photos: content.photos.filter((p) => p.url),
      };
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: SPONSOR_CHILD_SETTING_KEY, value: JSON.stringify(cleaned) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setContent(cleaned);
      setSaved(true);
    } catch (err) {
      alert("Save failed: " + (err instanceof Error ? err.message : "Network error"));
    } finally {
      setSaving(false);
    }
  };

  const SaveBar = () => (
    <div className="flex items-center gap-3">
      {saved && (
        <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> Saved
        </span>
      )}
      <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Sponsor a Child</h1>
          <p className="text-slate-500 text-sm mt-1">
            Edit the text and images on the Sponsor a Child page.{" "}
            <a href="/sponsor-a-child" target="_blank" className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium">
              View page <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
        {!loading && <SaveBar />}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          <Card title="Top Banner" hint="The large banner at the top of the page.">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Small heading</label>
                  <input className={inputCls} value={content.hero_tag} onChange={(e) => set("hero_tag", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Title (white)</label>
                  <input className={inputCls} value={content.hero_title} onChange={(e) => set("hero_title", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Title (orange, second line)</label>
                  <input className={inputCls} value={content.hero_highlight} onChange={(e) => set("hero_highlight", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Subtitle</label>
                  <textarea rows={3} className={`${inputCls} resize-none`} value={content.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Background image</label>
                <ImageField
                  value={content.hero_image}
                  onChange={(url) => set("hero_image", url)}
                  emptyText="No image — a plain green background is shown"
                />
              </div>
            </div>
          </Card>

          <Card title="Why Sponsor" hint="The introduction text with a photo beside it.">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Text</label>
                <textarea rows={14} className={inputCls} value={content.intro_text} onChange={(e) => set("intro_text", e.target.value)} />
                <p className="text-slate-400 text-xs mt-1.5">Leave an empty line between paragraphs.</p>
              </div>
              <div>
                <label className={labelCls}>Photo</label>
                <ImageField
                  value={content.intro_image}
                  onChange={(url) => set("intro_image", url)}
                  emptyText="No photo — the text is shown on its own"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>&quot;Your sponsorship helps provide&quot; list</label>
              <textarea
                rows={4}
                className={inputCls}
                value={content.provisions.join("\n")}
                onChange={(e) => set("provisions", e.target.value.split("\n"))}
              />
              <p className="text-slate-400 text-xs mt-1.5">One item per line.</p>
            </div>
          </Card>

          <Card title="How Much Does It Cost?" hint="The sponsorship price cards.">
            {content.costs.map((cost, i) => (
              <div key={i} className="grid sm:grid-cols-12 gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="sm:col-span-3">
                  <label className={labelCls}>Amount</label>
                  <input
                    className={inputCls}
                    placeholder="RWF 20,000"
                    value={cost.amount}
                    onChange={(e) => set("costs", content.costs.map((c, j) => (j === i ? { ...c, amount: e.target.value } : c)))}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelCls}>Period</label>
                  <input
                    className={inputCls}
                    placeholder="per month"
                    value={cost.period}
                    onChange={(e) => set("costs", content.costs.map((c, j) => (j === i ? { ...c, period: e.target.value } : c)))}
                  />
                </div>
                <div className="sm:col-span-5">
                  <label className={labelCls}>What it covers</label>
                  <input
                    className={inputCls}
                    value={cost.desc}
                    onChange={(e) => set("costs", content.costs.map((c, j) => (j === i ? { ...c, desc: e.target.value } : c)))}
                  />
                </div>
                <div className="sm:col-span-1 sm:pt-8">
                  <button
                    type="button"
                    onClick={() => set("costs", content.costs.filter((_, j) => j !== i))}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove price"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("costs", [...content.costs, { amount: "", period: "", desc: "" }])}
              className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              <Plus className="w-4 h-4" /> Add price
            </button>
          </Card>

          <Card title="Their Journey & Photos" hint="A short paragraph followed by a row of photos. Landscape photos (4:3) work best.">
            <div>
              <label className={labelCls}>Text</label>
              <textarea rows={4} className={inputCls} value={content.journey_text} onChange={(e) => set("journey_text", e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.photos.map((photo, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <ImageField
                    value={photo.url}
                    onChange={(url) => set("photos", content.photos.map((p, j) => (j === i ? { ...p, url } : p)))}
                    emptyText="Upload a photo"
                  />
                  <input
                    className={inputCls}
                    placeholder="Caption (optional)"
                    value={photo.caption}
                    onChange={(e) => set("photos", content.photos.map((p, j) => (j === i ? { ...p, caption: e.target.value } : p)))}
                  />
                  <button
                    type="button"
                    onClick={() => set("photos", content.photos.filter((_, j) => j !== i))}
                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete photo
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => set("photos", [...content.photos, { url: "", caption: "" }])}
              className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              <Plus className="w-4 h-4" /> Add photo
            </button>
            <p className="text-slate-400 text-xs">JPG, PNG, WebP — max 5 MB each</p>
          </Card>

          <Card title="Take Action Today" hint="The green section at the bottom of the page.">
            <div>
              <label className={labelCls}>Action points</label>
              <textarea
                rows={5}
                className={inputCls}
                value={content.actions.join("\n")}
                onChange={(e) => set("actions", e.target.value.split("\n"))}
              />
              <p className="text-slate-400 text-xs mt-1.5">One item per line. Three items fit best.</p>
            </div>
            <div>
              <label className={labelCls}>Closing text</label>
              <textarea rows={4} className={inputCls} value={content.closing_text} onChange={(e) => set("closing_text", e.target.value)} />
            </div>
          </Card>

          <div className="flex justify-end">
            <SaveBar />
          </div>
        </div>
      )}
    </div>
  );
}
