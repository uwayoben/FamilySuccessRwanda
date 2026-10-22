"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Records one visit per page shown, for the Visitors page in the admin.
export default function VisitTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Guards against React running the effect twice for the same page in development.
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
