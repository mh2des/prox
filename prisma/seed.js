// ProEx — Prisma database seed.
// Reproduces the site's hardcoded English content into the database so the
// public pages and the admin can be driven from Postgres instead of source files.
//
// - English (…En) and non-localized fields are populated from the existing content.
// - Arabic (…Ar) fields are intentionally left null / empty ([]) — they will be
//   machine-translated and refined via the admin later.
//
// Idempotent & re-runnable: content tables are wiped (deleteMany, FK-safe order)
// then re-created; AdminUser upserts by email, Setting by id, Page by slug.
//
// Run with env already exported (SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, DATABASE_URL…):
//   node prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ── helpers ────────────────────────────────────────────────────────────────
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const UNSPLASH = 'https://images.unsplash.com/photo-';

// ── PROJECTS ────────────────────────────────────────────────────────────────
// Merge of src/constants/projects.js (PROJECT_METADATA) + messages/en.json ourWork.projects
const projects = [
  {
    slug: 'legal-clinic-sop',
    titleEn: 'Development of Standard Operating Procedures (SOPs) for Legal Clinic Project',
    descEn: [
      'ProEx contributed to the launch of the Legal Clinic Project implemented by BASS Foundation on December 14, 2025, acting as the consulting partner responsible for developing the project’s Standard Operating Procedures (SOPs).',
      'The engagement focused on designing structured operational frameworks to ensure efficiency, consistency, and quality in service delivery. Through this work, ProEx supported the institutionalization of legal aid services and strengthened the operational readiness of the initiative.',
    ].join('\n\n'),
    sector: 'Civil Society',
    client: 'BASS Foundation',
    year: '2025',
    imageUrl: '/0urwork/Development of Standard Operating Procedures  1.png',
    published: true,
    sortOrder: 0,
  },
  {
    slug: 'pmp-training',
    titleEn: 'Professional Project Management (PMP) Training Program',
    descEn: [
      'ProEx delivered a specialized PMP training program for employees of Silah Development Foundation, totaling 35 training hours through a blended learning approach (in-person and online).',
      'The program was based on PMBOK guidelines and PMI methodologies, including Agile, Predictive, and Hybrid frameworks. This initiative aimed to enhance project management capabilities and equip participants with globally recognized practices to improve project delivery and organizational performance.',
    ].join('\n\n'),
    sector: 'Non-Profit / NGO',
    client: 'Silah Development Foundation',
    year: '2025',
    imageUrl: '/0urwork/Professional Project Management  2.png',
    published: true,
    sortOrder: 1,
  },
  {
    slug: 'mawaddah-rahmah-conference',
    titleEn: 'Strategic Event Management – Mawaddah & Rahmah Conference',
    descEn: [
      'ProEx played a key role in organizing the “Mawaddah & Rahmah” Conference held in Bahrain on November 1, 2025.',
      'The company delivered a professional end-to-end event management experience, ensuring high-quality organization and execution. In recognition of this contribution, ProEx was honored by Mustaqrah for its role in delivering a distinguished institutional event.',
    ].join('\n\n'),
    sector: 'Private / Institutional',
    client: 'Mustaqrah',
    year: '2025',
    imageUrl: '/0urwork/Strategic Event Management 3.png',
    published: true,
    sortOrder: 2,
  },
  {
    slug: 'gulf-university-sustainability',
    titleEn: 'Participation in Gulf University Sustainability Week 2025',
    descEn: [
      'Represented by its CEO, Dr. Khaled Al-Azab, ProEx participated in Gulf University Sustainability Week 2025, presenting a paper on sustainable governance and its role in promoting peace, justice, and strong institutions.',
      'This participation aligns with ProEx’s role as an advisory partner to the Bahrain Human Rights Observatory. The engagement concluded with formal recognition from the university.',
    ].join('\n\n'),
    sector: 'Academic / Advisory',
    client: 'Gulf University',
    year: '2025',
    imageUrl: '/0urwork/Participation in Gulf University Sustainability Week 2025  4.png',
    published: true,
    sortOrder: 3,
  },
];

