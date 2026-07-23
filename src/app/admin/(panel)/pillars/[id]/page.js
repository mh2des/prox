import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PillarForm from '../PillarForm';
import { updatePillar } from '../actions';

export default async function EditPillar({ params }) {
  const pillar = await prisma.servicePillar.findUnique({ where: { id: params.id } });
  if (!pillar) notFound();

  const action = updatePillar.bind(null, pillar.id);

  // Pass a plain, serialisable object; join String[] fields for the textareas.
  const data = {
    letter: pillar.letter,
    titleEn: pillar.titleEn,
    titleAr: pillar.titleAr,
    descEn: pillar.descEn,
    descAr: pillar.descAr,
    keyAreasEn: (pillar.keyAreasEn || []).join('\n'),
    keyAreasAr: (pillar.keyAreasAr || []).join('\n'),
    sortOrder: pillar.sortOrder,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Pillar</h1>
          <p className="admin-page-sub">{pillar.titleEn}</p>
        </div>
      </div>
      <PillarForm action={action} pillar={data} />
    </>
  );
}
