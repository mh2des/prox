import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function prettySlug(slug) {
  return String(slug)
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export default async function PagesList() {
  const pages = await prisma.page.findMany({ orderBy: { slug: 'asc' } });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Pages</h1>
          <p className="admin-page-sub">
            {pages.length} page{pages.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="card empty">No pages yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Hero title</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((pg) => (
                <tr key={pg.slug}>
                  <td style={{ fontWeight: 600 }}>{prettySlug(pg.slug)}</td>
                  <td>{pg.heroTitleEn || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/pages/${pg.slug}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
