"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign, Search, Filter, ChevronDown, ChevronUp,
  CheckCircle, Clock, XCircle, Trash2, Eye, RefreshCw,
  Download, TrendingUp, Calendar,
} from "lucide-react";

type Donation = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  donation_type: string;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
  confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const STATUS_ICONS: Record<string, React.FC<{className?: string}>> = {
  pending:   Clock,
  confirmed: CheckCircle,
  cancelled: XCircle,
};

const DONATION_TYPE_LABELS: Record<string, string> = {
  general:             "General",
  education:           "Education",
  healthcare:          "Healthcare",
  faina_jerusalem:     "Faina Jerusalem",
  women_empowerment:   "Women Empowerment",
  children:            "Children",
  youth:               "Youth",
};

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState<"created_at" | "amount">("created_at");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [selected, setSelected] = useState<number[]>([]);
  const [viewModal, setViewModal] = useState<Donation | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/donations");
      if (res.ok) setDonations(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = donations.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.full_name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchType = typeFilter === "all" || d.donation_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  }).sort((a, b) => {
    let diff = 0;
    if (sortField === "created_at") diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortField === "amount") diff = a.amount - b.amount;
    return sortDir === "asc" ? diff : -diff;
  });

  const totalShown = filtered.reduce((s, d) => s + Number(d.amount), 0);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/donations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setDonations((prev) => prev.map((d) => d.id === id ? { ...d, status: status as Donation["status"] } : d));
    if (viewModal?.id === id) setViewModal((prev) => prev ? { ...prev, status: status as Donation["status"] } : null);
    setUpdating(null);
  };

  const deleteDonation = async (id: number) => {
    if (!confirm("Delete this donation record?")) return;
    await fetch(`/api/admin/donations/${id}`, { method: "DELETE" });
    setDonations((prev) => prev.filter((d) => d.id !== id));
    if (viewModal?.id === id) setViewModal(null);
  };

  const toggleSelect = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((d) => d.id));

  const sort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField === field
      ? sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-30" />;

  const fmt = (amount: number, currency: string) =>
    `${currency || "USD"} ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="p-6 lg:p-10 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-orange-500" /> Donations
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage all donation records</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: donations.length, icon: DollarSign, color: "text-orange-500" },
          { label: "Confirmed", value: donations.filter((d) => d.status === "confirmed").length, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Pending", value: donations.filter((d) => d.status === "pending").length, icon: Clock, color: "text-yellow-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <s.icon className={`w-6 h-6 ${s.color}`} />
            <div>
              <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 bg-white"
              >
                <option value="all">All Types</option>
                {Object.entries(DONATION_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {filtered.length > 0 && (
          <p className="text-xs text-slate-400 mt-3 font-medium">
            Showing {filtered.length} of {donations.length} donations · Total: {fmt(totalShown, "USD")}
          </p>
        )}
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
                    className="w-4 h-4 accent-orange-500 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Donor</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700"
                  onClick={() => sort("amount")}
                >
                  <div className="flex items-center gap-1">Amount <SortIcon field="amount" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700"
                  onClick={() => sort("created_at")}
                >
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Date <SortIcon field="created_at" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                    <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No donations found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : filtered.map((d) => {
                const StatusIcon = STATUS_ICONS[d.status];
                return (
                  <tr key={d.id} className={`hover:bg-slate-50 transition-colors ${selected.includes(d.id) ? "bg-orange-50" : ""}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(d.id)}
                        onChange={() => toggleSelect(d.id)}
                        className="w-4 h-4 accent-orange-500 rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800">{d.full_name}</div>
                      <div className="text-xs text-slate-400">{d.email}</div>
                      {d.phone && <div className="text-xs text-slate-400">{d.phone}</div>}
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg capitalize">
                        {DONATION_TYPE_LABELS[d.donation_type] ?? d.donation_type}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900">{fmt(d.amount, d.currency)}</td>
                    <td className="px-4 py-4">
                      <select
                        value={d.status}
                        onChange={(e) => updateStatus(d.id, e.target.value)}
                        disabled={updating === d.id}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none disabled:opacity-60 ${STATUS_STYLES[d.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">{fmtDate(d.created_at)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewModal(d)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDonation(d.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{viewModal.full_name}</h2>
                <p className="text-slate-500 text-sm">{viewModal.email}</p>
              </div>
              <button onClick={() => setViewModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-xl font-extrabold text-slate-900">{fmt(viewModal.amount, viewModal.currency)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Program</p>
                  <p className="font-semibold text-slate-700 capitalize text-sm">{DONATION_TYPE_LABELS[viewModal.donation_type] ?? viewModal.donation_type}</p>
                </div>
              </div>

              {viewModal.phone && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-semibold text-slate-700">{viewModal.phone}</p>
                </div>
              )}

              {viewModal.message && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{viewModal.message}</p>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                <p className="text-slate-700 text-sm">{fmtDate(viewModal.created_at)}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <select
                value={viewModal.status}
                onChange={(e) => updateStatus(viewModal.id, e.target.value)}
                disabled={updating === viewModal.id}
                className={`flex-1 text-sm font-semibold px-4 py-3 rounded-xl border cursor-pointer focus:outline-none ${STATUS_STYLES[viewModal.status]}`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => deleteDonation(viewModal.id)}
                className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
