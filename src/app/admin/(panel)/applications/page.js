import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/format';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function ApplicationsList() {
  const { t } = getAdminT();
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    include: { job: true },
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.applications.title')}</h1>
          <p className="admin-page-sub">
            {applications.length} {t('unit.applications')}
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card empty">{t('empty.applications')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.applicant')}</th>
                <th>{t('th.position')}</th>
                <th>{t('th.applied')}</th>
                <th>{t('th.status')}</th>
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
                  <td>{a.job?.titleEn || t('detail.unknown')}</td>
                  <td>{formatDate(a.createdAt)}</td>
                  <td>
                    {a.status === 'NEW' ? (
                      <span className="badge badge-green">{t('status.new')}</span>
                    ) : (
                      <span className="badge badge-muted">{t('status.reviewed')}</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/applications/${a.id}`} className="btn btn-ghost btn-sm">
                        {t('action.view')}
                      </Link>
                      {a.cvUrl && (
                        <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                          {t('detail.cv')}
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
