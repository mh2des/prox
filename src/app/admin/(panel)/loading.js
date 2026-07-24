// Shown while any admin page's server data loads. Generic skeleton that
// works for both list and form pages.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="admin-page-head">
        <div style={{ width: '100%' }}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" style={{ width: 180, marginTop: 10 }} />
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 16,
              padding: '16px 18px',
              borderBottom: i < 4 ? '1px solid var(--a-border)' : 'none',
            }}
          >
            <div className="skeleton skeleton-line" style={{ flex: 2 }} />
            <div className="skeleton skeleton-line" style={{ flex: 1 }} />
            <div className="skeleton skeleton-line" style={{ width: 90 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
