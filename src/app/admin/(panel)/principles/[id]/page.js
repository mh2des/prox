import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PrincipleForm from '../PrincipleForm';
import { updatePrinciple } from '../actions';

export default async function EditPrinciple({ params }) {
  const principle = await prisma.principle.findUnique({ where: { id: params.id } });
  if (!principle) notFound();

  const action = updatePrinciple.bind(null, principle.id);

  // Pass a plain, serialisable object.
  const data = {
    type: principle.type,
    titleEn: principle.titleEn,
    titleAr: principle.titleAr,
    textEn: principle.textEn,
    textAr: principle.textAr,
    icon: principle.icon,
    sortOrder: principle.sortOrder,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Entry</h1>
          <p className="admin-page-sub">{principle.titleEn}</p>
        </div>
      </div>
      <PrincipleForm action={action} principle={data} />
    </>
  );
}
