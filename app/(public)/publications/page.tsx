import { FileText, Calendar, Eye, Download } from "lucide-react";
import { getPublications } from "@/lib/queries";
import { formatNewsDate } from "@/lib/news";

export const metadata = {
  title: "Publications | Family Success Rwanda",
  description: "Reports, plans, and other documents published by Family Success Rwanda.",
};

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 pt-32 pb-16 px-4 text-center">
        <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Resources</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4">
          Publications
        </h1>
        <p className="text-emerald-200 max-w-xl mx-auto text-lg">
          Reports, plans, and other documents you can read online or download.
        </p>
      </section>

      {/* Publications grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {publications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-4">
            <FileText className="w-12 h-12 opacity-40" />
            <p className="text-sm">No publications are available yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub) => (
              <div key={pub.id} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover">
                <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="block aspect-[16/10] bg-emerald-50 overflow-hidden">
                  {pub.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pub.cover_url} alt={pub.title} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <FileText className="w-14 h-14 text-emerald-300" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">PDF</span>
                    </div>
                  )}
                </a>
                <div className="flex flex-col flex-1 p-6">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 mb-3">
                    <Calendar className="w-3.5 h-3.5" /> {formatNewsDate(pub.published_at)}
                  </p>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{pub.title}</h2>
                  {pub.description?.trim() && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{pub.description}</p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-3 pt-2">
                    <a
                      href={pub.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View
                    </a>
                    <a
                      href={pub.file_url}
                      download
                      className="inline-flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
