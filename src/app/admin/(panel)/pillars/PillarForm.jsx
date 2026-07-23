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

export default function PillarForm({ action, pillar }) {
  const [state, formAction] = useFormState(action, {});
  const p = pillar || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">Letter *</label>
          <input name="letter" className="input" placeholder="T" defaultValue={p.letter || ''} required />
          <span className="field-hint">The TRACE pillar letter, e.g. T, R, A, C, E.</span>
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
        <label className="field-label">Description (English) *</label>
        <textarea name="descEn" className="textarea" defaultValue={p.descEn || ''} required />
      </div>
      <div className="field">
        <label className="field-label">Description (Arabic)</label>
        <textarea name="descAr" className="textarea" dir="rtl" defaultValue={p.descAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Key areas (English)</label>
        <textarea name="keyAreasEn" className="textarea" defaultValue={p.keyAreasEn || ''} />
        <span className="field-hint">One item per line.</span>
      </div>
      <div className="field">
        <label className="field-label">Key areas (Arabic)</label>
        <textarea name="keyAreasAr" className="textarea" dir="rtl" defaultValue={p.keyAreasAr || ''} />
        <span className="field-hint">One item per line.</span>
      </div>

      <div className="form-actions">
        <SubmitButton label={pillar ? 'Save changes' : 'Create pillar'} />
        <Link href="/admin/pillars" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
