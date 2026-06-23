import pool from "@/lib/db";
import Link from "next/link";
import {
  DollarSign, MessageSquare, Users, TrendingUp,
  ArrowRight, CheckCircle, Clock, XCircle,
  GraduationCap, Activity,
} from "lucide-react";

async function getStats() {
  try {
    const [[donations]]: any = await pool.execute(
      "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations"
    );
    const [[confirmed]]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM donations WHERE status = 'confirmed'"
    );
    const [[messages]]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM contact_messages"
    );
    const [[unread]]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'"
    );
    const [[subscribers]]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM newsletter_subscribers WHERE is_active = 1"
    );
    const [recentDonations]: any = await pool.execute(
      "SELECT * FROM donations ORDER BY created_at DESC LIMIT 6"
    );
    const [recentMessages]: any = await pool.execute(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5"
    );
    const [monthly]: any = await pool.execute(`
      SELECT DATE_FORMAT(created_at, '%b') as month,
             DATE_FORMAT(created_at, '%Y-%m') as ym,
             COUNT(*) as count,
             COALESCE(SUM(amount), 0) as total
      FROM donations
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY ym, month
      ORDER BY ym ASC
    `);
    const [byType]: any = await pool.execute(
      "SELECT donation_type, COUNT(*) as count FROM donations GROUP BY donation_type ORDER BY count DESC"
    );

    return {
      totalDonations: donations.count,
      totalAmount: Number(donations.total),
      confirmedDonations: confirmed.count,
      totalMessages: messages.count,
      unreadMessages: unread.count,
      totalSubscribers: subscribers.count,
      recentDonations,
      recentMessages,
      monthly,
      byType,
    };
  } catch {
    return null;
  }
}

const statusStyles: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  unread:    "bg-blue-100 text-blue-700",
  read:      "bg-gray-100 text-gray-600",
  replied:   "bg-emerald-100 text-emerald-700",
};

function formatAmount(amount: number, currency: string) {
  return `${currency ?? "USD"} ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function BarChart({ data }: { data: { month: string; total: number }[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div className="flex items-end gap-3 h-36 px-2">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-slate-500 font-medium">
            {d.total > 0 ? `$${Math.round(d.total)}` : ""}
          </span>
          <div className="w-full flex items-end" style={{ height: "80px" }}>
            <div
              className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-500 min-h-[4px]"
              style={{ height: `${Math.max((d.total / max) * 80, 4)}px` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-semibold">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const stats = await getStats();

  if (!stats) {
    return (
      <div className="p-8 lg:p-10">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Database Not Connected</h2>
          <p className="text-red-500 text-sm">Make sure XAMPP MySQL is running, then restart the dev server.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Donations",
      value: stats.totalDonations,
      sub: `${stats.confirmedDonations} confirmed`,
      icon: DollarSign,
      color: "from-orange-400 to-orange-600",
      bg: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      label: "Revenue Recorded",
      value: `$${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      sub: "Total donations amount",
      icon: TrendingUp,
      color: "from-emerald-400 to-emerald-600",
      bg: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Contact Messages",
      value: stats.totalMessages,
      sub: `${stats.unreadMessages} unread`,
      icon: MessageSquare,
      color: "from-blue-400 to-blue-600",
      bg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Subscribers",
      value: stats.totalSubscribers,
      sub: "Active newsletter subs",
      icon: Users,
      color: "from-purple-400 to-purple-600",
      bg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700 text-sm font-semibold">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-none mb-1">{card.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
            <p className={`text-xs font-semibold mt-1 ${card.textColor}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Donation Types */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-extrabold text-slate-900">Donation Trends</h2>
              <p className="text-slate-400 text-xs mt-0.5">Last 6 months</p>
            </div>
            <Link href="/admin/donations" className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {stats.monthly.length > 0 ? (
            <BarChart data={stats.monthly} />
          ) : (
            <div className="h-36 flex items-center justify-center text-slate-300 text-sm">No donation data yet</div>
          )}
        </div>

        {/* Donation by type */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-extrabold text-slate-900 mb-1">By Program</h2>
          <p className="text-slate-400 text-xs mb-5">Donations per category</p>
          {stats.byType.length > 0 ? (
            <div className="space-y-3">
              {stats.byType.map((t: any) => {
                const pct = Math.round((t.count / stats.totalDonations) * 100);
                return (
                  <div key={t.donation_type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600 text-xs font-semibold capitalize">{t.donation_type.replace("_", " ")}</span>
                      <span className="text-slate-400 text-xs">{t.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-slate-300 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Donations */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" /> Recent Donations
            </h2>
            <Link href="/admin/donations" className="text-orange-500 hover:text-orange-600 text-xs font-bold">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentDonations.length > 0 ? stats.recentDonations.map((d: any) => (
              <div key={d.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-sm font-semibold truncate">{d.full_name}</p>
                  <p className="text-slate-400 text-xs capitalize">{d.donation_type?.replace("_", " ")} · {timeAgo(d.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-900 text-sm font-bold">{formatAmount(d.amount, d.currency)}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[d.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {d.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">No donations yet</div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Recent Messages
              {stats.unreadMessages > 0 && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.unreadMessages}</span>
              )}
            </h2>
            <Link href="/admin/messages" className="text-blue-500 hover:text-blue-600 text-xs font-bold">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentMessages.length > 0 ? stats.recentMessages.map((m: any) => (
              <div key={m.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-slate-800 text-sm font-semibold truncate">{m.full_name}</p>
                    {m.status === "unread" && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-slate-500 text-xs font-medium truncate">{m.subject}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{timeAgo(m.created_at)}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusStyles[m.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {m.status}
                </span>
              </div>
            )) : (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">No messages yet</div>
            )}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-extrabold text-lg">Quick Actions</h2>
          <p className="text-slate-400 text-sm">Manage your organization data</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Donations", href: "/admin/donations", color: "bg-orange-500 hover:bg-orange-400" },
            { label: "Messages", href: "/admin/messages", color: "bg-blue-500 hover:bg-blue-400" },
            { label: "Subscribers", href: "/admin/subscribers", color: "bg-purple-500 hover:bg-purple-400" },
          ].map((a) => (
            <Link key={a.href} href={a.href} className={`${a.color} text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg`}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
