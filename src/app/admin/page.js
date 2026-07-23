import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';

// Server component. Middleware already guarantees the visitor is signed in;
// we re-read the session here (defense in depth) to greet the user.
export default async function AdminHome() {
  const session = await auth();

  // A few live counts so the dashboard shows the DB is really connected.
  const [projects, team, clients, posts, jobs, messages, applications] =
    await Promise.all([
      prisma.project.count(),
      prisma.teamMember.count(),
      prisma.client.count(),
      prisma.post.count(),
      prisma.job.count(),
      prisma.message.count(),
      prisma.application.count(),
    ]);

  const stats = [
    { label: 'Projects', value: projects },
    { label: 'Team', value: team },
    { label: 'Clients', value: clients },
    { label: 'Posts', value: posts },
    { label: 'Jobs', value: jobs },
    { label: 'Messages', value: messages },
    { label: 'Applications', value: applications },
  ];

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
            Pro<span style={{ color: '#3AACAD' }}>Ex</span> Admin
          </h1>
          <p style={{ margin: '6px 0 0', color: '#6B7A8D', fontSize: 14 }}>
            Signed in as {session?.user?.name} ({session?.user?.role})
          </p>
        </div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/admin/login' });
          }}
        >
          <button
            type="submit"
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: '#E05B5B',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </form>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 16,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#161C22',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '20px',
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#6B7A8D', marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: '#6B7A8D', fontSize: 13, marginTop: 32 }}>
        Full content management (Projects, Team, Clients, Posts, Jobs, inboxes,
        page editors, settings) is being built section by section.
      </p>
    </main>
  );
}
