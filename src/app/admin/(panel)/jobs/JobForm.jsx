'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  );
}

export default function JobForm({ action, job }) {
  const [state, formAction] = useFormState(action, {});
  const j = job || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">Title (English) *</label>
          <input name="titleEn" className="input" defaultValue={j.titleEn || ''} required />
        </div>
        <div className="field">
          <label className="field-label">Title (Arabic)</label>
          <input name="titleAr" className="input" dir="rtl" defaultValue={j.titleAr || ''} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Department *</label>
          <input name="department" className="input" defaultValue={j.department || ''} required />
        </div>
        <div className="field">
          <label className="field-label">Location</label>
          <input name="location" className="input" defaultValue={j.location || ''} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Type</label>
          <select name="type" className="select" defaultValue={j.type || 'JOB_OPENING'}>
            <option value="JOB_OPENING">Job Opening</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Status</label>
          <select name="status" className="select" defaultValue={j.status || 'ACTIVE'}>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Description (English) *</label>
        <textarea name="descriptionEn" className="textarea" defaultValue={j.descriptionEn || ''} required />
      </div>
      <div className="field">
        <label className="field-label">Description (Arabic)</label>
        <textarea name="descriptionAr" className="textarea" dir="rtl" defaultValue={j.descriptionAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Requirements (English) *</label>
        <textarea name="requirementsEn" className="textarea" defaultValue={j.requirementsEn || ''} required />
      </div>
      <div className="field">
        <label className="field-label">Requirements (Arabic)</label>
        <textarea name="requirementsAr" className="textarea" dir="rtl" defaultValue={j.requirementsAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Slug</label>
        <input name="slug" className="input" placeholder="auto-generated from the title" defaultValue={j.slug || ''} />
        <span className="field-hint">Leave blank to derive it from the English title.</span>
      </div>

      <div className="form-actions">
        <SubmitButton label={job ? 'Save changes' : 'Create job'} />
        <Link href="/admin/jobs" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
