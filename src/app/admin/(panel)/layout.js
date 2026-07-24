import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import Sidebar from './Sidebar';
import FlashBanner from '@/components/admin/FlashBanner';
import AdminLangToggle from '@/components/admin/AdminLangToggle';
import { getAdminT } from '@/lib/admin-i18n';

// Shell for all authenticated admin pages (everything except /admin/login).
// Route group "(panel)" keeps the URLs clean (/admin, /admin/projects, …).
export default async function PanelLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login'); // defense in depth (middleware also gates)

  const { locale, t } = getAdminT();

  return (
    <div className="admin-shell">
      <Sidebar locale={locale} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div />
          <div className="admin-user">
            <span>
              {session.user.name} · {session.user.role}
            </span>
            <AdminLangToggle locale={locale} label={t('languageName')} />
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
              }}
            >
              <button type="submit" className="btn btn-ghost btn-sm">
                {t('signOut')}
              </button>
            </form>
          </div>
        </div>
        <div className="admin-content">
          <Suspense fallback={null}>
            <FlashBanner locale={locale} />
          </Suspense>
          {children}
        </div>
      </div>
    </div>
  );
}
