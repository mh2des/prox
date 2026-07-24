import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deletePost } from './actions';
import { getAdminT } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function PostsList() {
  const { t } = getAdminT();
  const posts = await prisma.post.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{t('page.posts.title')}</h1>
          <p className="admin-page-sub">
            {posts.length} {t('unit.posts')}
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">
          {t('new.post')}
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card empty">{t('empty.posts')}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th.title')}</th>
                <th>{t('th.author')}</th>
                <th>{t('th.status')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.titleEn}</td>
                  <td>{p.author || '—'}</td>
                  <td>
                    {p.status === 'PUBLISHED' ? (
                      <span className="badge badge-green">{t('status.published')}</span>
                    ) : (
                      <span className="badge badge-muted">{t('status.draft')}</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/posts/${p.id}`} className="btn btn-ghost btn-sm">
                        {t('action.edit')}
                      </Link>
                      <DeleteButton action={deletePost.bind(null, p.id)} label={t('action.delete')} confirmMessage={t('confirmDelete')} />
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
