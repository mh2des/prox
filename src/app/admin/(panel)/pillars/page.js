import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deletePillar } from './actions';

export const dynamic = 'force-dynamic';

export default async function PillarsList() {
  const pillars = await prisma.servicePillar.findMany({
    orderBy: [{ sortOrder: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Services (TRACE Pillars)</h1>
          <p className="admin-page-sub">
            {pillars.length} pillar{pillars.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/pillars/new" className="btn btn-primary">
          + New Pillar
        </Link>
      </div>

      {pillars.length === 0 ? (
        <div className="card empty">No pillars yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Letter</th>
                <th>Title</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="badge badge-muted">{p.letter}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.titleEn}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/pillars/${p.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <DeleteButton action={deletePillar.bind(null, p.id)} />
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
