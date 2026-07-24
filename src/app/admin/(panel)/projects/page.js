import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteProject } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function ProjectsList() {
  const { t } = getAdminT();
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.projects.title')}</h1>
          <p className="admin-page-sub">
            {projects.length} {t('unit.projects')}
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          {t('new.project')}
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card empty">{t('empty.projects')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.title')}</th>
                <th>{t('th.client')}</th>
                <th>{t('th.year')}</th>
                <th>{t('th.status')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>
                    {p.titleEn}
                    {!p.titleAr && (
                      <span className="badge badge-yellow" style={{ marginInlineStart: 8, fontWeight: 500 }}>
                        {t('requiredLang')}
                      </span>
                    )}
                  </td>
                  <td>{p.client || '—'}</td>
                  <td>{p.year || '—'}</td>
                  <td>
                    {p.published ? (
                      <span className="badge badge-green">{t('status.published')}</span>
                    ) : (
                      <span className="badge badge-muted">{t('status.hidden')}</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/projects/${p.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deleteProject.bind(null, p.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
