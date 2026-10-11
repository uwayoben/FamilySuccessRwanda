import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { getNewsBySlug } from "@/lib/queries";
import { formatNewsDate, newsExcerpt } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "News | Family Success Rwanda" };
  return {
    title: `${item.title} | Family Success Rwanda`,
    description: newsExcerpt(item),
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const paragraphs = (item.content ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/news" className="inline-flex items-center gap-1.5 text-emerald-200 hover:text-white text-sm font-medium transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All news
          </Link>
          <p className="flex items-center gap-1.5 text-orange-400 font-semibold text-sm mb-3">
            <Calendar className="w-4 h-4" /> {formatNewsDate(item.published_at)}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {item.title}
          </h1>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {item.image_url && (
          <div className="rounded-3xl overflow-hidden shadow-xl mb-10 -mt-20 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.title} className="w-full h-auto" />
          </div>
        )}

        {item.excerpt?.trim() && (
          <p className="text-lg text-gray-800 font-medium leading-relaxed mb-6">{item.excerpt}</p>
        )}

        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-gray-600 leading-relaxed mb-5 whitespace-pre-line">
            {paragraph}
          </p>
        ))}

        <div className="border-t border-gray-100 mt-10 pt-8">
          <Link href="/news" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to all news
          </Link>
        </div>
      </article>
    </main>
  );
}
