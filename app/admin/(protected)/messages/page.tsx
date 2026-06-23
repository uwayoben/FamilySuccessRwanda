"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare, Search, Filter, Mail, Phone,
  CheckCircle, Clock, Send, Trash2, Eye, RefreshCw, XCircle,
} from "lucide-react";

type Message = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  unread:  "bg-blue-100 text-blue-700 border border-blue-200",
  read:    "bg-gray-100 text-gray-600 border border-gray-200",
  replied: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const STATUS_ICONS: Record<string, React.FC<{className?: string}>> = {
  unread:  Clock,
  read:    CheckCircle,
  replied: Send,
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewModal, setViewModal] = useState<Message | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) setMessages(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || m.full_name.toLowerCase().includes(q)
      || m.email.toLowerCase().includes(q)
      || m.subject.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: status as Message["status"] } : m));
    if (viewModal?.id === id) setViewModal((prev) => prev ? { ...prev, status: status as Message["status"] } : null);
    setUpdating(null);
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (viewModal?.id === id) setViewModal(null);
  };

  const openModal = async (m: Message) => {
    setViewModal(m);
    if (m.status === "unread") await updateStatus(m.id, "read");
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="p-6 lg:p-10 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-blue-500" />
            Messages
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Contact form submissions from your website</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Unread", value: messages.filter((m) => m.status === "unread").length, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Read", value: messages.filter((m) => m.status === "read").length, icon: CheckCircle, color: "text-gray-500", bg: "bg-gray-50" },
          { label: "Replied", value: messages.filter((m) => m.status === "replied").length, icon: Send, color: "text-emerald-500", bg: "bg-emerald-50" },
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
              placeholder="Search by name, email, or subject..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">
          {filtered.length} of {messages.length} messages
        </p>
      </div>

      {/* Messages list */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold">No messages found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((m) => {
              const StatusIcon = STATUS_ICONS[m.status];
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-4 px-6 py-5 hover:bg-slate-50 transition-colors cursor-pointer ${m.status === "unread" ? "bg-blue-50/30" : ""}`}
                  onClick={() => openModal(m)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.status === "unread" ? "bg-blue-100" : "bg-slate-100"}`}>
                    <StatusIcon className={`w-5 h-5 ${m.status === "unread" ? "text-blue-500" : "text-slate-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-bold truncate ${m.status === "unread" ? "text-slate-900" : "text-slate-700"}`}>
                        {m.full_name}
                      </p>
                      {m.status === "unread" && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLES[m.status]}`}>{m.status}</span>
                    </div>
                    <p className={`text-sm truncate mb-0.5 ${m.status === "unread" ? "text-slate-700 font-semibold" : "text-slate-500"}`}>
                      {m.subject}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{m.email} · {timeAgo(m.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => deleteMessage(m.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message detail modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-extrabold text-slate-900 truncate">{viewModal.full_name}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[viewModal.status]}`}>
                      {viewModal.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href={`mailto:${viewModal.email}`} className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 text-sm font-semibold">
                      <Mail className="w-4 h-4" /> {viewModal.email}
                    </a>
                    {viewModal.phone && (
                      <a href={`tel:${viewModal.phone}`} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-semibold">
                        <Phone className="w-4 h-4" /> {viewModal.phone}
                      </a>
                    )}
                  </div>
                </div>
                <button onClick={() => setViewModal(null)} className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</p>
                <p className="text-slate-900 font-semibold">{viewModal.subject}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Message</p>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{viewModal.message}</p>
              </div>

              <p className="text-xs text-slate-400 mb-6">{fmtDate(viewModal.created_at)}</p>

              <div className="flex flex-wrap gap-3">
                {(["unread", "read", "replied"] as const).map((s) => {
                  const Icon = STATUS_ICONS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => updateStatus(viewModal.id, s)}
                      disabled={viewModal.status === s || updating === viewModal.id}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 ${
                        viewModal.status === s
                          ? STATUS_STYLES[s] + " cursor-default"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      Mark as {s}
                    </button>
                  );
                })}
                <div className="flex-1" />
                <a
                  href={`mailto:${viewModal.email}?subject=Re: ${encodeURIComponent(viewModal.subject)}`}
                  onClick={() => updateStatus(viewModal.id, "replied")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
                <button
                  onClick={() => deleteMessage(viewModal.id)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
