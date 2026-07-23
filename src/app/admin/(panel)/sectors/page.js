import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteSector } from './actions';

export const dynamic = 'force-dynamic';

export default async function SectorsList() {
  const sectors = await prisma.sector.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Sectors</h1>
          <p className="admin-page-sub">
            {sectors.length} sector{sectors.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/sectors/new" className="btn btn-primary">
          + New Sector
        </Link>
      </div>

      {sectors.length === 0 ? (
        <div className="card empty">No sectors yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.titleEn}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/sectors/${s.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <form action={deleteSector.bind(null, s.id)}>
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
