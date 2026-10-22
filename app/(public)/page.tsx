import Link from "next/link";
import Image from "next/image";
import {
  Heart, ArrowRight, Wrench, GraduationCap, Star, Quote,
  Globe, Users, TrendingUp, Baby, Activity, Home,
  Sparkles, HeartHandshake, Scale, Handshake, Leaf, Target, Eye,
  type LucideIcon,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import PartnersSlider from "@/components/PartnersSlider";
import NewsCard from "@/components/NewsCard";
import CountUp from "@/components/CountUp";
import SponsorChildren from "@/components/SponsorChildren";
import { getHeroSlides, getPartners, getCoreValues, getPrograms, getSetting, getNews, getSuccessStories } from "@/lib/queries";
import { SPONSOR_CHILD_SETTING_KEY, parseSponsorChildContent, getChildrenSectionProps } from "@/lib/sponsorChild";

const ICON_MAP: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap, users: Users, "trending-up": TrendingUp,
  baby: Baby, activity: Activity, home: Home, globe: Globe,
  sparkles: Sparkles, heart: Heart, "heart-handshake": HeartHandshake,
  scale: Scale, handshake: Handshake, leaf: Leaf, star: Star,
};

// Stock fallback shown until an image is uploaded in Admin → Home Page.
const DEFAULT_WHO_WE_ARE_IMAGE = "https://images.unsplash.com/photo-1598605170898-853b9ae903fc?w=1200&q=80";
const DEFAULT_FAINA_IMAGE = "https://images.unsplash.com/photo-1548102245-c79dbcfa9f92?w=1200&q=80";

// Same figures as the Our Impact page.
const IMPACT_NUMBERS = [
  { end: 320, suffix: "+", label: "Students Sponsored", sub: "In 2024 at Faina Jerusalem", icon: GraduationCap },
  { end: 6, suffix: "", label: "Active Programs", sub: "Covering every life stage", icon: Star },
  { end: 5, suffix: "", label: "TVET Courses", sub: "Vocational training", icon: Wrench },
  { end: 2, suffix: "", label: "Districts Reached", sub: "Nyaruguru & Nyamagabe", icon: Globe },
];

