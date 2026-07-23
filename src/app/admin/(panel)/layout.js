import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import Sidebar from './Sidebar';

// Shell for all authenticated admin pages (everything except /admin/login).
// Route group "(panel)" keeps the URLs clean (/admin, /admin/projects, …).
export default async function PanelLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login'); // defense in depth (middleware also gates)

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div />
          <div className="admin-user">
            <span>
              {session.user.name} · {session.user.role}
            </span>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
              }}
            >
              <button type="submit" className="btn btn-ghost btn-sm">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
