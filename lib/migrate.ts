import mysql from "mysql2/promise";

type Migration =
  | { name: string; sql: string }
  | { name: string; fn: (conn: mysql.Connection) => Promise<void> };

// ─── Table Migrations ────────────────────────────────────────────────────────

const TABLE_MIGRATIONS: Migration[] = [
  {
    name: "create_donations",
    sql: `CREATE TABLE IF NOT EXISTS donations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(30),
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      donation_type ENUM('general','education','healthcare','faina_jerusalem','women_empowerment','children','youth') DEFAULT 'general',
      message TEXT,
      status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_contact_messages",
    sql: `CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(30),
      subject VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      status ENUM('unread','read','replied') DEFAULT 'unread',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_newsletter_subscribers",
    sql: `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(150) NOT NULL UNIQUE,
      name VARCHAR(100),
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active TINYINT(1) DEFAULT 1
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_programs",
    sql: `CREATE TABLE IF NOT EXISTS programs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      slug VARCHAR(200) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      summary TEXT,
      beneficiaries VARCHAR(100),
      icon VARCHAR(50),
      bg_color VARCHAR(50) DEFAULT 'bg-blue-600',
      text_color VARCHAR(50) DEFAULT 'text-blue-600',
      border_color VARCHAR(50) DEFAULT 'border-blue-200',
      light_bg VARCHAR(50) DEFAULT 'bg-blue-50',
      tag VARCHAR(100),
      impact_items JSON,
      is_active TINYINT(1) DEFAULT 1,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_hero_slides",
    sql: `CREATE TABLE IF NOT EXISTS hero_slides (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tag VARCHAR(200) NOT NULL,
      title VARCHAR(200) NOT NULL,
      highlight VARCHAR(200) NOT NULL,
      subtitle TEXT NOT NULL,
      cta1_label VARCHAR(100) NOT NULL,
      cta1_href VARCHAR(200) NOT NULL,
      cta2_label VARCHAR(100) NOT NULL,
      cta2_href VARCHAR(200) NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      overlay VARCHAR(200) DEFAULT 'from-orange-950/80 via-orange-900/70 to-black/60',
      stat_value VARCHAR(50),
      stat_label VARCHAR(100),
      bullets JSON,
      icon_name VARCHAR(50) DEFAULT 'globe',
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_partners",
    sql: `CREATE TABLE IF NOT EXISTS partners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      abbr VARCHAR(20) NOT NULL UNIQUE,
      name VARCHAR(200) NOT NULL,
      bg_gradient VARCHAR(100) DEFAULT 'from-gray-800 to-gray-600',
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_core_values",
    sql: `CREATE TABLE IF NOT EXISTS core_values (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      icon_name VARCHAR(50) NOT NULL,
      color_classes VARCHAR(200) NOT NULL,
      icon_color VARCHAR(100) NOT NULL,
      display_order INT DEFAULT 0
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_staff",
    sql: `CREATE TABLE IF NOT EXISTS staff (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(200) NOT NULL UNIQUE,
      name VARCHAR(200) NOT NULL,
      role VARCHAR(200) NOT NULL,
      department VARCHAR(100) NOT NULL,
      photo VARCHAR(500),
      short_bio TEXT,
      full_bio TEXT,
      email VARCHAR(150),
      phone VARCHAR(30),
      joined_year VARCHAR(10),
      education JSON,
      expertise JSON,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_site_settings",
    sql: `CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_gallery",
    sql: `CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_url VARCHAR(500) NOT NULL,
      description TEXT,
      display_order INT DEFAULT 99,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_news",
    sql: `CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      slug VARCHAR(250) NOT NULL UNIQUE,
      excerpt TEXT,
      content MEDIUMTEXT,
      image_url VARCHAR(500),
      published_at DATE NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_publications",
    sql: `CREATE TABLE IF NOT EXISTS publications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      description TEXT,
      file_url VARCHAR(500) NOT NULL,
      cover_url VARCHAR(500),
      published_at DATE NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_success_stories",
    sql: `CREATE TABLE IF NOT EXISTS success_stories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      subtitle VARCHAR(250),
      quote TEXT,
      story MEDIUMTEXT,
      image_url VARCHAR(500),
      display_order INT DEFAULT 99,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    name: "create_faith_statements",
    sql: `CREATE TABLE IF NOT EXISTS faith_statements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text TEXT NOT NULL,
      icon_name VARCHAR(50) NOT NULL,
      icon_color VARCHAR(100) NOT NULL,
      display_order INT DEFAULT 0
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
  {
    // Safely add new columns to programs for existing installs
    name: "alter_programs_add_detail_cols",
    fn: async (conn) => {
      const newCols: [string, string][] = [
        ["summary",       "TEXT AFTER description"],
        ["beneficiaries", "VARCHAR(100) AFTER summary"],
        ["bg_color",      "VARCHAR(50) DEFAULT 'bg-blue-600' AFTER beneficiaries"],
        ["text_color",    "VARCHAR(50) DEFAULT 'text-blue-600' AFTER bg_color"],
        ["border_color",  "VARCHAR(50) DEFAULT 'border-blue-200' AFTER text_color"],
        ["light_bg",      "VARCHAR(50) DEFAULT 'bg-blue-50' AFTER border_color"],
        ["tag",           "VARCHAR(100) AFTER light_bg"],
        ["impact_items",  "JSON AFTER tag"],
      ];
      for (const [col, def] of newCols) {
        const [[row]]: any = await conn.query(
          `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'programs' AND COLUMN_NAME = ?`,
          [col]
        );
        if (row.cnt === 0) {
          await conn.query(`ALTER TABLE programs ADD COLUMN ${col} ${def}`);
        }
      }
    },
  },
  {
    // One row per public page view. No IP addresses are stored — only the country.
    name: "create_site_visits",
    sql: `CREATE TABLE IF NOT EXISTS site_visits (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id CHAR(36) NOT NULL,
      path VARCHAR(255) NOT NULL,
      country CHAR(2),
      referrer VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_site_visits_created (created_at),
      INDEX idx_site_visits_visitor (visitor_id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  },
];

// ─── Seed Migrations ─────────────────────────────────────────────────────────

const SEED_MIGRATIONS: Migration[] = [
  {
    name: "seed_programs",
    fn: async (conn) => {
      const programs = [
        {
          title: "Education Support", slug: "education-support",
          description: "FSR targets children and youth from the most vulnerable families, providing access to primary skills, technical skills, human rights education, sexual and reproductive health rights, and life skills training. We also build and equip schools to ensure that quality education is accessible to all.",
          summary: "Empowering children and youth with quality education and life skills.",
          beneficiaries: "Children & Youth",
          icon: "graduation-cap",
          bg_color: "bg-blue-600", text_color: "text-blue-600", border_color: "border-blue-200", light_bg: "bg-blue-50",
          tag: "Education Support",
          impact_items: ["Primary and technical skills training","Human rights & SRHR education","Life skills development","School construction & equipment","School fees support for vulnerable students"],
          display_order: 1,
        },
        {
          title: "Women & Community Empowerment", slug: "women-empowerment",
          description: "We train women in mindset change, entrepreneurship, income generation, vision building, conflict management, nutrition, and hygiene. Our primary approach is through Village Savings and Loans Associations (VSLAs), which build sustainable economic independence at the grassroots level.",
          summary: "Building economic independence and community resilience for women.",
          beneficiaries: "Women & Families",
          icon: "users",
          bg_color: "bg-pink-600", text_color: "text-pink-600", border_color: "border-pink-200", light_bg: "bg-pink-50",
          tag: "Women & Community",
          impact_items: ["Mindset change & vision building","Entrepreneurship training","Income generation skills","Village Savings & Loans Associations (VSLAs)","Nutrition & hygiene education"],
          display_order: 2,
        },
        {
          title: "Youth Capacity Building", slug: "youth-capacity",
          description: "FSR provides career guidance and career development, along with job creation and saving schemes for youth. We coach young people grouped in newly created VSLAs, training them in entrepreneurship and business literacy — giving them practical tools to build their own futures.",
          summary: "Equipping young Rwandans with skills and opportunities for success.",
          beneficiaries: "Youth",
          icon: "trending-up",
          bg_color: "bg-indigo-600", text_color: "text-indigo-600", border_color: "border-indigo-200", light_bg: "bg-indigo-50",
          tag: "Youth Capacity",
          impact_items: ["Career guidance & development","Job creation initiatives","Savings scheme coaching","VSLAs for youth groups","Entrepreneurship & business literacy"],
          display_order: 3,
        },
        {
          title: "Children Empowerment", slug: "children-empowerment",
          description: "We believe children deserve an active role and voice in their own holistic development. FSR builds decent shelters for homeless children, pays school fees for students from vulnerable families, provides nutritional support, and distributes domestic materials to vulnerable families and children.",
          summary: "Holistic support and rights for the most vulnerable children.",
          beneficiaries: "Orphans & Vulnerable Children",
          icon: "baby",
          bg_color: "bg-green-600", text_color: "text-green-600", border_color: "border-green-200", light_bg: "bg-green-50",
          tag: "Children Empowerment",
          impact_items: ["Active participation in own development","Shelter for homeless children","School fees for vulnerable students","Nutritional support","Domestic materials for families"],
          display_order: 4,
        },
        {
          title: "Healthcare", slug: "healthcare",
          description: "FSR conducts healthcare outreach and medical clinics in underserved rural communities of Nyaruguru District and beyond. Our goal is to ensure that even the most remote and vulnerable populations have access to essential medical care and health education.",
          summary: "Bringing essential medical care to underserved rural communities.",
          beneficiaries: "Rural Communities",
          icon: "activity",
          bg_color: "bg-red-600", text_color: "text-red-600", border_color: "border-red-200", light_bg: "bg-red-50",
          tag: "Healthcare",
          impact_items: ["Mobile healthcare outreach","Medical clinics in rural areas","Health education campaigns","Support for vulnerable patients","Community health awareness"],
          display_order: 5,
        },
        {
          title: "Family Strengthening", slug: "family-strengthening",
          description: "The family is the key unit of child development. FSR provides parenting education, savings groups, and community development initiatives. We place special focus on teen mothers, offering vocational training and life skills to help them become self-sufficient, capable parents.",
          summary: "Strengthening families from the inside out with education and support.",
          beneficiaries: "Families & Teen Mothers",
          icon: "home",
          bg_color: "bg-orange-600", text_color: "text-orange-600", border_color: "border-orange-200", light_bg: "bg-orange-50",
          tag: "Family Strengthening",
          impact_items: ["Parenting education programs","Community savings groups","Vocational training for teen mothers","Life skills coaching","Community development initiatives"],
          display_order: 6,
        },
      ];
      for (const p of programs) {
        await conn.query(
          `INSERT IGNORE INTO programs
           (title,slug,description,summary,beneficiaries,icon,bg_color,text_color,border_color,light_bg,tag,impact_items,display_order)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [p.title, p.slug, p.description, p.summary, p.beneficiaries, p.icon,
           p.bg_color, p.text_color, p.border_color, p.light_bg, p.tag,
           JSON.stringify(p.impact_items), p.display_order]
        );
      }
    },
  },
  {
    name: "seed_programs_detail_update",
    fn: async (conn) => {
      // Update existing rows that were seeded before new columns were added
      const updates = [
        { slug: "education-support",   summary: "Empowering children and youth with quality education and life skills.",              beneficiaries: "Children & Youth",          bg_color: "bg-blue-600",   text_color: "text-blue-600",   border_color: "border-blue-200",   light_bg: "bg-blue-50",   tag: "Education Support",    impact_items: ["Primary and technical skills training","Human rights & SRHR education","Life skills development","School construction & equipment","School fees support for vulnerable students"] },
        { slug: "women-empowerment",   summary: "Building economic independence and community resilience for women.",                 beneficiaries: "Women & Families",          bg_color: "bg-pink-600",   text_color: "text-pink-600",   border_color: "border-pink-200",   light_bg: "bg-pink-50",   tag: "Women & Community",    impact_items: ["Mindset change & vision building","Entrepreneurship training","Income generation skills","Village Savings & Loans Associations (VSLAs)","Nutrition & hygiene education"] },
        { slug: "youth-capacity",      summary: "Equipping young Rwandans with skills and opportunities for success.",               beneficiaries: "Youth",                     bg_color: "bg-indigo-600", text_color: "text-indigo-600", border_color: "border-indigo-200", light_bg: "bg-indigo-50", tag: "Youth Capacity",       impact_items: ["Career guidance & development","Job creation initiatives","Savings scheme coaching","VSLAs for youth groups","Entrepreneurship & business literacy"] },
        { slug: "children-empowerment",summary: "Holistic support and rights for the most vulnerable children.",                     beneficiaries: "Orphans & Vulnerable Children",bg_color: "bg-green-600", text_color: "text-green-600",  border_color: "border-green-200",  light_bg: "bg-green-50",  tag: "Children Empowerment", impact_items: ["Active participation in own development","Shelter for homeless children","School fees for vulnerable students","Nutritional support","Domestic materials for families"] },
        { slug: "healthcare",          summary: "Bringing essential medical care to underserved rural communities.",                  beneficiaries: "Rural Communities",         bg_color: "bg-red-600",    text_color: "text-red-600",    border_color: "border-red-200",    light_bg: "bg-red-50",    tag: "Healthcare",           impact_items: ["Mobile healthcare outreach","Medical clinics in rural areas","Health education campaigns","Support for vulnerable patients","Community health awareness"] },
        { slug: "family-strengthening",summary: "Strengthening families from the inside out with education and support.",            beneficiaries: "Families & Teen Mothers",   bg_color: "bg-orange-600", text_color: "text-orange-600", border_color: "border-orange-200", light_bg: "bg-orange-50", tag: "Family Strengthening", impact_items: ["Parenting education programs","Community savings groups","Vocational training for teen mothers","Life skills coaching","Community development initiatives"] },
      ];
      for (const u of updates) {
        await conn.query(
          `UPDATE programs SET summary=?, beneficiaries=?, bg_color=?, text_color=?, border_color=?, light_bg=?, tag=?, impact_items=?
           WHERE slug=? AND (summary IS NULL OR summary='')`,
          [u.summary, u.beneficiaries, u.bg_color, u.text_color, u.border_color, u.light_bg, u.tag, JSON.stringify(u.impact_items), u.slug]
        );
      }
    },
  },
  {
    name: "seed_hero_slides",
    fn: async (conn) => {
      const slides = [
        { tag: "Registered NGO · Rwanda Governance Board · Since 2020", title: "Transforming Lives", highlight: "Together", subtitle: "Family Success Rwanda empowers the most vulnerable communities through education, healthcare, women empowerment, and family strengthening — rooted in faith and compassion.", cta1_label: "Donate Now", cta1_href: "/donate", cta2_label: "Our Programs", cta2_href: "/programs", image_url: "https://images.unsplash.com/photo-1598605170898-853b9ae903fc?w=1920&q=80", overlay: "from-orange-950/80 via-orange-900/70 to-black/60", stat_value: "320+", stat_label: "Students Sponsored", bullets: ["Nyaruguru District","6 Programs","Since 2020"], icon_name: "globe", display_order: 1 },
        { tag: "FSR Key Project · Founded 2023", title: "Faina Jerusalem", highlight: "Village", subtitle: "Our flagship vocational training centre gives street children, orphans, and vulnerable youth a real future through government-accredited TVET courses and primary education.", cta1_label: "Explore the Village", cta1_href: "/faina-jerusalem", cta2_label: "Sponsor a Student", cta2_href: "/donate", image_url: "https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?w=1920&q=80", overlay: "from-orange-950/80 via-orange-900/70 to-black/60", stat_value: "5", stat_label: "TVET Courses", bullets: ["320 Students 2024","Gov't Accredited","Fully Sponsored"], icon_name: "graduation-cap", display_order: 2 },
        { tag: "Program Spotlight · Education Support", title: "Every Child Deserves", highlight: "An Education", subtitle: "FSR builds and equips schools, pays school fees, and provides life skills training for children from the most vulnerable families across Nyaruguru District.", cta1_label: "View Programs", cta1_href: "/programs", cta2_label: "Support Education", cta2_href: "/donate", image_url: "https://images.unsplash.com/photo-1548102245-c79dbcfa9f92?w=1920&q=80", overlay: "from-orange-950/80 via-orange-900/70 to-black/60", stat_value: "100%", stat_label: "Transparent", bullets: ["Schools Built","Fees Covered","Life Skills"], icon_name: "book-open", display_order: 3 },
        { tag: "Program Spotlight · Women Empowerment", title: "Empowering Women,", highlight: "Strengthening Families", subtitle: "Through Village Savings and Loans Associations (VSLAs), entrepreneurship training, and income generation, FSR builds lasting economic independence for Rwandan women.", cta1_label: "Learn More", cta1_href: "/programs", cta2_label: "Give Now", cta2_href: "/donate", image_url: "https://images.unsplash.com/photo-1603703182693-51a19941fa59?w=1920&q=80", overlay: "from-orange-950/80 via-orange-900/70 to-black/60", stat_value: "6", stat_label: "Active Programs", bullets: ["VSLAs Created","Entrepreneurship","Income Gen."], icon_name: "users", display_order: 4 },
        { tag: "FSR 2030 Vision", title: "Building the Safety Net", highlight: "for Rwanda's Future", subtitle: "Our 2030 strategic plan ensures every vulnerable child enjoys their full rights — aligned with Rwanda's NST1, the UNCRC, and the Sustainable Development Goals.", cta1_label: "Our Impact", cta1_href: "/impact", cta2_label: "Partner With Us", cta2_href: "/contact", image_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80", overlay: "from-orange-950/80 via-orange-900/70 to-black/60", stat_value: "2030", stat_label: "Strategic Vision", bullets: ["NST1 Aligned","UNCRC Partner","SDG Goals"], icon_name: "target", display_order: 5 },
      ];
      for (const s of slides) {
        await conn.query(
          `INSERT IGNORE INTO hero_slides (tag,title,highlight,subtitle,cta1_label,cta1_href,cta2_label,cta2_href,image_url,overlay,stat_value,stat_label,bullets,icon_name,display_order)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [s.tag, s.title, s.highlight, s.subtitle, s.cta1_label, s.cta1_href, s.cta2_label, s.cta2_href, s.image_url, s.overlay, s.stat_value, s.stat_label, JSON.stringify(s.bullets), s.icon_name, s.display_order]
        );
      }
    },
  },
  {
    name: "seed_partners",
    fn: async (conn) => {
      const partners = [
        { abbr: "RGB",     name: "Rwanda Governance Board",  bg_gradient: "from-emerald-800 to-emerald-600", display_order: 1 },
        { abbr: "JADF",    name: "Joint Action Dev. Forum",  bg_gradient: "from-blue-800 to-blue-600",       display_order: 2 },
        { abbr: "MINEDUC", name: "Ministry of Education",    bg_gradient: "from-indigo-800 to-indigo-600",   display_order: 3 },
        { abbr: "MOH",     name: "Ministry of Health",       bg_gradient: "from-red-800 to-red-600",         display_order: 4 },
        { abbr: "UNICEF",  name: "UNICEF Rwanda",            bg_gradient: "from-sky-700 to-sky-500",         display_order: 5 },
        { abbr: "WV",      name: "World Vision Rwanda",      bg_gradient: "from-orange-700 to-orange-500",   display_order: 6 },
        { abbr: "RRC",     name: "Rwanda Red Cross",         bg_gradient: "from-rose-800 to-rose-600",       display_order: 7 },
        { abbr: "GIZ",     name: "GIZ Rwanda",               bg_gradient: "from-teal-800 to-teal-600",       display_order: 8 },
        { abbr: "TF",      name: "Tearfund",                 bg_gradient: "from-purple-800 to-purple-600",   display_order: 9 },
        { abbr: "CI",      name: "Compassion Intl.",         bg_gradient: "from-amber-700 to-amber-500",     display_order: 10 },
      ];
      for (const p of partners) {
        await conn.query(
          `INSERT IGNORE INTO partners (abbr, name, bg_gradient, display_order) VALUES (?,?,?,?)`,
          [p.abbr, p.name, p.bg_gradient, p.display_order]
        );
      }
    },
  },
  {
    name: "seed_core_values",
    fn: async (conn) => {
      const values = [
        { label: "Hope",           description: "Believing in a brighter future for every family we serve.",                         icon_name: "sparkles",       color_classes: "border-blue-200 bg-blue-50",     icon_color: "text-blue-500",    display_order: 1 },
        { label: "Love",           description: "Unconditional love as the foundation of all our work.",                             icon_name: "heart",          color_classes: "border-red-200 bg-red-50",       icon_color: "text-red-500",     display_order: 2 },
        { label: "Compassion",     description: "Responding with empathy to suffering in all its forms.",                            icon_name: "heart-handshake",color_classes: "border-orange-200 bg-orange-50", icon_color: "text-orange-500",  display_order: 3 },
        { label: "Integrity",      description: "Transparent, honest, and accountable in everything.",                               icon_name: "scale",          color_classes: "border-purple-200 bg-purple-50", icon_color: "text-purple-500",  display_order: 4 },
        { label: "Social Justice", description: "Advocating for the rights and dignity of every person.",                            icon_name: "globe",          color_classes: "border-green-200 bg-green-50",   icon_color: "text-green-600",   display_order: 5 },
        { label: "Tolerance",      description: "Welcoming diversity and promoting peaceful coexistence.",                           icon_name: "handshake",      color_classes: "border-sky-200 bg-sky-50",       icon_color: "text-sky-500",     display_order: 6 },
        { label: "Stewardship",    description: "Responsibly managing resources entrusted to us.",                                   icon_name: "leaf",           color_classes: "border-emerald-200 bg-emerald-50",icon_color: "text-emerald-600", display_order: 7 },
        { label: "Reconciliation", description: "Fostering healing — both vertically with God and horizontally within communities.", icon_name: "star",           color_classes: "border-orange-200 bg-orange-50", icon_color: "text-orange-500",  display_order: 8 },
      ];
      for (const v of values) {
        await conn.query(
          `INSERT IGNORE INTO core_values (label,description,icon_name,color_classes,icon_color,display_order) VALUES (?,?,?,?,?,?)`,
          [v.label, v.description, v.icon_name, v.color_classes, v.icon_color, v.display_order]
        );
      }
    },
  },
  {
    name: "seed_staff",
    fn: async (conn) => {
      const staff = [
        { slug: "executive-director",        name: "Executive Director",              role: "Executive Director",                        department: "Leadership",              photo: "", short_bio: "Leads the overall vision and strategic direction of Family Success Rwanda, overseeing all programs and partnerships.", full_bio: "The Executive Director provides overall leadership and strategic direction to Family Success Rwanda. With a deep commitment to community transformation and a strong faith foundation, they oversee all organizational operations, manage partnerships, and ensure FSR's programs remain aligned with the 2030 strategic vision. They work closely with the board, staff, and community leaders to advance FSR's mission of empowering vulnerable families across Rwanda.", email: "director@familysuccessrwanda.org", phone: "+250 788 316 227", joined_year: "2020", education: ["Leadership & Nonprofit Management","Community Development"],             expertise: ["Strategic Planning","Community Development","Partnership Management","Fundraising"],                              display_order: 1 },
        { slug: "program-manager",           name: "Program Manager",                 role: "Program Manager",                           department: "Programs",                photo: "", short_bio: "Oversees implementation of all six FSR programs, ensuring quality delivery and measurable community impact.", full_bio: "The Program Manager is responsible for the design, implementation, and evaluation of all FSR programs including Education Support, Women Empowerment, Youth Capacity Building, Children Empowerment, Healthcare, and Family Strengthening. They coordinate field teams, track program outcomes, and ensure all activities align with FSR's mission and the 2030 strategic plan.", email: "programs@familysuccessrwanda.org", phone: "", joined_year: "2020", education: ["Social Work","Project Management"],                                         expertise: ["Program Design","M&E","Community Mobilization","VSLA Facilitation"],                                               display_order: 2 },
        { slug: "faina-jerusalem-coordinator",name: "Faina Jerusalem Coordinator",   role: "Village Coordinator",                       department: "Faina Jerusalem Village", photo: "", short_bio: "Manages day-to-day operations of Faina Jerusalem Village, supporting 320+ students in education and TVET training.", full_bio: "The Faina Jerusalem Village Coordinator manages all aspects of the village's operations — from student enrollment and welfare to teacher coordination and government curriculum compliance. They ensure every student receives quality education and vocational training, oversee the feeding program, and coordinate internship placements for TVET graduates.", email: "faina@familysuccessrwanda.org", phone: "", joined_year: "2023", education: ["Education Management","TVET Administration"],                              expertise: ["TVET Coordination","Student Welfare","Government Liaison","Curriculum Implementation"],                             display_order: 3 },
        { slug: "women-empowerment-officer", name: "Women Empowerment Officer",       role: "Women & Community Empowerment Officer",      department: "Programs",                photo: "", short_bio: "Leads women's empowerment initiatives including VSLA groups, entrepreneurship training, and income generation programs.", full_bio: "The Women Empowerment Officer designs and delivers all FSR programs targeting women and community development. They establish and coach Village Savings and Loans Associations (VSLAs), facilitate entrepreneurship training, and provide ongoing support to women pursuing income-generating activities. They also run programs in nutrition, hygiene, conflict management, and mindset transformation.", email: "women@familysuccessrwanda.org", phone: "", joined_year: "2021", education: ["Gender Studies","Community Development","Business Administration"],       expertise: ["VSLA Facilitation","Entrepreneurship Training","Gender-Based Programming","Community Mobilization"],                display_order: 4 },
        { slug: "healthcare-officer",        name: "Healthcare Officer",              role: "Healthcare & Outreach Officer",             department: "Healthcare",              photo: "", short_bio: "Coordinates mobile healthcare outreach clinics and community health education across underserved rural communities.", full_bio: "The Healthcare Officer plans and executes FSR's mobile medical clinics and community health outreach programs in underserved rural areas of Nyaruguru District. They work with volunteer medical professionals, coordinate logistics for healthcare camps, and run community health education campaigns on nutrition, maternal health, hygiene, and disease prevention.", email: "health@familysuccessrwanda.org", phone: "", joined_year: "2021", education: ["Public Health","Community Health"],                                         expertise: ["Mobile Clinics","Community Health Education","Patient Support","Health Campaigns"],                                  display_order: 5 },
        { slug: "finance-officer",           name: "Finance Officer",                 role: "Finance & Administration Officer",           department: "Administration",          photo: "", short_bio: "Manages FSR's financial operations, audits, donor reporting, and ensures full transparency in all fund management.", full_bio: "The Finance & Administration Officer is responsible for all financial management at Family Success Rwanda. They maintain accurate financial records, prepare donor reports, coordinate external audits, and ensure funds are used strictly for approved activities. Their work ensures FSR's commitment to full transparency — every donation is receipted, tracked, and reported.", email: "finance@familysuccessrwanda.org", phone: "", joined_year: "2022", education: ["Accounting & Finance","Nonprofit Financial Management"],                   expertise: ["Financial Management","Donor Reporting","Audit Coordination","Compliance"],                                        display_order: 6 },
      ];
      for (const s of staff) {
        await conn.query(
          `INSERT IGNORE INTO staff (slug,name,role,department,photo,short_bio,full_bio,email,phone,joined_year,education,expertise,display_order)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [s.slug, s.name, s.role, s.department, s.photo, s.short_bio, s.full_bio, s.email, s.phone, s.joined_year, JSON.stringify(s.education), JSON.stringify(s.expertise), s.display_order]
        );
      }
    },
  },
  {
    // Sample articles so the news section is not empty — edit or delete them in Admin → News.
    name: "seed_news",
    fn: async (conn) => {
      const news = [
        {
          title: "320 Students Sponsored at Faina Jerusalem Village",
          slug: "320-students-sponsored-at-faina-jerusalem-village",
          excerpt: "In 2024, 320 students were enrolled at Faina Jerusalem Village, all fully sponsored for their course and feeding fees.",
          content: "Faina Jerusalem Village continues to open doors for disadvantaged, marginalized, and vulnerable youth. In 2024, 320 students were enrolled, and every one of them was fully sponsored for their course and feeding fees.\n\nStudents follow the Government of Rwanda's official training curriculum, with one-year TVET short courses in welding, masonry, carpentry, tailoring, and hairdressing, alongside quality primary education for school dropouts and vulnerable children.\n\nEach TVET course combines eight months of classes with four months of internship, followed by entrepreneurship guidance and job placement support.\n\nWe thank every sponsor and partner who makes this possible.",
          image_url: "https://images.unsplash.com/photo-1548102245-c79dbcfa9f92?w=1200&q=80",
          days_ago: 3,
        },
        {
          title: "Sponsor a Child: A New Way to Change a Life",
          slug: "sponsor-a-child-a-new-way-to-change-a-life",
          excerpt: "You can now sponsor a child who lost parental care from RWF 20,000 per month for food and basic needs.",
          content: "Every child deserves love, security, and the chance to dream. Family Success Rwanda has opened a child sponsorship program for children who lost parental care and other vulnerable children in Rwanda.\n\nSponsorship helps provide food, clothes, shoes, bedding, scholastic materials, and school uniforms. RWF 20,000 per month provides food and basic needs for a child.\n\nVisit the Sponsor a Child page to learn more and to find our bank details.",
          image_url: "https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?w=1200&q=80",
          days_ago: 10,
        },
        {
          title: "Volunteers Welcome at Family Success Rwanda",
          slug: "volunteers-welcome-at-family-success-rwanda",
          excerpt: "Give your time and skills to support children, women, and families in Nyaruguru District.",
          content: "Family Success Rwanda welcomes volunteers who want to give their time and skills to serve vulnerable children, women, and families in Nyaruguru District.\n\nVolunteers can support education, Faina Jerusalem Village, healthcare outreach, women and community empowerment, and more.\n\nTo apply, open Get Involved and choose Volunteers, then fill in the application form. Our team will get in touch with you.",
          image_url: "",
          days_ago: 21,
        },
      ];
      for (const n of news) {
        await conn.query(
          `INSERT IGNORE INTO news (title, slug, excerpt, content, image_url, published_at)
           VALUES (?,?,?,?,?, DATE_SUB(CURDATE(), INTERVAL ? DAY))`,
          [n.title, n.slug, n.excerpt, n.content, n.image_url, n.days_ago]
        );
      }
    },
  },
  {
    name: "seed_faith_statements",
    fn: async (conn) => {
      const statements = [
        { text: "We glorify God only",                                              icon_name: "flame",    icon_color: "text-orange-400", display_order: 1 },
        { text: "We believe Jesus Christ as our Saviour only",                      icon_name: "heart",    icon_color: "text-red-400",    display_order: 2 },
        { text: "We believe in Holy Scripture authority only",                      icon_name: "book-open",icon_color: "text-yellow-400", display_order: 3 },
        { text: "We are saved by Grace only through Faith only",                    icon_name: "sparkles", icon_color: "text-blue-300",   display_order: 4 },
        { text: "The Holy Spirit is our advisor to become a blessing to everybody", icon_name: "feather",  icon_color: "text-emerald-300",display_order: 5 },
      ];
      for (const st of statements) {
        await conn.query(
          `INSERT IGNORE INTO faith_statements (text,icon_name,icon_color,display_order) VALUES (?,?,?,?)`,
          [st.text, st.icon_name, st.icon_color, st.display_order]
        );
      }
    },
  },
];

