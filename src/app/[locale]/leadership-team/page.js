import InteractiveTeam from '../../../components/Team/InteractiveTeam';

// ── Leadership data ──────────────────────────────────────────
const leaders = [
  {
    name:  'Dr. Khaled Hamood Al-Azab',
    title: 'Vice President of the Arab Volunteer Union',
    subtitle: 'Expert in Strategic Planning & Institutional Capacity Building',
    image: '/leadership-team/Dr. Khaled Hamood Al-Azab   1.jpeg',
    bio: 'An accomplished consultant and academic with over 18 years of experience in management, strategic planning, and organizational development. Holding a Ph.D. in "Administration and Planning," he has spearheaded major regional initiatives in collaboration with international organizations such as the UNDP and GIZ. Dr. Al-Azab specializes in designing institutional models, conflict resolution, and developing complex procedural manuals for the third sector and government entities across the GCC and the Arab world.',
    expertise: [
      'Strategic & Operational Planning',
      'Institutional Capacity Building & Organizational Restructuring',
      'Project Management, Monitoring, Evaluation, Accountability, and Learning (MEAL)',
      'Training of Trainers (TOT) & Curriculum Design',
    ],
    experience: [
      { role: 'Vice President, Arab Volunteer Union (Bahrain)', desc: 'Leading development and training strategies at a regional level.' },
      { role: 'Consultant for GIZ & UNDP', desc: 'Executed projects on social cohesion, conflict management, and strategic roadmap development in complex environments.' },
      { role: 'Chairman, Attanweer Development Foundation (ADF)', desc: 'Directed financial and administrative operations, leading multi-disciplinary teams to achieve institutional KPIs.' },
    ],
  },
  {
    name:  'Sumair Ahmed Watani',
    title: 'Business Development & Growth Marketing Director',
    subtitle: 'Export Strategy & Supply Chain Expert',
    image: '/leadership-team/Sumair Ahmed Watani   2.png',
    bio: 'A high-impact executive with over 20 years of global experience in crafting market penetration strategies, particularly within the KSA and Bahraini markets. Specializing in transforming commercial objectives into tangible results through digital transformation and product development, he has a proven track record of driving multimillion-dollar revenue growth. He excels in navigating GCC regulatory standards and managing complex supply chains for the FMCG sector.',
    expertise: [
      'KSA & GCC Market Penetration',
      'Brand Management & Product Development',
      'Growth Marketing & Digital Strategy (SEO/SMM)',
      'Export Operations & Regulatory Compliance',
    ],
    experience: [
      { role: 'Business Development Manager (United King Foods)', desc: 'Expanded footprint to 1,000+ stores in KSA, achieving a 160% increase in regional sales.' },
      { role: 'Planning Strategy Manager (Horwath Mak)', desc: 'Provided consultancy for UAE government entities regarding organizational restructuring and KSA market integration.' },
      { role: 'Marketing Manager (Mehran Foods)', desc: 'Led market entry into KSA and Bahrain, generating $10M in revenue and securing listings with major regional retailers.' },
    ],
  },
  {
    name:  'Sami Mohammed Ali',
    title: 'Manager of Grants & Capacity Building',
    subtitle: 'International Relations & Project Management Expert',
    image: '/leadership-team/Sami Mohammed Zeinelabdein Ali   3.png',
    bio: 'A dedicated professional with extensive experience in both the public and private sectors, specializing in donor relations and grant management. He possesses strong leadership skills in managing multi-national teams and overseeing large-scale projects with budgets exceeding $55 million. Mr. Ali is an expert in formulating organizational policies and procedures, combined with high-level diplomatic negotiation skills and official simultaneous interpretation capabilities.',
    expertise: [
      'Grant System Management & Partner Capacity Assessment',
      'Strategic Initiative Development & Risk Management',
      'International Relations & Diplomatic Protocol',
      'Monitoring, Evaluation, and Learning (MEAL) for cross-border projects',
    ],
    experience: [
      { role: 'Grants & Capacity Building Manager (International Islamic Charity Organization - Kuwait)', desc: 'Developed grant processes and oversaw partner assessments across 11 international offices.' },
      { role: 'Operations Manager (IICO)', desc: 'Managed diverse project portfolios in over 50 countries with a total budget exceeding $55M.' },
      { role: 'Liaison Officer & Interpreter (UAE & Sudan Embassies \u2013 Malaysia)', desc: 'Managed official events and provided high-level protocol and translation for ministerial and presidential delegations.' },
    ],
  },
  {
    name:  'Saleh Abd El Hamid Mohamed',
    title: 'Economic & Financial Analyst',
    subtitle: 'Institutional Development & AI Integration Expert',
    image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80',
    bio: 'A distinguished Economic and Financial Analyst within the Minister\'s Office Sector at the Ministry of Finance. With a background that includes advanced diplomas in Behavioral Sciences and Artificial Intelligence, he is currently a Ph.D. candidate in Finance and Economics. He bridges the gap between deep economic theory and modern technological application, serving as an internationally accredited lecturer and a consultant for strategic policy development in government and private sectors.',
    expertise: [
      'Macro & Microeconomic Analysis and Financial Modeling',
      'Institutional Development & Strategic Planning',
      'AI Applications in Management and Economics',
      'Behavioral Sciences, Leadership, and Advanced Communication',
    ],
    experience: [
      { role: 'Ministry of Finance (Minister\'s Office Sector)', desc: 'Serving as a Financial Analyst and Institutional Developer for fiscal policies.' },
      { role: 'International Lecturer', desc: 'Delivering training programs in economics and AI for prestigious institutions including Cairo University and the League of Arab States.' },
      { role: 'Consultant, Egyptian Enterprise Center for Policy & Strategic Studies', desc: 'Prepared strategic working papers for international forums, including COP 27.' },
    ],
  },
];

export default function LeadershipTeam({ params: { locale } }) {
  const isAr = locale === 'ar';

  return (
    <div>
      <InteractiveTeam leaders={leaders} isAr={isAr} />
    </div>
  );
}
