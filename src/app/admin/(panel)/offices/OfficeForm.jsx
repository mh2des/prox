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

export default function OfficeForm({ action, office }) {
  const [state, formAction] = useFormState(action, {});
  const o = office || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">City (English) *</label>
          <input name="cityEn" className="input" defaultValue={o.cityEn || ''} required />
        </div>
        <div className="field">
          <label className="field-label">City (Arabic)</label>
          <input name="cityAr" className="input" dir="rtl" defaultValue={o.cityAr || ''} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Address (English) *</label>
        <textarea name="addressEn" className="textarea" defaultValue={o.addressEn || ''} required />
      </div>
      <div className="field">
        <label className="field-label">Address (Arabic)</label>
        <textarea name="addressAr" className="textarea" dir="rtl" defaultValue={o.addressAr || ''} />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Phone</label>
          <input name="phone" className="input" defaultValue={o.phone || ''} />
        </div>
        <div className="field">
          <label className="field-label">Email</label>
          <input name="email" className="input" defaultValue={o.email || ''} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Maps URL</label>
        <input name="mapsUrl" className="input" placeholder="https://maps.google.com/..." defaultValue={o.mapsUrl || ''} />
      </div>

      <div className="field">
        <label className="field-label">Sort order</label>
        <input type="number" name="sortOrder" className="input" defaultValue={o.sortOrder ?? 0} />
      </div>

      <div className="form-actions">
        <SubmitButton label={office ? 'Save changes' : 'Create office'} />
        <Link href="/admin/offices" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
