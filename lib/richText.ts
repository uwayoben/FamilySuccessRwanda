// Helpers for the formatted text written with the admin RichTextEditor.
// Plain string functions, so they work on both the server and in the browser.

const ALLOWED_TAGS = new Set(["p", "br", "strong", "b", "em", "i", "u", "h3", "h4", "ul", "ol", "li", "a", "blockquote"]);
const RENAMED_TAGS: Record<string, string> = { b: "strong", i: "em", div: "p", h1: "h3", h2: "h3" };

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function safeHref(attrs: string): string | null {
  const match = attrs.match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
  const href = (match?.[2] ?? match?.[3] ?? match?.[4] ?? "").replace(/&amp;/g, "&").trim();
  return /^(https?:|mailto:|tel:|\/)/i.test(href) ? href : null;
}

// Keeps only simple formatting tags, with no attributes except a safe link address.
// Everything else (scripts, styles, event handlers, unknown tags) is dropped.
export function sanitizeHtml(html: string): string {
  return html
    .split(/(<[^>]*>)/g)
    .map((part) => {
      if (!part.startsWith("<")) return part.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const tag = part.match(/^<(\/?)([a-z0-9]+)\b([^>]*)>$/i);
      if (!tag) return "";
      const [, closing, rawName, attrs] = tag;
      const name = RENAMED_TAGS[rawName.toLowerCase()] ?? rawName.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return "";
      if (closing) return name === "br" ? "" : `</${name}>`;
      if (name === "a") {
        const href = safeHref(attrs);
        return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">` : "<a>";
      }
      return `<${name}>`;
    })
    .join("")
    .replace(/<p>(\s|<br>|&nbsp;)*<\/p>/g, "")
    .trim();
}

const looksLikeHtml = (s: string) => /<\/?(p|br|strong|b|em|i|u|h[1-6]|ul|ol|li|a|div|blockquote)\b/i.test(s);

// Text written before the editor existed is plain text: turn its blank-line paragraphs into HTML.
export function toRichHtml(text: string): string {
  if (!text.trim()) return "";
  if (looksLikeHtml(text)) return sanitizeHtml(text);
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

// Plain-text version, e.g. for short previews on cards and page descriptions.
export function htmlToText(html: string): string {
  return html
    .replace(/<(br|\/p|\/li|\/h[1-6]|\/blockquote)[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
