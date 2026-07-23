import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import OfficeForm from '../OfficeForm';
import { updateOffice } from '../actions';

export default async function EditOffice({ params }) {
  const office = await prisma.office.findUnique({ where: { id: params.id } });
  if (!office) notFound();

  const action = updateOffice.bind(null, office.id);

  // Pass a plain, serialisable object.
  const data = {
    cityEn: office.cityEn,
    cityAr: office.cityAr,
    addressEn: office.addressEn,
    addressAr: office.addressAr,
    mapsUrl: office.mapsUrl,
    phone: office.phone,
    email: office.email,
    sortOrder: office.sortOrder,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Office</h1>
          <p className="admin-page-sub">{office.cityEn}</p>
        </div>
      </div>
      <OfficeForm action={action} office={data} />
    </>
  );
}
