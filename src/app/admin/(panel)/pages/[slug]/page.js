import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PageForm from '../PageForm';
import { updatePage } from '../actions';

function prettySlug(slug) {
  return String(slug)
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export default async function EditPage({ params }) {
  const page = await prisma.page.findUnique({ where: { slug: params.slug } });
  if (!page) notFound();

  const action = updatePage.bind(null, page.slug);

  // Pass a plain, serialisable object.
  const data = {
    heroBadgeEn: page.heroBadgeEn,
    heroBadgeAr: page.heroBadgeAr,
    heroTitleEn: page.heroTitleEn,
    heroTitleAr: page.heroTitleAr,
    heroSubtitleEn: page.heroSubtitleEn,
    heroSubtitleAr: page.heroSubtitleAr,
    introEn: page.introEn,
    introAr: page.introAr,
    heroImageUrl: page.heroImageUrl,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Page</h1>
          <p className="admin-page-sub">{prettySlug(page.slug)}</p>
        </div>
      </div>
      <PageForm action={action} page={data} />
    </>
  );
}
