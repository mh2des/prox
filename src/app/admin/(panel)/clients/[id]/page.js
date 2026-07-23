import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ClientForm from '../ClientForm';
import { updateClient } from '../actions';

export default async function EditClient({ params }) {
  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) notFound();

  const action = updateClient.bind(null, client.id);

  // Pass a plain, serialisable object.
  const data = {
    name: client.name,
    descEn: client.descEn,
    descAr: client.descAr,
    website: client.website,
    logoUrl: client.logoUrl,
    published: client.published,
    sortOrder: client.sortOrder,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Client</h1>
          <p className="admin-page-sub">{client.name}</p>
        </div>
      </div>
      <ClientForm action={action} client={data} />
    </>
  );
}
