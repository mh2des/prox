import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteClient } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function ClientsList() {
  const { t } = getAdminT();
  const clients = await prisma.client.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.clients.title')}</h1>
          <p className="admin-page-sub">
            {clients.length} {t('unit.clients')}
          </p>
        </div>
        <Link href="/admin/clients/new" className="btn btn-primary">
          {t('new.client')}
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="card empty">{t('empty.clients')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.name')}</th>
                <th>{t('th.website')}</th>
                <th>{t('th.status')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.website || '—'}</td>
                  <td>
                    {c.published ? (
                      <span className="badge badge-green">{t('status.published')}</span>
                    ) : (
                      <span className="badge badge-muted">{t('status.hidden')}</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/clients/${c.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deleteClient.bind(null, c.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
