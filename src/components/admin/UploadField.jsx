'use client';

import { useState } from 'react';
import { UploadButton } from '@/lib/uploadthing';

// Drop-in replacement for a URL text input. Uploads via UploadThing and keeps a
// hidden input in sync so the resulting URL posts with a normal Server Action.
// Also allows pasting/editing a URL directly. endpoint: 'image' | 'document'.
export default function UploadField({ name, defaultValue = '', endpoint = 'image' }) {
  const [url, setUrl] = useState(defaultValue || '');
  const [error, setError] = useState('');
  const isImage = endpoint === 'image';

  return (
    <div className="upload-field">
      {url ? (
        <div className="upload-preview">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="preview" className="upload-thumb" />
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              View file
            </a>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setUrl('')}>
            Remove
          </button>
        </div>
      ) : null}

      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          const u = res?.[0]?.ufsUrl ?? res?.[0]?.url;
          if (u) {
            setUrl(u);
            setError('');
          }
        }}
        onUploadError={(e) => setError(e?.message || 'Upload failed')}
      />

      {error && <div className="form-error">{error}</div>}

      <input
        className="input"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="…or paste an image path / URL"
        style={{ marginTop: 8 }}
      />
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
