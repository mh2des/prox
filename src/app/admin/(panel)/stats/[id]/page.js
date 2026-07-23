import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StatForm from '../StatForm';
import { updateStat } from '../actions';

export default async function EditStat({ params }) {
  const stat = await prisma.stat.findUnique({ where: { id: params.id } });
  if (!stat) notFound();

  const action = updateStat.bind(null, stat.id);

  const data = {
    valueEn: stat.valueEn,
    valueAr: stat.valueAr,
    labelEn: stat.labelEn,
    labelAr: stat.labelAr,
    sortOrder: stat.sortOrder,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Stat</h1>
          <p className="admin-page-sub">{stat.labelEn}</p>
        </div>
      </div>
      <StatForm action={action} stat={data} />
    </>
  );
}
