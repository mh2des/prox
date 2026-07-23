import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SectorForm from '../SectorForm';
import { updateSector } from '../actions';

export default async function EditSector({ params }) {
  const sector = await prisma.sector.findUnique({ where: { id: params.id } });
  if (!sector) notFound();

  const action = updateSector.bind(null, sector.id);

  // Pass a plain, serialisable object.
  const data = {
    titleEn: sector.titleEn,
    titleAr: sector.titleAr,
    descEn: sector.descEn,
    descAr: sector.descAr,
    sortOrder: sector.sortOrder,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Sector</h1>
          <p className="admin-page-sub">{sector.titleEn}</p>
        </div>
      </div>
      <SectorForm action={action} sector={data} />
    </>
  );
}