const ALTER_MIGRATIONS: Migration[] = [
  {
    name: "alter_partners_add_logo_url",
    fn: async (conn) => {
      const [cols]: any = await conn.query(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partners' AND COLUMN_NAME = 'logo_url'`
      );
      if (!cols.length) {
        await conn.query("ALTER TABLE partners ADD COLUMN logo_url VARCHAR(500) DEFAULT '' AFTER name");
      }
    },
  },
  {
    name: "alter_partners_add_website_url",
    fn: async (conn) => {
      const [cols]: any = await conn.query(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partners' AND COLUMN_NAME = 'website_url'`
      );
      if (!cols.length) {
        await conn.query("ALTER TABLE partners ADD COLUMN website_url VARCHAR(500) DEFAULT '' AFTER logo_url");
      }
    },
  },
];

const MIGRATIONS: Migration[] = [...TABLE_MIGRATIONS, ...ALTER_MIGRATIONS, ...SEED_MIGRATIONS];

// ─── Runner ──────────────────────────────────────────────────────────────────

export async function runMigrations() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     ?? "localhost",
    port:     Number(process.env.DB_PORT ?? 3306),
    user:     process.env.DB_USER     ?? "root",
    password: process.env.DB_PASSWORD ?? "",
  });

  try {
    const db = process.env.DB_NAME ?? "fsr_website";

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${db}\``);

    // Bootstrap tracking table (always, before reading it)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL UNIQUE,
        ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    const [ran]: any = await conn.query("SELECT name FROM _migrations");
    const done = new Set((ran as { name: string }[]).map(r => r.name));

    for (const m of MIGRATIONS) {
      if (done.has(m.name)) continue;
      if ("sql" in m) {
        await conn.query(m.sql);
      } else {
        await m.fn(conn);
      }
      await conn.query("INSERT INTO _migrations (name) VALUES (?)", [m.name]);
      console.log(`[migrate] ✓ ${m.name}`);
    }
  } finally {
    await conn.end();
  }
}
