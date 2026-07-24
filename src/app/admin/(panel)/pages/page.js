import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

function prettySlug(slug) {
  return String(slug)
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export default async function PagesList() {
  const { t } = getAdminT();
  const pages = await prisma.page.findMany({ orderBy: { slug: 'asc' } });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.pages.title')}</h1>
          <p className="admin-page-sub">
            {pages.length} {t('unit.pages')}
          </p>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="card empty">{t('empty.pages')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.page')}</th>
                <th>{t('th.heroTitle')}</th>
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
                        {t('action.edit')}
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
