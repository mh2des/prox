import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteTeamMember } from './actions';

export const dynamic = 'force-dynamic';

export default async function TeamList() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Leadership</h1>
          <p className="admin-page-sub">
            {members.length} member{members.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/team/new" className="btn btn-primary">
          + New Member
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="card empty">No team members yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td>{m.positionEn || '—'}</td>
                  <td>
                    {m.published ? (
                      <span className="badge badge-green">Published</span>
                    ) : (
                      <span className="badge badge-muted">Hidden</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/team/${m.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <DeleteButton action={deleteTeamMember.bind(null, m.id)} />
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
