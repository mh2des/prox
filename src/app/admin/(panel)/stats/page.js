import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteStat } from './actions';

export const dynamic = 'force-dynamic';

export default async function StatsList() {
  const stats = await prisma.stat.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Homepage Stats</h1>
          <p className="admin-page-sub">
            {stats.length} stat{stats.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/stats/new" className="btn btn-primary">
          + New Stat
        </Link>
      </div>

      {stats.length === 0 ? (
        <div className="card empty">No stats yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Value</th>
                <th>Label</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.valueEn}</td>
                  <td>{s.labelEn}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/stats/${s.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <DeleteButton action={deleteStat.bind(null, s.id)} />
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
