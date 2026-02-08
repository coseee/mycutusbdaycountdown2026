import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { useMousePosition } from '../hooks/useMousePosition';

// Floating Glow Orbs - Background effect (Galaxy Version)
const FloatingGlow = () => {
    // Visible, slow moving, galaxy feel - MEMOIZED to prevent jitter on re-renders
    const orbs = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 100 + 40, // 40px - 140px (Larger)
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 60 + 60, // 60s - 120s (Very slow)
    })), []);

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {orbs.map((orb) => (
                <div
                    key={orb.id}
                    style={{
                        position: 'absolute',
                        left: `${orb.left}%`,
                        top: `${orb.top}%`,
                        width: `${orb.size}px`,
                        height: `${orb.size}px`,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)', // Higher opacity (visible)
                        filter: 'blur(10px)', // Softer blur
                        animation: `float-particle ${orb.duration}s infinite ease-in-out`,
                        animationDelay: `${orb.delay}s`,
                        opacity: 0.6, // Base opacity
                    }}
                />
            ))}
        </div>
    );
};

const Promise1Growth = ({ isMuted, toggleMute }) => {
    const containerRef = useRef(null);
    const musicRef = useRef(null);
    const { position: mousePosition, isActive: mouseActive } = useMousePosition(1); // Instant tracking

    // Animation states
    const [particles, setParticles] = useState([]);
    const particlesRef = useRef([]); // Ref for physics
    const [moonProgress, setMoonProgress] = useState(0); // 0 to 100
    const [moonPhase, setMoonPhase] = useState('new'); // 'new' | 'waxing' | 'full'
    const [sunVisible, setSunVisible] = useState(false); // New: Sun reveal delay
    const [isTransitioning, setIsTransitioning] = useState(false); // For smooth move to orbit

    // Moon Position State
    // Initially center: { x: 50, y: 50 }
    // Later: Orbiting Sun
    const [orbitAngle, setOrbitAngle] = useState(0);

    // Spark/Sun position (follows mouse - this is HER)
    const [sunPos, setSunPos] = useState({ x: 50, y: 50 });
    const sunPosRef = useRef(sunPos);

    // Initial Entry Animation (Moon fades in over 25s)
    const [entryProgress, setEntryProgress] = useState(0);

    // Interaction State
    const [hasMoved, setHasMoved] = useState(false);

    // Play Promise 1 music on mount and start Sun reveal timer
    // Play Promise 1 music on mount and start Sun reveal timer
    useEffect(() => {
        // AUDIO START (Simple & Robust)
        if (musicRef.current) {
            musicRef.current.volume = 0.4;
            musicRef.current.play().catch(e => {
                console.log('Promise 1 audio autoplay failed:', e);
            });
        }

        // MOON REVEAL ANIMATION (25 seconds)
        const startTime = Date.now();
        const duration = 25000; // 25s

        const revealInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setEntryProgress(progress);

            if (progress >= 1) clearInterval(revealInterval);
        }, 50); // Update every 50ms

        // SUN REVEAL DELAY (30 seconds)
        const sunTimer = setTimeout(() => setSunVisible(true), 30000);

        return () => {
            clearTimeout(sunTimer);
            clearInterval(revealInterval);
        };
    }, []);

    // Update Sun position based on mouse
    useEffect(() => {
        if (moonPhase === 'full') {
            // FINALE: Move Sun to Center
            setSunPos({ x: 50, y: 50 });
            return;
        }

        if (mouseActive && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const relX = ((mousePosition.x - rect.left) / rect.width) * 100;
            const relY = ((mousePosition.y - rect.top) / rect.height) * 100;

            // Allow free movement - Relaxed clamping to maximize cursor tracking
            const clampedX = Math.max(2, Math.min(98, relX));
            const clampedY = Math.max(2, Math.min(98, relY));

            setSunPos({ x: clampedX, y: clampedY });

            if (!hasMoved) setHasMoved(true);
        }
    }, [mousePosition, mouseActive, hasMoved]);

    // Keep ref updated for intervals
    useEffect(() => {
        sunPosRef.current = sunPos;
    }, [sunPos]);

    // Particle System & Moon Logic
    useEffect(() => {
        const particleInterval = setInterval(() => {
            if (moonPhase === 'full' || isTransitioning || !sunVisible || !hasMoved) return; // Only emit when Sun is visible AND cursor moved

            const id = Date.now() + Math.random();
            const startX = sunPosRef.current.x;
            const startY = sunPosRef.current.y;

            // Calculate angle to center (50, 50)
            const dx = 50 - startX;
            const dy = 50 - startY;
            const angle = Math.atan2(dy, dx);

            // Add to Ref (Physics Source)
            particlesRef.current.push({
                id,
                x: startX,
                y: startY,
                angle, // Store angle for rotation
                progress: 0,
                speed: 0.02 + Math.random() * 0.01,
            });
        }, 75); // Fast beam: New particle every 75ms

        // Animation Loop for particles
        let animationFrame;
        const animate = () => {
            const currentParticles = particlesRef.current;
            const nextParticles = [];
            let absorbedCount = 0;

            currentParticles.forEach(p => {
                // Target: Center (50, 50)
                const targetX = 50;
                const targetY = 50;

                const newProgress = p.progress + p.speed;

                // Interpolate
                const currentX = p.x + (targetX - p.x) * newProgress;
                const currentY = p.y + (targetY - p.y) * newProgress;

                if (newProgress >= 1) {
                    absorbedCount++; // Reached Moon
                } else {
                    p.x = currentX;
                    p.y = currentY;
                    p.progress = newProgress;
                    nextParticles.push(p);
                }
            });

            // Update Ref
            particlesRef.current = nextParticles;

            // Update State for Render (if particles exist)
            if (currentParticles.length > 0) {
                setParticles([...nextParticles]);
            }

            // Handle Growth (Side Effect Safe Here)
            if (absorbedCount > 0) {
                setMoonProgress(prev => {
                    // Calculate distance
                    const sunX = sunPosRef.current.x;
                    const sunY = sunPosRef.current.y;
                    const dist = Math.sqrt(Math.pow(sunX - 50, 2) + Math.pow(sunY - 50, 2));

                    // Max distance ~70. Factor 1.0 (Close) -> 0.4 (Far)
                    const distanceFactor = Math.max(0.4, 1 - (dist / 70));

                    // Growth Rate (Increased for faster progression ~40s to 1m45s)
                    const growth = 0.18 * distanceFactor;

                    const newProg = Math.min(100, prev + absorbedCount * growth);

                    if (newProg >= 100) {
                        setIsTransitioning(true);
                        setTimeout(() => {
                            setIsTransitioning(false);
                            setMoonPhase('full');
                        }, 2000);
                    }
                    return newProg;
                });
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            clearInterval(particleInterval);
            cancelAnimationFrame(animationFrame);
        };
    }, [moonPhase, isTransitioning, sunVisible, hasMoved]);

    // ORBIT LOGIC (Only when 'full')
    useEffect(() => {
        if (moonPhase !== 'full') return;

        let orbitFrame;
        const animateOrbit = () => {
            setOrbitAngle(prev => (prev + 0.005) % (Math.PI * 2)); // Increment angle (slower orbit for majesty)
            orbitFrame = requestAnimationFrame(animateOrbit);
        };
        orbitFrame = requestAnimationFrame(animateOrbit);

        return () => cancelAnimationFrame(orbitFrame);
    }, [moonPhase]);

    // Calculate Moon Render Position
    const getMoonRenderPos = () => {
        if (moonPhase !== 'full' && !isTransitioning) {
            return { x: 50, y: 50 }; // Fixed center
        }

        // Target Orbit Radius
        const radiusX = 25;
        const radiusY = 25;

        // Target Position (Orbit)
        const targetX = sunPos.x + Math.cos(orbitAngle) * radiusX;
        const targetY = sunPos.y + Math.sin(orbitAngle) * radiusY;

        // If transitioning, we interpolate (handled by CSS transition for simplicity or could be JS)
        // For simplicity, we'll let CSS handle the position move from 50,50 to target
        return { x: targetX, y: targetY };
    };

    const moonRenderPos = getMoonRenderPos();

    // Derived Visuals
    const moonScale = 0.5 + (moonProgress / 100) * 0.5; // Starts at 0.5, grows to 1.0
    const moonOpacity = 0.3 + (moonProgress / 100) * 0.7; // Starts at 0.3, grows to 1.0
    const moonGlow = (moonProgress / 100) * 40; // Glow radius in px

    // Sun Scale - Grows when Moon is full (Phase 2)
    const isSunEnhanced = moonPhase === 'full' || isTransitioning;

    return (
        <div
            ref={containerRef}
            className="promise-1-container"
            style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(to top, #4a1942 0%, #2d1b4e 50%, #1a1a2e 100%)', // Original Rose-Burgundy -> Midnight Purple
                overflow: 'hidden',
                zIndex: 100,
            }}
        >
            {/* Floating Glow Orbs (Yellow Circles) */}
            <FloatingGlow />

            {/* Title - Fade in ONLY when Sun moves to center (Finale) */}
            <div
                style={{
                    position: 'absolute',
                    top: '8%', // Moved up from 15%
                    width: '100%',
                    textAlign: 'center',
                    zIndex: 20,
                    pointerEvents: 'none',
                    opacity: isSunEnhanced ? 1 : 0,
                    transition: 'opacity 3s ease-in-out',
                    transitionDelay: '1s', // Wait for sun to start moving
                }}
            >
                <h1
                    style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: '3.5rem',
                        color: '#fff',
                        margin: 0,
                        textShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
                    }}
                >
                    The Promise of Growth
                </h1>
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '20%', // Moved up from 40% to top-left
                    left: '10%',
                    maxWidth: '350px', // Slightly wider for cursive
                    textAlign: 'left',
                    zIndex: 20,
                    pointerEvents: 'none',
                    opacity: isSunEnhanced ? 1 : 0,
                    transition: 'opacity 3s ease-in-out',
                    transitionDelay: '6s', // 5s after title start (+1s base)
                }}
            >
                <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: '1.8rem',
                        background: 'linear-gradient(to right, #fbcfe8, #d8b4fe)', // Rose-Pink to Lavender
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                        lineHeight: 1.4,
                        fontWeight: 700,
                        display: 'inline', // Ensure gradient applies cleanly
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))', // Added correct drop-shadow
                    }}>
                        "The Moon has no light of its own, it only reflects the Sun." 🌑✨
                    </span>
                </div>
                <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '1.5rem',
                    color: '#f5d0fe', // Fuchsia 200 (Soft Pink)
                    fontWeight: 600,
                    textShadow: '0 0 10px rgba(245, 208, 254, 0.4)',
                    marginLeft: '1rem',
                }}>
                    "And I am at my brightest when I am near you." 🌕💖
                </p>
            </div>

            {/* Right Side Poetry - Fades in last */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    maxWidth: '350px',
                    textAlign: 'right',
                    zIndex: 20,
                    pointerEvents: 'none',
                    opacity: isSunEnhanced ? 1 : 0,
                    transition: 'opacity 3s ease-in-out',
                    transitionDelay: '16s', // 10s after left text (+6s base)
                }}
            >
                <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: '2rem',
                        background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline',
                        fontWeight: 700,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}>
                        You are my Sun, and I am forever in your orbit. ☀️💫
                    </span>
                </div>
                <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '1.8rem',
                    color: '#f472b6', // Pink 400
                    fontWeight: 600,
                    textShadow: '0 0 10px rgba(244, 114, 182, 0.4)',
                }}>
                    Always growing, for you 🌹
                </p>
            </div>

            {/* Particles */}
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        borderRight: '3px solid #fcd34d', // Wifi arc shape
                        borderTop: '3px solid transparent',
                        borderBottom: '3px solid transparent',
                        borderLeft: '3px solid transparent',
                        transform: `translate(-50%, -50%) rotate(${p.angle}rad)`, // Rotate towards center
                        filter: 'drop-shadow(0 0 4px #fcd34d)',
                        opacity: 1,
                        pointerEvents: 'none',
                        zIndex: 18,
                        transition: 'opacity 0.2s',
                    }}
                />
            ))}

            {/* The Sun (Her) */}
            <div
                className="the-sun"
                style={{
                    position: 'absolute',
                    left: `${sunPos.x}%`,
                    top: `${sunPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                    cursor: sunVisible ? 'none' : 'auto',
                    opacity: sunVisible ? 1 : 0,
                    pointerEvents: sunVisible ? 'auto' : 'none',
                    width: '60px', // Explicit size for centering
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center', // Just to be safe
                    justifyContent: 'center',
                    transition: moonPhase === 'full'
                        ? 'left 2s ease-in-out, top 2s ease-in-out, opacity 1.5s ease-in-out'
                        : 'opacity 1.5s ease-in-out',
                }}
            >
                {/* Realistic Sun (CSS Sphere) - Only visible when enhanced */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, #fffbeb, #fcd34d 20%, #f59e0b 60%, #b45309 100%)',
                        boxShadow: '0 0 60px rgba(251, 191, 36, 0.6), inset 0 0 40px rgba(251, 146, 60, 0.8)',
                        transform: 'translate(-50%, -50%) scale(0)', // Start hidden
                        opacity: 0,
                        animation: isSunEnhanced ? 'sun-appear 2s ease-out forwards' : 'none', // Animate in
                        zIndex: 2,
                    }}
                >
                    {/* Sun Activity/Corona */}
                    <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)', animation: 'pulse-glow 3s infinite ease-in-out' }}></div>
                </div>

                {/* Original Icon Sun (Fades out when enhanced) */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: isSunEnhanced ? 0 : 1,
                    transition: 'opacity 1s ease-out'
                }}>
                    <div
                        style={{
                            position: 'absolute',
                            inset: '-30px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
                            animation: 'spin-slow 12s linear infinite',
                        }}
                    />
                    <Sun
                        size={56}
                        style={{
                            color: '#fbbf24', // Amber-400
                            filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))',
                            animation: 'spin-slow 20s linear infinite',
                        }}
                    />
                </div>

                <span
                    style={{
                        position: 'absolute',
                        top: isSunEnhanced ? '170px' : '80px', // Increased to 170px for clearance
                        left: '70%', // Hardcoded to 70% as per user request
                        transform: 'translateX(-50%)',
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: isSunEnhanced ? '1.5rem' : '1.2rem',
                        color: '#fbbf24',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                        transition: 'all 1s ease-out',
                    }}
                >
                    peru ☀️
                </span>
            </div>

            {/* The Moon (Me) */}
            <div
                className="the-moon"
                style={{
                    position: 'absolute',
                    left: `${moonRenderPos.x}%`,
                    top: `${moonRenderPos.y}%`,
                    transform: `translate(-50%, -50%) scale(${moonScale})`,
                    zIndex: 15,
                    opacity: moonOpacity * entryProgress, // Combine gameplay opacity with entry fade
                    transition: isTransitioning ? 'left 2s ease-in-out, top 2s ease-in-out, transform 2s' : (moonPhase === 'full' ? 'none' : 'transform 0.1s'),
                }}
            >
                {/* Moon Glow (increases with progress) */}
                <div
                    style={{
                        position: 'absolute',
                        inset: `-${moonGlow}px`,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(226, 232, 240, 0.3) 0%, transparent 70%)',
                        transition: 'inset 0.3s',
                    }}
                />
                {/* Realistic Moon (CSS Sphere) */}
                <div
                    style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 35% 35%, #f8fafc, #cbd5e1 40%, #475569 85%, #0f172a 100%)',
                        boxShadow: `
                            inset -10px -10px 20px rgba(0,0,0,0.5),
                            inset 10px 10px 20px rgba(255,255,255,0.8),
                            0 0 ${moonGlow}px rgba(226, 232, 240, 0.6)
                        `,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Subtle Craters (Overlay) */}
                    <div style={{ position: 'absolute', top: '20%', left: '25%', width: '15%', height: '15%', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: '55%', left: '60%', width: '25%', height: '25%', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: '70%', left: '30%', width: '10%', height: '10%', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.1)' }}></div>
                </div>
                <span
                    style={{
                        position: 'absolute',
                        top: '120%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: '3rem',
                        color: '#e2e8f0',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        opacity: 0.8,
                    }}
                >
                    omo 🌙
                </span>
            </div>

            {/* Dynamic Proximity Text (Only when Sun is visible and active) */}
            {sunVisible && moonPhase !== 'full' && !isTransitioning && (
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    width: '100%',
                    textAlign: 'center',
                    color: '#e2e8f0',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.2rem',
                    pointerEvents: 'none',
                    opacity: 0.8,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease'
                }}>
                    {hasMoved ? (
                        Math.sqrt(Math.pow(sunPos.x - 50, 2) + Math.pow(sunPos.y - 50, 2)) > 30
                            ? "(be closer to me please🥺)"
                            : "☺️"
                    ) : (
                        "Reach out to the moon..."
                    )}
                </div>
            )}

            {/* Promise 1 Specific Music */}
            <audio
                ref={musicRef}
                src="/mycutusbdaycountdown2026/music/promise1.mp3"
                loop
                muted={isMuted}
            />

            {/* Themed Mute/Unmute Button */}
            <button
                onClick={toggleMute}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)', // Glassmorphism
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(251, 191, 36, 0.5)', // Gold border
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.2)',
                    transition: 'all 0.3s ease',
                    zIndex: 200,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
            >
                {isMuted ? (
                    <VolumeX size={24} color="#fbbf24" /> // Amber-400
                ) : (
                    <Volume2 size={24} color="#fbbf24" />
                )}
            </button>
        </div>
    );
};

export default Promise1Growth;