// ── TEAM MEMBERS ──────────────────────────────────────────────────────────────
// From src/app/[locale]/leadership-team/page.js `leaders`.
// positionEn = "title — subtitle"; experienceEn entries = "role — desc".
const teamMembers = [
  {
    name: 'Dr. Khaled Hamood Al-Azab',
    positionEn:
      'Vice President of the Arab Volunteer Union — Expert in Strategic Planning & Institutional Capacity Building',
    bioEn:
      'An accomplished consultant and academic with over 18 years of experience in management, strategic planning, and organizational development. Holding a Ph.D. in "Administration and Planning," he has spearheaded major regional initiatives in collaboration with international organizations such as the UNDP and GIZ. Dr. Al-Azab specializes in designing institutional models, conflict resolution, and developing complex procedural manuals for the third sector and government entities across the GCC and the Arab world.',
    expertiseEn: [
      'Strategic & Operational Planning',
      'Institutional Capacity Building & Organizational Restructuring',
      'Project Management, Monitoring, Evaluation, Accountability, and Learning (MEAL)',
      'Training of Trainers (TOT) & Curriculum Design',
    ],
    expertiseAr: [],
    experienceEn: [
      'Vice President, Arab Volunteer Union (Bahrain) — Leading development and training strategies at a regional level.',
      'Consultant for GIZ & UNDP — Executed projects on social cohesion, conflict management, and strategic roadmap development in complex environments.',
      'Chairman, Attanweer Development Foundation (ADF) — Directed financial and administrative operations, leading multi-disciplinary teams to achieve institutional KPIs.',
    ],
    experienceAr: [],
    photoUrl: '/leadership-team/Dr. Khaled Hamood Al-Azab   1.jpeg',
    published: true,
    sortOrder: 0,
  },
  {
    name: 'Sumair Ahmed Watani',
    positionEn:
      'Business Development & Growth Marketing Director — Export Strategy & Supply Chain Expert',
    bioEn:
      'A high-impact executive with over 20 years of global experience in crafting market penetration strategies, particularly within the KSA and Bahraini markets. Specializing in transforming commercial objectives into tangible results through digital transformation and product development, he has a proven track record of driving multimillion-dollar revenue growth. He excels in navigating GCC regulatory standards and managing complex supply chains for the FMCG sector.',
    expertiseEn: [
      'KSA & GCC Market Penetration',
      'Brand Management & Product Development',
      'Growth Marketing & Digital Strategy (SEO/SMM)',
      'Export Operations & Regulatory Compliance',
    ],
    expertiseAr: [],
    experienceEn: [
      'Business Development Manager (United King Foods) — Expanded footprint to 1,000+ stores in KSA, achieving a 160% increase in regional sales.',
      'Planning Strategy Manager (Horwath Mak) — Provided consultancy for UAE government entities regarding organizational restructuring and KSA market integration.',
      'Marketing Manager (Mehran Foods) — Led market entry into KSA and Bahrain, generating $10M in revenue and securing listings with major regional retailers.',
    ],
    experienceAr: [],
    photoUrl: '/leadership-team/Sumair Ahmed Watani   2.png',
    published: true,
    sortOrder: 1,
  },
  {
    name: 'Sami Mohammed Ali',
    positionEn:
      'Manager of Grants & Capacity Building — International Relations & Project Management Expert',
    bioEn:
      'A dedicated professional with extensive experience in both the public and private sectors, specializing in donor relations and grant management. He possesses strong leadership skills in managing multi-national teams and overseeing large-scale projects with budgets exceeding $55 million. Mr. Ali is an expert in formulating organizational policies and procedures, combined with high-level diplomatic negotiation skills and official simultaneous interpretation capabilities.',
    expertiseEn: [
      'Grant System Management & Partner Capacity Assessment',
      'Strategic Initiative Development & Risk Management',
      'International Relations & Diplomatic Protocol',
      'Monitoring, Evaluation, and Learning (MEAL) for cross-border projects',
    ],
    expertiseAr: [],
    experienceEn: [
      'Grants & Capacity Building Manager (International Islamic Charity Organization - Kuwait) — Developed grant processes and oversaw partner assessments across 11 international offices.',
      'Operations Manager (IICO) — Managed diverse project portfolios in over 50 countries with a total budget exceeding $55M.',
      'Liaison Officer & Interpreter (UAE & Sudan Embassies – Malaysia) — Managed official events and provided high-level protocol and translation for ministerial and presidential delegations.',
    ],
    experienceAr: [],
    photoUrl: '/leadership-team/Sami Mohammed Zeinelabdein Ali   3.png',
    published: true,
    sortOrder: 2,
  },
  {
    name: 'Saleh Abd El Hamid Mohamed',
    positionEn: 'Economic & Financial Analyst — Institutional Development & AI Integration Expert',
    bioEn:
      "A distinguished Economic and Financial Analyst within the Minister's Office Sector at the Ministry of Finance. With a background that includes advanced diplomas in Behavioral Sciences and Artificial Intelligence, he is currently a Ph.D. candidate in Finance and Economics. He bridges the gap between deep economic theory and modern technological application, serving as an internationally accredited lecturer and a consultant for strategic policy development in government and private sectors.",
    expertiseEn: [
      'Macro & Microeconomic Analysis and Financial Modeling',
      'Institutional Development & Strategic Planning',
      'AI Applications in Management and Economics',
      'Behavioral Sciences, Leadership, and Advanced Communication',
    ],
    expertiseAr: [],
    experienceEn: [
      "Ministry of Finance (Minister's Office Sector) — Serving as a Financial Analyst and Institutional Developer for fiscal policies.",
      'International Lecturer — Delivering training programs in economics and AI for prestigious institutions including Cairo University and the League of Arab States.',
      'Consultant, Egyptian Enterprise Center for Policy & Strategic Studies — Prepared strategic working papers for international forums, including COP 27.',
    ],
    experienceAr: [],
    // Source uses a hotlinked Unsplash portrait for this member (no local asset).
    photoUrl:
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80',
    published: true,
    sortOrder: 3,
  },
];

