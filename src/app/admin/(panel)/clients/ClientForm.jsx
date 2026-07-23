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

export default function ClientForm({ action, client }) {
  const [state, formAction] = useFormState(action, {});
  const c = client || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="field">
        <label className="field-label">Name *</label>
        <input name="name" className="input" defaultValue={c.name || ''} required />
      </div>

      <div className="field">
        <label className="field-label">Description (English)</label>
        <textarea name="descEn" className="textarea" defaultValue={c.descEn || ''} />
      </div>
      <div className="field">
        <label className="field-label">Description (Arabic)</label>
        <textarea name="descAr" className="textarea" dir="rtl" defaultValue={c.descAr || ''} />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Website</label>
          <input name="website" className="input" placeholder="https://..." defaultValue={c.website || ''} />
        </div>
        <div className="field">
          <label className="field-label">Sort order</label>
          <input type="number" name="sortOrder" className="input" defaultValue={c.sortOrder ?? 0} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Logo URL</label>
        <input name="logoUrl" className="input" placeholder="https://..." defaultValue={c.logoUrl || ''} />
        <span className="field-hint">paste a logo URL for now</span>
      </div>

      <div className="checkbox-row">
        <input type="checkbox" id="published" name="published" defaultChecked={client ? c.published : true} />
        <label htmlFor="published" className="field-label" style={{ margin: 0 }}>
          Published (visible on the public site)
        </label>
      </div>

      <div className="form-actions">
        <SubmitButton label={client ? 'Save changes' : 'Create client'} />
        <Link href="/admin/clients" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