export default async function HomePage() {
  const [slides, partners, coreValues, programs, whoWeAreImage, fainaImage, news, stories, sponsorChildRaw] = await Promise.all([
    getHeroSlides(),
    getPartners(),
    getCoreValues(),
    getPrograms(),
    getSetting("who_we_are_image"),
    getSetting("faina_home_image"),
    getNews(3),
    getSuccessStories(3),
    getSetting(SPONSOR_CHILD_SETTING_KEY),
  ]);
  const childrenSection = getChildrenSectionProps(parseSponsorChildContent(sponsorChildRaw));

  return (
    <>
      <HeroSlider slides={slides} />

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-orange-100 rounded-3xl" />
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-emerald-100 rounded-3xl" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={whoWeAreImage ?? DEFAULT_WHO_WE_ARE_IMAGE}
                  alt="Family Success Rwanda serving families in Nyaruguru District"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-6 leading-tight">
                Serving Rwanda with <span className="text-emerald-700">Heart & Purpose</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-5">
                Family Success Rwanda (FSR) is a Christian, humanitarian, locally-led NGO registered in 2022 with the Rwanda Governance Board. We operate in Nyaruguru District, Mata Sector, serving the most vulnerable families and children.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Our mission is to serve and empower the most vulnerable community through the Word of God and in deed, while in partnership with families and churches, so that Rwandans feel loved and supported with increased dignity, hope, and spiritual wellbeing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about" className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                  Learn Our Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact in Numbers */}
      <section className="section-padding bg-gradient-to-br from-emerald-800 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full" style={{filter:"blur(80px)"}} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">By The Numbers</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
              Our Impact in <span className="text-orange-400">Numbers</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {IMPACT_NUMBERS.map((stat) => (
              <div key={stat.label} className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="text-white font-semibold mt-2">{stat.label}</p>
                <p className="text-emerald-200 text-xs mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/impact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              See Our Impact <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Purpose</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Mission & <span className="text-emerald-700">Vision</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-base italic">
                  &quot;To serve and empower the most vulnerable community through the Word of God and in deed, while in partnership with families and churches, so that Rwandans feel loved and supported and have increased dignity, hope, and spiritual wellbeing.&quot;
                </p>
              </div>
            </div>

            <div className="bg-emerald-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-4">Our Vision</h3>
                <p className="text-emerald-100 leading-relaxed text-base italic">
                  &quot;To see Rwandan families live in love and peace, families honouring God and fulfilling their basic needs, and able to access holistic transformation.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Our <span className="text-emerald-700">Programs</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Six transformative programs designed to uplift every generation — from children to elders — with dignity and compassion.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(p => {
              const Icon = ICON_MAP[p.icon] ?? GraduationCap;
              return (
                <div key={p.slug} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 card-hover group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${p.light_bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${p.text_color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.summary || p.description}</p>
                  <Link href="/programs" className="inline-flex items-center gap-1 text-emerald-700 font-medium text-sm mt-4 hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/programs" className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-md">
              View All Programs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Choose a Child — managed in Admin → Sponsor a Child */}
      {childrenSection.items.length > 0 && <SponsorChildren items={childrenSection.items} limit={4} />}

      {/* Faina Jerusalem Feature */}
      <section className="section-padding bg-gradient-to-br from-emerald-900 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-80 h-80 bg-orange-400 rounded-full" style={{ filter: "blur(60px)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">Key Project</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-6 leading-tight">
                Faina Jerusalem <br /><span className="text-orange-400">Village</span>
              </h2>
              <p className="text-emerald-200 text-base leading-relaxed mb-5">
                Founded in 2023 by FSR, the Faina Jerusalem Village was originally established to rehabilitate delinquent street children and orphans. Today it runs under the Government of Rwanda training curriculum with general admissions.
              </p>
              <p className="text-emerald-200 text-base leading-relaxed mb-8">
                In 2024, <span className="text-orange-400 font-bold">320 students</span> were enrolled — all fully sponsored for course and feeding fees. The village offers quality primary education and one-year TVET short courses.
              </p>
              <Link href="/faina-jerusalem" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg">
                Explore the Village <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-orange-500/20 rounded-3xl" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fainaImage ?? DEFAULT_FAINA_IMAGE}
                  alt="Students at Faina Jerusalem Village"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Our Core <span className="text-emerald-700">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {coreValues.map(v => {
              const Icon = ICON_MAP[v.icon_name] ?? Sparkles;
              return (
                <div key={v.label} className={`rounded-2xl border-2 p-5 text-center font-semibold text-base ${v.color_classes} card-hover`}>
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${v.icon_color}`} />
                  {v.label}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories — hidden until a story is added in Admin → Success Stories */}
      {stories.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Lives Transformed</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
                Success <span className="text-emerald-700">Stories</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Link
                  key={story.id}
                  href={`/success-stories#story-${story.id}`}
                  className="group flex flex-col bg-emerald-50 rounded-2xl overflow-hidden border border-emerald-100 card-hover"
                >
                  {story.image_url && (
                    <div className="aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={story.image_url} alt={story.name} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-6">
                    <Quote className="w-8 h-8 text-orange-400 mb-3" />
                    <p className="text-gray-700 leading-relaxed italic line-clamp-4 mb-5">
                      {story.quote?.trim() || story.story}
                    </p>
                    <div className="mt-auto">
                      <p className="font-bold text-gray-900">{story.name}</p>
                      {story.subtitle?.trim() && <p className="text-sm text-emerald-700">{story.subtitle}</p>}
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 mt-3">
                        Read the story <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/success-stories"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-3 rounded-full transition-colors"
              >
                All Success Stories <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News — hidden until an article is published in Admin → News */}
      {news.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">News & Updates</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
                Latest <span className="text-emerald-700">News</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/news"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-3 rounded-full transition-colors"
              >
                View All News <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <PartnersSlider partners={partners} />

      {/* Donate CTA */}
      <section className="section-padding bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-14 h-14 text-white/30 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Your Gift Changes Lives</h2>
          <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">
            Every contribution — large or small — helps a child stay in school, a family access healthcare, or a young person learn a life-changing skill.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:bg-orange-50 transition-colors shadow-lg text-base">
              <Heart className="w-5 h-5" /> Donate Today
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-orange-700 hover:bg-orange-800 text-white font-semibold px-8 py-4 rounded-full transition-colors text-base">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
