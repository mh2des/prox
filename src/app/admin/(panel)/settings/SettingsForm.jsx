'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateSettings } from './actions';

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  );
}

export default function SettingsForm({ setting }) {
  const [state, formAction] = useFormState(updateSettings, {});
  const s = setting || {};

  return (
    <form action={formAction} className="form">
      {state?.error && <div className="form-error">{state.error}</div>}
      {state?.ok && <div className="field-hint">Settings saved.</div>}

      <div className="form-row">
        <div className="field">
          <label className="field-label">Company name *</label>
          <input name="companyName" className="input" defaultValue={s.companyName || ''} required />
        </div>
        <div className="field">
          <label className="field-label">Admin email *</label>
          <input type="email" name="adminEmail" className="input" defaultValue={s.adminEmail || ''} required />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Company description (English)</label>
        <textarea name="companyDescEn" className="textarea" defaultValue={s.companyDescEn || ''} />
      </div>
      <div className="field">
        <label className="field-label">Company description (Arabic)</label>
        <textarea name="companyDescAr" className="textarea" dir="rtl" defaultValue={s.companyDescAr || ''} />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Timezone</label>
          <input name="timezone" className="input" defaultValue={s.timezone || ''} />
        </div>
        <div className="field">
          <label className="field-label">Default language</label>
          <select name="defaultLanguage" className="select" defaultValue={s.defaultLanguage || 'en'}>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Session timeout (minutes)</label>
          <input type="number" name="sessionTimeoutMins" className="input" defaultValue={s.sessionTimeoutMins ?? 0} />
        </div>
        <div className="field">
          <label className="field-label">Max login attempts</label>
          <input type="number" name="maxLoginAttempts" className="input" defaultValue={s.maxLoginAttempts ?? 0} />
        </div>
      </div>

      <div className="checkbox-row">
        <input
          type="checkbox"
          id="emailNotifications"
          name="emailNotifications"
          defaultChecked={!!s.emailNotifications}
        />
        <label htmlFor="emailNotifications" className="field-label" style={{ margin: 0 }}>
          Email notifications enabled
        </label>
      </div>

      <div className="form-actions">
        <SubmitButton label="Save settings" />
      </div>
    </form>
  );
}
