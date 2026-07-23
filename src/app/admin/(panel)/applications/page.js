import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ApplicationsList() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    include: { job: true },
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Job Applications</h1>
          <p className="admin-page-sub">
            {applications.length} application{applications.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card empty">No applications yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Position</th>
                <th>Applied</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.fullName}</div>
                    <div className="admin-page-sub" style={{ margin: 0 }}>{a.email}</div>
                  </td>
                  <td>{a.job?.titleEn || 'Unknown'}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>
                    {a.status === 'NEW' ? (
                      <span className="badge badge-green">New</span>
                    ) : (
                      <span className="badge badge-muted">Reviewed</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/applications/${a.id}`} className="btn btn-ghost btn-sm">
                        View
                      </Link>
                      {a.cvUrl && (
                        <a href={a.cvUrl} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
                          CV
                        </a>
                      )}
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
