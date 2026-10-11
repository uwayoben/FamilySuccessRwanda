import pool from "@/lib/db";

export type HeroSlide = {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta1_label: string;
  cta1_href: string;
  cta2_label: string;
  cta2_href: string;
  image_url: string;
  overlay: string;
  stat_value: string;
  stat_label: string;
  bullets: string[];
  icon_name: string;
};

export type Partner = {
  id: number;
  abbr: string;
  name: string;
  logo_url: string;
  website_url: string;
  bg_gradient: string;
  display_order: number;
  is_active: number;
};

export type CoreValue = {
  id: number;
  label: string;
  description: string;
  icon_name: string;
  color_classes: string;
  icon_color: string;
};

export type FaithStatement = {
  id: number;
  text: string;
  icon_name: string;
  icon_color: string;
};

export type StaffMember = {
  id: number;
  slug: string;
  name: string;
  role: string;
  department: string;
  photo: string;
  short_bio: string;
  full_bio: string;
  email: string;
  phone: string;
  joined_year: string;
  education: string[];
  expertise: string[];
};

export type Program = {
  id: number;
  title: string;
  slug: string;
  description: string;
  summary: string;
  icon: string;
  beneficiaries: string;
  bg_color: string;
  text_color: string;
  border_color: string;
  light_bg: string;
  tag: string;
  impact_items: string[];
  is_active: boolean;
  display_order: number;
};

function parseJson<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val) as T; } catch { return fallback; }
  }
  return fallback;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const [rows] = await pool.execute(
    "SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY display_order ASC"
  ) as any[];
  return (rows as any[]).map(r => ({ ...r, bullets: parseJson<string[]>(r.bullets, []) }));
}

export async function getPartners(): Promise<Partner[]> {
  const [rows] = await pool.execute(
    "SELECT * FROM partners WHERE is_active = 1 ORDER BY display_order ASC"
  ) as any[];
  return rows as Partner[];
}

export async function getCoreValues(): Promise<CoreValue[]> {
  const [rows] = await pool.execute(
    "SELECT * FROM core_values ORDER BY display_order ASC"
  ) as any[];
  return rows as CoreValue[];
}

export async function getFaithStatements(): Promise<FaithStatement[]> {
  const [rows] = await pool.execute(
    "SELECT * FROM faith_statements ORDER BY display_order ASC"
  ) as any[];
  return rows as FaithStatement[];
}

export async function getAllStaff(): Promise<StaffMember[]> {
  const [rows] = await pool.execute(
    "SELECT * FROM staff WHERE is_active = 1 ORDER BY display_order ASC"
  ) as any[];
  return (rows as any[]).map(r => ({
    ...r,
    education: parseJson<string[]>(r.education, []),
    expertise: parseJson<string[]>(r.expertise, []),
  }));
}

export async function getStaffBySlug(slug: string): Promise<StaffMember | null> {
  const [rows] = await pool.execute(
    "SELECT * FROM staff WHERE slug = ? AND is_active = 1 LIMIT 1",
    [slug]
  ) as any[];
  if (!(rows as any[]).length) return null;
  const r = (rows as any[])[0];
  return {
    ...r,
    education: parseJson<string[]>(r.education, []),
    expertise: parseJson<string[]>(r.expertise, []),
  };
}

export async function getPrograms(): Promise<Program[]> {
  const [rows] = await pool.execute(
    "SELECT * FROM programs WHERE is_active = 1 ORDER BY display_order ASC"
  ) as any[];
  return (rows as any[]).map(r => ({
    ...r,
    impact_items: parseJson<string[]>(r.impact_items, []),
  }));
}

export type GalleryItem = {
  id: number;
  image_url: string;
  description: string;
  display_order: number;
  is_active: number;
  created_at: string;
};

export async function getGallery(): Promise<GalleryItem[]> {
  const [rows] = await pool.execute(
    "SELECT * FROM gallery WHERE is_active = 1 ORDER BY display_order ASC, id DESC"
  ) as any[];
  return rows as GalleryItem[];
}

export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_at: string; // YYYY-MM-DD
  is_active: number;
};

// DATE columns come back as JS Dates; format in SQL to avoid timezone shifts.
export const NEWS_COLUMNS =
  "id, title, slug, excerpt, content, image_url, DATE_FORMAT(published_at, '%Y-%m-%d') AS published_at, is_active";

export async function getNews(limit?: number): Promise<NewsItem[]> {
  try {
    const limitSql = limit ? ` LIMIT ${Math.max(1, Math.floor(limit))}` : "";
    const [rows] = await pool.execute(
      `SELECT ${NEWS_COLUMNS} FROM news
       WHERE is_active = 1 AND published_at <= CURDATE()
       ORDER BY published_at DESC, id DESC${limitSql}`
    ) as any[];
    return rows as NewsItem[];
  } catch {
    // Table may not exist yet if migrations haven't run — show no news.
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const [rows] = await pool.execute(
      `SELECT ${NEWS_COLUMNS} FROM news
       WHERE slug = ? AND is_active = 1 AND published_at <= CURDATE() LIMIT 1`,
      [slug]
    ) as any[];
    return (rows as NewsItem[])[0] ?? null;
  } catch {
    return null;
  }
}

export type Publication = {
  id: number;
  title: string;
  description: string;
  file_url: string;
  cover_url: string;
  published_at: string; // YYYY-MM-DD
  is_active: number;
};

export const PUBLICATION_COLUMNS =
  "id, title, description, file_url, cover_url, DATE_FORMAT(published_at, '%Y-%m-%d') AS published_at, is_active";

export async function getPublications(): Promise<Publication[]> {
  try {
    const [rows] = await pool.execute(
      `SELECT ${PUBLICATION_COLUMNS} FROM publications
       WHERE is_active = 1 ORDER BY published_at DESC, id DESC`
    ) as any[];
    return rows as Publication[];
  } catch {
    // Table may not exist yet if migrations haven't run — show no publications.
    return [];
  }
}

export type SuccessStory = {
  id: number;
  name: string;
  subtitle: string;
  quote: string;
  story: string;
  image_url: string;
  display_order: number;
  is_active: number;
};

export async function getSuccessStories(limit?: number): Promise<SuccessStory[]> {
  try {
    const limitSql = limit ? ` LIMIT ${Math.max(1, Math.floor(limit))}` : "";
    const [rows] = await pool.execute(
      `SELECT * FROM success_stories WHERE is_active = 1 ORDER BY display_order ASC, id DESC${limitSql}`
    ) as any[];
    return rows as SuccessStory[];
  } catch {
    // Table may not exist yet if migrations haven't run — show no stories.
    return [];
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const [rows] = await pool.execute(
      "SELECT setting_value FROM site_settings WHERE setting_key = ? LIMIT 1",
      [key]
    ) as any[];
    return (rows as any[])[0]?.setting_value || null;
  } catch {
    // Table may not exist yet if migrations haven't run — fall back to defaults.
    return null;
  }
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const [rows] = await pool.execute(
    "SELECT * FROM programs WHERE slug = ? AND is_active = 1 LIMIT 1",
    [slug]
  ) as any[];
  if (!(rows as any[]).length) return null;
  const r = (rows as any[])[0];
  return { ...r, impact_items: parseJson<string[]>(r.impact_items, []) };
}
