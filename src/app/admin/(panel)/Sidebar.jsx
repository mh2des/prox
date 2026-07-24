'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { makeT } from '@/lib/admin-dict';
import Icon from './icons';

const groups = [
  { items: [{ href: '/admin', key: 'nav.dashboard', icon: 'dashboard' }] },
  {
    titleKey: 'nav.group.content',
    items: [
      { href: '/admin/projects', key: 'nav.projects', icon: 'briefcase' },
      { href: '/admin/team', key: 'nav.team', icon: 'users' },
      { href: '/admin/clients', key: 'nav.clients', icon: 'building' },
      { href: '/admin/posts', key: 'nav.posts', icon: 'newspaper' },
    ],
  },
  {
    titleKey: 'nav.group.pages',
    items: [
      { href: '/admin/pages', key: 'nav.pages', icon: 'fileText' },
      { href: '/admin/principles', key: 'nav.principles', icon: 'compass' },
      { href: '/admin/stats', key: 'nav.stats', icon: 'barChart' },
      { href: '/admin/sectors', key: 'nav.sectors', icon: 'layers' },
      { href: '/admin/pillars', key: 'nav.pillars', icon: 'grid' },
      { href: '/admin/offices', key: 'nav.offices', icon: 'mapPin' },
    ],
  },
  {
    titleKey: 'nav.group.inbox',
    items: [
      { href: '/admin/messages', key: 'nav.messages', icon: 'mail' },
      { href: '/admin/jobs', key: 'nav.jobs', icon: 'megaphone' },
      { href: '/admin/applications', key: 'nav.applications', icon: 'clipboard' },
    ],
  },
];

// First letters of the first two words, uppercased. Falls back to "PX".
function initials(name) {
  if (!name) return 'PX';
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return (letters || 'PX').toUpperCase();
}

export default function Sidebar({ locale = 'en', user, signOutSlot }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = makeT(locale);
  const asideRef = useRef(null);
  const toggleRef = useRef(null);
  const closeRef = useRef(null);

  // Explicit close (Escape / overlay / × button) returns focus to the toggle.
  const closeDrawer = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close the drawer whenever the route changes (a nav item was tapped). No
  // focus restore here — the user has navigated to a new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the mobile drawer is open: move focus in, lock scroll, close on
  // Escape, and trap Tab inside the drawer (WAI-ARIA dialog pattern).
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = asideRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, closeDrawer]);

  const settingsActive = pathname.startsWith('/admin/settings');

  return (
    <>
      {/* Mobile-only hamburger; hidden on desktop via CSS. */}
      <button
        ref={toggleRef}
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
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      <aside
        ref={asideRef}
        className={`admin-sidebar${open ? ' open' : ''}`}
        role={open ? 'dialog' : undefined}
        aria-modal={open ? 'true' : undefined}
        aria-label={open ? t('openMenu') : undefined}
      >
        <div className="admin-sidebar-head">
          <div className="admin-logo">
            Pro<span>Ex</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="admin-drawer-close"
            aria-label={t('closeMenu')}
            onClick={closeDrawer}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="admin-nav">
          {groups.map((g, i) => (
            <div className="admin-nav-cluster" key={i}>
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
                    <Icon name={item.icon} size={18} />
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Pinned account footer: identity + settings + sign-out. */}
        <div className="admin-sidebar-foot">
          <Link
            href="/admin/settings"
            className={`admin-account${settingsActive ? ' active' : ''}`}
          >
            <span className="admin-avatar">{initials(user?.name)}</span>
            <span className="admin-account-meta">
              <span className="admin-account-name">{user?.name || t('account.name')}</span>
              <span className="admin-account-role">{user?.role || t('account.role')}</span>
            </span>
            <Icon name="settings" size={18} className="admin-account-gear" />
          </Link>
          {signOutSlot}
        </div>
      </aside>
    </>
  );
}
