import InteractiveTeam from '../../../components/Team/InteractiveTeam';
import { getTeam } from '../../../lib/content';

export const dynamic = 'force-dynamic';

export default async function LeadershipTeam({ params: { locale } }) {
  const isAr = locale === 'ar';
  const leaders = await getTeam(locale);

  return (
    <div>
      <InteractiveTeam leaders={leaders} isAr={isAr} />
    </div>
  );
}
