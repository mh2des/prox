import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
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
            {message.name} · {message.createdAt.toLocaleString()}
          </p>
        </div>
        <Link href="/admin/messages" className="btn btn-ghost">
          Back to inbox
        </Link>
      </div>

      <div className="card">
        <div className="field">
          <span className="field-label">From</span>
          <div>{message.name}</div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <span className="field-label">Email</span>
          <div>
            <a href={`mailto:${message.email}`}>{message.email}</a>
          </div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <span className="field-label">Subject</span>
          <div>{message.subject || '(no subject)'}</div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <span className="field-label">Received</span>
          <div>{message.createdAt.toLocaleString()}</div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <span className="field-label">Message</span>
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.body}</div>
        </div>

        <div className="form-actions">
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
