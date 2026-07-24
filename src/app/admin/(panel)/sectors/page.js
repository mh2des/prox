import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteSector } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function SectorsList() {
  const { t } = getAdminT();
  const sectors = await prisma.sector.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.sectors.title')}</h1>
          <p className="admin-page-sub">
            {sectors.length} {t('unit.sectors')}
          </p>
        </div>
        <Link href="/admin/sectors/new" className="btn btn-primary">
          {t('new.sector')}
        </Link>
      </div>

      {sectors.length === 0 ? (
        <div className="card empty">{t('empty.sectors')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.title')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>
                    {s.titleEn}
                    {!s.titleAr && (
                      <span className="badge badge-yellow" style={{ marginInlineStart: 8, fontWeight: 500 }}>
                        {t('requiredLang')}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/sectors/${s.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deleteSector.bind(null, s.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
