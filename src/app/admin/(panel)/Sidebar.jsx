'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { makeT } from '@/lib/admin-dict';

const groups = [
  { items: [{ href: '/admin', key: 'nav.dashboard' }] },
  {
    titleKey: 'nav.group.content',
    items: [
      { href: '/admin/projects', key: 'nav.projects' },
      { href: '/admin/team', key: 'nav.team' },
      { href: '/admin/clients', key: 'nav.clients' },
      { href: '/admin/posts', key: 'nav.posts' },
    ],
  },
  {
    titleKey: 'nav.group.pages',
    items: [
      { href: '/admin/pages', key: 'nav.pages' },
      { href: '/admin/principles', key: 'nav.principles' },
      { href: '/admin/stats', key: 'nav.stats' },
      { href: '/admin/sectors', key: 'nav.sectors' },
      { href: '/admin/pillars', key: 'nav.pillars' },
      { href: '/admin/offices', key: 'nav.offices' },
    ],
  },
  {
    titleKey: 'nav.group.inbox',
    items: [
      { href: '/admin/messages', key: 'nav.messages' },
      { href: '/admin/jobs', key: 'nav.jobs' },
      { href: '/admin/applications', key: 'nav.applications' },
    ],
  },
  {
    titleKey: 'nav.group.system',
    items: [{ href: '/admin/settings', key: 'nav.settings' }],
  },
];

export default function Sidebar({ locale = 'en' }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = makeT(locale);

  // Close the drawer whenever the route changes (a nav item was tapped).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape; lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Mobile-only hamburger; hidden on desktop via CSS. */}
      <button
        type="button"
        className="admin-mobile-toggle"
        aria-label={t('openMenu')}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">☰</span>
      </button>

      {/* Overlay behind the drawer (mobile only). */}
      {open && (
        <div
          className="admin-drawer-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div className="admin-sidebar-head">
          <div className="admin-logo">
            Pro<span>Ex</span>
          </div>
          <button
            type="button"
            className="admin-drawer-close"
            aria-label={t('closeMenu')}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="admin-nav">
          {groups.map((g, i) => (
            <div key={i}>
              {g.titleKey && <div className="admin-nav-group">{t(g.titleKey)}</div>}
              {g.items.map((item) => {
                const active =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-item${active ? ' active' : ''}`}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
