import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { formatDateTime } from '@/lib/format';
import { getAdminT } from '@/lib/admin-i18n';
import { setApplicationStatus, deleteApplication } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetail({ params }) {
  const { t } = getAdminT();
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
            {a.status === 'NEW' ? t('detail.newApplication') : t('detail.reviewed')}
          </p>
        </div>
        {a.status === 'NEW' ? (
          <span className="badge badge-green">{t('status.new')}</span>
        ) : (
          <span className="badge badge-muted">{t('status.reviewed')}</span>
        )}
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="form">
          <div className="field">
            <span className="field-label">{t('detail.position')}</span>
            <div>{a.job?.titleEn || t('detail.unknown')}</div>
          </div>

          <div className="form-row">
            <div className="field">
              <span className="field-label">{t('detail.email')}</span>
              <div>
                <a href={`mailto:${a.email}`} className="btn btn-ghost btn-sm">
                  {a.email}
                </a>
              </div>
            </div>
            <div className="field">
              <span className="field-label">{t('detail.phone')}</span>
              <div>{a.phone || '—'}</div>
            </div>
          </div>

          <div className="field">
            <span className="field-label">{t('detail.applied')}</span>
            <div>{formatDateTime(a.createdAt)}</div>
          </div>

          {a.cvUrl && (
            <div className="field">
              <span className="field-label">{t('detail.cv')}</span>
              <div>
                <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  {t('detail.openCv')}
                </a>
              </div>
            </div>
          )}

          <div className="field">
            <span className="field-label">{t('detail.message')}</span>
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
                {a.status === 'NEW' ? t('detail.markReviewed') : t('detail.markNew')}
              </button>
            </form>
            <DeleteButton action={deleteApplication.bind(null, a.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
            <Link href="/admin/applications" className="btn btn-ghost">
              {t('action.back')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
