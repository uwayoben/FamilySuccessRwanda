import pool from "@/lib/db";
import Link from "next/link";
import CountryList from "@/components/admin/CountryList";
import { getVisitorStats } from "@/lib/visits";
import {
  DollarSign, MessageSquare, Users, HandHeart, ArrowRight, ArrowUpRight, XCircle,
  Clock, Mail, Newspaper, Quote, FileText, GalleryHorizontal, GraduationCap,
  UserCheck, Handshake, ImageIcon, CheckCircle2, type LucideIcon,
} from "lucide-react";

// Tables added later may not exist until migrations have run — count them as empty.
async function countRows(sql: string): Promise<number> {
  try {
    const [[row]]: any = await pool.execute(sql);
    return Number(row.count ?? 0);
  } catch {
    return 0;
  }
}

async function getStats() {
  try {
    const [byStatus]: any = await pool.execute(
      "SELECT status, COUNT(*) as count FROM donations GROUP BY status"
    );
    const [confirmedByCurrency]: any = await pool.execute(
      `SELECT currency, COUNT(*) as count, COALESCE(SUM(amount), 0) as total
       FROM donations WHERE status = 'confirmed' GROUP BY currency ORDER BY total DESC`
    );
    const [[thisMonth]]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM donations WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')"
    );
    const [[messages]]: any = await pool.execute(
      `SELECT COUNT(*) as count,
              COALESCE(SUM(status = 'unread'), 0) as unread,
              COALESCE(SUM(subject LIKE 'Volunteer application%'), 0) as volunteers,
              COALESCE(SUM(subject LIKE 'Volunteer application%' AND status = 'unread'), 0) as volunteersUnread
       FROM contact_messages`
    );
    const [[subscribers]]: any = await pool.execute(
      `SELECT COUNT(*) as count,
              COALESCE(SUM(subscribed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)), 0) as recent
       FROM newsletter_subscribers WHERE is_active = 1`
    );
    const [recentDonations]: any = await pool.execute(
      "SELECT * FROM donations ORDER BY created_at DESC LIMIT 6"
    );
    const [recentMessages]: any = await pool.execute(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 6"
    );
    const [monthly]: any = await pool.execute(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as ym, COUNT(*) as count
      FROM donations
      WHERE created_at >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 5 MONTH)
      GROUP BY ym
    `);
    const [byType]: any = await pool.execute(
      "SELECT donation_type, COUNT(*) as count FROM donations GROUP BY donation_type ORDER BY count DESC"
    );

    const [news, stories, publications, gallery, programs, staff, partners, slides] = await Promise.all([
      countRows("SELECT COUNT(*) as count FROM news"),
      countRows("SELECT COUNT(*) as count FROM success_stories"),
      countRows("SELECT COUNT(*) as count FROM publications"),
      countRows("SELECT COUNT(*) as count FROM gallery"),
      countRows("SELECT COUNT(*) as count FROM programs"),
      countRows("SELECT COUNT(*) as count FROM staff"),
      countRows("SELECT COUNT(*) as count FROM partners"),
      countRows("SELECT COUNT(*) as count FROM hero_slides"),
    ]);

    const status: Record<string, number> = { pending: 0, confirmed: 0, cancelled: 0 };
    for (const row of byStatus) status[row.status] = Number(row.count);

    // Always show the last six calendar months, including ones with no donations.
    const monthCounts = new Map<string, number>(monthly.map((m: any) => [m.ym, Number(m.count)]));
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return {
        ym,
        label: d.toLocaleDateString("en-US", { month: "short" }),
        fullLabel: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        count: monthCounts.get(ym) ?? 0,
      };
    });

    return {
      status,
      totalDonations: status.pending + status.confirmed + status.cancelled,
      donationsThisMonth: Number(thisMonth.count),
      confirmedByCurrency: confirmedByCurrency.map((c: any) => ({ currency: c.currency ?? "USD", total: Number(c.total), count: Number(c.count) })),
      totalMessages: Number(messages.count),
      unreadMessages: Number(messages.unread),
      volunteers: Number(messages.volunteers),
      volunteersUnread: Number(messages.volunteersUnread),
      totalSubscribers: Number(subscribers.count),
      recentSubscribers: Number(subscribers.recent),
      recentDonations,
      recentMessages,
      months,
      byType: byType.map((t: any) => ({ type: String(t.donation_type ?? "general"), count: Number(t.count) })),
      content: { news, stories, publications, gallery, programs, staff, partners, slides },
    };
  } catch {
    return null;
  }
}

const statusStyles: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  unread:    "bg-blue-50 text-blue-700 ring-blue-200",
  read:      "bg-slate-50 text-slate-600 ring-slate-200",
  replied:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ring-1 ring-inset capitalize ${statusStyles[status] ?? "bg-slate-50 text-slate-600 ring-slate-200"}`}>
      {status}
    </span>
  );
}

