import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteTeamMember } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function TeamList() {
  const { t } = getAdminT();
  const members = await prisma.teamMember.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.team.title')}</h1>
          <p className="admin-page-sub">
            {members.length} {t('unit.team')}
          </p>
        </div>
        <Link href="/admin/team/new" className="btn btn-primary">
          {t('new.team')}
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="card empty">{t('empty.team')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.name')}</th>
                <th>{t('th.position')}</th>
                <th>{t('th.status')}</th>
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
                      <span className="badge badge-green">{t('status.published')}</span>
                    ) : (
                      <span className="badge badge-muted">{t('status.hidden')}</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/team/${m.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deleteTeamMember.bind(null, m.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
