import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteProject } from './actions';

export const dynamic = 'force-dynamic';

export default async function ProjectsList() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Our Work</h1>
          <p className="admin-page-sub">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card empty">No projects yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Year</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.titleEn}</td>
                  <td>{p.client || '—'}</td>
                  <td>{p.year || '—'}</td>
                  <td>
                    {p.published ? (
                      <span className="badge badge-green">Published</span>
                    ) : (
                      <span className="badge badge-muted">Hidden</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/projects/${p.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <DeleteButton action={deleteProject.bind(null, p.id)} />
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
