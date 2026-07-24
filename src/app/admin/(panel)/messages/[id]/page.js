import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { formatDateTime } from '@/lib/format';
import { toggleMessageRead, deleteMessage } from '../actions';

export const dynamic = 'force-dynamic';

export default async function MessageDetail({ params }) {
  const message = await prisma.message.findUnique({ where: { id: params.id } });
  if (!message) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{message.subject || '(no subject)'}</h1>
          <p className="admin-page-sub">
            {message.name} · {formatDateTime(message.createdAt)}
          </p>
        </div>
        <Link href="/admin/messages" className="btn btn-ghost">
          Back to inbox
        </Link>
      </div>

      <div className="card">
        <div className="detail-row">
          <span className="detail-label">From</span>
          <div className="detail-value">{message.name}</div>
        </div>

        <div className="detail-row">
          <span className="detail-label">Email</span>
          <div className="detail-value">
            <a href={`mailto:${message.email}`}>{message.email}</a>
          </div>
        </div>

        <div className="detail-row">
          <span className="detail-label">Subject</span>
          <div className="detail-value">{message.subject || '(no subject)'}</div>
        </div>

        <div className="detail-row">
          <span className="detail-label">Received</span>
          <div className="detail-value">{formatDateTime(message.createdAt)}</div>
        </div>

        <div className="detail-row">
          <span className="detail-label">Message</span>
          <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{message.body}</div>
        </div>

        <div className="form-actions" style={{ marginTop: 20 }}>
          <form action={toggleMessageRead.bind(null, message.id, !message.read)}>
            <button type="submit" className="btn btn-primary">
              {message.read ? 'Mark as unread' : 'Mark as read'}
            </button>
          </form>
          <DeleteButton action={deleteMessage.bind(null, message.id)} />
        </div>
      </div>
    </>
  );
}
