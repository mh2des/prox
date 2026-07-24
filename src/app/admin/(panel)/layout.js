import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import Sidebar from './Sidebar';
import Icon from './icons';
import FlashBanner from '@/components/admin/FlashBanner';
import AdminLangToggle from '@/components/admin/AdminLangToggle';
import { getAdminT } from '@/lib/admin-i18n';

// Shell for all authenticated admin pages (everything except /admin/login).
// Route group "(panel)" keeps the URLs clean (/admin, /admin/projects, …).
export default async function PanelLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login'); // defense in depth (middleware also gates)

  const { locale, t } = getAdminT();

  // Sign-out lives in the sidebar footer now; render its server form here and
  // pass it down as a slot (Sidebar is a client component).
  const signOutSlot = (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/admin/login' });
      }}
    >
      <button type="submit" className="admin-signout">
        <Icon name="logout" size={16} dir />
        {t('signOut')}
      </button>
    </form>
  );

  return (
    <div className="admin-shell">
      <Sidebar locale={locale} user={session.user} signOutSlot={signOutSlot} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div />
          <div className="admin-user">
            <AdminLangToggle locale={locale} label={t('languageName')} />
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