// ── CLIENTS ──────────────────────────────────────────────────────────────────
// From messages/en.json ourWork.clients.clientLogos[].
const clients = [
  { name: 'BASS Foundation', logoUrl: '/our-clients/WhatsApp Image 2026-03-29 at 8.18.31 AM.jpeg', sortOrder: 0 },
  { name: 'Silah Development Foundation', logoUrl: '/our-clients/WhatsApp Image 2026-03-29 at 8.18.31 AM (1).jpeg', sortOrder: 1 },
  { name: 'Mustaqrah', logoUrl: '/our-clients/WhatsApp Image 2026-03-29 at 8.18.31 AM (2).jpeg', sortOrder: 2 },
  { name: 'Gulf University', logoUrl: '/our-clients/WhatsApp Image 2026-03-29 at 8.18.31 AM.jpeg', sortOrder: 3 },
  { name: 'Bahrain Human Rights Observatory', logoUrl: '/our-clients/WhatsApp Image 2026-03-29 at 8.18.31 AM (1).jpeg', sortOrder: 4 },
].map((c) => ({ ...c, published: true }));

// ── PRINCIPLES (Vision / Mission / Values) ───────────────────────────────────
// Vision & Mission from src/components/ui/VMVSplitCard.jsx.
// The Vision panel has only a headline (no separate body) in the source, so the
// headline is reused as textEn. Values from src/components/ui/ValuesInfographic.jsx.
const principles = [
  {
    type: 'VISION',
    titleEn: 'Shaping Institutional Excellence Across the Region',
    textEn: 'Shaping Institutional Excellence Across the Region',
    icon: null,
    sortOrder: 0,
  },
  {
    type: 'MISSION',
    titleEn: 'Driving Measurable Outcomes for Visionary Institutions',
    textEn:
      'To partner with visionary leaders and institutions, offering integrated advisory solutions that strengthen governance, enhance performance, and foster resilient and future-ready organizations.',
    icon: null,
    sortOrder: 1,
  },
  { type: 'VALUE', titleEn: 'Integrity', textEn: 'We uphold the highest standards of honesty, ethics, and professional conduct.', icon: '⚖', sortOrder: 2 },
  { type: 'VALUE', titleEn: 'Excellence', textEn: 'We pursue quality and continuous improvement in all we do.', icon: '★', sortOrder: 3 },
  { type: 'VALUE', titleEn: 'Collaboration', textEn: 'We value partnerships, mutual respect, and shared success.', icon: '⟳', sortOrder: 4 },
  { type: 'VALUE', titleEn: 'Innovation', textEn: 'We embrace creative solutions that drive meaningful change.', icon: '◈', sortOrder: 5 },
  { type: 'VALUE', titleEn: 'Impact', textEn: 'Our work is guided by measurable outcomes and long-term value creation.', icon: '◎', sortOrder: 6 },
];

