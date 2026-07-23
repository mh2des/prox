import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [projects, team, clients, posts, jobs, messages, applications] =
    await Promise.all([
      prisma.project.count(),
      prisma.teamMember.count(),
      prisma.client.count(),
      prisma.post.count(),
      prisma.job.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.application.count({ where: { status: 'NEW' } }),
    ]);

  const stats = [
    { label: 'Projects', value: projects, href: '/admin/projects' },
    { label: 'Team', value: team },
    { label: 'Clients', value: clients },
    { label: 'Posts', value: posts },
    { label: 'Jobs', value: jobs },
    { label: 'Unread messages', value: messages },
    { label: 'New applications', value: applications },
  ];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Overview of your content.</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => {
          const inner = (
            <>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </>
          );
          return s.href ? (
            <Link
              key={s.label}
              href={s.href}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              {inner}
            </Link>
          ) : (
            <div key={s.label} className="card">
              {inner}
            </div>
          );
        })}
      </div>
    </>
  );
}
