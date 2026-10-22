"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight, Mail, MapPin, Heart } from "lucide-react";
import { socialLinks } from "@/components/socialLinks";

const aboutDropdown = [
  { href: "/about", label: "Background", desc: "Mission, vision & values" },
  { href: "/about/staff", label: "Our Staff", desc: "Meet the team" },
];

const newsDropdown = [
  { href: "/news", label: "Latest News", desc: "Updates from our work" },
  { href: "/success-stories", label: "Success Stories", desc: "Lives transformed" },
  { href: "/publications", label: "Publications", desc: "Reports & documents" },
];

const getInvolvedDropdown = [
  { href: "/get-involved/volunteers", label: "Volunteers", desc: "Give your time & skills" },
  { href: "/get-involved/internships", label: "Internships", desc: "Gain experience with us" },
  { href: "/get-involved/donors", label: "Donors", desc: "Support our work" },
];

const navLinks = [
  { href: "/about", label: "About", dropdown: aboutDropdown },
  { href: "/programs", label: "Programs", dropdown: null },
  { href: "/faina-jerusalem", label: "Faina Jerusalem", dropdown: null },
  { href: "/impact", label: "Our Impact", dropdown: null },
  { href: "/sponsor-a-child", label: "Sponsor a Child", dropdown: null },
  { href: "/news", label: "News", dropdown: newsDropdown },
  { href: "/gallery", label: "Gallery", dropdown: null },
  { href: "/contact", label: "Contact", dropdown: null },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const involvedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setInvolvedOpen(false);
    setMobileDropdown(null);
  }, [pathname]);

  // Keep the page behind the open mobile menu from scrolling
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      if (involvedRef.current && !involvedRef.current.contains(e.target as Node)) {
        setInvolvedOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isInvolvedActive = pathname.startsWith("/get-involved");
  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isDropdownActive = (items: { href: string }[]) => items.some((item) => isLinkActive(item.href));

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
      {/* Top Bar — collapses on scroll; phones show only the email and social links */}
      <div className={`bg-emerald-900 text-emerald-100 overflow-hidden transition-all duration-300 ${scrolled ? "max-h-0" : "max-h-9"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4 text-xs whitespace-nowrap">
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="mailto:info@familysuccessrwanda.org" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-orange-400" /> info@familysuccessrwanda.org
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden lg:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" /> Nyaruguru District, Mata Sector, Rwanda
            </span>
            {/* Only accounts with a real link are shown here */}
            <div className="flex items-center gap-4 lg:gap-3 lg:border-l lg:border-emerald-700 lg:pl-5">
              {socialLinks.filter((s) => s.href.startsWith("http")).map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:text-orange-400 transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="py-1.5">
              <Image
                src="/logo.png"
                alt="Family Success Rwanda"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav — shown from xl up; narrower screens use the menu button */}
          <div className="hidden xl:flex items-center gap-1" ref={dropdownRef}>
            {navLinks.map((link) => {
              if (link.dropdown) {
                const open = openDropdown === link.href;
                return (
                  <div key={link.href} className="relative">
                    <button
                      onClick={() => setOpenDropdown(open ? null : link.href)}
                      onMouseEnter={() => setOpenDropdown(link.href)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        isDropdownActive(link.dropdown)
                          ? "bg-emerald-700 text-white"
                          : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown panel */}
                    <div
                      onMouseLeave={() => setOpenDropdown(null)}
                      className={`absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                        open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex flex-col px-4 py-3.5 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0 ${
                            pathname === item.href ? "bg-orange-50" : ""
                          }`}
                        >
                          <span className={`font-semibold text-sm ${pathname === item.href ? "text-orange-600" : "text-gray-800"}`}>
                            {item.label}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">{item.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isLinkActive(link.href)
                      ? "bg-emerald-700 text-white"
                      : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Get Involved + Donate + Mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="relative hidden xl:block" ref={involvedRef}>
              <button
                onClick={() => setInvolvedOpen((o) => !o)}
                onMouseEnter={() => setInvolvedOpen(true)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isInvolvedActive
                    ? "bg-emerald-700 border-emerald-700 text-white"
                    : "border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                Get Involved
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${involvedOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown panel */}
              <div
                onMouseLeave={() => setInvolvedOpen(false)}
                className={`absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                  involvedOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {getInvolvedDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col px-4 py-3.5 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0 ${
                      pathname === item.href ? "bg-orange-50" : ""
                    }`}
                  >
                    <span className={`font-semibold text-sm ${pathname === item.href ? "text-orange-600" : "text-gray-800"}`}>
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">{item.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/donate"
              className="hidden sm:flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Donate
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`xl:hidden transition-all duration-300 ${menuOpen ? "max-h-[calc(100svh-6.5rem)] overflow-y-auto opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}>
        <div className="bg-white border-t border-gray-100 px-4 pt-3 pb-6">
          <div className="divide-y divide-gray-100">
            {navLinks.map((link) => {
              if (link.dropdown) {
                const open = mobileDropdown === link.href;
                const active = isDropdownActive(link.dropdown);
                return (
                  <div key={link.href} className="py-1">
                    <button
                      onClick={() => setMobileDropdown(open ? null : link.href)}
                      aria-expanded={open}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-base font-semibold transition-colors ${
                        active ? "text-emerald-700" : "text-gray-800"
                      } ${open ? "bg-emerald-50" : "active:bg-gray-50"}`}
                    >
                      {link.label}
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && (
                      <div className="mt-1 mb-2 ml-3 space-y-1 border-l-2 border-orange-200 pl-3">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-3 py-2.5 rounded-lg transition-colors ${
                              pathname === item.href ? "bg-orange-50" : "active:bg-orange-50"
                            }`}
                          >
                            <span className={`block text-sm font-semibold ${pathname === item.href ? "text-orange-600" : "text-gray-700"}`}>{item.label}</span>
                            <span className="block text-xs text-gray-400 mt-0.5">{item.desc}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const active = isLinkActive(link.href);
              return (
                <div key={link.href} className="py-1">
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-base font-semibold transition-colors ${
                      active ? "bg-emerald-50 text-emerald-700" : "text-gray-800 active:bg-gray-50"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className={`w-4 h-4 ${active ? "text-emerald-500" : "text-gray-300"}`} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Get Involved */}
          <div className="mt-4 bg-emerald-50 rounded-2xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3">Get Involved</p>
            <div className="grid grid-cols-2 gap-3">
              {getInvolvedDropdown.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl border px-3 py-3 transition-colors ${
                    pathname === item.href
                      ? "bg-emerald-700 border-emerald-700"
                      : "bg-white border-emerald-100 active:bg-emerald-100"
                  }`}
                >
                  <span className={`block text-sm font-bold ${pathname === item.href ? "text-white" : "text-gray-800"}`}>{item.label}</span>
                  <span className={`block text-xs mt-0.5 ${pathname === item.href ? "text-emerald-100" : "text-gray-500"}`}>{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/donate"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-4 py-3.5 rounded-full text-base font-bold mt-4 shadow-md transition-colors"
          >
            <Heart className="w-5 h-5" /> Donate Now
          </Link>

          {/* Address, which the top bar leaves out on phones */}
          <div className="mt-5 space-y-2 text-xs text-gray-500">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" /> Nyaruguru District, Mata Sector, Rwanda
            </p>
          </div>
        </div>
      </div>

      {/* Dimmed backdrop below the open menu — tap to close */}
      {menuOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="xl:hidden absolute top-full left-0 right-0 h-screen bg-black/40"
        />
      )}
    </nav>
  );
}
