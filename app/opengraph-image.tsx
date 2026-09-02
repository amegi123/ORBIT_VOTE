import { ImageResponse } from 'next/og';

export const alt = 'Orbit Creative Challenge 2026 | Creator Voting';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Subtle decorative border ring */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            bottom: '24px',
            left: '24px',
            right: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
          }}
        />

        {/* Brand Tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(37, 99, 235, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            padding: '10px 24px',
            borderRadius: '9999px',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '3px',
            color: '#60a5fa',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
          ORBIT ELECTRONICS PRESENTS
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '20px',
            color: '#ffffff',
            maxWidth: '1000px',
          }}
        >
          Orbit Creative Challenge 2026
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 500,
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Vote for your favorite creator and follow the live competition leaderboard.
        </div>

        {/* Badges footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#2563eb',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '14px',
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            VOTE NOW
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '12px 24px',
              borderRadius: '14px',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            Verified 24-Hour Protocol
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
