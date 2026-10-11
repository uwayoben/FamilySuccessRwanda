import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Heart, Mail } from "lucide-react";
import { socialLinks } from "@/components/socialLinks";

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
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
                { href: "/success-stories", label: "Success Stories" },
                { href: "/news", label: "News" },
                { href: "/publications", label: "Publications" },
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
