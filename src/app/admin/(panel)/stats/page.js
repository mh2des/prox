import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteStat } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function StatsList() {
  const { t } = getAdminT();
  const stats = await prisma.stat.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.stats.title')}</h1>
          <p className="admin-page-sub">
            {stats.length} {t('unit.stats')}
          </p>
        </div>
        <Link href="/admin/stats/new" className="btn btn-primary">
          {t('new.stat')}
        </Link>
      </div>

      {stats.length === 0 ? (
        <div className="card empty">{t('empty.stats')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.value')}</th>
                <th>{t('th.label')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.valueEn}</td>
                  <td>{s.labelEn}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/stats/${s.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deleteStat.bind(null, s.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
