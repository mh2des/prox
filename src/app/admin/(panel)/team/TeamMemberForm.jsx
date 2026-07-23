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

export default function TeamMemberForm({ action, member }) {
  const [state, formAction] = useFormState(action, {});
  const m = member || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="field">
        <label className="field-label">Name *</label>
        <input name="name" className="input" defaultValue={m.name || ''} required />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Position (English) *</label>
          <input name="positionEn" className="input" defaultValue={m.positionEn || ''} required />
        </div>
        <div className="field">
          <label className="field-label">Position (Arabic)</label>
          <input name="positionAr" className="input" dir="rtl" defaultValue={m.positionAr || ''} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Bio (English)</label>
        <textarea name="bioEn" className="textarea" defaultValue={m.bioEn || ''} />
      </div>
      <div className="field">
        <label className="field-label">Bio (Arabic)</label>
        <textarea name="bioAr" className="textarea" dir="rtl" defaultValue={m.bioAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Expertise (English)</label>
        <textarea name="expertiseEn" className="textarea" defaultValue={m.expertiseEn || ''} />
        <span className="field-hint">One item per line.</span>
      </div>
      <div className="field">
        <label className="field-label">Expertise (Arabic)</label>
        <textarea name="expertiseAr" className="textarea" dir="rtl" defaultValue={m.expertiseAr || ''} />
        <span className="field-hint">One item per line.</span>
      </div>

      <div className="field">
        <label className="field-label">Experience (English)</label>
        <textarea name="experienceEn" className="textarea" defaultValue={m.experienceEn || ''} />
        <span className="field-hint">One item per line.</span>
      </div>
      <div className="field">
        <label className="field-label">Experience (Arabic)</label>
        <textarea name="experienceAr" className="textarea" dir="rtl" defaultValue={m.experienceAr || ''} />
        <span className="field-hint">One item per line.</span>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Photo URL</label>
          <input name="photoUrl" className="input" placeholder="/team/... or https://..." defaultValue={m.photoUrl || ''} />
        </div>
        <div className="field">
          <label className="field-label">LinkedIn</label>
          <input name="linkedin" className="input" placeholder="https://linkedin.com/in/..." defaultValue={m.linkedin || ''} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Sort order</label>
        <input type="number" name="sortOrder" className="input" defaultValue={m.sortOrder ?? 0} />
      </div>

      <div className="checkbox-row">
        <input type="checkbox" id="published" name="published" defaultChecked={member ? m.published : true} />
        <label htmlFor="published" className="field-label" style={{ margin: 0 }}>
          Published (visible on the public site)
        </label>
      </div>

      <div className="form-actions">
        <SubmitButton label={member ? 'Save changes' : 'Create member'} />
        <Link href="/admin/team" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
