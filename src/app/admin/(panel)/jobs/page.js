import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteJob } from './actions';

export const dynamic = 'force-dynamic';

const TYPE_LABELS = {
  JOB_OPENING: 'Job Opening',
  INTERNSHIP: 'Internship',
};

export default async function JobsList() {
  const jobs = await prisma.job.findMany({
    orderBy: [{ createdAt: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Careers</h1>
          <p className="admin-page-sub">
            {jobs.length} job{jobs.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/jobs/new" className="btn btn-primary">
          + New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card empty">No jobs yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td style={{ fontWeight: 600 }}>{j.titleEn}</td>
                  <td>{j.department || '—'}</td>
                  <td>{TYPE_LABELS[j.type] || j.type}</td>
                  <td>
                    {j.status === 'ACTIVE' ? (
                      <span className="badge badge-green">Active</span>
                    ) : (
                      <span className="badge badge-muted">Closed</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/jobs/${j.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <form action={deleteJob.bind(null, j.id)}>
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
