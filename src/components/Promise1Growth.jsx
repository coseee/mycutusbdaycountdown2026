import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
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

const Promise1Growth = () => {
    const containerRef = useRef(null);
    const musicRef = useRef(null);
    const { position: mousePosition, isActive: mouseActive } = useMousePosition(1); // Instant tracking

    // Animation states
    const [particles, setParticles] = useState([]);
    const [moonProgress, setMoonProgress] = useState(0); // 0 to 100
    const [moonPhase, setMoonPhase] = useState('new'); // 'new' | 'waxing' | 'full'
    const [isTransitioning, setIsTransitioning] = useState(false); // For smooth move to orbit

    // Moon Position State
    // Initially center: { x: 50, y: 50 }
    // Later: Orbiting Sun
    const [orbitAngle, setOrbitAngle] = useState(0);

    // Spark/Sun position (follows mouse - this is HER)
    const [sunPos, setSunPos] = useState({ x: 50, y: 50 });
    const sunPosRef = useRef(sunPos);

    // Play Promise 1 music on mount
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume = 0.4;
            musicRef.current.play().catch(e => console.log('Promise 1 audio failed:', e));
        }
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
        }
    }, [mousePosition, mouseActive]);

    // Keep ref updated for intervals
    useEffect(() => {
        sunPosRef.current = sunPos;
    }, [sunPos]);

    // Particle System & Moon Logic
    useEffect(() => {
        const particleInterval = setInterval(() => {
            if (moonPhase === 'full' || isTransitioning) return; // Stop emitting when full or moving to orbit

            const id = Date.now() + Math.random();
            const startX = sunPosRef.current.x;
            const startY = sunPosRef.current.y;

            // Create particle at Sun position
            setParticles(prev => [
                ...prev,
                {
                    id,
                    x: startX,
                    y: startY,
                    progress: 0,
                    speed: 0.02 + Math.random() * 0.01, // Travel speed
                }
            ]);
        }, 300); // New particle every 300ms

        // Animation Loop for particles
        let animationFrame;
        const animate = () => {
            setParticles(prevParticles => {
                const nextParticles = [];
                let absorbedCount = 0;

                prevParticles.forEach(p => {
                    // Target is center (50, 50) for now
                    const targetX = 50;
                    const targetY = 50;

                    const newProgress = p.progress + p.speed;

                    // Interpolate position
                    const currentX = p.x + (targetX - p.x) * newProgress;
                    const currentY = p.y + (targetY - p.y) * newProgress;

                    if (newProgress >= 1) {
                        absorbedCount++; // Particle reached Moon
                    } else {
                        nextParticles.push({ ...p, x: currentX, y: currentY, progress: newProgress });
                    }
                });

                if (absorbedCount > 0) {
                    setMoonProgress(prev => {
                        // Calculate distance from center (50, 50) to Sun (sunPosRef.current)
                        const sunX = sunPosRef.current.x;
                        const sunY = sunPosRef.current.y;
                        const dist = Math.sqrt(Math.pow(sunX - 50, 2) + Math.pow(sunY - 50, 2));

                        // Max distance is approx 70 (corner to center)
                        // Factor: Closer = 1.0, Furthest = ~0.2
                        const distanceFactor = Math.max(0.2, 1 - (dist / 70));

                        // Check for fast mode (skip wait)
                        const params = new URLSearchParams(window.location.search);
                        const isFastMode = params.get('fast') === 'true';

                        let growth;
                        if (isFastMode) {
                            // 10 seconds to fill
                            // 300ms emission = ~3.3 particles/sec -> 33 particles in 10s
                            // 100% / 33 = ~3% per particle
                            growth = 3.0;
                        } else {
                            // Normal mode: Distance-based
                            // Base growth 0.25% * factor (~2 minutes at max speed, ~10 minutes at min)
                            growth = 0.25 * distanceFactor;
                        }

                        const newProg = Math.min(100, prev + absorbedCount * growth);
                        if (newProg >= 100) {
                            setIsTransitioning(true); // Start transition to orbit
                            setTimeout(() => {
                                setIsTransitioning(false);
                                setMoonPhase('full');
                            }, 2000); // 2s transition
                        }
                        return newProg;
                    });
                }

                return nextParticles;
            });
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            clearInterval(particleInterval);
            cancelAnimationFrame(animationFrame);
        };
    }, [moonPhase, isTransitioning]);

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

            {/* Particles */}
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#fcd34d',
                        boxShadow: '0 0 10px #fcd34d',
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
                    cursor: 'none',
                    width: '60px', // Explicit size for centering
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center', // Just to be safe
                    justifyContent: 'center',
                    pointerEvents: 'none', // Allow clicks through
                    transition: moonPhase === 'full' ? 'left 2s ease-in-out, top 2s ease-in-out' : 'none', // Instant tracking normally, Smooth for finale
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
                    opacity: moonOpacity,
                    transition: isTransitioning ? 'left 2s ease-in-out, top 2s ease-in-out, transform 2s' : (moonPhase === 'full' ? 'none' : 'transform 0.1s, opacity 0.1s'),
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
                        fontSize: '1rem',
                        color: '#e2e8f0',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        opacity: 0.8,
                    }}
                >
                    omo 🌙
                </span>
            </div>

            {/* Instruction if New Moon */}
            {moonProgress < 20 && (
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    width: '100%',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.9rem',
                    pointerEvents: 'none',
                    opacity: 0.7
                }}>
                    Feed the moon with your light...
                </div>
            )}

            {/* Promise 1 Specific Music */}
            <audio
                ref={musicRef}
                src="/mycutusbdaycountdown2026/music/promise1.mp3"
                loop
            />
        </div>
    );
};

export default Promise1Growth;
