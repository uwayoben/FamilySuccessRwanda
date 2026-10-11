import Link from "next/link";
import { Quote, Heart, ArrowRight } from "lucide-react";
import { getSuccessStories } from "@/lib/queries";

export const metadata = {
  title: "Success Stories | Family Success Rwanda",
  description: "Stories of children, youth, women, and families whose lives have been transformed through Family Success Rwanda.",
};

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 pt-32 pb-16 px-4 text-center">
        <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Lives Transformed</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4">
          Success Stories
        </h1>
        <p className="text-emerald-200 max-w-xl mx-auto text-lg">
          Meet the children, youth, women, and families whose lives are changing.
        </p>
      </section>

      {/* Stories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-4">
            <Quote className="w-12 h-12 opacity-40" />
            <p className="text-sm">No stories have been published yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {stories.map((story, i) => {
              const paragraphs = (story.story ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
              return (
                <article
                  key={story.id}
                  id={`story-${story.id}`}
                  className="scroll-mt-32 grid md:grid-cols-5 gap-8 items-start bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-8"
                >
                  {story.image_url && (
                    <div className={`md:col-span-2 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={story.image_url} alt={story.name} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                  <div className={story.image_url ? "md:col-span-3" : "md:col-span-5"}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{story.name}</h2>
                    {story.subtitle?.trim() && (
                      <p className="text-emerald-700 font-semibold mt-1">{story.subtitle}</p>
                    )}
                    {story.quote?.trim() && (
                      <blockquote className="relative bg-white border-l-4 border-orange-400 rounded-r-2xl pl-6 pr-5 py-5 my-6">
                        <Quote className="w-6 h-6 text-orange-300 mb-2" />
                        <p className="text-lg text-gray-800 italic leading-relaxed">{story.quote}</p>
                      </blockquote>
                    )}
                    {paragraphs.map((paragraph, j) => (
                      <p key={j} className="text-gray-600 leading-relaxed mb-4 last:mb-0 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-emerald-800 to-emerald-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-14 h-14 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Help Write the Next Story</h2>
          <p className="text-emerald-200 text-lg mb-10 max-w-2xl mx-auto">
            Your support makes stories like these possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              <Heart className="w-5 h-5" /> Donate Now
            </Link>
            <Link
              href="/sponsor-a-child"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Sponsor a Child <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
