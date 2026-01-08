import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        padding: '4rem',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #fff, #a0a5b9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Goal Tracker
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem',
          lineHeight: 1.6
        }}>
          Transform your dreams into actionable plans. Track goals, measure progress, and integrate with your life.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
          <button className="glass-panel" style={{
            padding: '12px 24px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600
          }}>
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