// ── STATS ────────────────────────────────────────────────────────────────────
// From src/app/[locale]/page.js "Selected Work" stat panel.
const stats = [
  { valueEn: '50+', labelEn: 'Institutions Served', sortOrder: 0 },
  { valueEn: '12+', labelEn: 'Years of Impact', sortOrder: 1 },
  { valueEn: '5', labelEn: 'Core Capabilities', sortOrder: 2 },
  { valueEn: '3', labelEn: 'Sectors We Serve', sortOrder: 3 },
];

// ── SECTORS ──────────────────────────────────────────────────────────────────
// From messages/en.json home.sectors[].
const sectors = [
  { titleEn: 'Government Sector', descEn: 'Supporting governance reform, public policy design, institutional performance enhancement, and citizen-centric service transformation.', sortOrder: 0 },
  { titleEn: 'Private Sector', descEn: 'Driving competitiveness, leadership development, governance maturity, and sustainable growth strategies.', sortOrder: 1 },
  { titleEn: 'Civil Society', descEn: 'Strengthening institutional capacity, program effectiveness, sustainability, and community engagement.', sortOrder: 2 },
];

// ── SERVICE PILLARS (TRACE) ──────────────────────────────────────────────────
// From messages/en.json services.pillars[].
const servicePillars = [
  {
    letter: 'T',
    titleEn: 'Training & Capacity Development',
    descEn:
      'We design and deliver high-impact training programs that strengthen institutional competencies and leadership capabilities. Our programs are tailored to organizational needs and aligned with strategic priorities, ensuring that knowledge translates into practical application and measurable improvement.',
    keyAreasEn: [
      'Leadership and executive development',
      'Governance and institutional management',
      'Strategic planning and performance management',
      'Public policy and institutional reform',
      'Organizational culture and change management',
    ],
    keyAreasAr: [],
    sortOrder: 0,
  },
  {
    letter: 'R',
    titleEn: 'Strategic Relationship Building',
    descEn:
      'Strong institutions rely on strong networks. We help organizations design and manage stakeholder ecosystems, strategic partnerships, and collaborative platforms that strengthen influence and expand impact.',
    keyAreasEn: [
      'Stakeholder mapping and engagement strategies',
      'Partnership development and alliance building',
      'Institutional networking initiatives',
      'Multi-sector collaboration platforms',
    ],
    keyAreasAr: [],
    sortOrder: 1,
  },
  {
    letter: 'A',
    titleEn: 'Institutional Assessment',
    descEn:
      'Effective transformation begins with a clear understanding of current performance. We conduct comprehensive institutional assessments that evaluate governance frameworks, operational effectiveness, policy alignment, and organizational capacity. Our approach combines data analysis, stakeholder consultation, and international best practices to deliver actionable insights.',
    keyAreasEn: [
      'Institutional performance evaluation',
      'Governance and compliance reviews',
      'Policy and program evaluation',
      'Organizational diagnostics',
    ],
    keyAreasAr: [],
    sortOrder: 2,
  },
  {
    letter: 'C',
    titleEn: 'Strategic Communication',
    descEn:
      'Communication is a powerful driver of institutional influence and public trust. We design integrated communication strategies that align messaging with institutional objectives and stakeholder expectations.',
    keyAreasEn: [
      'Communication strategy design',
      'Public awareness campaigns',
      'Media engagement frameworks',
      'Institutional branding and messaging',
    ],
    keyAreasAr: [],
    sortOrder: 3,
  },
  {
    letter: 'E',
    titleEn: 'Strategic Event Management',
    descEn:
      'We design and manage high-level conferences, institutional forums, and national initiatives that facilitate dialogue, collaboration, and knowledge exchange. Our approach ensures that events are not merely gatherings, but strategic platforms that support institutional objectives and policy dialogue.',
    keyAreasEn: [
      'Conference and summit organization',
      'Institutional forums and policy dialogues',
      'Training workshops and knowledge events',
      'End-to-end event management',
    ],
    keyAreasAr: [],
    sortOrder: 4,
  },
];

