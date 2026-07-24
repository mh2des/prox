import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { formatDateTime } from '@/lib/format';
import { getAdminT } from '@/lib/admin-i18n';
import { toggleMessageRead, deleteMessage } from '../actions';

export const dynamic = 'force-dynamic';

export default async function MessageDetail({ params }) {
  const { t } = getAdminT();
  const message = await prisma.message.findUnique({ where: { id: params.id } });
  if (!message) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{message.subject || t('detail.noSubject')}</h1>
          <p className="admin-page-sub">
            {message.name} · {formatDateTime(message.createdAt)}
          </p>
        </div>
        <Link href="/admin/messages" className="btn btn-ghost">
          {t('detail.backToInbox')}
        </Link>
      </div>

      <div className="card">
        <div className="detail-row">
          <span className="detail-label">{t('detail.from')}</span>
          <div className="detail-value">{message.name}</div>
        </div>

        <div className="detail-row">
          <span className="detail-label">{t('detail.email')}</span>
          <div className="detail-value">
            <a href={`mailto:${message.email}`}>{message.email}</a>
          </div>
        </div>

        <div className="detail-row">
          <span className="detail-label">{t('detail.subject')}</span>
          <div className="detail-value">{message.subject || t('detail.noSubject')}</div>
        </div>

        <div className="detail-row">
          <span className="detail-label">{t('detail.received')}</span>
          <div className="detail-value">{formatDateTime(message.createdAt)}</div>
        </div>

        <div className="detail-row">
          <span className="detail-label">{t('detail.message')}</span>
          <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{message.body}</div>
        </div>

        <div className="form-actions" style={{ marginTop: 20 }}>
          <form action={toggleMessageRead.bind(null, message.id, !message.read)}>
            <button type="submit" className="btn btn-primary">
              {message.read ? t('detail.markUnread') : t('detail.markRead')}
            </button>
          </form>
          <DeleteButton action={deleteMessage.bind(null, message.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
        </div>
      </div>
    </>
  );
}
