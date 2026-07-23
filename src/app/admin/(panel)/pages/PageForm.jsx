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

export default function PageForm({ action, page }) {
  const [state, formAction] = useFormState(action, {});
  const p = page || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">Hero badge (English)</label>
          <input name="heroBadgeEn" className="input" defaultValue={p.heroBadgeEn || ''} />
        </div>
        <div className="field">
          <label className="field-label">Hero badge (Arabic)</label>
          <input name="heroBadgeAr" className="input" dir="rtl" defaultValue={p.heroBadgeAr || ''} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Hero title (English)</label>
          <input name="heroTitleEn" className="input" defaultValue={p.heroTitleEn || ''} />
        </div>
        <div className="field">
          <label className="field-label">Hero title (Arabic)</label>
          <input name="heroTitleAr" className="input" dir="rtl" defaultValue={p.heroTitleAr || ''} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Hero subtitle (English)</label>
        <textarea name="heroSubtitleEn" className="textarea" defaultValue={p.heroSubtitleEn || ''} />
      </div>
      <div className="field">
        <label className="field-label">Hero subtitle (Arabic)</label>
        <textarea name="heroSubtitleAr" className="textarea" dir="rtl" defaultValue={p.heroSubtitleAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Intro (English)</label>
        <textarea name="introEn" className="textarea" defaultValue={p.introEn || ''} />
      </div>
      <div className="field">
        <label className="field-label">Intro (Arabic)</label>
        <textarea name="introAr" className="textarea" dir="rtl" defaultValue={p.introAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Hero image URL</label>
        <input name="heroImageUrl" className="input" placeholder="/… or https://…" defaultValue={p.heroImageUrl || ''} />
        <span className="field-hint">Image path or URL.</span>
      </div>

      <div className="form-actions">
        <SubmitButton label="Save page" />
        <Link href="/admin/pages" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
