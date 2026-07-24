'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const groups = [
  { items: [{ href: '/admin', label: 'Dashboard' }] },
  {
    title: 'Content',
    items: [
      { href: '/admin/projects', label: 'Our Work' },
      { href: '/admin/team', label: 'Team' },
      { href: '/admin/clients', label: 'Clients' },
      { href: '/admin/posts', label: 'Media Posts' },
    ],
  },
  {
    title: 'Pages & Sections',
    items: [
      { href: '/admin/pages', label: 'Pages' },
      { href: '/admin/principles', label: 'Vision / Mission / Values' },
      { href: '/admin/stats', label: 'Homepage Stats' },
      { href: '/admin/sectors', label: 'Sectors' },
      { href: '/admin/pillars', label: 'Services (TRACE)' },
      { href: '/admin/offices', label: 'Offices' },
    ],
  },
  {
    title: 'Inbox',
    items: [
      { href: '/admin/messages', label: 'Messages' },
      { href: '/admin/jobs', label: 'Careers' },
      { href: '/admin/applications', label: 'Applications' },
    ],
  },
  {
    title: 'System',
    items: [{ href: '/admin/settings', label: 'Settings' }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
        aria-label="Open navigation menu"
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
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="admin-nav">
          {groups.map((g, i) => (
            <div key={i}>
              {g.title && <div className="admin-nav-group">{g.title}</div>}
              {g.items.map((item) => {
                if (item.soon) {
                  return (
                    <span key={item.href} className="admin-nav-item soon">
                      {item.label}
                      <span style={{ marginLeft: 'auto', fontSize: 11 }}>soon</span>
                    </span>
                  );
                }
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
                    {item.label}
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
