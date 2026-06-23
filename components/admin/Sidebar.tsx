"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  MessageSquare,
  Users,
  Globe,
  LogOut,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  ImageIcon,
  UserCheck,
  Handshake,
  GalleryHorizontal,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard",   label: "Dashboard",    icon: LayoutDashboard, group: "Overview" },
  { href: "/admin/donations",   label: "Donations",    icon: DollarSign,      group: "Activity" },
  { href: "/admin/messages",    label: "Messages",     icon: MessageSquare,   group: "Activity" },
  { href: "/admin/subscribers", label: "Subscribers",  icon: Users,           group: "Activity" },
  { href: "/admin/programs",    label: "Programs",     icon: GraduationCap,   group: "Content" },
  { href: "/admin/slides",      label: "Hero Slides",  icon: ImageIcon,       group: "Content" },
  { href: "/admin/staff",       label: "Staff",        icon: UserCheck,       group: "Content" },
  { href: "/admin/partners",    label: "Partners",     icon: Handshake,       group: "Content" },
  { href: "/admin/gallery",     label: "Gallery",      icon: GalleryHorizontal, group: "Content" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700/50">
        <div className="bg-white rounded-xl px-3 py-2 inline-block mb-3">
          <Image src="/logo.png" alt="FSR" width={120} height={38} className="h-8 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {["Overview", "Activity", "Content"].map(group => {
          const items = navItems.filter(n => n.group === group);
          return (
            <div key={group} className="mb-5">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest px-3 mb-2">{group}</p>
              <div className="space-y-1">
                {items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                        active
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                          : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-300 rounded-r-full" />
                      )}
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {active && <ChevronRight className="w-4 h-4 opacity-70" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-700/50">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest px-3 mb-3">External</p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
          >
            <Globe className="w-5 h-5" />
            View Website
          </Link>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="px-4 pb-6 pt-4 border-t border-slate-700/50 space-y-2">
        <div className="bg-slate-700/40 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-extrabold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate">Administrator</p>
            <p className="text-slate-400 text-xs truncate">FSR Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-30" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-slate-800 z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-slate-800 z-40">
        <SidebarContent />
      </aside>
    </>
  );
}
