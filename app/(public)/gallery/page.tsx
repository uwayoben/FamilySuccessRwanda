import { getGallery } from "@/lib/queries";
import GalleryGrid from "./GalleryGrid";

export const metadata = {
  title: "Gallery | Family Success Rwanda",
  description: "Photos from our programs, events, and community activities across Rwanda.",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 pt-32 pb-16 px-4 text-center">
        <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Our Gallery</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4">
          Moments That Matter
        </h1>
        <p className="text-emerald-200 max-w-xl mx-auto text-lg">
          A glimpse into the lives we touch, the communities we serve, and the change we create together.
        </p>
      </section>

      {/* Gallery grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <GalleryGrid items={items} />
      </section>
    </main>
  );
}
