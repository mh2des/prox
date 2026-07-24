import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deletePrinciple } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function PrinciplesList() {
  const { t } = getAdminT();
  const principles = await prisma.principle.findMany({
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.principles.title')}</h1>
          <p className="admin-page-sub">
            {principles.length} {t('unit.principles')}
          </p>
        </div>
        <Link href="/admin/principles/new" className="btn btn-primary">
          {t('new.principle')}
        </Link>
      </div>

      {principles.length === 0 ? (
        <div className="card empty">{t('empty.principles')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.type')}</th>
                <th>{t('th.title')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {principles.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="badge badge-muted">{p.type}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {p.titleEn}
                    {!p.titleAr && (
                      <span className="badge badge-yellow" style={{ marginInlineStart: 8, fontWeight: 500 }}>
                        {t('requiredLang')}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/principles/${p.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deletePrinciple.bind(null, p.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
