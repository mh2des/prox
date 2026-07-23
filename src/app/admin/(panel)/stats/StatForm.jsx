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

export default function StatForm({ action, stat }) {
  const [state, formAction] = useFormState(action, {});
  const s = stat || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">Value (English) *</label>
          <input name="valueEn" className="input" placeholder="50+" defaultValue={s.valueEn || ''} required />
        </div>
        <div className="field">
          <label className="field-label">Value (Arabic)</label>
          <input name="valueAr" className="input" dir="rtl" defaultValue={s.valueAr || ''} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Label (English) *</label>
          <input name="labelEn" className="input" placeholder="Institutions Served" defaultValue={s.labelEn || ''} required />
        </div>
        <div className="field">
          <label className="field-label">Label (Arabic)</label>
          <input name="labelAr" className="input" dir="rtl" defaultValue={s.labelAr || ''} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Sort order</label>
        <input type="number" name="sortOrder" className="input" defaultValue={s.sortOrder ?? 0} />
      </div>

      <div className="form-actions">
        <SubmitButton label={stat ? 'Save changes' : 'Create stat'} />
        <Link href="/admin/stats" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
