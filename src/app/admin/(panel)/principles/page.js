import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deletePrinciple } from './actions';

export const dynamic = 'force-dynamic';

export default async function PrinciplesList() {
  const principles = await prisma.principle.findMany({
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Vision / Mission / Values</h1>
          <p className="admin-page-sub">
            {principles.length} entr{principles.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
        <Link href="/admin/principles/new" className="btn btn-primary">
          + New Entry
        </Link>
      </div>

      {principles.length === 0 ? (
        <div className="card empty">No entries yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {principles.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="badge badge-muted">{p.type}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.titleEn}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/principles/${p.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <form action={deletePrinciple.bind(null, p.id)}>
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
