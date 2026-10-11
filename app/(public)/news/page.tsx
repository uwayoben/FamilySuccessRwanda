import { Newspaper } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/queries";

export const metadata = {
  title: "News | Family Success Rwanda",
  description: "The latest news, stories, and updates from Family Success Rwanda.",
};

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 pt-32 pb-16 px-4 text-center">
        <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">News & Updates</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4">
          Latest News
        </h1>
        <p className="text-emerald-200 max-w-xl mx-auto text-lg">
          Stories and updates from our programs and the communities we serve.
        </p>
      </section>

      {/* News grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-4">
            <Newspaper className="w-12 h-12 opacity-40" />
            <p className="text-sm">No news has been published yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
