import { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// ─── Storm Background ───
const StormBackground = ({ lightningFlash, opacity }) => {
    const rainStreaks = useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            height: 10 + Math.random() * 20,
            duration: 0.4 + Math.random() * 0.4,
            delay: Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.4,
        })), []);

    const glassDroplets = useMemo(() =>
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            top: Math.random() * 80,
            left: Math.random() * 90 + 5,
            size: 3 + Math.random() * 5,
            duration: 4 + Math.random() * 6,
            delay: Math.random() * 4,
        })), []);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            opacity,
            transition: 'opacity 2.5s ease-in-out',
        }}>
            {/* Storm clouds */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
            }} />

            {/* Lightning flash overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(200, 210, 255, 0.15)',
                opacity: lightningFlash ? 1 : 0,
                transition: 'opacity 0.1s',
                pointerEvents: 'none',
            }} />

            {/* Rain streaks */}
            {rainStreaks.map(r => (
                <div key={r.id} style={{
                    position: 'absolute',
                    top: '-10vh',
                    left: `${r.left}%`,
                    width: '1.5px',
                    height: `${r.height}px`,
                    background: `rgba(180, 200, 255, ${r.opacity})`,
                    animation: `rain-drop ${r.duration}s linear infinite`,
                    animationDelay: `${r.delay}s`,
                    pointerEvents: 'none',
                }} />
            ))}

            {/* Glass droplets - slow drips on the window */}
            {glassDroplets.map(d => (
                <div key={`drip-${d.id}`} style={{
                    position: 'absolute',
                    top: `${d.top}%`,
                    left: `${d.left}%`,
                    width: `${d.size}px`,
                    height: `${d.size * 1.4}px`,
                    background: 'rgba(180, 210, 255, 0.35)',
                    borderRadius: '50% 50% 40% 40%',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    animation: `glass-drip ${d.duration}s linear infinite`,
                    animationDelay: `${d.delay}s`,
                    pointerEvents: 'none',
                    zIndex: 12,
                }} />
            ))}
        </div>
    );
};

// ─── Peace Background ───
// ─── Peace Background (Option 4: Rain-Smeared Night) ───
const PeaceBackground = ({ opacity }) => {
    // Bokeh lights (Streetlamps/City lights blurred by rain)
    const bokehLights = useMemo(() =>
        Array.from({ length: 25 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: 40 + Math.random() * 60, // Bottom half mostly
            size: 20 + Math.random() * 60,
            color: Math.random() > 0.3 ? '#f59e0b' : '#ef4444', // Amber/Red (Tail lights)
            duration: 4 + Math.random() * 6,
            delay: Math.random() * 5,
            opacity: 0.1 + Math.random() * 0.2,
        })), []);

    // Gentle rain on glass (illuminated)
    const illuminatedDrops = useMemo(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 2 + Math.random() * 4,
            delay: Math.random() * 5,
        })), []);

    // Gentle falling rain (illuminated)
    const rainStreaks = useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            height: 10 + Math.random() * 20,
            duration: 0.8 + Math.random() * 0.5, // Slower than storm
            delay: Math.random() * 2,
            opacity: 0.1 + Math.random() * 0.3,
        })), []);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            opacity,
            transition: 'opacity 3s ease-in-out',
        }}>
            {/* Falling Rain Streaks (Warm/Amber) */}
            {rainStreaks.map(r => (
                <div key={r.id} style={{
                    position: 'absolute',
                    top: '-10vh',
                    left: `${r.left}%`,
                    width: '1px',
                    height: `${r.height}px`,
                    background: `rgba(251, 191, 36, ${r.opacity})`, // Gold rain
                    animation: `rain-drop ${r.duration}s linear infinite`,
                    animationDelay: `${r.delay}s`,
                    pointerEvents: 'none',
                }} />
            ))}

            {/* Bokeh Lights */}
            {bokehLights.map(b => (
                <div key={b.id} style={{
                    position: 'absolute',
                    left: `${b.left}%`,
                    top: `${b.top}%`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
                    filter: 'blur(8px)',
                    opacity: b.opacity,
                    animation: `pulse-glow ${b.duration}s ease-in-out infinite alternate`,
                    animationDelay: `${b.delay}s`,
                    pointerEvents: 'none',
                }} />
            ))}

            {/* Illuminated Raindrops on Glass */}
            {illuminatedDrops.map(d => (
                <div key={`drop-${d.id}`} style={{
                    position: 'absolute',
                    left: `${d.left}%`,
                    top: `${d.top}%`,
                    width: `${d.size}px`,
                    height: `${d.size * 1.5}px`,
                    background: 'rgba(251, 191, 36, 0.4)', // Warm amber tint
                    borderRadius: '50% 50% 40% 40%',
                    boxShadow: '0 0 4px rgba(251, 191, 36, 0.2)',
                    animation: `glass-drip ${d.duration}s linear infinite`,
                    animationDelay: `${d.delay}s`,
                    pointerEvents: 'none',
                }} />
            ))}
        </div>
    );
};



