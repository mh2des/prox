import InteractiveTeam from '../../../components/Team/InteractiveTeam';
import { getTeam, getPage } from '../../../lib/content';

export const revalidate = 3600; // ISR: static + cached, refreshed hourly or on-demand from admin

export default async function LeadershipTeam({ params: { locale } }) {
  const isAr = locale === 'ar';
  const leaders = await getTeam(locale);

  // ── DB: editable page hero. This page has no hero markup of its own — the
  // hero lives inside <InteractiveTeam> (owned by another agent). InteractiveTeam
  // is a client component and can't read the DB itself, so we fetch the Page row
  // here and forward it as a prop for the component to consume (with its own
  // fallbacks). No separate hero section exists here, so heroImageUrl is skipped.
  const page = await getPage('leadership-team', locale);

  return (
    <div>
      <InteractiveTeam leaders={leaders} isAr={isAr} page={page} />
    </div>
  );
}
