import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { formatDateTime } from '@/lib/format';
import { deleteMessage } from './actions';

export const dynamic = 'force-dynamic';

export default async function MessagesList() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Messages</h1>
          <p className="admin-page-sub">
            {messages.length} message{messages.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="card empty">No messages yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Received</th>
                <th>Status</th>
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
                  <td>{m.subject || '(no subject)'}</td>
                  <td>{formatDateTime(m.createdAt)}</td>
                  <td>
                    {m.read ? (
                      <span className="badge badge-muted">Read</span>
                    ) : (
                      <span className="badge badge-green">New</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/messages/${m.id}`} className="btn btn-ghost btn-sm">
                        View
                      </Link>
                      <DeleteButton action={deleteMessage.bind(null, m.id)} />
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
