import Link from "next/link";
import { Users, Eye, CalendarDays, Globe, ArrowUpRight, XCircle, type LucideIcon } from "lucide-react";
import CountryList from "@/components/admin/CountryList";
import { getVisitorStats, type VisitorDay } from "@/lib/visits";

const RANGES = [7, 30, 90];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>{children}</div>;
}

function CardHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="px-6 pt-5 pb-4">
      <h2 className="font-bold text-slate-900">{title}</h2>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

// Visitors per day. One series, so no legend; hover a bar for the exact figures.
function DailyBars({ days }: { days: VisitorDay[] }) {
  const max = Math.max(...days.map((d) => d.visitors), 1);
  const plotHeight = 176;
  // Keep the date labels readable on long ranges.
  const labelEvery = days.length <= 7 ? 1 : days.length <= 30 ? 5 : 15;
  return (
    <div className="px-6 pb-6">
      <div className="relative" style={{ height: plotHeight }}>
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-200" />
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-100" />
        <div className="absolute inset-x-0 bottom-0 border-t border-slate-200" />
        <span className="absolute -top-2 right-0 bg-white pl-2 text-[10px] font-medium text-slate-400 tabular-nums">{max}</span>

        <div className={`absolute inset-0 flex items-end pr-8 ${days.length > 30 ? "gap-px" : "gap-1 sm:gap-2"}`}>
          {days.map((d, i) => {
            const isToday = i === days.length - 1;
            const height = d.visitors > 0 ? Math.max((d.visitors / max) * plotHeight, 4) : 0;
            return (
              <div
                key={d.date}
                title={`${d.label}: ${d.visitors} visitor${d.visitors === 1 ? "" : "s"}, ${d.views} page view${d.views === 1 ? "" : "s"}`}
                className="group flex-1 h-full flex items-end justify-center"
              >
                <div
                  className={`w-full max-w-10 rounded-t ${isToday ? "bg-emerald-600" : "bg-emerald-600/55 group-hover:bg-emerald-600"} transition-colors`}
                  style={{ height }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={`flex pr-8 mt-2 ${days.length > 30 ? "gap-px" : "gap-1 sm:gap-2"}`}>
        {days.map((d, i) => (
          <span key={d.date} className="flex-1 text-center text-[10px] text-slate-400 whitespace-nowrap overflow-visible">
            {(days.length - 1 - i) % labelEvery === 0 ? d.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function VisitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { days: daysParam } = await searchParams;
  const days = RANGES.includes(Number(daysParam)) ? Number(daysParam) : 30;
  const stats = await getVisitorStats(days);

  if (!stats) {
    return (
      <div className="p-8 lg:p-10">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Visitor data not available</h2>
          <p className="text-red-500 text-sm">Make sure XAMPP MySQL is running, then restart the dev server so the visitors table is created.</p>
        </div>
      </div>
    );
  }

  const kpis: { label: string; value: number; sub: string; icon: LucideIcon; tint: string }[] = [
    { label: "Visitors today", value: stats.today.visitors, sub: `${stats.today.views} page views today`, icon: Users, tint: "bg-orange-50 text-orange-600" },
    { label: `Visitors, last ${days} days`, value: stats.range.visitors, sub: `${stats.allTime.visitors.toLocaleString("en-US")} since tracking began`, icon: CalendarDays, tint: "bg-emerald-50 text-emerald-600" },
    { label: `Page views, last ${days} days`, value: stats.range.views, sub: stats.range.visitors > 0 ? `${(stats.range.views / stats.range.visitors).toFixed(1)} pages per visitor` : "No visits yet", icon: Eye, tint: "bg-blue-50 text-blue-600" },
    { label: "Countries", value: stats.range.countries, sub: `Visitors came from, last ${days} days`, icon: Globe, tint: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="p-6 pt-20 lg:p-10 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Website Visitors</h1>
          <p className="text-slate-500 text-sm mt-1">
            How many people visit the website and which countries they come from. Admin pages and search-engine bots are not counted.
          </p>
        </div>
        <div className="inline-flex self-start sm:self-auto bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin/visitors?days=${r}`}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                r === days ? "bg-orange-500 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {r} days
            </Link>
          ))}
        </div>
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
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums mt-2">{kpi.value.toLocaleString("en-US")}</p>
            <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
          </Card>
        ))}
      </div>

      {/* Trend + countries */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Visitors per day" sub={`Unique visitors each day, last ${days} days — hover a bar for details`} />
          {stats.range.views > 0 ? (
            <DailyBars days={stats.days} />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm px-6 pb-6">No visits in this period yet</div>
          )}
        </Card>

        <Card>
          <CardHeader title="Visitors by country" sub={`Last ${days} days`} />
          <div className="px-6 pb-6 max-h-[420px] overflow-y-auto">
            <CountryList rows={stats.countries} />
          </div>
        </Card>
      </div>

      {/* Pages + referrers */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader title="Most visited pages" sub={`Last ${days} days`} />
          {stats.pages.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-slate-100 text-xs text-slate-500">
                  <th className="text-left font-semibold px-6 py-2.5">Page</th>
                  <th className="text-right font-semibold px-6 py-2.5">Visitors</th>
                  <th className="text-right font-semibold px-6 py-2.5">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.pages.map((p: { path: string; views: number; visitors: number }) => (
                  <tr key={p.path}>
                    <td className="px-6 py-3 max-w-0 w-full">
                      <a href={p.path} target="_blank" className="group inline-flex items-center gap-1 text-slate-700 hover:text-orange-600 font-medium truncate max-w-full">
                        <span className="truncate">{p.path}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums text-slate-900 font-semibold">{p.visitors.toLocaleString("en-US")}</td>
                    <td className="px-6 py-3 text-right tabular-nums text-slate-500">{p.views.toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-slate-400 text-sm py-10 text-center border-t border-slate-100">No visits in this period yet</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Where visitors came from" sub="Other websites that linked here" />
          <div className="px-6 pb-6">
            {stats.referrers.length > 0 ? (
              <ul className="space-y-2.5">
                {stats.referrers.map((r: { referrer: string; visitors: number }) => (
                  <li key={r.referrer} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-700 truncate">{r.referrer}</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{r.visitors}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm py-6 text-center">
                No links from other websites yet. Visitors who type the address or use a bookmark are not listed here.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
