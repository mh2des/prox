import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import JobForm from '../JobForm';
import { updateJob } from '../actions';

export default async function EditJob({ params }) {
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) notFound();

  const action = updateJob.bind(null, job.id);

  // Pass a plain, serialisable object.
  const data = {
    titleEn: job.titleEn,
    titleAr: job.titleAr,
    department: job.department,
    type: job.type,
    descriptionEn: job.descriptionEn,
    descriptionAr: job.descriptionAr,
    requirementsEn: job.requirementsEn,
    requirementsAr: job.requirementsAr,
    location: job.location,
    status: job.status,
    slug: job.slug,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Job</h1>
          <p className="admin-page-sub">{job.titleEn}</p>
        </div>
      </div>
      <JobForm action={action} job={data} />
    </>
  );
}
