'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const C = {
  primary: '#298A8B',
  primaryLight: '#3AACAD',
  bg2: '#161C22',
  bg3: '#1D252E',
  border: 'rgba(255,255,255,0.09)',
  text: '#E8EDF2',
  muted: '#6B7A8D',
  red: '#E05B5B',
};

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: '100%',
          maxWidth: 380,
          background: C.bg2,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Pro<span style={{ color: C.primaryLight }}>Ex</span>
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Admin Control Panel
          </div>
        </div>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@proex.com"
          autoComplete="username"
          required
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: 16 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          style={inputStyle}
        />

        {error && (
          <div style={{ color: C.red, fontSize: 13, marginTop: 14 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '12px',
            borderRadius: 8,
            border: 'none',
            background: loading ? C.bg3 : C.primary,
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Signing in…' : 'Sign In to Dashboard'}
        </button>
      </form>
    </main>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  color: C.text,
  marginBottom: 8,
  fontWeight: 500,
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 14px',
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  background: C.bg3,
  color: C.text,
  fontSize: 14,
  outline: 'none',
};