// ─── Life's Clutter (Storm phase) ───
const stormNotifications = [
    { icon: '📅', text: '3 meetings today', color: '#3b82f6' },
    { icon: '📱', text: 'Hiring alert: 12 applicants', color: '#8b5cf6' },
    { icon: '💒', text: 'Venue not booked!', color: '#ec4899' },
    { icon: '😤', text: 'Jose hasn\'t done his work again', color: '#ef4444' },
    { icon: '🙄', text: 'Kavita ne wapis uspe chilla dia', color: '#f97316' },
    { icon: '🛺', text: 'No autos on Uber/Rapido!', color: '#eab308' },
    { icon: '📧', text: '47 unread emails', color: '#6366f1' },
    { icon: '⏰', text: 'Deadline tomorrow', color: '#dc2626' },
    { icon: '🔍', text: 'Searching for auto to RV Champak Apartments...', color: '#22c55e' },
    { icon: '🇺🇸', text: 'Visa interview schedule', color: '#0ea5e9' },
    { icon: '🍳', text: 'Need to make dinner', color: '#a855f7' },
    { icon: '🤔', text: 'Dinner mai kya khau?', color: '#f43f5e' },
    { icon: '💇', text: 'Parlour jaana hai', color: '#d946ef' },
    { icon: '🤦', text: 'Wapis IIMA se hiring karwana chahte hai', color: '#fb923c' },
    { icon: '🛒', text: 'Groceries mangwani hai', color: '#34d399' },
    { icon: '🥺', text: 'I miss you', color: '#f9a8d4' },
    { icon: '☹️', text: 'i\'m hungry', color: '#fbbf24' },
    { icon: '🥱', text: 'aalas aa raha hai', color: '#94a3b8' },
    { icon: '🍗', text: 'where\'s my biryani', color: '#ea580c' },
    { icon: '🚗', text: 'itna traffficcc', color: '#ef4444' },
];

