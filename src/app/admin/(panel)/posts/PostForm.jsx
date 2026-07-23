'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import RichTextEditor from '@/components/admin/RichTextEditor';
import UploadField from '@/components/admin/UploadField';

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  );
}

export default function PostForm({ action, post }) {
  const [state, formAction] = useFormState(action, {});
  const p = post || {};

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
        <label className="field-label">Excerpt (English)</label>
        <textarea name="excerptEn" className="textarea" defaultValue={p.excerptEn || ''} />
      </div>
      <div className="field">
        <label className="field-label">Excerpt (Arabic)</label>
        <textarea name="excerptAr" className="textarea" dir="rtl" defaultValue={p.excerptAr || ''} />
      </div>

      <div className="field">
        <label className="field-label">Content (English)</label>
        <RichTextEditor name="contentEn" defaultValue={p.contentEn || ''} />
      </div>
      <div className="field">
        <label className="field-label">Content (Arabic)</label>
        <RichTextEditor name="contentAr" defaultValue={p.contentAr || ''} dir="rtl" />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Author</label>
          <input name="author" className="input" defaultValue={p.author || ''} />
        </div>
        <div className="field">
          <label className="field-label">Status</label>
          <select name="status" className="select" defaultValue={p.status || 'DRAFT'}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field-label">Published date</label>
          <input type="date" name="publishedAt" className="input" defaultValue={p.publishedAt || ''} />
        </div>
        <div className="field">
          <label className="field-label">Featured image URL</label>
          <UploadField name="featuredImage" defaultValue={p.featuredImage || ''} endpoint="image" />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Slug</label>
        <input name="slug" className="input" placeholder="auto-generated from the title" defaultValue={p.slug || ''} />
        <span className="field-hint">Leave blank to derive it from the English title.</span>
      </div>

      <div className="form-actions">
        <SubmitButton label={post ? 'Save changes' : 'Create post'} />
        <Link href="/admin/posts" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
