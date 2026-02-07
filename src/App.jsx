import { useState, useMemo, useRef, useEffect } from 'react';
import { useDateTracker } from './hooks/useDateTracker';
import Countdown from './components/Countdown';
import ValentineQuestion from './components/ValentineQuestion';
import IntroductionPage from './components/IntroductionPage';
import Promise1Growth from './components/Promise1Growth';
import { Heart, Sparkles, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

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

  // Check for direct promise URL parameter (e.g., ?promise=1)
  const getInitialPromise = () => {
    const params = new URLSearchParams(window.location.search);
    const promiseParam = params.get('promise');
    if (promiseParam) {
      return parseInt(promiseParam, 10);
    }
    return null;
  };

  const initialPromise = getInitialPromise();

  // If promise parameter exists, auto-skip to that promise
  // DEFAULT TO OPEN: User requests direct access to Intro Page
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [hasAnsweredYes, setHasAnsweredYes] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const activePromiseState = useState(initialPromise);
  const [activePromise, setActivePromise] = activePromiseState;
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  // Function to play background music
  const playBackgroundMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Soft volume
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Manage Background Music: Play in Intro, Pause in Promise 1
  useEffect(() => {
    if (hasAnsweredYes) {
      if (activePromise === 1) {
        // Pause Intro music if we are in Promise 1 (Deep Link or Navigation)
        if (audioRef.current) audioRef.current.pause();
      } else {
        // For Intro or other promises, ensure global music is playing
        // Check if it's paused OR if volume was faded out, ensuring resume
        if (audioRef.current) {
          if (audioRef.current.paused) {
            audioRef.current.volume = 0.3; // Reset volume
            playBackgroundMusic();
          } else if (audioRef.current.volume < 0.3) {
            // If playing but faded (e.g. from aborted transition), restore volume
            audioRef.current.volume = 0.3;
          }
        }
      }
    }
  }, [hasAnsweredYes, activePromise]);

  // Toggle mute / Play if paused
  const toggleMute = () => {
    if (audioRef.current) {
      // If audio is paused (autoplay blocked), play it
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => console.log('Play on unmute failed', e));
        audioRef.current.muted = false;
        setIsMuted(false);
      } else {
        // Otherwise toggle mute
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  // Check if unlock button should be available (on or after Feb 7th 12am)
  const canUnlock = currentDate >= START_DATE;

  // Handle opening a promise with transition logic
  const handleOpenPromise = (promiseNum) => {
    // Clear any existing fade interval to prevent fighting
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (promiseNum === 1) {
      // Fade out music over 5 seconds
      if (audioRef.current) {
        const startVolume = audioRef.current.volume;
        const fadeDuration = 5000;
        const intervalTime = 100;
        const steps = fadeDuration / intervalTime;
        const volumeStep = startVolume / steps;

        fadeIntervalRef.current = setInterval(() => {
          if (audioRef.current.volume > volumeStep) {
            audioRef.current.volume -= volumeStep;
          } else {
            // Stop audio and clear interval
            audioRef.current.volume = 0;
            audioRef.current.pause();
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
            }

            // Navigate to Promise 1 after fade complete
            setActivePromise(1);
            // Reset volume for future use (if we come back)
            audioRef.current.volume = 0.3;
          }
        }, intervalTime);
      } else {
        // No audio ref, just navigate
        setActivePromise(1);
      }
    } else {
      setActivePromise(promiseNum);
    }
  };

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
        ) : !hasAnsweredYes ? (
          /* Valentine Question Experience */
          <ValentineQuestion
            onYesClick={() => {
              setHasAnsweredYes(true);
              playBackgroundMusic();
            }}
          />
        ) : activePromise === 1 ? (
          /* Promise 1 - The Promise of Growth */
          <Promise1Growth />
        ) : (
          /* Introduction Page - After saying Yes */
          <IntroductionPage
            currentDate={currentDate}
            onOpenPromise={handleOpenPromise}
            skipAnimation={true}
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

      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/mycutusbdaycountdown2026/music/background.mp3"
        loop
        preload="auto"
      />

      {/* Mute/Unmute Button - Only show after Yes */}
      {hasAnsweredYes && (
        <button
          onClick={toggleMute}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #e91e63',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
            transition: 'all 0.3s ease',
            zIndex: 100,
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isMuted ? (
            <VolumeX size={24} color="#e91e63" />
          ) : (
            <Volume2 size={24} color="#e91e63" />
          )}
        </button>
      )}

      {/* Back Button - Only show when viewing a promise */}
      {activePromise !== null && (
        <button
          onClick={() => setActivePromise(null)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(254, 243, 199, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#fef3c7',
            fontFamily: "'Dancing Script', cursive",
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            zIndex: 200,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowLeft size={20} />
          Back to Vachan
        </button>
      )}

    </div>
  );
}

export default App;
