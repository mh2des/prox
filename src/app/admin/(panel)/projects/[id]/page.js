import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectForm from '../ProjectForm';
import { updateProject } from '../actions';

export default async function EditProject({ params }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  const action = updateProject.bind(null, project.id);

  // Pass a plain, serialisable object; format the date for <input type="date">.
  const data = {
    titleEn: project.titleEn,
    titleAr: project.titleAr,
    descEn: project.descEn,
    descAr: project.descAr,
    sector: project.sector,
    client: project.client,
    year: project.year,
    location: project.location,
    imageUrl: project.imageUrl,
    slug: project.slug,
    published: project.published,
    sortOrder: project.sortOrder,
    projectDate: project.projectDate
      ? project.projectDate.toISOString().slice(0, 10)
      : '',
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Project</h1>
          <p className="admin-page-sub">{project.titleEn}</p>
        </div>
      </div>
      <ProjectForm action={action} project={data} />
    </>
  );
}