const StormClutter = ({ opacity }) => {
    const leaves = useMemo(() =>
        Array.from({ length: 7 }, (_, i) => ({
            id: i,
            startLeft: -10 + Math.random() * 20,
            startTop: 10 + Math.random() * 70,
            size: 12 + Math.random() * 10,
            duration: 6 + Math.random() * 5,
            delay: Math.random() * 8,
            hue: Math.random() > 0.5 ? '#8b6914' : '#5a4a28',
        })), []);

    // Exactly 1 notification per position — zero overlap guaranteed
    const notifs = useMemo(() => {
        const zones = [
            { top: 15, left: 2 },    // 0  left upper (moved higher to clear text)
            { top: 3, left: 42 },    // 1  top-center
            { top: 2, left: 78 },    // 2  top-right
            { top: 18, left: 78 },   // 3  right upper
            { top: 30, left: 45 },   // 4  on window upper
            { top: 34, left: 65 },   // 5  right of window
            { top: 42, left: 30 },   // 6  on window mid-left
            { top: 40, left: 78 },   // 7  right mid
            { top: 50, left: 55 },   // 8  on window center
            { top: 56, left: 2 },    // 9  left lower
            { top: 58, left: 78 },   // 10 right lower
            { top: 68, left: 2 },    // 11 left low
            { top: 68, left: 50 },   // 12 center low
            { top: 78, left: 78 },   // 13 right bottom
            { top: 85, left: 2 },    // 14 left bottom
            { top: 88, left: 45 },   // 15 center bottom
            // New zones for extra notifications (indices 16-19)
            { top: 5, left: 25 },    // 16 Top-left (moved right to clear back button)
            { top: 85, left: 90 },   // 17 Far bottom-right
            { top: 50, left: 5 },    // 18 Mid-far-left
            { top: 15, left: 90 },   // 19 Mid-far-right
        ];
        return stormNotifications.map((n, i) => ({
            ...n,
            id: i,
            top: zones[i % zones.length].top,
            left: zones[i % zones.length].left,
            duration: 11,
            // Create staggered delay STARTING after the Leaves/Clutter container fades in (3s)
            // Base delay 3.5s + 0.8s per item -> Spans from 3.5s to ~16s
            delay: 3.5 + (i * 0.8),
            tilt: -2 + Math.random() * 4,
        }));
    }, []);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            opacity,
            transition: 'opacity 2.5s ease-in-out',
            pointerEvents: 'none',
            zIndex: 35,
        }}>
            {/* Wind-blown leaves */}
            {leaves.map(l => (
                <div key={`leaf-${l.id}`} style={{
                    position: 'absolute',
                    top: `${l.startTop}%`,
                    left: `${l.startLeft}%`,
                    width: `${l.size}px`,
                    height: `${l.size * 0.6}px`,
                    background: l.hue,
                    borderRadius: '0 80% 0 80%',
                    animation: `leaf-blow ${l.duration}s ease-in-out infinite`,
                    animationDelay: `${l.delay}s`,
                    opacity: 0,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }} />
            ))}

            {/* Notification cards */}
            {notifs.map(n => (
                <div key={`notif-${n.id}`} style={{
                    position: 'absolute',
                    top: `${n.top}%`,
                    left: `${n.left}%`,
                    background: 'rgba(20, 20, 30, 0.8)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '12px',
                    padding: '0.55rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: `1px solid ${n.color}44`,
                    boxShadow: `0 3px 12px rgba(0,0,0,0.5), 0 0 8px ${n.color}22`,
                    animation: `notif-drift ${n.duration}s ease-in-out infinite`,
                    animationDelay: `${n.delay}s`,
                    opacity: 0,
                    whiteSpace: 'nowrap',
                    '--notif-tilt': `${n.tilt}deg`,
                }}>
                    <span style={{ fontSize: '1.05rem' }}>{n.icon}</span>
                    <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)',
                        color: 'rgba(203, 213, 225, 0.9)',
                        letterSpacing: '0.3px',
                    }}>{n.text}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Floating Memories (Peace phase) ───
const memoryFiles = [
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 02.33.28 (3).jpeg' },
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 02.33.30 (1).jpeg' }, // Swapped from 5
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 02.33.29 (1).jpeg' },
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 02.33.29 (3).jpeg' },
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 03.27.45 (1).jpeg' }, // Index 4
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 03.27.45.jpeg' }, // Swapped from 1
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 02.33.30.jpeg' },
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 02.33.31 (1).jpeg' },
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 02.33.31 (3).jpeg' },
    { type: 'image', src: 'WhatsApp Image 2026-02-09 at 02.33.31.jpeg' },
    { type: 'video', src: 'WhatsApp Video 2026-02-09 at 02.33.27.mp4' },
    { type: 'video', src: 'WhatsApp Video 2026-02-09 at 02.33.30.mp4' },
];

