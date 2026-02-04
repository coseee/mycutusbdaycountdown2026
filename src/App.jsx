import { useState, useMemo } from 'react';
import { useDateTracker } from './hooks/useDateTracker';
import Countdown from './components/Countdown';
import ValentineQuestion from './components/ValentineQuestion';
import { Heart, Sparkles } from 'lucide-react';

// Floating Hearts Background - Memoized to prevent re-render repositioning
const BackgroundHearts = () => {
  const hearts = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${4 + Math.random() * 4}s`,
      size: 15 + Math.random() * 30,
      opacity: 0.2 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart animate-float"
          style={{
            left: heart.left,
            top: heart.top,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            opacity: heart.opacity,
          }}
        >
          <Heart size={heart.size} fill="currentColor" />
        </div>
      ))}
    </div>
  );
};

function App() {
  const { currentDate, isPreEvent, START_DATE } = useDateTracker();
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if unlock button should be available (on or after Feb 7th 12am)
  const canUnlock = currentDate >= START_DATE;

  return (
    <div className="app-container">
      <BackgroundHearts />

      {/* Main Content - Absolutely Centered */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 10,
        width: '100%',
        maxWidth: '900px',
        padding: '0 1rem',
        gap: '2rem'
      }}>

        {/* Hero Section */}
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {/* Only show heart and title before unlock */}
          {!isUnlocked && (
            <>
              <div
                className="animate-pulse-glow"
                style={{
                  padding: '1.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 8px 32px rgba(136, 14, 79, 0.2)',
                }}
              >
                <Heart
                  size={64}
                  style={{ color: '#c2185b', fill: '#e91e63' }}
                />
              </div>

              {/* Title */}
              <h1
                className="font-heading text-heading"
                style={{
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  textShadow: '2px 2px 8px rgba(136, 14, 79, 0.2)',
                  margin: 0,
                }}
              >
                My Cutu's Birthday Countdown
              </h1>
            </>
          )}
          {/* Subtitle - Personal Message (only show before unlock) */}
          {!isUnlocked && (
            <p
              className="font-body"
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                color: '#6a6a6a',
                fontWeight: 300,
                maxWidth: '600px',
                lineHeight: 1.6,
              }}
            >
              I wasn't allowed to spend money..... so I spent my time building this for you{' '}
              <span
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
                className="emoji-easter-egg"
              >
                🥰
                <span
                  className="easter-egg-tooltip"
                  style={{
                    position: 'absolute',
                    bottom: '120%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #fff 0%, #fce4ec 100%)',
                    color: '#880e4f',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 15px rgba(136, 14, 79, 0.2)',
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'all 0.3s ease',
                    pointerEvents: 'none',
                  }}
                >
                  I hope you like it bb 🧡
                </span>
              </span>
            </p>
          )}
        </header>

        {/* Show Countdown Section until user clicks Unlock */}
        {!isUnlocked ? (
          <section
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '700px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {/* Show countdown if still pre-event */}
            {isPreEvent ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={24} style={{ color: '#c2185b' }} />
                  <h2
                    className="font-heading text-primary-dark"
                    style={{ fontSize: '1.75rem', margin: 0 }}
                  >
                    Beginning on Feb 7th
                  </h2>
                  <Sparkles size={24} style={{ color: '#c2185b' }} />
                </div>
                <Countdown targetDate={START_DATE} currentDate={currentDate} />
              </>
            ) : (
              /* Countdown ended - show celebration message */
              <div className="font-heading text-primary-dark animate-celebration" style={{ fontSize: '2.5rem', textAlign: 'center' }}>
                🎉 It's Time! 🎉
              </div>
            )}

            {/* Unlock Button - Only visible after countdown ends */}
            {canUnlock && (
              <button
                className="animate-fade-in-up"
                onClick={() => setIsUnlocked(true)}
                style={{
                  marginTop: '1rem',
                  padding: '1rem 2.5rem',
                  fontSize: '1.25rem',
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 700,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(233, 30, 99, 0.4)',
                  transition: 'all 0.3s ease',
                  animationDelay: '0.3s',
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 30px rgba(233, 30, 99, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(233, 30, 99, 0.4)';
                }}
              >
                💝 Unlock Your Surprises 💝
              </button>
            )}
          </section>
        ) : (
          /* Valentine Question Experience */
          <ValentineQuestion
            onYesClick={() => {
              // For now, show a celebration! Later we can add more content
              alert('🎉 YAY! I knew you\'d say yes! Happy Valentine\'s Day, my love! 💖');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer font-heading" style={{ color: '#880e4f', fontSize: '1.1rem' }}>
        <p style={{ margin: 0 }}>
          Made with ❤️ by <span style={{ color: '#e91e63', fontWeight: 700 }}>Omo</span> for his <span style={{ color: '#e65100', fontWeight: 700, textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>Peru</span>
        </p>
        <p className="font-body" style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>
          {currentDate.toLocaleString()}
        </p>
      </footer>

    </div>
  );
}

export default App;
