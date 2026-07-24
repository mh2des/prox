import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { getAdminT } from '@/lib/admin-i18n';
import { formatDate, formatDateTime, fmtNum, greetKey, timeAgo } from '@/lib/format';
import Icon from './icons';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { locale, t } = getAdminT();
  const session = await auth();
  const firstName = (session?.user?.name || t('account.name')).split(' ')[0];

  const [
    projects,
    team,
    clients,
    jobs,
    postsPublished,
    postsDraft,
    unreadMessages,
    newApplications,
    projMissingAr,
    postMissingAr,
    teamMissingAr,
    mRows,
    aRows,
    pRows,
    prRows,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.teamMember.count(),
    prisma.client.count(),
    prisma.job.count({ where: { status: 'ACTIVE' } }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.message.count({ where: { read: false } }),
    prisma.application.count({ where: { status: 'NEW' } }),
    prisma.project.count({ where: { OR: [{ titleAr: null }, { titleAr: '' }] } }),
    prisma.post.count({ where: { OR: [{ titleAr: null }, { titleAr: '' }] } }),
    // TeamMember has no nameAr — position is the translatable identity field.
    prisma.teamMember.count({ where: { OR: [{ positionAr: null }, { positionAr: '' }] } }),
    prisma.message.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, name: true },
    }),
    prisma.application.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, fullName: true, job: { select: { titleEn: true } } },
    }),
    prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, titleEn: true },
    }),
    prisma.project.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, titleEn: true },
    }),
  ]);

  const postsTotal = postsPublished + postsDraft;

  // ── Translation health (ratio of content rows that have Arabic) ──
  const missingArTotal = projMissingAr + postMissingAr + teamMissingAr;
  const arTotalRows = projects + postsTotal + team;
  const pct = arTotalRows
    ? Math.round(((arTotalRows - missingArTotal) / arTotalRows) * 100)
    : 100;
  const ringColor =
    pct >= 90 ? 'var(--a-green)' : pct >= 60 ? 'var(--a-yellow)' : 'var(--a-red)';

  // ── Publishing donut ──
  const donutTotal = postsTotal || 1;
  const p1 = Math.round((postsPublished / donutTotal) * 100);

  // ── KPI cards ──
  const kpis = [
    { label: t('dash.projects'), value: projects, href: '/admin/projects', icon: 'briefcase', sub: t('dash.ctx.portfolio') },
    { label: t('dash.team'), value: team, href: '/admin/team', icon: 'users', sub: t('dash.ctx.team') },
    { label: t('dash.clients'), value: clients, href: '/admin/clients', icon: 'building', sub: t('dash.ctx.clients') },
    {
      label: t('dash.posts'),
      value: postsTotal,
      href: '/admin/posts',
      icon: 'newspaper',
      sub: postsTotal
        ? t('kpi.postsSplit')
            .replace('{pub}', fmtNum(postsPublished, locale))
            .replace('{draft}', fmtNum(postsDraft, locale))
        : t('kpi.postsEmpty'),
    },
    { label: t('dash.jobs'), value: jobs, href: '/admin/jobs', icon: 'megaphone', sub: t('dash.ctx.jobs') },
  ];

  // ── Merged recent-activity feed ──
  const feed = [
    ...mRows.map((r) => ({
      id: 'm' + r.id,
      createdAt: r.createdAt,
      icon: 'mail',
      tone: 'red',
      href: '/admin/messages',
      text: (
        <>
          <span>{t('act.message')} </span>
          <bdi>{r.name}</bdi>
        </>
      ),
    })),
    ...aRows.map((r) => ({
      id: 'a' + r.id,
      createdAt: r.createdAt,
      icon: 'clipboard',
      tone: 'yellow',
      href: '/admin/applications',
      text: (
        <>
          <bdi>{r.fullName}</bdi>
          <span> {t('act.applied')} </span>
          <bdi>{r.job?.titleEn ?? ''}</bdi>
        </>
      ),
    })),
    ...pRows.map((r) => ({
      id: 'p' + r.id,
      createdAt: r.createdAt,
      icon: 'newspaper',
      tone: 'teal',
      href: '/admin/posts',
      text: (
        <>
          <span>{t('act.post')} </span>
          <bdi>{r.titleEn}</bdi>
        </>
      ),
    })),
    ...prRows.map((r) => ({
      id: 'r' + r.id,
      createdAt: r.createdAt,
      icon: 'briefcase',
      tone: 'teal',
      href: '/admin/projects',
      text: (
        <>
          <span>{t('act.project')} </span>
          <bdi>{r.titleEn}</bdi>
        </>
      ),
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 7);

  return (
    <div className="dash">
      {/* Greeting */}
      <header className="dash-greet">
        <h1 className="dash-greet__title">
          {t(greetKey())}, <bdi>{firstName}</bdi>
        </h1>
        <p className="dash-greet__sub">
          {t('dash.greetSub')} · {formatDate(new Date(), locale)}
        </p>
      </header>

      {/* Needs attention */}
      <section className="dash-section">
        <p className="dash-eyebrow">{t('dash.needsAttention')}</p>
        <div className="attn-grid">
          <Link
            href="/admin/messages"
            className={`attn${unreadMessages > 0 ? ' attn--alert attn--red' : ' attn--clear'}`}
          >
            <span className="attn__icon">
              <Icon name={unreadMessages > 0 ? 'mail' : 'check'} size={20} />
            </span>
            <div className="attn__body">
              <span className="attn__label">{t('dash.unread')}</span>
              <span className="attn__value tnum" dir="ltr">
                {fmtNum(unreadMessages, locale)}
              </span>
              <span className="attn__sub">
                {unreadMessages > 0 ? t('dash.awaitingReply') : t('dash.inboxZero')}
              </span>
            </div>
            {unreadMessages > 0 && <span className="attn__dot" aria-hidden="true" />}
          </Link>

          <Link
            href="/admin/applications"
            className={`attn${newApplications > 0 ? ' attn--alert attn--yellow' : ' attn--clear'}`}
          >
            <span className="attn__icon">
              <Icon name={newApplications > 0 ? 'clipboard' : 'check'} size={20} />
            </span>
            <div className="attn__body">
              <span className="attn__label">{t('dash.newApps')}</span>
              <span className="attn__value tnum" dir="ltr">
                {fmtNum(newApplications, locale)}
              </span>
              <span className="attn__sub">
                {newApplications > 0 ? t('dash.needsReview') : t('dash.allReviewed')}
              </span>
            </div>
            {newApplications > 0 && <span className="attn__dot" aria-hidden="true" />}
          </Link>
        </div>
      </section>

      {/* Quick actions */}
      <section className="dash-section">
        <div className="quick-actions">
          <Link href="/admin/posts/new" className="btn btn-primary">
            <Icon name="plus" size={18} />
            {t('dash.action.newPost')}
          </Link>
          <Link href="/admin/projects/new" className="btn btn-ghost">
            <Icon name="briefcase" size={18} />
            {t('dash.action.newProject')}
          </Link>
          <Link href="/admin/team/new" className="btn btn-ghost">
            <Icon name="userPlus" size={18} />
            {t('dash.action.newTeam')}
          </Link>
          <Link href="/admin/clients/new" className="btn btn-ghost">
            <Icon name="building" size={18} />
            {t('dash.action.newClient')}
          </Link>
        </div>
      </section>

      {/* Overview KPIs */}
      <section className="dash-section">
        <p className="dash-eyebrow">{t('dash.overview')}</p>
        <div className="kpi-grid">
          {kpis.map((c) => (
            <Link key={c.label} href={c.href} className="kpi">
              <div className="kpi__top">
                <span className="kpi__icon">
                  <Icon name={c.icon} size={18} />
                </span>
                <span className="kpi__label">{c.label}</span>
              </div>
              <div className="kpi__value tnum" dir="ltr">
                {fmtNum(c.value, locale)}
              </div>
              <div className="kpi__sub">{c.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="dash-section">
        <div className="insight-grid">
          {/* Translation health ring */}
          <article className="insight">
            <div className="insight__head">
              <span className="kpi__icon">
                <Icon name="languages" size={18} />
              </span>
              <span className="kpi__label">{t('dash.translationHealth')}</span>
            </div>
            <div className="insight__ringrow">
              <svg
                className="ring"
                viewBox="0 0 42 42"
                width="96"
                height="96"
                role="img"
                aria-label={`${t('dash.translationHealth')} ${pct}%`}
              >
                <circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--a-bg4)" strokeWidth="3.2" />
                <circle
                  cx="21"
                  cy="21"
                  r="15.9155"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeDashoffset="25"
                />
                <text x="21" y="21" textAnchor="middle" dominantBaseline="central" fill="var(--a-text)" fontSize="9" fontWeight="700">
                  {pct}%
                </text>
              </svg>
              <div className="insight__meta">
                <p className="insight__big tnum" dir="ltr">
                  {fmtNum(arTotalRows - missingArTotal, locale)}/{fmtNum(arTotalRows, locale)}
                </p>
                {missingArTotal > 0 ? (
                  <Link href="/admin/posts" className="insight-cta">
                    {fmtNum(missingArTotal, locale)} {t('dash.missingArabic')}
                    <Icon name="arrowRight" size={14} dir />
                  </Link>
                ) : (
                  <span className="insight-ok">
                    <Icon name="check" size={14} />
                    {t('dash.fullyBilingual')}
                  </span>
                )}
              </div>
            </div>
          </article>

          {/* Publishing donut */}
          <article className="insight">
            <div className="insight__head">
              <span className="kpi__icon">
                <Icon name="newspaper" size={18} />
              </span>
              <span className="kpi__label">{t('dash.publishing')}</span>
            </div>
            <div className="insight__ringrow">
              <svg
                viewBox="0 0 42 42"
                width="96"
                height="96"
                role="img"
                aria-label={`${postsPublished} ${t('dash.published')}, ${postsDraft} ${t('dash.draft')}`}
              >
                <circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--a-bg3)" strokeWidth="4" />
                <circle
                  cx="21"
                  cy="21"
                  r="15.9155"
                  fill="none"
                  stroke="var(--a-green)"
                  strokeWidth="4"
                  strokeDasharray={`${p1} ${100 - p1}`}
                  strokeDashoffset="25"
                />
                <circle
                  cx="21"
                  cy="21"
                  r="15.9155"
                  fill="none"
                  stroke="var(--a-yellow)"
                  strokeWidth="4"
                  strokeDasharray={`${100 - p1} ${p1}`}
                  strokeDashoffset={100 - p1 + 25}
                />
                <text x="21" y="19" textAnchor="middle" fill="var(--a-text)" fontSize="8" fontWeight="700">
                  {fmtNum(postsTotal, locale)}
                </text>
                <text x="21" y="25.5" textAnchor="middle" fill="var(--a-muted)" fontSize="3.4">
                  {t('dash.postsTotal')}
                </text>
              </svg>
              <ul className="legend">
                <li>
                  <span className="legend-dot" style={{ '--seg': 'var(--a-green)' }} />
                  {t('dash.published')} <b className="tnum">{fmtNum(postsPublished, locale)}</b>
                </li>
                <li>
                  <span className="legend-dot" style={{ '--seg': 'var(--a-yellow)' }} />
                  {t('dash.draft')} <b className="tnum">{fmtNum(postsDraft, locale)}</b>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* Recent activity */}
      <section className="dash-section">
        <p className="dash-eyebrow">{t('dash.recentActivity')}</p>
        {feed.length === 0 ? (
          <div className="dash-empty">
            <Icon name="clock" size={22} />
            <p className="dash-empty__title">{t('dash.noActivity')}</p>
            <p className="kpi__sub">{t('dash.noActivitySub')}</p>
          </div>
        ) : (
          <ul className="activity">
            {feed.map((r) => (
              <li key={r.id}>
                <Link href={r.href} className="activity__row" title={formatDateTime(r.createdAt, locale)}>
                  <span className={`activity__icon activity__icon--${r.tone}`}>
                    <Icon name={r.icon} size={16} />
                  </span>
                  <span className="activity__text">{r.text}</span>
                  <time className="activity__time tnum" dateTime={new Date(r.createdAt).toISOString()}>
                    {timeAgo(r.createdAt, locale, t)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
