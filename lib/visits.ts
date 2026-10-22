import pool from "@/lib/db";

export type VisitorDay = { date: string; label: string; views: number; visitors: number };
export type CountryRow = { country: string | null; visitors: number; views: number };

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Website visitor figures for the last `days` days (including today).
// Returns null when the site_visits table isn't there yet (migrations not run).
export async function getVisitorStats(days: number) {
  const since = `DATE_SUB(CURDATE(), INTERVAL ${Math.max(1, Math.floor(days)) - 1} DAY)`;
  try {
    const [[today]]: any = await pool.query(
      "SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors FROM site_visits WHERE created_at >= CURDATE()"
    );
    const [[range]]: any = await pool.query(
      `SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors, COUNT(DISTINCT country) as countries
       FROM site_visits WHERE created_at >= ${since}`
    );
    const [[allTime]]: any = await pool.query(
      "SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors FROM site_visits"
    );
    const [daily]: any = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as d, COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors
       FROM site_visits WHERE created_at >= ${since} GROUP BY d`
    );
    const [countries]: any = await pool.query(
      `SELECT country, COUNT(DISTINCT visitor_id) as visitors, COUNT(*) as views
       FROM site_visits WHERE created_at >= ${since}
       GROUP BY country ORDER BY visitors DESC, views DESC`
    );
    const [pages]: any = await pool.query(
      `SELECT path, COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors
       FROM site_visits WHERE created_at >= ${since}
       GROUP BY path ORDER BY views DESC LIMIT 10`
    );
    const [referrers]: any = await pool.query(
      `SELECT referrer, COUNT(DISTINCT visitor_id) as visitors
       FROM site_visits WHERE created_at >= ${since} AND referrer IS NOT NULL
       GROUP BY referrer ORDER BY visitors DESC LIMIT 8`
    );

    // Every day in the range, including days with no visits.
    const byDay = new Map<string, { views: number; visitors: number }>(
      daily.map((r: any) => [r.d, { views: Number(r.views), visitors: Number(r.visitors) }])
    );
    const now = new Date();
    const dayRows: VisitorDay[] = Array.from({ length: days }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1 - i));
      const key = ymd(d);
      return {
        date: key,
        label: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        views: byDay.get(key)?.views ?? 0,
        visitors: byDay.get(key)?.visitors ?? 0,
      };
    });

    return {
      today: { views: Number(today.views), visitors: Number(today.visitors) },
      range: { views: Number(range.views), visitors: Number(range.visitors), countries: Number(range.countries) },
      allTime: { views: Number(allTime.views), visitors: Number(allTime.visitors) },
      days: dayRows,
      countries: countries.map((c: any): CountryRow => ({
        country: c.country ?? null,
        visitors: Number(c.visitors),
        views: Number(c.views),
      })),
      pages: pages.map((p: any) => ({ path: String(p.path), views: Number(p.views), visitors: Number(p.visitors) })),
      referrers: referrers.map((r: any) => ({ referrer: String(r.referrer), visitors: Number(r.visitors) })),
    };
  } catch {
    return null;
  }
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryName(code: string | null) {
  if (!code) return "Unknown";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}
