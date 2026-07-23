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

export default function ProjectForm({ action, project }) {
  const [state, formAction] = useFormState(action, {});
  const p = project || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">Title (English) *</label>
          <input name="titleEn" className="input" defaultValue={p.titleEn || ''} required />
        </div>
        <div className="field">
          <label className="field-label">Title (Arabic)</label>
          <input name="titleAr" className="input" dir="rtl" defaultValue={p.titleAr || ''} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Description (English) *</label>
        <textarea name="descEn" className="textarea" defaultValue={p.descEn || ''} required />
      </div>
      <div className="field">
        <label className="field-label">Description (Arabic)</label>
        <textarea name="descAr" className="textarea" dir="rtl" defaultValue={p.descAr || ''} />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Client</label>
          <input name="client" className="input" defaultValue={p.client || ''} />
        </div>
        <div className="field">
          <label className="field-label">Sector</label>
          <input name="sector" className="input" defaultValue={p.sector || ''} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Year</label>
          <input name="year" className="input" placeholder="2025" defaultValue={p.year || ''} />
        </div>
        <div className="field">
          <label className="field-label">Location</label>
          <input name="location" className="input" defaultValue={p.location || ''} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Project date</label>
          <input type="date" name="projectDate" className="input" defaultValue={p.projectDate || ''} />
        </div>
        <div className="field">
          <label className="field-label">Sort order</label>
          <input type="number" name="sortOrder" className="input" defaultValue={p.sortOrder ?? 0} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Image URL</label>
        <input name="imageUrl" className="input" placeholder="/0urwork/... or https://..." defaultValue={p.imageUrl || ''} />
        <span className="field-hint">Direct upload is coming next; for now paste an image path or URL.</span>
      </div>

      <div className="field">
        <label className="field-label">Slug</label>
        <input name="slug" className="input" placeholder="auto-generated from the title" defaultValue={p.slug || ''} />
        <span className="field-hint">Leave blank to derive it from the English title.</span>
      </div>

      <div className="checkbox-row">
        <input type="checkbox" id="published" name="published" defaultChecked={project ? p.published : true} />
        <label htmlFor="published" className="field-label" style={{ margin: 0 }}>
          Published (visible on the public site)
        </label>
      </div>

      <div className="form-actions">
        <SubmitButton label={project ? 'Save changes' : 'Create project'} />
        <Link href="/admin/projects" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
