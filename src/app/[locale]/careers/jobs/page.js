import { getTranslations } from '../../../../lib/i18n';
import { getActiveJobs } from '../../../../lib/content';
import JobsClient from './JobsClient';
import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export default async function JobsPage({ params: { locale } }) {
  const t = getTranslations(locale);
  const c = t.careers;
  const jobs = await getActiveJobs(locale);

  return (
    <div className={styles.page}>
      <JobsClient c={c} jobs={jobs} isAr={locale === 'ar'} />
    </div>
  );
}
