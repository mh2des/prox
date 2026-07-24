"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import styles from '../page.module.css';
import UploadField from '@/components/admin/UploadField';
import { submitApplication } from './actions';

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.filterBtn} disabled={pending}>
      {pending ? '…' : label}
    </button>
  );
}

function ApplyForm({ job, isAr, onCancel }) {
  const [state, formAction] = useFormState(submitApplication, {});

  if (state?.ok) {
    return (
      <p style={{ color: '#52c87a', fontWeight: 600, marginTop: '1rem' }}>
        {isAr ? 'تم إرسال طلبك بنجاح. شكراً لك!' : 'Your application has been submitted. Thank you!'}
      </p>
    );
  }

  return (
    <form action={formAction} style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input type="hidden" name="jobId" value={job.id} />
      {/* Honeypot — hidden from humans, filled by bots (silently dropped). */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />
      {state?.error && <p style={{ color: '#e05b5b', margin: 0 }}>{state.error}</p>}
      <input name="fullName" placeholder={isAr ? 'الاسم الكامل' : 'Full name'} className={styles.filterInput} required />
      <input type="email" name="email" placeholder={isAr ? 'البريد الإلكتروني' : 'Email'} className={styles.filterInput} required />
      <input name="phone" placeholder={isAr ? 'رقم الهاتف' : 'Phone (optional)'} className={styles.filterInput} />
      <textarea name="message" rows="3" placeholder={isAr ? 'رسالة قصيرة (اختياري)' : 'A short message (optional)'} className={styles.filterInput} />
      <div>
        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
          {isAr ? 'السيرة الذاتية (PDF / Word)' : 'CV / Résumé (PDF / Word)'}
        </label>
        <UploadField name="cvUrl" endpoint="cv" />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <SubmitButton label={isAr ? 'إرسال الطلب' : 'Submit application'} />
        <button type="button" onClick={onCancel} className={styles.jobTab}>
          {isAr ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </form>
  );
}

export default function JobsClient({ c, jobs = [], isAr }) {
  const [activeJobTab, setActiveJobTab] = useState('openings');
  const [applyingId, setApplyingId] = useState(null);
  const [titleFilter, setTitleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const wantType = activeJobTab === 'openings' ? 'JOB_OPENING' : 'INTERNSHIP';
  const filtered = jobs.filter(
    (j) =>
      j.type === wantType &&
      (!titleFilter || j.title.toLowerCase().includes(titleFilter.toLowerCase())) &&
      (!deptFilter || (j.department || '').toLowerCase().includes(deptFilter.toLowerCase()))
  );

  return (
    <>
      <div style={{ height: '75px', background: 'var(--color-dark, #0a1f1e)' }}></div>
      <section className={`${styles.tabSection} ${styles.tabSectionAlt}`} id="tab-jobs" style={{ paddingBottom: '8rem', paddingTop: '6rem', minHeight: 'calc(100vh - 75px)' }}>
        <div className="container">
          <div className={styles.centerHeaderContainer}>
            <h2 className={styles.centerTitle}>{c.opportunitiesTitle}</h2>
            <div className={styles.centerGoldBar} />
          </div>

          <div className={styles.jobTabs}>
            <button
              className={`${styles.jobTab} ${activeJobTab === 'openings' ? styles.jobTabActive : ''}`}
              onClick={() => { setActiveJobTab('openings'); setApplyingId(null); }}
            >
              {isAr ? 'الوظائف' : 'Job Openings'}
            </button>
            <button
              className={`${styles.jobTab} ${activeJobTab === 'internships' ? styles.jobTabActive : ''}`}
              onClick={() => { setActiveJobTab('internships'); setApplyingId(null); }}
            >
              {isAr ? 'التدريب' : 'Internships'}
            </button>
          </div>

          <div className={styles.jobFiltersContainer}>
            <div className={styles.jobFilters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{isAr ? 'المسمى' : 'Title'}</label>
                <input type="text" value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} placeholder={isAr ? 'المسمى' : 'Title'} className={styles.filterInput} />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{isAr ? 'القسم' : 'Department'}</label>
                <input type="text" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} placeholder={isAr ? 'القسم' : 'Department'} className={styles.filterInput} />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.jobMessages}>
              <div className={styles.noJobsMessage}>
                {activeJobTab === 'openings'
                  ? isAr ? 'لا توجد وظائف حالياً' : 'There are currently no jobs'
                  : isAr ? 'لا توجد فرص تدريب حالياً' : 'There are currently no internship opportunities'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2.5rem' }}>
              {filtered.map((job) => (
                <div key={job.id} style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '1.75rem', background: 'rgba(255,255,255,0.02)' }}>
                  <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.3rem' }}>{job.title}</h3>
                  <p style={{ opacity: 0.7, margin: '0 0 1rem', fontSize: '0.95rem' }}>
                    {job.department}{job.location ? ` · ${job.location}` : ''}
                  </p>
                  {job.description && <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 1rem', lineHeight: 1.6 }}>{job.description}</p>}
                  {job.requirements && (
                    <>
                      <p style={{ fontWeight: 700, margin: '0 0 0.35rem' }}>{isAr ? 'المتطلبات' : 'Requirements'}</p>
                      <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 1rem', lineHeight: 1.6, opacity: 0.9 }}>{job.requirements}</p>
                    </>
                  )}
                  {applyingId === job.id ? (
                    <ApplyForm job={job} isAr={isAr} onCancel={() => setApplyingId(null)} />
                  ) : (
                    <button className={styles.filterBtn} onClick={() => setApplyingId(job.id)}>
                      {isAr ? 'قدّم الآن' : 'Apply now'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
