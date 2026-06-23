"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const aboutDropdown = [
  { href: "/about", label: "Background", desc: "Mission, vision & values" },
  { href: "/about/staff", label: "Our Staff", desc: "Meet the team" },
];

const navLinks = [
  { href: "/", label: "Home", dropdown: null },
  { href: "/about", label: "About", dropdown: aboutDropdown },
  { href: "/programs", label: "Programs", dropdown: null },
  { href: "/faina-jerusalem", label: "Faina Jerusalem", dropdown: null },
  { href: "/impact", label: "Our Impact", dropdown: null },
  { href: "/gallery", label: "Gallery", dropdown: null },
  { href: "/contact", label: "Contact", dropdown: null },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAboutOpen(false);
    setMobileAboutOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAboutActive = pathname === "/about" || pathname.startsWith("/about/");

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className={`transition-all duration-300 rounded-xl px-3 py-1.5 ${scrolled ? "" : "bg-white/90 backdrop-blur-sm shadow-md"}`}>
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.dropdown) {
                return (
                  <div key={link.href} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setAboutOpen((o) => !o)}
                      onMouseEnter={() => setAboutOpen(true)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isAboutActive
                          ? "bg-emerald-700 text-white"
                          : scrolled
                          ? "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown panel */}
                    <div
                      onMouseLeave={() => setAboutOpen(false)}
                      className={`absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                        aboutOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-emerald-700 text-white"
                      : scrolled
                      ? "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Donate + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/donate"
              className="hidden sm:flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Donate
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white border-t border-gray-100 shadow-xl px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            if (link.dropdown) {
              return (
                <div key={link.href}>
                  <button
                    onClick={() => setMobileAboutOpen((o) => !o)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isAboutActive ? "bg-emerald-700 text-white" : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAboutOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-orange-200 pl-3">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            pathname === item.href
                              ? "bg-orange-50 text-orange-600 font-semibold"
                              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          <span className="font-medium">{item.label}</span>
                          <span className="block text-xs text-gray-400 mt-0.5">{item.desc}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-emerald-700 text-white"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/donate"
            className="flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-4 py-3 rounded-lg text-sm font-semibold mt-3 transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
