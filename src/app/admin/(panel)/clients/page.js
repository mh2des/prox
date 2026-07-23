import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteClient } from './actions';

export const dynamic = 'force-dynamic';

export default async function ClientsList() {
  const clients = await prisma.client.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Clients</h1>
          <p className="admin-page-sub">
            {clients.length} client{clients.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/clients/new" className="btn btn-primary">
          + New Client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="card empty">No clients yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Website</th>
                <th>Status</th>
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
                      <span className="badge badge-green">Published</span>
                    ) : (
                      <span className="badge badge-muted">Hidden</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/clients/${c.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <form action={deleteClient.bind(null, c.id)}>
                        <button type="submit" className="btn btn-danger btn-sm">
                          Delete
                        </button>
                      </form>
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
