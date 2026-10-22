import { Globe } from "lucide-react";
import { countryName, type CountryRow } from "@/lib/visits";

export function CountryFlag({ code }: { code: string | null }) {
  if (!code) {
    return (
      <span className="w-7 h-5 rounded-sm bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Globe className="w-3.5 h-3.5 text-slate-400" />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt=""
      loading="lazy"
      className="w-7 h-5 rounded-sm object-cover ring-1 ring-slate-200 flex-shrink-0"
    />
  );
}

// Countries ranked by visitors, with each country's share of all visitors.
export default function CountryList({ rows, limit }: { rows: CountryRow[]; limit?: number }) {
  const total = rows.reduce((sum, r) => sum + r.visitors, 0);
  const max = Math.max(...rows.map((r) => r.visitors), 1);
  const shown = limit ? rows.slice(0, limit) : rows;

  if (rows.length === 0) {
    return <p className="text-slate-400 text-sm py-6 text-center">No visitors yet</p>;
  }

  return (
    <ul className="space-y-3">
      {shown.map((r) => (
        <li key={r.country ?? "unknown"} title={`${countryName(r.country)}: ${r.visitors} visitors, ${r.views} page views`}>
          <div className="flex items-center gap-3 mb-1.5">
            <CountryFlag code={r.country} />
            <span className="text-slate-700 text-sm font-medium flex-1 truncate">{countryName(r.country)}</span>
            <span className="text-slate-900 text-sm font-semibold tabular-nums">{r.visitors.toLocaleString("en-US")}</span>
            <span className="text-slate-400 text-xs tabular-nums w-10 text-right">
              {Math.round((r.visitors / total) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden ml-10">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(r.visitors / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