// ── OFFICES ──────────────────────────────────────────────────────────────────
// From src/app/[locale]/contact/page.js offices[] (English).
const offices = [
  {
    cityEn: 'MUHARRAQ OFFICE',
    addressEn: ['Flat 11, Building 1649', 'Road 512, Block 205', 'Muharraq', 'Kingdom of Bahrain'].join(', '),
    mapsUrl:
      'https://www.google.com/maps/place/ProEx+for+Consulting+and+Business+Development+%D8%A8%D8%B1%D9%88%D8%A5%D9%83%D8%B3+%D9%84%D9%84%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA+%D9%88%D8%AA%D8%B7%D9%88%D9%8A%D8%B1+%D8%A7%D9%84%D8%A7%D8%B9%D9%85%D8%A7%D9%84%E2%80%AD/@26.2619781,50.6139213,20.39z/data=!4m10!1m2!2m1!1sFlat+11,+Building+1649,+Road+512,+Block+205,+Muharraq,+Kingdom+of+Bahrain!3m6!1s0x3e49a7f4669f068f:0xfcd301862635a838!8m2!3d26.2620262!4d50.6142706!15sCklGbGF0IDExLCBCdWlsZGluZyAxNjQ5LCBSb2FkIDUxMiwgQmxvY2sgMjA1LCBNdWhhcnJhcSwgS2luZ2RvbSBvZiBCYWhyYWlukgEaaHVtYW5fcmVzc291cmNlX2NvbnN1bHRpbmfgAQA!16s%2Fg%2F11x73_d5h0?entry=ttu&g_ep=EgoyMDI2MDMyMy4xIKXMDSoASAFQAw%3D%3D',
    phone: null,
    email: null,
    sortOrder: 0,
  },
];

// ── POSTS (Media articles) ───────────────────────────────────────────────────
// From messages/en.json media.articles[]. featuredImage left null (source uses
// generic hotlinked stock images decided at render time).
const posts = [
  {
    titleEn: 'The Future of Corporate Governance in the GCC',
    excerptEn: 'How regional enterprises are upgrading board structures and audit frameworks to meet new international standards.',
    contentEn: 'How regional enterprises are upgrading board structures and audit frameworks to meet new international standards.',
  },
  {
    titleEn: 'Human Capital at the Heart of Transformation',
    excerptEn: 'Why people strategy is the single greatest lever for sustainable business transformation in rapidly evolving markets.',
    contentEn: 'Why people strategy is the single greatest lever for sustainable business transformation in rapidly evolving markets.',
  },
  {
    titleEn: 'Digital Maturity: Where Saudi Enterprises Stand Today',
    excerptEn: 'A ProEx benchmarking report assessing digital readiness across key sectors including financial services, healthcare, and retail.',
    contentEn: 'A ProEx benchmarking report assessing digital readiness across key sectors including financial services, healthcare, and retail.',
  },
].map((p) => ({
  slug: slugify(p.titleEn),
  titleEn: p.titleEn,
  excerptEn: p.excerptEn,
  contentEn: p.contentEn,
  author: 'ProEx',
  status: 'PUBLISHED',
  featuredImage: null,
  publishedAt: new Date(),
}));

// ── JOBS ─────────────────────────────────────────────────────────────────────
// messages/en.json careers.positions is empty. The two rows below are SAMPLE
// openings so the Careers page renders — the client can delete or replace them
// from the admin at any time.
const jobs = [
  {
    titleEn: 'Management Consultant',
    department: 'Consulting',
    type: 'JOB_OPENING',
    descriptionEn:
      'Join our advisory team to help government, private sector, and civil society clients translate strategy into measurable institutional outcomes. You will lead assessments, design operating models and procedural frameworks, and support the delivery of capacity-building and transformation engagements across the GCC.',
    requirementsEn:
      "Bachelor's degree in Business, Public Administration, or a related field (Master's preferred); 3+ years of management consulting or institutional development experience; strong analytical, facilitation, and report-writing skills; fluency in English and Arabic.",
    location: 'Manama, Bahrain',
    status: 'ACTIVE',
  },
  {
    titleEn: 'Business Development Manager',
    department: 'Business Development',
    type: 'JOB_OPENING',
    descriptionEn:
      'Drive ProEx growth by identifying new opportunities, building strategic partnerships, and managing client relationships across the region. You will lead proposal development, represent the firm at institutional forums, and help expand our footprint in the government and private sectors.',
    requirementsEn:
      "Bachelor's degree in Business, Marketing, or a related field; 5+ years of business development experience, ideally within professional services or consulting; proven track record of building partnerships and winning engagements; excellent communication and negotiation skills in English and Arabic.",
    location: 'Manama, Bahrain',
    status: 'ACTIVE',
  },
].map((j) => ({ ...j, slug: slugify(j.titleEn) }));

