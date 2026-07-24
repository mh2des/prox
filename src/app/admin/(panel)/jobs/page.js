import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteJob } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

const TYPE_LABELS = {
  JOB_OPENING: 'Job Opening',
  INTERNSHIP: 'Internship',
};

export default async function JobsList() {
  const { t } = getAdminT();
  const jobs = await prisma.job.findMany({
    orderBy: [{ createdAt: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.jobs.title')}</h1>
          <p className="admin-page-sub">
            {jobs.length} {t('unit.jobs')}
          </p>
        </div>
        <Link href="/admin/jobs/new" className="btn btn-primary">
          {t('new.job')}
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card empty">{t('empty.jobs')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.title')}</th>
                <th>{t('th.department')}</th>
                <th>{t('th.type')}</th>
                <th>{t('th.status')}</th>
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
                      <span className="badge badge-green">{t('status.active')}</span>
                    ) : (
                      <span className="badge badge-muted">{t('status.closed')}</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/jobs/${j.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deleteJob.bind(null, j.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
