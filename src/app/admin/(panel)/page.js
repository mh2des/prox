import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [projects, team, clients, posts, jobs, unreadMessages, newApplications] =
    await Promise.all([
      prisma.project.count(),
      prisma.teamMember.count(),
      prisma.client.count(),
      prisma.post.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.message.count({ where: { read: false } }),
      prisma.application.count({ where: { status: 'NEW' } }),
    ]);

  // Actionable inbox items — surfaced first so nothing waits unseen.
  const attention = [
    { label: 'Unread messages', value: unreadMessages, href: '/admin/messages' },
    { label: 'New applications', value: newApplications, href: '/admin/applications' },
  ];

  const content = [
    { label: 'Projects', value: projects, href: '/admin/projects' },
    { label: 'Team members', value: team, href: '/admin/team' },
    { label: 'Clients', value: clients, href: '/admin/clients' },
    { label: 'Media posts', value: posts, href: '/admin/posts' },
    { label: 'Active jobs', value: jobs, href: '/admin/jobs' },
  ];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Overview of your content and inbox.</p>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {attention.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`card stat-attention${s.value > 0 ? ' has-items' : ''}`}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <div className="stat-value">
              {s.value}
              {s.value > 0 && <span className="stat-dot" aria-hidden="true" />}
            </div>
            <div className="stat-label">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="admin-nav-group" style={{ padding: '0 0 10px' }}>
        Content
      </div>
      <div className="stat-grid">
        {content.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
