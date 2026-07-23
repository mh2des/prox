import { prisma } from './prisma';

// Locale-aware field pickers for the per-locale (…En / …Ar) columns.
// Arabic falls back to English when the Arabic value is empty.
function pick(row, base, locale) {
  const ar = row[base + 'Ar'];
  const en = row[base + 'En'];
  return locale === 'ar' ? ar || en || '' : en ?? ar ?? '';
}
function pickArr(row, base, locale) {
  const ar = row[base + 'Ar'];
  const en = row[base + 'En'];
  return locale === 'ar' && ar && ar.length ? ar : en || [];
}
function paragraphs(text) {
  return (text || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

// ── Page hero / intro ──
export async function getPage(slug, locale) {
  const p = await prisma.page.findUnique({ where: { slug } });
  if (!p) return null;
  return {
    heroBadge: pick(p, 'heroBadge', locale),
    heroTitle: pick(p, 'heroTitle', locale),
    heroSubtitle: pick(p, 'heroSubtitle', locale),
    intro: pick(p, 'intro', locale),
    introParagraphs: paragraphs(pick(p, 'intro', locale)),
    heroImageUrl: p.heroImageUrl || null,
  };
}

// ── Our Work ──
export async function getProjects(locale) {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: pick(p, 'title', locale),
    paragraphs: paragraphs(pick(p, 'desc', locale)),
    client: p.client,
    sector: p.sector,
    year: p.year,
    location: p.location,
    image: p.imageUrl,
  }));
}

// ── Our Clients ──
export async function getClients(locale) {
  const rows = await prisma.client.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    desc: pick(c, 'desc', locale),
    website: c.website,
    image: c.logoUrl,
  }));
}

// ── Leadership / Team ──
export async function getTeam(locale) {
  const rows = await prisma.teamMember.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return rows.map((m) => {
    const position = pick(m, 'position', locale);
    // The admin stores position as "Title — Subtitle" and experience items as
    // "Role — Description"; split them back for the presentation components.
    const [title, subtitle] = splitDash(position);
    const experience = pickArr(m, 'experience', locale).map((line) => {
      const [role, desc] = splitDash(line);
      return { role, desc: desc || '' };
    });
    return {
      id: m.id,
      name: m.name,
      title,
      subtitle: subtitle || '',
      position,
      bio: pick(m, 'bio', locale),
      expertise: pickArr(m, 'expertise', locale),
      experience,
      image: m.photoUrl,
      linkedin: m.linkedin,
    };
  });
}
function splitDash(s) {
  if (!s) return ['', ''];
  const parts = s.split(/\s[—–-]\s/);
  return [parts[0].trim(), parts.slice(1).join(' — ').trim()];
}

// ── Vision / Mission / Values ──
export async function getPrinciples(locale) {
  const rows = await prisma.principle.findMany({
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
  });
  const map = (r) => ({
    id: r.id,
    title: pick(r, 'title', locale),
    text: pick(r, 'text', locale),
    icon: r.icon,
  });
  return {
    vision: rows.filter((r) => r.type === 'VISION').map(map)[0] || null,
    mission: rows.filter((r) => r.type === 'MISSION').map(map)[0] || null,
    values: rows.filter((r) => r.type === 'VALUE').map(map),
  };
}

// ── Homepage stats ──
export async function getStats(locale) {
  const rows = await prisma.stat.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((s) => ({ id: s.id, value: pick(s, 'value', locale), label: pick(s, 'label', locale) }));
}

// ── Sectors ──
export async function getSectors(locale) {
  const rows = await prisma.sector.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((s) => ({ id: s.id, title: pick(s, 'title', locale), desc: pick(s, 'desc', locale) }));
}

// ── Service pillars (TRACE) ──
export async function getPillars(locale) {
  const rows = await prisma.servicePillar.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((p) => ({
    id: p.id,
    letter: p.letter,
    title: pick(p, 'title', locale),
    desc: pick(p, 'desc', locale),
    keyAreas: pickArr(p, 'keyAreas', locale),
  }));
}

// ── Offices ──
export async function getOffices(locale) {
  const rows = await prisma.office.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((o) => ({
    id: o.id,
    city: pick(o, 'city', locale),
    address: pick(o, 'address', locale),
    mapsUrl: o.mapsUrl,
    phone: o.phone,
    email: o.email,
  }));
}

// ── Media posts ──
export async function getPublishedPosts(locale) {
  const rows = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  });
  return rows.map((p) => ({
    slug: p.slug,
    title: pick(p, 'title', locale),
    excerpt: pick(p, 'excerpt', locale),
    author: p.author,
    featuredImage: p.featuredImage,
    publishedAt: p.publishedAt,
  }));
}
export async function getPost(slug, locale) {
  const p = await prisma.post.findUnique({ where: { slug } });
  if (!p || p.status !== 'PUBLISHED') return null;
  return {
    slug: p.slug,
    title: pick(p, 'title', locale),
    excerpt: pick(p, 'excerpt', locale),
    content: pick(p, 'content', locale),
    author: p.author,
    featuredImage: p.featuredImage,
    publishedAt: p.publishedAt,
  };
}

// ── Careers / jobs ──
export async function getActiveJobs(locale) {
  const rows = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    orderBy: [{ createdAt: 'desc' }],
  });
  return rows.map((j) => ({
    id: j.id,
    slug: j.slug,
    title: pick(j, 'title', locale),
    department: j.department,
    type: j.type,
    description: pick(j, 'description', locale),
    requirements: pick(j, 'requirements', locale),
    location: j.location,
  }));
}
