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

export default function SectorForm({ action, sector }) {
  const [state, formAction] = useFormState(action, {});
  const s = sector || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">Title (English) *</label>
          <input name="titleEn" className="input" defaultValue={s.titleEn || ''} required />
        </div>
        <div className="field">
          <label className="field-label">Title (Arabic)</label>
          <input name="titleAr" className="input" dir="rtl" defaultValue={s.titleAr || ''} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Description (English)</label>
        <textarea name="descEn" className="textarea" defaultValue={s.descEn || ''} />
      </div>
      <div className="field">
        <label className="field-label">Description (Arabic)</label>
        <textarea name="descAr" className="textarea" dir="rtl" defaultValue={s.descAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Sort order</label>
        <input type="number" name="sortOrder" className="input" defaultValue={s.sortOrder ?? 0} />
      </div>

      <div className="form-actions">
        <SubmitButton label={sector ? 'Save changes' : 'Create sector'} />
        <Link href="/admin/sectors" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
