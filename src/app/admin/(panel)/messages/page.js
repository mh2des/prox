import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { formatDateTime } from '@/lib/format';
import { getAdminT } from '@/lib/admin-i18n';
import { deleteMessage } from './actions';

export const dynamic = 'force-dynamic';

export default async function MessagesList() {
  const { t } = getAdminT();
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.messages.title')}</h1>
          <p className="admin-page-sub">
            {messages.length} {t('unit.messages')}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="card empty">{t('empty.messages')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.from')}</th>
                <th>{t('th.subject')}</th>
                <th>{t('th.received')}</th>
                <th>{t('th.status')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div className="field-hint">{m.email}</div>
                  </td>
                  <td>{m.subject || t('detail.noSubject')}</td>
                  <td>{formatDateTime(m.createdAt)}</td>
                  <td>
                    {m.read ? (
                      <span className="badge badge-muted">{t('status.read')}</span>
                    ) : (
                      <span className="badge badge-green">{t('status.new')}</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/messages/${m.id}`} className="btn btn-ghost btn-sm">
                        {t('action.view')}
                      </Link>
                      <DeleteButton action={deleteMessage.bind(null, m.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
