import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TeamMemberForm from '../TeamMemberForm';
import { updateTeamMember } from '../actions';

export default async function EditTeamMember({ params }) {
  const member = await prisma.teamMember.findUnique({ where: { id: params.id } });
  if (!member) notFound();

  const action = updateTeamMember.bind(null, member.id);

  // Pass a plain, serialisable object; join array fields to one-per-line text.
  const data = {
    name: member.name,
    positionEn: member.positionEn,
    positionAr: member.positionAr,
    bioEn: member.bioEn,
    bioAr: member.bioAr,
    expertiseEn: (member.expertiseEn || []).join('\n'),
    expertiseAr: (member.expertiseAr || []).join('\n'),
    experienceEn: (member.experienceEn || []).join('\n'),
    experienceAr: (member.experienceAr || []).join('\n'),
    photoUrl: member.photoUrl,
    linkedin: member.linkedin,
    published: member.published,
    sortOrder: member.sortOrder,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Edit Member</h1>
          <p className="admin-page-sub">{member.name}</p>
        </div>
      </div>
      <TeamMemberForm action={action} member={data} />
    </>
  );
}
