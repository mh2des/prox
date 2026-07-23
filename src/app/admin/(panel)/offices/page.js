import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteOffice } from './actions';

export const dynamic = 'force-dynamic';

export default async function OfficesList() {
  const offices = await prisma.office.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Offices</h1>
          <p className="admin-page-sub">
            {offices.length} office{offices.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/offices/new" className="btn btn-primary">
          + New Office
        </Link>
      </div>

      {offices.length === 0 ? (
        <div className="card empty">No offices yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>City</th>
                <th>Phone</th>
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
                        Edit
                      </Link>
                      <form action={deleteOffice.bind(null, o.id)}>
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
