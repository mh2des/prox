import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostForm from '../PostForm';
import { updatePost } from '../actions';

export default async function EditPost({ params }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  const action = updatePost.bind(null, post.id);

  // Pass a plain, serialisable object; format the date for <input type="date">.
  const data = {
    titleEn: post.titleEn,
    titleAr: post.titleAr,
    excerptEn: post.excerptEn,
    excerptAr: post.excerptAr,
    contentEn: post.contentEn,
    contentAr: post.contentAr,
    author: post.author,
    status: post.status,
    featuredImage: post.featuredImage,
    slug: post.slug,
    publishedAt: post.publishedAt
      ? post.publishedAt.toISOString().slice(0, 10)
      : '',
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Post</h1>
          <p className="admin-page-sub">{post.titleEn}</p>
        </div>
      </div>
      <PostForm action={action} post={data} />
    </>
  );
}
