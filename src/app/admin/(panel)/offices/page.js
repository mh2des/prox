import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteOffice } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function OfficesList() {
  const { t } = getAdminT();
  const offices = await prisma.office.findMany({
    // Office has no createdAt column — order by sortOrder only (matches getOffices).
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.offices.title')}</h1>
          <p className="admin-page-sub">
            {offices.length} {t('unit.offices')}
          </p>
        </div>
        <Link href="/admin/offices/new" className="btn btn-primary">
          {t('new.office')}
        </Link>
      </div>

      {offices.length === 0 ? (
        <div className="card empty">{t('empty.offices')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.city')}</th>
                <th>{t('th.phone')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offices.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.cityEn}</td>
                  <td>{o.phone || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/offices/${o.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deleteOffice.bind(null, o.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