const FloatingMemories = () => {
    // Solidified Positions (User Provided)
    const memoryPositions = [
        { top: 16, left: 29, rotation: -5, size: 140 },
        { top: 35, left: 8, rotation: 3, size: 140 },
        { top: 72, left: 10, rotation: -2, size: 140 },
        { top: 74, left: 21, rotation: 5, size: 140 },
        { top: 74, left: 90, rotation: -6, size: 140 },
        { top: 75, left: 78, rotation: 4, size: 140 },
        { top: 33, left: 19, rotation: 2, size: 140 },
        { top: 79, left: 66, rotation: -3, size: 140 },
        { top: 37, left: 50, rotation: 0, size: 410 }, // Centerpiece
        { top: 76, left: 33, rotation: 0, size: 140 },
        { top: 21, left: 69, rotation: 0, size: 140 },
        { top: 79, left: 48, rotation: 0, size: 140 }
    ];

    const memories = useMemo(() => {
        // Calculate delays based on horizontal position (left-to-right sweep)
        // Total duration for full appearance: ~10s.
        // Leftmost (0%) -> 0s delay. Rightmost (100%) -> 8s delay (allowing 2s fade).
        return memoryFiles.map((file, i) => {
            const pos = memoryPositions[i] || { top: 50, left: 50, rotation: 0, size: 140 };
            const sweepDelay = (pos.left / 100) * 8;

            return {
                ...file,
                id: i,
                top: pos.top,
                left: pos.left,
                rotation: pos.rotation,
                size: pos.size,
                delay: sweepDelay,
                duration: 3 + (i % 3), // Hover duration variance
            };
        });
    }, []);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            opacity: 1, // Container fully visible, children have delays
            pointerEvents: 'none',
            zIndex: 25, // Above window (zIndex 10-20), below text (zIndex 30)
            overflow: 'hidden'
        }}>
            {memories.map(m => (
                <div key={m.id} style={{
                    position: 'absolute',
                    top: `${m.top}%`,
                    left: `${m.left}%`,
                    width: `${m.size}px`,
                    transform: `translate(-50%, -50%) rotate(${m.rotation}deg)`,
                    animation: `fade-in-slow 2s ease-out both`, // Removed hover-gentle
                    animationDelay: `${m.delay}s`, // Fade delay only
                    padding: '6px 6px 20px 6px', // Polaroid style
                    background: '#fff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    borderRadius: '2px',
                    // opacity handled by keyframe 'fade-in-slow' (ends at 0.9)
                }}>
                    {m.type === 'video' ? (
                        <video
                            src={`/mycutusbdaycountdown2026/assets/promise2/${m.src}`}
                            autoPlay loop muted playsInline
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    ) : (
                        <img
                            src={`/mycutusbdaycountdown2026/assets/promise2/${m.src}`}
                            alt="Memory"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// ─── Main Component ───
const Promise2Home = ({ isMuted, toggleMute }) => {
    // Narrative phase: storm → transitioning → peace (one-way)
    const [phase, setPhase] = useState('storm');
    const [lightningFlash, setLightningFlash] = useState(false);

    // Entrance Animation States
    const [bgOpacity, setBgOpacity] = useState(0);
    const [rainOpacity, setRainOpacity] = useState(0);
    const [leavesOpacity, setLeavesOpacity] = useState(0);

    // Storm text visibility
    const [stormText1, setStormText1] = useState(false);
    const [stormText2, setStormText2] = useState(false);
    const [stormText3, setStormText3] = useState(false);
    const [hintVisible, setHintVisible] = useState(false);

    // Peace text visibility
    const [peaceTitle, setPeaceTitle] = useState(false);
    const [peaceText1, setPeaceText1] = useState(false);
    const [peaceText2, setPeaceText2] = useState(false);
    const [peaceText3, setPeaceText3] = useState(false);

    // Latch rotation
    const [latchClosed, setLatchClosed] = useState(false);

    // Audio refs
    const rainRef = useRef(null);
    const peaceRef = useRef(null);
    const crossfadeRef = useRef(null);

    // ─── Storm Phase: Entrance Sequence ───
    useEffect(() => {
        if (phase !== 'storm') return;
        const timers = [];

        // 1. Background fades in first (0 -> 1.5s)
        timers.push(setTimeout(() => setBgOpacity(1), 100));

        // 2. Rain starts slowly (1.5s -> 3s)
        timers.push(setTimeout(() => setRainOpacity(1), 1500));

        // 3. Leaves & Clutter Container fades in (3s -> 4.5s)
        timers.push(setTimeout(() => setLeavesOpacity(1), 3000));

        // 4. Notifications pop up from 3.5s to ~16s (handled by CSS delays in StormClutter)

        // 5. Text sequence starts AFTER all notifications (16.5s+)
        timers.push(setTimeout(() => setStormText1(true), 16500));
        timers.push(setTimeout(() => setStormText2(true), 19500));
        timers.push(setTimeout(() => setStormText3(true), 22500));
        timers.push(setTimeout(() => setHintVisible(true), 25000));

        // Random lightning flashes
        const lightningInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                setLightningFlash(true);
                setTimeout(() => setLightningFlash(false), 150);
                // Double flash sometimes
                if (Math.random() < 0.4) {
                    setTimeout(() => {
                        setLightningFlash(true);
                        setTimeout(() => setLightningFlash(false), 80);
                    }, 300);
                }
            }
        }, 2500);

        return () => {
            timers.forEach(t => clearTimeout(t));
            clearInterval(lightningInterval);
        };
    }, [phase]);

    // ─── Peace Phase: Sequential text ───
    useEffect(() => {
        if (phase !== 'peace') return;
        const timers = [];

        // Text starts AFTER the 10s memory fade-in sequence
        timers.push(setTimeout(() => setPeaceTitle(true), 11000));
        timers.push(setTimeout(() => setPeaceText1(true), 14000));
        timers.push(setTimeout(() => setPeaceText2(true), 18000));
        timers.push(setTimeout(() => setPeaceText3(true), 23000));

        return () => timers.forEach(t => clearTimeout(t));
    }, [phase]);

    // ─── Audio Management ───
    useEffect(() => {
        if (phase === 'storm') {
            // Start rain with delay and fade-in
            if (rainRef.current && !isMuted) {
                rainRef.current.volume = 0; // Start at 0
                rainRef.current.play().catch(e => console.log('Rain audio:', e));

                // Fade in rain volume over 2s (starts at 2s mark to match visual rain)
                setTimeout(() => {
                    const fadeDuration = 2000;
                    const steps = fadeDuration / 50;
                    let step = 0;
                    const rainFade = setInterval(() => {
                        step++;
                        const progress = step / steps;
                        if (rainRef.current) {
                            rainRef.current.volume = 0.2 * progress;
                        }
                        if (step >= steps) clearInterval(rainFade);
                    }, 50);
                }, 2000);
            }
            // Start Kalank music immediately (background level)
            if (peaceRef.current && !isMuted) {
                peaceRef.current.volume = 0.3; // Audible but subtle in storm
                peaceRef.current.play().catch(e => console.log('Music start:', e));
            }
        }
    }, [phase]);

    // Handle mute/unmute for current phase
    useEffect(() => {
        if (rainRef.current) {
            rainRef.current.muted = isMuted;
            if (!isMuted && rainRef.current.paused && phase === 'storm') {
                rainRef.current.play().catch(e => console.log(e));
            }
        }
        if (peaceRef.current) {
            peaceRef.current.muted = isMuted;
            // Ensure music plays if unmuted in any phase of Promise 2
            if (!isMuted && peaceRef.current.paused) {
                peaceRef.current.play().catch(e => console.log(e));
            }
        }
    }, [isMuted, phase]);

    // ─── Handle Latch Click (storm → peace) ───
    const handleLatchClick = () => {
        if (phase !== 'storm') return;

        setLatchClosed(true);
        setPhase('transitioning');
        setHintVisible(false);

        // Rain fades out, Music swells (0.3 -> 0.6)
        if (peaceRef.current && !isMuted) {
            // Ensure it's playing (it should be already)
            peaceRef.current.play().catch(e => console.log('Peace audio:', e));
        }

        // Crossfade audio over 2.5s
        const fadeDuration = 2500;
        const steps = fadeDuration / 50;
        let step = 0;

        crossfadeRef.current = setInterval(() => {
            step++;
            const progress = step / steps;

            if (rainRef.current && !rainRef.current.muted) {
                // Fade from 0.2 (low volume) to 0
                rainRef.current.volume = Math.max(0, 0.2 * (1 - progress));
            }
            if (peaceRef.current && !peaceRef.current.muted) {
                // Fade from 0.3 (storm level) to 0.6 (peace level)
                peaceRef.current.volume = 0.3 + (0.3 * progress);
            }

            if (step >= steps) {
                clearInterval(crossfadeRef.current);
                if (rainRef.current) {
                    rainRef.current.pause();
                    rainRef.current.volume = 0;
                }
                setPhase('peace');
            }
        }, 50);
    };

    // Cleanup crossfade on unmount
    useEffect(() => {
        return () => {
            if (crossfadeRef.current) clearInterval(crossfadeRef.current);
            if (rainRef.current) rainRef.current.pause();
            if (peaceRef.current) peaceRef.current.pause();
        };
    }, []);

    // Derive visual states
    const isStorm = phase === 'storm';
    const isPeace = phase === 'peace';
    const isTransitioning = phase === 'transitioning';

    // Sky gradient
    const skyGradient = isStorm
        ? 'linear-gradient(to bottom, #0f172a 0%, #1e293b 30%, #334155 60%, #1e293b 100%)'
        : 'linear-gradient(to bottom, #0f172a 0%, #1e293b 60%, #334155 80%, #d97706 95%, #f59e0b 100%)'; // Night + Streetlight Glow

    // Mute button color scheme
    const muteColor = isStorm || isTransitioning
        ? { bg: 'rgba(100, 120, 150, 0.2)', border: 'rgba(148, 163, 184, 0.5)', icon: '#94a3b8' }
        : { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.5)', icon: '#fbbf24' };

    // Fade helper for text
    const fadeStyle = (visible, delay = 0) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(15px)',
        transition: `all 1s ease-out ${delay}s`,
    });

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            overflow: 'hidden',
        }}>
            {/* ─── Sky / Background ─── */}
            <div style={{
                position: 'absolute', inset: 0,
                background: skyGradient,
                opacity: (isStorm && bgOpacity === 0) ? 0 : 1, // Start hidden, fade in on mount
                transition: 'background 2.5s ease-in-out, opacity 1.5s ease-out',
                zIndex: 0,
            }}>
                <StormBackground
                    lightningFlash={lightningFlash}
                    opacity={isStorm ? rainOpacity : (isTransitioning ? 1 : 0)} // Controlled by state in storm
                />
                <PeaceBackground opacity={isPeace || isTransitioning ? 1 : 0} />
            </div>

            {/* ─── Life's Clutter (above window, storm only) ─── */}
            <StormClutter opacity={isStorm ? leavesOpacity : 0} />

            {/* ─── Floating Memories (Peace only) ─── */}
            {(isPeace || isTransitioning) && <FloatingMemories />}

            {/* ─── The Window ─── */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(80vw, 700px)',
                height: 'min(70vh, 550px)',
                zIndex: 10,
                perspective: '800px',
            }}>
                {/* Left pane glass (fixed, always closed) */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0,
                    width: '50%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.06) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(1.5px)',
                }} />

                {/* Right pane glass (swings open/closed with 3D rotation) */}
                <div style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0,
                    width: '50%',
                    transformOrigin: 'right center',
                    transform: latchClosed ? 'rotateY(0deg)' : 'rotateY(-35deg)',
                    transition: 'transform 2s ease-in-out',
                    zIndex: 2,
                }}>
                    <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.06) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: latchClosed ? 'blur(1.5px)' : 'none',
                        transition: 'backdrop-filter 2s',
                        boxShadow: latchClosed ? 'none' : 'inset -5px 0 15px rgba(0,0,0,0.3)',
                    }} />
                </div>

                {/* Window frame (outer) */}
                <div style={{
                    position: 'absolute', inset: '-18px',
                    border: '18px solid #27272a',
                    pointerEvents: 'none',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 20px 50px rgba(0,0,0,0.5)',
                    zIndex: 11,
                }}>
                    {/* Horizontal cross bar */}
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '14px', background: '#27272a', marginTop: '-7px' }} />
                    {/* Vertical cross bar */}
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '14px', background: '#27272a', marginLeft: '-7px' }} />
                </div>

                {/* Window sill */}
                <div style={{
                    position: 'absolute',
                    bottom: '-36px',
                    left: '-28px',
                    right: '-28px',
                    height: '36px',
                    background: 'linear-gradient(to bottom, #27272a, #18181b)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                    zIndex: 12,
                }}>

                </div>

                {/* ─── The Latch ─── */}
                <div
                    onClick={handleLatchClick}
                    title={isStorm ? 'Close the latch' : ''}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '36px',
                        height: '70px',
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: '4px',
                        cursor: isStorm ? 'pointer' : 'default',
                        zIndex: 20,
                        border: '2px solid rgba(255,255,255,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.3s, background 0.3s',
                    }}
                    onMouseEnter={(e) => {
                        if (isStorm) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                            e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                        e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                    }}
                >
                    {/* Handle bar - rotates from horizontal to vertical */}
                    <div style={{
                        width: '4px',
                        height: '22px',
                        background: isPeace || isTransitioning
                            ? 'linear-gradient(to bottom, #fbbf24, #d97706)'
                            : '#cbd5e1',
                        borderRadius: '2px',
                        transform: latchClosed ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 1s ease-in-out, background 2.5s',
                    }} />
                </div>
            </div>

            {/* ─── Storm Text (LEFT side) ─── */}
            {
                (isStorm || isTransitioning) && (
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '5%',
                        maxWidth: '320px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        zIndex: 30,
                        pointerEvents: 'none',
                        opacity: isTransitioning ? 0 : 1,
                        transition: 'opacity 2s ease-out',
                    }}>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                            color: 'rgba(203, 213, 225, 0.9)',
                            fontStyle: 'italic',
                            textAlign: 'left',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            margin: 0,
                            ...fadeStyle(stormText1),
                        }}>
                            When everything outside is chaos...
                        </p>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(0.9rem, 2.2vw, 1.2rem)',
                            color: 'rgba(203, 213, 225, 0.8)',
                            fontStyle: 'italic',
                            textAlign: 'left',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            margin: 0,
                            marginLeft: '1rem',
                            ...fadeStyle(stormText2),
                        }}>
                            When the world feels too loud, too cold, too much...
                        </p>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(0.9rem, 2.2vw, 1.2rem)',
                            color: 'rgba(203, 213, 225, 0.7)',
                            fontStyle: 'italic',
                            textAlign: 'left',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            margin: 0,
                            marginLeft: '2rem',
                            ...fadeStyle(stormText3),
                        }}>
                            And nothing feels like it fits...
                        </p>
                    </div>
                )
            }

            {/* ─── Hint to close latch (beside the latch) ─── */}
            {
                isStorm && hintVisible && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(calc(-50% + 60px), -50%)',
                        zIndex: 25,
                        pointerEvents: 'none',
                        animation: 'hint-pulse 2s ease-in-out infinite',
                    }}>
                        <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                            color: 'rgba(203, 213, 225, 0.7)',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.5px',
                        }}>
                            close the latch
                        </span>
                    </div>
                )
            }

            {/* ─── Peace Title (centered, top) ─── */}
            {
                isPeace && (
                    <div style={{
                        position: 'absolute',
                        top: '5%',
                        width: '100%',
                        textAlign: 'center',
                        zIndex: 30,
                        pointerEvents: 'none',
                        padding: '0 2rem',
                    }}>
                        <h1 style={{
                            fontFamily: "'Dancing Script', cursive",
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            color: '#fff',
                            margin: 0,
                            textShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
                            ...fadeStyle(peaceTitle),
                        }}>
                            The Promise of Home
                        </h1>
                    </div>
                )
            }

            {/* ─── Peace Poetry (RIGHT side) ─── */}
            {
                isPeace && (
                    <div style={{
                        position: 'absolute',
                        bottom: '45%',
                        right: '5%',
                        maxWidth: '380px',
                        textAlign: 'right',
                        zIndex: 30,
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                    }}>
                        <p style={{
                            fontFamily: "'Dancing Script', cursive",
                            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                            color: '#fde68a',
                            fontWeight: 600,
                            textAlign: 'right',
                            margin: 0,
                            textShadow: '0 0 10px rgba(251, 191, 36, 0.3)',
                            lineHeight: 1.6,
                            ...fadeStyle(peaceText1),
                        }}>
                            I promise to be your safe place, and your calm in every storm.
                        </p>

                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                            color: 'rgba(253, 230, 138, 0.9)',
                            fontStyle: 'italic',
                            textAlign: 'right',
                            margin: 0,
                            marginTop: '0.5rem',
                            lineHeight: 1.8,
                            ...fadeStyle(peaceText2),
                        }}>
                            With me, I want even our silence to feel like the sweetest conversation.
                            I don't just want to be your <span style={{ color: '#fbbf24', textShadow: '0 0 10px rgba(251,191,36,0.6)' }}>destination</span>...
                            I want to be where you <span style={{ color: '#fda4af', textShadow: '0 0 10px rgba(253,164,175,0.6)' }}>belong</span>.
                        </p>

                        <p style={{
                            fontFamily: "'Dancing Script', cursive",
                            fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)',
                            color: '#fde68a',
                            fontWeight: 700,
                            textAlign: 'right',
                            margin: 0,
                            marginTop: '0.5rem',
                            textShadow: '0 0 15px rgba(251, 191, 36, 0.5)',
                            ...fadeStyle(peaceText3),
                        }}>
                            I will forever be your <span style={{ color: '#fff', textShadow: '0 0 20px #fff' }}>home</span>, as you are <span style={{ color: '#fbbf24', textShadow: '0 0 15px #fbbf24' }}>mine</span>.
                        </p>
                    </div>
                )
            }

            {/* ─── Themed Mute Button ─── */}
            <button
                onClick={toggleMute}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: muteColor.bg,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${muteColor.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 15px rgba(0,0,0,0.2)`,
                    transition: 'all 0.5s ease',
                    zIndex: 200,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                {isMuted ? (
                    <VolumeX size={24} color={muteColor.icon} />
                ) : (
                    <Volume2 size={24} color={muteColor.icon} />
                )}
            </button>

            {/* ─── Audio Sources ─── */}
            <audio ref={rainRef} src="/mycutusbdaycountdown2026/music/audiopapkin-rain-and-little-storm-298087.mp3" loop preload="auto" />
            <audio ref={peaceRef} src="/mycutusbdaycountdown2026/music/07 - Kalank (Duet) - Kalank (2019).mp3" loop preload="auto" />
        </div >
    );
};

export default Promise2Home;
