import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { setApplicationStatus, deleteApplication } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetail({ params }) {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { job: true },
  });
  if (!application) notFound();

  const a = application;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{a.fullName}</h1>
          <p className="admin-page-sub">
            {a.status === 'NEW' ? 'New application' : 'Reviewed'}
          </p>
        </div>
        {a.status === 'NEW' ? (
          <span className="badge badge-green">New</span>
        ) : (
          <span className="badge badge-muted">Reviewed</span>
        )}
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="form">
          <div className="field">
            <span className="field-label">Position</span>
            <div>{a.job?.titleEn || 'Unknown'}</div>
          </div>

          <div className="form-row">
            <div className="field">
              <span className="field-label">Email</span>
              <div>
                <a href={`mailto:${a.email}`} className="btn btn-ghost btn-sm">
                  {a.email}
                </a>
              </div>
            </div>
            <div className="field">
              <span className="field-label">Phone</span>
              <div>{a.phone || '—'}</div>
            </div>
          </div>

          <div className="field">
            <span className="field-label">Applied</span>
            <div>{new Date(a.createdAt).toLocaleString()}</div>
          </div>

          {a.cvUrl && (
            <div className="field">
              <span className="field-label">CV</span>
              <div>
                <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  Open CV
                </a>
              </div>
            </div>
          )}

          <div className="field">
            <span className="field-label">Message</span>
            <div style={{ whiteSpace: 'pre-wrap' }}>{a.message || '—'}</div>
          </div>

          <div className="form-actions">
            <form
              action={setApplicationStatus.bind(
                null,
                a.id,
                a.status === 'NEW' ? 'REVIEWED' : 'NEW'
              )}
            >
              <button type="submit" className="btn btn-primary">
                {a.status === 'NEW' ? 'Mark reviewed' : 'Mark as new'}
              </button>
            </form>
            <DeleteButton action={deleteApplication.bind(null, a.id)} />
            <Link href="/admin/applications" className="btn btn-ghost">
              Back
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
