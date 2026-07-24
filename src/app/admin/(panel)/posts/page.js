import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
import { deletePost } from './actions';

export const dynamic = 'force-dynamic';

export default async function PostsList() {
  const posts = await prisma.post.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Media Posts</h1>
          <p className="admin-page-sub">
            {posts.length} post{posts.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card empty">No posts yet. Create your first one.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
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
                      <span className="badge badge-green">Published</span>
                    ) : (
                      <span className="badge badge-muted">Draft</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/posts/${p.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <DeleteButton action={deletePost.bind(null, p.id)} />
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
