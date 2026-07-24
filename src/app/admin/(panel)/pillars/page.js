import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deletePillar } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function PillarsList() {
  const { t } = getAdminT();
  const pillars = await prisma.servicePillar.findMany({
    orderBy: [{ sortOrder: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.pillars.title')}</h1>
          <p className="admin-page-sub">
            {pillars.length} {t('unit.pillars')}
          </p>
        </div>
        <Link href="/admin/pillars/new" className="btn btn-primary">
          {t('new.pillar')}
        </Link>
      </div>

      {pillars.length === 0 ? (
        <div className="card empty">{t('empty.pillars')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.letter')}</th>
                <th>{t('th.title')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="badge badge-muted">{p.letter}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.titleEn}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/pillars/${p.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deletePillar.bind(null, p.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
