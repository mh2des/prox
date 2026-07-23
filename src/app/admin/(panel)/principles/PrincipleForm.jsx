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

export default function PrincipleForm({ action, principle }) {
  const [state, formAction] = useFormState(action, {});
  const p = principle || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">Type *</label>
          <select name="type" className="select" defaultValue={p.type || 'VISION'} required>
            <option value="VISION">Vision</option>
            <option value="MISSION">Mission</option>
            <option value="VALUE">Value</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Sort order</label>
          <input type="number" name="sortOrder" className="input" defaultValue={p.sortOrder ?? 0} />
        </div>
      </div>

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
        <label className="field-label">Text (English) *</label>
        <textarea name="textEn" className="textarea" defaultValue={p.textEn || ''} required />
      </div>
      <div className="field">
        <label className="field-label">Text (Arabic)</label>
        <textarea name="textAr" className="textarea" dir="rtl" defaultValue={p.textAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Icon</label>
        <input name="icon" className="input" defaultValue={p.icon || ''} />
        <span className="field-hint">optional icon/glyph</span>
      </div>

      <div className="form-actions">
        <SubmitButton label={principle ? 'Save changes' : 'Create entry'} />
        <Link href="/admin/principles" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
