import Link from "next/link";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import type { NewsItem } from "@/lib/queries";
import { formatNewsDate, newsExcerpt } from "@/lib/news";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover"
    >
      <div className="aspect-[16/10] bg-emerald-50 overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-emerald-200" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 mb-3">
          <Calendar className="w-3.5 h-3.5" /> {formatNewsDate(item.published_at)}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-emerald-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{newsExcerpt(item)}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
          Read more <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
