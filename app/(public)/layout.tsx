import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";

// Render public pages on every request so admin changes show up without a rebuild.
export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <VisitTracker />
    </>
  );
}
