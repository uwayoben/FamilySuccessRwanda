export const SPONSOR_CHILD_SETTING_KEY = "sponsor_child_content";

export type SponsorChildCost = { amount: string; period: string; desc: string };
export type SponsorChildPhoto = { url: string; caption: string };

export type SponsorChildContent = {
  hero_tag: string;
  hero_title: string;
  hero_highlight: string;
  hero_subtitle: string;
  hero_image: string;
  intro_text: string; // paragraphs separated by a blank line
  intro_image: string;
  provisions: string[];
  costs: SponsorChildCost[];
  journey_text: string;
  photos: SponsorChildPhoto[];
  actions: string[];
  closing_text: string;
};

export const DEFAULT_SPONSOR_CHILD_CONTENT: SponsorChildContent = {
  hero_tag: "Support a child who lost parental care",
  hero_title: "Sponsor a Child in",
  hero_highlight: "Rwanda Today",
  hero_subtitle: "Every child deserves love, security, and the chance to dream.",
  hero_image: "https://images.unsplash.com/photo-1548102245-c79dbcfa9f92?w=1920&q=80",
  intro_text:
    "Every child deserves love, security, and the chance to dream. Sadly, many children who lost parental care, marginalized, and vulnerable children in Rwanda face unimaginable hardships. For them, basic necessities like food, clothing, and scholastic materials are often out of reach. Without support, these children struggle to survive, let alone thrive.\n\n" +
    "You can change that. By sponsoring a child through Family Success Rwanda, you're not just giving financial assistance — you're giving Godly love, hope, dignity, and a future. Your support can break the cycle of poverty, open doors to education, and empower vulnerable children to reach their God-given potential.",
  intro_image: "https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?w=1200&q=80",
  provisions: [
    "Food",
    "Clothes, shoes, and bedding",
    "Scholastic materials and school uniforms",
  ],
  costs: [
    { amount: "RWF 20,000", period: "per month", desc: "Provides food and basic needs for a child." },
    { amount: "RWF 440,000", period: "per year", desc: "For primary school." },
    { amount: "RWF 1,112,000", period: "per year", desc: "For secondary school or TVET support, including start-up toolkits." },
  ],
  journey_text:
    "When you sponsor a child, you become part of their journey. You'll receive updates about their progress and see firsthand the impact of your generosity. It's a deeply rewarding experience — for you and for the child whose life you transform.",
  photos: [],
  actions: [
    "Sponsor a child now for as little as RWF 20,000 per month for basic needs.",
    "Make a monthly commitment to ensure ongoing care and education.",
    "Share this opportunity with friends and family to multiply the impact.",
  ],
  closing_text:
    "Together, we can break the cycle of poverty and family conflicts affecting a child, and embrace a brighter future for children. Your kindness can be the turning point in a child's life.",
};

const str = (val: unknown, fallback: string) => (typeof val === "string" ? val : fallback);

const strList = (val: unknown, fallback: string[]) =>
  Array.isArray(val) ? val.filter((v): v is string => typeof v === "string") : fallback;

// Saved content is merged over the defaults so fields added later still render.
export function parseSponsorChildContent(raw: string | null | undefined): SponsorChildContent {
  const d = DEFAULT_SPONSOR_CHILD_CONTENT;
  if (!raw) return d;

  let saved: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return d;
    saved = parsed;
  } catch {
    return d;
  }

  return {
    hero_tag: str(saved.hero_tag, d.hero_tag),
    hero_title: str(saved.hero_title, d.hero_title),
    hero_highlight: str(saved.hero_highlight, d.hero_highlight),
    hero_subtitle: str(saved.hero_subtitle, d.hero_subtitle),
    hero_image: str(saved.hero_image, d.hero_image),
    intro_text: str(saved.intro_text, d.intro_text),
    intro_image: str(saved.intro_image, d.intro_image),
    provisions: strList(saved.provisions, d.provisions),
    costs: Array.isArray(saved.costs)
      ? saved.costs
          .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
          .map((c) => ({ amount: str(c.amount, ""), period: str(c.period, ""), desc: str(c.desc, "") }))
      : d.costs,
    journey_text: str(saved.journey_text, d.journey_text),
    photos: Array.isArray(saved.photos)
      ? saved.photos
          .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
          .map((p) => ({ url: str(p.url, ""), caption: str(p.caption, "") }))
      : d.photos,
    actions: strList(saved.actions, d.actions),
    closing_text: str(saved.closing_text, d.closing_text),
  };
}