function formatMoney(amount: number, currency: string) {
  const decimals = currency === "RWF" ? 0 : 2;
  return `${currency} ${Number(amount).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name: string) {
  return (name ?? "").split(/\s+/).filter((w) => /^\p{L}/u.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>{children}</div>;
}

function CardHeader({ title, sub, href, linkLabel = "View all" }: { title: string; sub?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-xs font-semibold whitespace-nowrap mt-0.5">
          {linkLabel} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

// Donation requests per month. One series, so no legend; hover a bar for the exact count.
function MonthlyBars({ months }: { months: { ym: string; label: string; fullLabel: string; count: number }[] }) {
  const max = Math.max(...months.map((m) => m.count), 1);
  const plotHeight = 144;
  return (
    <div className="px-6 pb-6">
      <div className="relative" style={{ height: plotHeight }}>
        {/* Recessive guide lines: max, half, baseline */}
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-200" />
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-100" />
        <div className="absolute inset-x-0 bottom-0 border-t border-slate-200" />
        <span className="absolute -top-2 right-0 bg-white pl-2 text-[10px] font-medium text-slate-400 tabular-nums">{max}</span>

        <div className="absolute inset-0 flex items-end gap-3 sm:gap-5 pr-8">
          {months.map((m, i) => {
            const isCurrent = i === months.length - 1;
            const height = m.count > 0 ? Math.max((m.count / max) * plotHeight, 6) : 0;
            return (
              <div
                key={m.ym}
                title={`${m.fullLabel}: ${m.count} donation request${m.count === 1 ? "" : "s"}`}
                className="group relative flex-1 h-full flex items-end justify-center"
              >
                <span className={`absolute left-1/2 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-slate-700 transition-opacity ${isCurrent ? "" : "opacity-0 group-hover:opacity-100"}`} style={{ bottom: height + 4 }}>
                  {m.count}
                </span>
                <div
                  className={`w-full max-w-10 rounded-t ${isCurrent ? "bg-emerald-600" : "bg-emerald-600/55 group-hover:bg-emerald-600"} transition-colors`}
                  style={{ height }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3 sm:gap-5 pr-8 mt-2">
        {months.map((m, i) => (
          <span key={m.ym} className={`flex-1 text-center text-xs ${i === months.length - 1 ? "font-semibold text-slate-700" : "text-slate-400"}`}>
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const [stats, visitors] = await Promise.all([getStats(), getVisitorStats(30)]);

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

  const attention: { label: string; count: number; hint: string; href: string; icon: LucideIcon }[] = [
    { label: "Pending donation requests", count: stats.status.pending, hint: "Waiting for payment follow-up", href: "/admin/donations", icon: Clock },
    { label: "Unread messages", count: stats.unreadMessages, hint: "Contact form and applications", href: "/admin/messages", icon: Mail },
    { label: "New volunteer applications", count: stats.volunteersUnread, hint: `${stats.volunteers} received in total`, href: "/admin/messages", icon: HandHeart },
  ];

  const kpis: { label: string; value: string; sub: string; icon: LucideIcon; tint: string }[] = [
    { label: "Donation requests", value: stats.totalDonations.toLocaleString("en-US"), sub: `${stats.donationsThisMonth} this month`, icon: DollarSign, tint: "bg-orange-50 text-orange-600" },
    { label: "Confirmed donations", value: stats.status.confirmed.toLocaleString("en-US"), sub: `${stats.status.pending} pending · ${stats.status.cancelled} cancelled`, icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" },
    { label: "Messages", value: stats.totalMessages.toLocaleString("en-US"), sub: `${stats.unreadMessages} unread`, icon: MessageSquare, tint: "bg-blue-50 text-blue-600" },
    { label: "Newsletter subscribers", value: stats.totalSubscribers.toLocaleString("en-US"), sub: `${stats.recentSubscribers} new in the last 30 days`, icon: Users, tint: "bg-violet-50 text-violet-600" },
  ];

  const statusRows = [
    { key: "confirmed", label: "Confirmed", bar: "bg-emerald-500" },
    { key: "pending", label: "Pending", bar: "bg-amber-400" },
    { key: "cancelled", label: "Cancelled", bar: "bg-red-400" },
  ];

  const maxType = Math.max(...stats.byType.map((t: { count: number }) => t.count), 1);

  const contentTiles: { label: string; count: number; href: string; icon: LucideIcon }[] = [
    { label: "News", count: stats.content.news, href: "/admin/news", icon: Newspaper },
    { label: "Success stories", count: stats.content.stories, href: "/admin/stories", icon: Quote },
    { label: "Publications", count: stats.content.publications, href: "/admin/publications", icon: FileText },
    { label: "Gallery photos", count: stats.content.gallery, href: "/admin/gallery", icon: GalleryHorizontal },
    { label: "Programs", count: stats.content.programs, href: "/admin/programs", icon: GraduationCap },
    { label: "Staff", count: stats.content.staff, href: "/admin/staff", icon: UserCheck },
    { label: "Partners", count: stats.content.partners, href: "/admin/partners", icon: Handshake },
    { label: "Hero slides", count: stats.content.slides, href: "/admin/slides", icon: ImageIcon },
  ];

  return (
    <div className="p-6 pt-20 lg:p-10 space-y-6 max-w-[1400px]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">An overview of donations, messages, and website content.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          View website <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Needs attention */}
      <div className="grid sm:grid-cols-3 gap-4">
        {attention.map((item) => {
          const active = item.count > 0;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                active ? "bg-orange-50 border-orange-200 hover:border-orange-300" : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">{item.label}</p>
                <p className="text-xs text-slate-500 truncate">{active ? item.hint : "Nothing waiting"}</p>
              </div>
              <span className={`text-2xl font-extrabold tabular-nums ${active ? "text-orange-600" : "text-slate-300"}`}>{item.count}</span>
            </Link>
          );
        })}
      </div>

      {/* Key figures */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500">{kpi.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${kpi.tint}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums mt-2">{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
          </Card>
        ))}
      </div>

      {/* Website visitors */}
      {visitors && (
        <Card>
          <CardHeader title="Website visitors" sub="Last 30 days" href="/admin/visitors" linkLabel="Full report" />
          <div className="grid lg:grid-cols-2 gap-6 px-6 pb-6">
            <div className="grid grid-cols-2 gap-3 content-start">
              {[
                { label: "Visitors today", value: visitors.today.visitors },
                { label: "Visitors (30 days)", value: visitors.range.visitors },
                { label: "Page views (30 days)", value: visitors.range.views },
                { label: "Countries", value: visitors.range.countries },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{item.value.toLocaleString("en-US")}</p>
                  <p className="text-xs font-medium text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-3">Top countries</p>
              <CountryList rows={visitors.countries} limit={5} />
            </div>
          </div>
        </Card>
      )}

      {/* Donations: trend + breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Donation requests per month" sub="Number of requests received, last 6 months" href="/admin/donations" />
          {stats.totalDonations > 0 ? (
            <MonthlyBars months={stats.months} />
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-400 text-sm px-6 pb-6">No donation requests yet</div>
          )}
        </Card>

        <Card>
          <CardHeader title="Donation status" sub="All requests received" />
          <div className="px-6 pb-6">
            {stats.totalDonations > 0 ? (
              <>
                <div className="flex gap-0.5 h-2.5 rounded-full overflow-hidden bg-slate-100">
                  {statusRows.map((row) =>
                    stats.status[row.key] > 0 ? (
                      <div
                        key={row.key}
                        title={`${row.label}: ${stats.status[row.key]}`}
                        className={row.bar}
                        style={{ width: `${(stats.status[row.key] / stats.totalDonations) * 100}%` }}
                      />
                    ) : null
                  )}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {statusRows.map((row) => (
                    <li key={row.key} className="flex items-center gap-2.5 text-sm">
                      <span className={`w-2.5 h-2.5 rounded-sm ${row.bar}`} />
                      <span className="text-slate-600 flex-1">{row.label}</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{stats.status[row.key]}</span>
                      <span className="text-slate-400 text-xs tabular-nums w-10 text-right">
                        {Math.round((stats.status[row.key] / stats.totalDonations) * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-slate-400 text-sm py-6 text-center">No data yet</p>
            )}

            <div className="border-t border-slate-100 mt-5 pt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">Confirmed amount</p>
              {stats.confirmedByCurrency.length > 0 ? (
                <ul className="space-y-1.5">
                  {stats.confirmedByCurrency.map((c: { currency: string; total: number; count: number }) => (
                    <li key={c.currency} className="flex items-baseline justify-between gap-3">
                      <span className="text-base font-bold text-slate-900 tabular-nums">{formatMoney(c.total, c.currency)}</span>
                      <span className="text-xs text-slate-400">{c.count} donation{c.count === 1 ? "" : "s"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm">No confirmed donations yet</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader title="Recent donation requests" href="/admin/donations" />
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {stats.recentDonations.length > 0 ? stats.recentDonations.map((d: any) => (
              <div key={d.id} className="flex items-center gap-3 px-6 py-3.5">
                <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {initials(d.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-semibold truncate">{d.full_name}</p>
                  <p className="text-slate-500 text-xs capitalize truncate">{d.donation_type?.replace(/_/g, " ")} · {timeAgo(d.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-900 text-sm font-bold tabular-nums">{formatMoney(d.amount, d.currency ?? "USD")}</p>
                  <StatusBadge status={d.status} />
                </div>
              </div>
            )) : (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">No donation requests yet</div>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Recent messages" sub={stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : undefined} href="/admin/messages" />
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {stats.recentMessages.length > 0 ? stats.recentMessages.map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 px-6 py-3.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${m.status === "unread" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                  {initials(m.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${m.status === "unread" ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>{m.full_name}</p>
                  <p className="text-slate-500 text-xs truncate">{m.subject}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-400 text-xs mb-1">{timeAgo(m.created_at)}</p>
                  <StatusBadge status={m.status} />
                </div>
              </div>
            )) : (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">No messages yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Programs supported + website content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Requests by program" sub="What donors choose to support" />
          <div className="px-6 pb-6">
            {stats.byType.length > 0 ? (
              <ul className="space-y-3">
                {stats.byType.map((t: { type: string; count: number }) => (
                  <li key={t.type} title={`${t.type.replace(/_/g, " ")}: ${t.count}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-600 text-xs font-medium capitalize">{t.type.replace(/_/g, " ")}</span>
                      <span className="text-slate-900 text-xs font-semibold tabular-nums">{t.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(t.count / maxType) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm py-6 text-center">No data yet</p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Website content" sub="Click a tile to manage that section" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 pb-6">
            {contentTiles.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                className="group rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 p-4 transition-colors"
              >
                <tile.icon className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                <p className="text-2xl font-extrabold text-slate-900 tabular-nums mt-3">{tile.count}</p>
                <p className="text-xs font-medium text-slate-500">{tile.label}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
