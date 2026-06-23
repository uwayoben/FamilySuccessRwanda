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

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const [rows] = await pool.execute(
    "SELECT * FROM programs WHERE slug = ? AND is_active = 1 LIMIT 1",
    [slug]
  ) as any[];
  if (!(rows as any[]).length) return null;
  const r = (rows as any[])[0];
  return { ...r, impact_items: parseJson<string[]>(r.impact_items, []) };
}
