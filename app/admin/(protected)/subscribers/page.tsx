"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Search, Mail, CheckCircle, XCircle,
  Trash2, RefreshCw, UserCheck, UserX, Download,
} from "lucide-react";

type Subscriber = {
  id: number;
  email: string;
  name: string | null;
  subscribed_at: string;
  is_active: boolean;
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [selected, setSelected] = useState<number[]>([]);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) setSubscribers(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = subscribers.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.email.toLowerCase().includes(q) || (s.name?.toLowerCase().includes(q) ?? false);
    const matchFilter = filter === "all" || (filter === "active" && s.is_active) || (filter === "inactive" && !s.is_active);
    return matchSearch && matchFilter;
  });

  const toggleActive = async (id: number, active: boolean) => {
    setUpdating(id);
    await fetch(`/api/admin/subscribers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: active }),
    });
    setSubscribers((prev) => prev.map((s) => s.id === id ? { ...s, is_active: active } : s));
    setUpdating(null);
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm("Remove this subscriber?")) return;
    await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const toggleSelect = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((s) => s.id));

  const exportCSV = () => {
    const rows = [["ID", "Email", "Name", "Subscribed At", "Active"]];
    subscribers.forEach((s) => rows.push([String(s.id), s.email, s.name ?? "", s.subscribed_at, s.is_active ? "Yes" : "No"]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "fsr-subscribers.csv";
    a.click();
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const activeCount = subscribers.filter((s) => s.is_active).length;

  return (
    <div className="p-6 lg:p-10 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-500" /> Subscribers
          </h1>
          <p className="text-slate-500 text-sm mt-1">Newsletter subscriber management</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={load}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: subscribers.length, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Active", value: activeCount, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Inactive", value: subscribers.length - activeCount, icon: UserX, color: "text-red-400", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
            />
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">{filtered.length} of {subscribers.length} subscribers</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subscribed</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${50 + Math.random() * 50}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No subscribers found</p>
                    <p className="text-xs mt-1">Try adjusting your search</p>
                  </td>
                </tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${selected.includes(s.id) ? "bg-purple-50" : ""}`}>
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      className="w-4 h-4 accent-purple-500 rounded"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-slate-800">{s.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{s.name ?? <span className="text-slate-300 italic">—</span>}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{fmtDate(s.subscribed_at)}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(s.id, !s.is_active)}
                      disabled={updating === s.id}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                        s.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {s.is_active
                        ? <><CheckCircle className="w-3.5 h-3.5" /> Active</>
                        : <><XCircle className="w-3.5 h-3.5" /> Inactive</>}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${s.email}`}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteSubscriber(s.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selection action bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 z-40">
          <span className="text-sm font-semibold">{selected.length} selected</span>
          <div className="w-px h-4 bg-slate-600" />
          <button
            onClick={() => selected.forEach((id) => toggleActive(id, true))}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold"
          >
            Activate all
          </button>
          <button
            onClick={() => selected.forEach((id) => toggleActive(id, false))}
            className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
          >
            Deactivate all
          </button>
          <button
            onClick={() => setSelected([])}
            className="text-slate-400 hover:text-white text-sm font-semibold"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