// ── PAGES (marketing page hero + intro content) ──────────────────────────────
const pages = [
  {
    slug: 'home',
    heroBadgeEn: 'ProEx Advisory',
    heroTitleEn: 'Empowering Institutions.\nDriving Sustainable Impact.',
    heroSubtitleEn:
      'We partner with government entities, private sector leaders, and civil society organizations to design and deliver transformative institutional solutions.',
    introEn: [
      'ProEx for Consulting and Business Development w.L.L is a specialized consulting firm delivering integrated solutions in institutional development, governance, and strategic transformation.',
      'We combine regional expertise with practical consulting experience to support organizations across government, private sector, and civil society in navigating complex challenges and achieving sustainable impact.',
      'Our work is driven by a commitment to strengthening institutions, enhancing performance, and enabling long-term development outcomes. Through our integrated TRACE methodology, we design and deliver solutions that connect strategy with execution—transforming vision into measurable results.',
    ].join('\n\n'),
    heroImageUrl: `${UNSPLASH}1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80`,
  },
  {
    slug: 'who-we-are',
    heroBadgeEn: null,
    heroTitleEn: 'Strategic Partners for\nInstitutional Transformation',
    heroSubtitleEn:
      'Combining rigorous analysis, practical implementation, and sustainable impact frameworks.',
    introEn: [
      'At ProEx for Consulting and Business Development w.L.L, we are strategic partners for institutions seeking transformation, sustainability, and institutional excellence.',
      'Founded in the Kingdom of Bahrain with a regional outlook, ProEx was established to bridge the gap between strategy and execution — ensuring that institutional objectives are translated into measurable outcomes.',
      'We combine rigorous analysis, practical implementation, and sustainable impact frameworks, enabling organizations to navigate complexity with confidence and clarity.',
      'We pride ourselves in our capacity to work across sectors — government, private, and civil society — delivering context-aware solutions that drive performance, enhance governance, and strengthen stakeholder ecosystems.',
    ].join('\n\n'),
    heroImageUrl: `${UNSPLASH}1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80`,
  },
  {
    slug: 'services',
    heroBadgeEn: 'Our Services',
    heroTitleEn: 'Our Services',
    heroSubtitleEn:
      'At ProEx for Consulting and Business Development w.L.L, we deliver integrated consulting solutions designed to strengthen institutions, enhance governance, and enable sustainable impact.',
    introEn:
      'At ProEx for Consulting and Business Development w.L.L, we deliver integrated consulting solutions designed to strengthen institutions, enhance governance, and enable sustainable impact.\n\nOur services are structured around the TRACE model, an integrated framework that combines strategic analysis, capacity development, stakeholder engagement, communication strategy, and high-level event management.\n\nThrough this model, we support organizations in translating vision into execution and strategy into measurable results.',
    heroImageUrl: `${UNSPLASH}1568992687947-868a62a9f521?auto=format&fit=crop&w=2000&q=80`,
  },
  {
    slug: 'media',
    heroBadgeEn: 'Media & Knowledge',
    heroTitleEn: 'Media & News',
    heroSubtitleEn: 'Insights, updates and thought leadership from the ProEx team.',
    introEn: null,
    heroImageUrl: `${UNSPLASH}1504711434969-e33886168f5c?auto=format&fit=crop&w=2000&q=80`,
  },
  {
    slug: 'careers',
    heroBadgeEn: null,
    heroTitleEn: 'Careers at ProEx',
    heroSubtitleEn:
      'At ProEx for Consulting and Business Development w.L.L, we are always looking for talented professionals who are passionate about institutional development, governance, and strategic consulting.',
    introEn:
      'We believe that our people are our greatest asset, and we are committed to building a collaborative environment where ideas thrive and expertise grows.',
    heroImageUrl: `${UNSPLASH}1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80`,
  },
  {
    slug: 'contact',
    heroBadgeEn: null,
    heroTitleEn: 'Contact Us',
    heroSubtitleEn:
      'Connect with our strategic advisors to discuss how we can accelerate your enterprise growth.',
    introEn:
      'Whether you have a strategic inquiry or want to explore partnership opportunities, our team is ready to assist you.',
    heroImageUrl: '/bahrain-map-bg.png',
  },
  {
    slug: 'our-work',
    heroBadgeEn: 'Selected Projects',
    heroTitleEn: 'Our Work',
    heroSubtitleEn:
      'At ProEx for Consulting and Business Development w.L.L, our work focuses on delivering practical solutions that generate measurable institutional impact. Our projects span government institutions, private sector organizations, and civil society initiatives.',
    introEn:
      'Our projects reflect our commitment to strengthening governance, building institutional capacity, and enabling sustainable development across the region.',
    heroImageUrl: `${UNSPLASH}1557426272-fc759fdf7a8d?auto=format&fit=crop&w=2000&q=80`,
  },
  {
    slug: 'our-clients',
    heroBadgeEn: 'Our Clients',
    heroTitleEn: 'Success Partners',
    heroSubtitleEn:
      'We take pride in partnering with leading institutions that share our vision for driving institutional excellence and sustainable impact across various sectors.',
    introEn: null,
    heroImageUrl: `${UNSPLASH}1557426272-fc759fdf7a8d?auto=format&fit=crop&w=2000&q=80`,
  },
  {
    slug: 'leadership-team',
    heroBadgeEn: 'ProEx',
    heroTitleEn: 'Leadership Team',
    heroSubtitleEn: null,
    introEn: null,
    // Source hero uses a solid dark background (no image asset).
    heroImageUrl: null,
  },
];

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@proex.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      'SEED_ADMIN_PASSWORD environment variable is required to seed the admin user. ' +
        'Export it before running the seed (e.g. SEED_ADMIN_PASSWORD=... node prisma/seed.js).'
    );
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Wipe content tables (FK-safe: Application depends on Job — delete it first).
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.client.deleteMany();
  await prisma.post.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.servicePillar.deleteMany();
  await prisma.principle.deleteMany();
  await prisma.office.deleteMany();

  // Recreate content.
  const projectRes = await prisma.project.createMany({ data: projects });
  const teamRes = await prisma.teamMember.createMany({ data: teamMembers });
  const clientRes = await prisma.client.createMany({ data: clients });
  const postRes = await prisma.post.createMany({ data: posts });
  const statRes = await prisma.stat.createMany({ data: stats });
  const sectorRes = await prisma.sector.createMany({ data: sectors });
  const pillarRes = await prisma.servicePillar.createMany({ data: servicePillars });
  const principleRes = await prisma.principle.createMany({ data: principles });
  const officeRes = await prisma.office.createMany({ data: offices });
  const jobRes = await prisma.job.createMany({ data: jobs });

  // Pages — upsert by slug.
  for (const page of pages) {
    const { slug, ...rest } = page;
    await prisma.page.upsert({ where: { slug }, update: rest, create: page });
  }

  // Settings singleton — upsert by id 1.
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {
      companyName: 'ProEx',
      adminEmail,
      timezone: 'Asia/Bahrain',
      defaultLanguage: 'en',
      sessionTimeoutMins: 30,
      maxLoginAttempts: 5,
      emailNotifications: true,
    },
    create: {
      id: 1,
      companyName: 'ProEx',
      adminEmail,
      timezone: 'Asia/Bahrain',
      defaultLanguage: 'en',
      sessionTimeoutMins: 30,
      maxLoginAttempts: 5,
      emailNotifications: true,
    },
  });

  // Admin user — upsert by email.
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Administrator',
      username: 'admin',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    create: {
      name: 'Administrator',
      username: 'admin',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(
    `Seeded: ${projectRes.count} projects, ${teamRes.count} team, ${clientRes.count} clients, ` +
      `${principleRes.count} principles, ${statRes.count} stats, ${sectorRes.count} sectors, ` +
      `${pillarRes.count} service pillars, ${officeRes.count} offices, ${postRes.count} posts, ` +
      `${jobRes.count} jobs (sample), ${pages.length} pages, 1 setting, 1 admin user.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
