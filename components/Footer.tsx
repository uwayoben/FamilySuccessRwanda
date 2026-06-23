import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Heart, Mail } from "lucide-react";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-white">
      {/* Newsletter Strip */}
      <div className="bg-emerald-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Stay Connected</h3>
            <p className="text-emerald-200 text-sm mt-1">Get updates on our programs and community impact.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5 inline-block bg-white rounded-xl px-3 py-2">
              <Image
                src="/logo.png"
                alt="Family Success Rwanda"
                width={180}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-emerald-300 text-sm leading-relaxed mb-4">
              A Christian humanitarian NGO transforming lives through education, healthcare, and community empowerment in Rwanda.
            </p>
            <p className="text-orange-400 font-semibold italic">&quot;Transforming Lives Together&quot;</p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: FacebookIcon, href: "#", label: "Facebook" },
                { icon: TwitterIcon, href: "#", label: "Twitter" },
                { icon: InstagramIcon, href: "#", label: "Instagram" },
                { icon: YoutubeIcon, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-emerald-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-base mb-5 border-b border-emerald-700 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About FSR" },
                { href: "/programs", label: "Our Programs" },
                { href: "/faina-jerusalem", label: "Faina Jerusalem Village" },
                { href: "/impact", label: "Our Impact" },
                { href: "/donate", label: "Donate" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-emerald-300 hover:text-orange-400 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-white text-base mb-5 border-b border-emerald-700 pb-2">Our Programs</h4>
            <ul className="space-y-3">
              {[
                "Education Support",
                "Women Empowerment",
                "Youth Capacity Building",
                "Children Empowerment",
                "Healthcare Outreach",
                "Family Strengthening",
              ].map((program) => (
                <li key={program}>
                  <Link
                    href="/programs"
                    className="text-emerald-300 hover:text-orange-400 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white text-base mb-5 border-b border-emerald-700 pb-2">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Location</p>
                  <p className="text-emerald-300 text-sm">Nyaruguru District, Mata Sector, Rwanda</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Phone</p>
                  <a href="tel:+250788316227" className="text-emerald-300 hover:text-orange-400 text-sm transition-colors">
                    +250 788 316 227
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Email</p>
                  <a href="mailto:info@familysuccessrwanda.org" className="text-emerald-300 hover:text-orange-400 text-sm transition-colors">
                    info@familysuccessrwanda.org
                  </a>
                </div>
              </li>
            </ul>
            <div className="mt-6 bg-emerald-900 rounded-lg p-4">
              <p className="text-emerald-200 text-xs">
                Registered with Rwanda Governance Board<br />
                <span className="text-orange-400 font-medium">No. 840/RGB/NGO/LP/07/2022</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-emerald-400 text-sm text-center">
            © {new Date().getFullYear()} Family Success Rwanda. All rights reserved.
          </p>
          <Link href="/admin" className="text-emerald-700 hover:text-emerald-500 text-xs transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  return (
    <form
      action="/api/newsletter"
      method="POST"
      className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="Enter your email address"
        className="flex-1 min-w-0 sm:w-72 px-4 py-3 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
      />
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
