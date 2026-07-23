'use client';

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
      { href: '/admin/pages', label: 'Pages', soon: true },
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

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        Pro<span>Ex</span>
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
  );
}
