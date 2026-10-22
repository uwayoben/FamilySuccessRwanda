import { CheckCircle } from "lucide-react";
import type { SponsorChildProfile } from "@/lib/sponsorChild";

export default function ChildPhoto({ child, className }: { child: SponsorChildProfile; className: string }) {
  return child.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={child.photo} alt={child.name} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-gradient-to-br from-emerald-100 to-orange-100 ${className}`}>
      <span className="text-6xl font-extrabold text-emerald-700/40">{child.name.charAt(0)}</span>
    </div>
  );
}

export function ChildStatusBadge({ sponsored }: { sponsored: boolean }) {
  return sponsored ? (
    <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
      <CheckCircle className="w-3.5 h-3.5" /> Sponsored
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 bg-white/95 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full shadow">
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-orange-400 opacity-75 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-orange-500" />
      </span>
      Waiting for a sponsor
    </span>
  );
}
