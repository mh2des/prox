import { getTranslations } from '../../../../lib/i18n';
import { getActiveJobs } from '../../../../lib/content';
import JobsClient from './JobsClient';
import styles from '../page.module.css';

export const revalidate = 3600; // ISR: static + cached, refreshed hourly or on-demand from admin

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
