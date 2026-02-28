import { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { PROMISE4_MEDIA } from '../promise4Media';

// ─── CONFIGURATION ───
const MEDIA_FILES = PROMISE4_MEDIA;
const RAIN_MEDIA = MEDIA_FILES.filter(f => f.file !== 'special.mp4');
const TOTAL_COUNT = RAIN_MEDIA.length;
const BASE_PATH = '/mycutusbdaycountdown2026/assets/promise4/';

const encodePath = (filename) => BASE_PATH + encodeURIComponent(filename);

// ─── Intro Slides Data ───
const INTRO_SLIDES = [
    {
        text: "Every morning I wake up to a little video of you... ✨",
        file: 'morning video.mp4',
        type: 'video',
    },
    {
        text: "A picture of your morning cold coffee... ☕",
        file: 'cold coffee.jpeg',
        type: 'image',
    },
    {
        text: "Your mid-day snack that you had to show me... 🍪",
        file: 'snack.jpeg',
        type: 'image',
    },
    {
        text: "Those moments when you look like my little andu... 🥚💕",
        file: 'andu.jpeg',
        type: 'image',
    },
    {
        text: "When something on your table feels too adorable to not share... 🌸",
        file: 'adorable.jpeg',
        type: 'image',
    },
    {
        text: "When you spot orange, pink, or yellow gems and call them hum do aur humaare teen... 👶✨🚼",
        file: 'gems.jpeg',
        type: 'image',
    },
    {
        text: "Your efforts to host dinner for the people you love... 🧑‍🍳❤️",
        file: 'effort.jpeg',
        type: 'image',
    },
    {
        text: "And when the sun kisses you while you head back home... 🌅💛",
        file: 'home.mp4',
        type: 'video',
    },
];

// ─── Warm Background ───
const WarmBackground = () => {
    const particles = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 8 + Math.random() * 12,
            delay: Math.random() * 8,
            opacity: 0.03 + Math.random() * 0.06,
        })), []);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 30%, #1a1525 0%, #130f1e 40%, #0a0810 100%)',
        }}>
            {particles.map(p => (
                <div key={p.id} style={{
                    position: 'absolute',
                    left: `${p.left}%`,
                    top: `${p.top}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    borderRadius: '50%',
                    background: 'rgba(244, 143, 177, 0.5)',
                    opacity: p.opacity,
                    animation: `float-particle ${p.duration}s ease-in-out infinite`,
                    animationDelay: `${p.delay}s`,
                    pointerEvents: 'none',
                    filter: 'blur(1px)',
                }} />
            ))}
        </div>
    );
};

// ─── Intro Slide (text first, then media) ───
const IntroSlide = ({ slide, visible, isFirst }) => {
    const [mediaVisible, setMediaVisible] = useState(false);
    const mediaDelay = isFirst ? 5000 : 3000;

    useEffect(() => {
        if (!visible) {
            setMediaVisible(false);
            return;
        }
        const timer = setTimeout(() => setMediaVisible(true), mediaDelay);
        return () => clearTimeout(timer);
    }, [visible, mediaDelay]);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            zIndex: 20,
            padding: '2rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 1.2s ease-in-out, transform 1.2s ease-in-out',
            pointerEvents: visible ? 'auto' : 'none',
        }}>
            {/* Text appears first */}
            <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(0.95rem, 2.2vw, 1.3rem)',
                color: 'rgba(248, 187, 208, 0.9)',
                fontStyle: 'italic',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                margin: 0,
                maxWidth: '500px',
                lineHeight: 1.7,
            }}>
                {slide.text}
            </p>

            {/* Media appears after delay */}
            <div style={{
                width: 'min(280px, 50vw)',
                height: 'min(360px, 55vh)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid rgba(244, 143, 177, 0.3)',
                boxShadow: '0 8px 40px rgba(244, 143, 177, 0.15), 0 2px 15px rgba(0,0,0,0.5)',
                opacity: mediaVisible ? 1 : 0,
                transform: mediaVisible ? 'scale(1)' : 'scale(0.92)',
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
            }}>
                {slide.type === 'video' ? (
                    <video
                        src={encodePath(slide.file)}
                        autoPlay muted loop playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <img
                        src={encodePath(slide.file)}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
            </div>
        </div>
    );
};



// ─── Photo Rain (Progressive) ───
const PhotoRain = ({ visible, mediaFiles }) => {
    const [activePhotos, setActivePhotos] = useState([]);
    const indexRef = useRef(0);
    const timerRef = useRef(null);
    const COLUMNS = 16;

    const shuffled = useMemo(() => {
        const arr = [...mediaFiles];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, [mediaFiles]);

    useEffect(() => {
        if (!visible) return;

        // Reset for fresh start (needed when dev controls re-enter rain phase)
        indexRef.current = 0;
        setActivePhotos([]);

        // 720 photos / 120s ≈ 6 per second
        const intervalMs = Math.max(150, (120 * 1000) / shuffled.length);

        timerRef.current = setInterval(() => {
            if (indexRef.current >= shuffled.length) {
                clearInterval(timerRef.current);
                return;
            }

            const i = indexRef.current;
            const col = i % COLUMNS;
            const columnWidth = 100 / COLUMNS;
            const jitter = (Math.random() - 0.5) * (columnWidth * 0.2);
            const left = col * columnWidth + columnWidth / 2 + jitter;

            const newPhoto = {
                id: i,
                file: shuffled[i],
                left,
                duration: 13 + Math.random() * 5,
                rotation: Math.random() * 6 - 3,
                createdAt: Date.now(),
            };

            setActivePhotos(prev => {
                const now = Date.now();
                const alive = prev.filter(p => now - p.createdAt < p.duration * 1000);
                return [...alive, newPhoto];
            });

            indexRef.current++;
        }, intervalMs);

        return () => clearInterval(timerRef.current);
    }, [visible, shuffled]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'absolute', inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 5,
        }}>
            {activePhotos.map(item => (
                <div key={item.id} style={{
                    position: 'absolute',
                    left: `${item.left}%`,
                    top: '-120px',
                    transform: `translateX(-50%) rotate(${item.rotation}deg)`,
                    animation: `photo-fall ${item.duration}s linear 1 forwards`,
                }}>
                    <div style={{
                        width: '75px',
                        height: '100px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '2px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        background: '#1a1525',
                    }}>
                        {item.file.type === 'video' ? (
                            <video
                                src={encodePath(item.file.file)}
                                autoPlay muted loop playsInline
                                onError={(e) => { e.currentTarget.parentElement.style.opacity = '0'; }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <img
                                src={encodePath(item.file.file)}
                                alt=""
                                loading="lazy"
                                onError={(e) => { e.currentTarget.parentElement.style.opacity = '0'; }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ─── Counter Animation ───
const AnimatedCounter = ({ target, visible, duration = 4000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [visible, target, duration]);

    return (
        <div style={{
            position: 'absolute',
            bottom: '8%',
            right: '6%',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            opacity: visible ? 1 : 0,
            transition: 'opacity 1.5s ease-out',
            pointerEvents: 'none',
        }}>
            <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 300,
                color: 'rgba(244, 143, 177, 0.6)',
                letterSpacing: '2px',
                animation: 'counter-glow 2s ease-in-out infinite alternate',
            }}>
                {count}
            </span>
        </div>
    );
};


// ─── Main Component ───
const Promise4LittleThings = ({ isMuted, toggleMute }) => {
    // Phase: 'intro' → 'rain' → 'promise'
    const [phase, setPhase] = useState('intro');

    // Intro phase — which slide is showing (-1 = none yet)
    const [currentSlide, setCurrentSlide] = useState(-1);

    // Rain phase states
    const [rainVisible, setRainVisible] = useState(false);
    const [counterVisible, setCounterVisible] = useState(false);
    const [rainText, setRainText] = useState(false);

    // Promise phase states
    const [promiseTitle, setPromiseTitle] = useState(false);
    const [promiseText1, setPromiseText1] = useState(false);
    const [promiseText2, setPromiseText2] = useState(false);
    const [promiseText3, setPromiseText3] = useState(false);
    const [promiseText4, setPromiseText4] = useState(false);
    const [backdropVisible, setBackdropVisible] = useState(false);

    // Specific video for promise backdrop
    const backdropVideo = { file: 'special.mp4', type: 'video' };

    // Audio
    const audioRef = useRef(null);

    // ─── Dev: Timer management & skip helpers ───
    const activeTimersRef = useRef([]);
    const skipFlagRef = useRef(false);
    const [effectTrigger, setEffectTrigger] = useState(0);

    const scheduleTimer = (fn, ms) => {
        const t = setTimeout(fn, ms);
        activeTimersRef.current.push(t);
        return t;
    };

    const clearAllTimers = () => {
        activeTimersRef.current.forEach(t => clearTimeout(t));
        activeTimersRef.current = [];
    };

    const resetAllStates = () => {
        setCurrentSlide(-1);
        setRainVisible(false);
        setCounterVisible(false);
        setRainText(false);
        setPromiseTitle(false);
        setPromiseText1(false);
        setPromiseText2(false);
        setPromiseText3(false);
        setPromiseText4(false);
        setBackdropVisible(false);
    };

    const devSkip = (target) => {
        clearAllTimers();
        resetAllStates();
        setEffectTrigger(n => n + 1);

        switch (target) {
            case 'intro':
                setPhase('intro');
                break;
            case 'rain':
                setPhase('rain');
                break;
            case 'rainText':
                skipFlagRef.current = true;
                setPhase('rain');
                setRainVisible(true);
                setRainText(true);
                break;
            case 'promise':
                setPhase('promise');
                break;
        }
    };

    // ─── Intro Phase: cycle through slides ───
    useEffect(() => {
        if (phase !== 'intro') return;
        if (skipFlagRef.current) { skipFlagRef.current = false; return; }
        clearAllTimers();

        const FIRST_SLIDE_DURATION = 12000;
        const SLIDE_DURATION = 9000;
        const INITIAL_DELAY = 1500;

        let offset = INITIAL_DELAY;
        INTRO_SLIDES.forEach((_, i) => {
            scheduleTimer(() => setCurrentSlide(i), offset);
            offset += (i === 0) ? FIRST_SLIDE_DURATION : SLIDE_DURATION;
        });

        scheduleTimer(() => {
            setCurrentSlide(-1);
            setPhase('rain');
        }, offset + 2000);

        return () => clearAllTimers();
    }, [phase, effectTrigger]);

    // ─── Rain Phase Sequence ───
    useEffect(() => {
        if (phase !== 'rain') return;
        if (skipFlagRef.current) { skipFlagRef.current = false; return; }
        clearAllTimers();

        scheduleTimer(() => setRainVisible(true), 500);
        scheduleTimer(() => setCounterVisible(true), 3000);
        scheduleTimer(() => setCounterVisible(false), 133000);
        scheduleTimer(() => setRainText(true), 135000);
        scheduleTimer(() => setRainText(false), 148000);
        scheduleTimer(() => setPhase('promise'), 150000);

        return () => clearAllTimers();
    }, [phase, effectTrigger]);

    // ─── Promise Phase Sequence ───
    useEffect(() => {
        if (phase !== 'promise') return;
        if (skipFlagRef.current) { skipFlagRef.current = false; return; }
        clearAllTimers();

        scheduleTimer(() => setRainVisible(false), 300);
        scheduleTimer(() => setCounterVisible(false), 300);
        scheduleTimer(() => setBackdropVisible(true), 1000);
        scheduleTimer(() => setPromiseText1(true), 2000);
        scheduleTimer(() => setPromiseText2(true), 6000);
        scheduleTimer(() => setPromiseText3(true), 10000);
        scheduleTimer(() => setPromiseText4(true), 14000);
        scheduleTimer(() => setPromiseTitle(true), 18000);

        return () => clearAllTimers();
    }, [phase, effectTrigger]);

    // ─── Audio ───
    useEffect(() => {
        if (audioRef.current && !isMuted) {
            audioRef.current.volume = 0;
            audioRef.current.play().catch(e => console.log('Promise4 audio:', e));
            const fadeDuration = 2000;
            const steps = fadeDuration / 50;
            let step = 0;
            const fadeIn = setInterval(() => {
                step++;
                if (audioRef.current) {
                    audioRef.current.volume = Math.min(0.4, 0.4 * (step / steps));
                }
                if (step >= steps) clearInterval(fadeIn);
            }, 50);
        }
        return () => { if (audioRef.current) audioRef.current.pause(); };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            if (!isMuted && audioRef.current.paused) {
                audioRef.current.play().catch(e => console.log(e));
            }
        }
    }, [isMuted]);

    const muteColor = {
        bg: 'rgba(244, 143, 177, 0.15)',
        border: 'rgba(244, 143, 177, 0.5)',
        icon: '#f48fb1',
    };

    const fadeStyle = (visible) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(15px)',
        transition: 'all 1.2s ease-out',
    });

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            overflow: 'hidden',
        }}>
            <WarmBackground />

            {/* ─── Intro Phase: Slides ─── */}
            {phase === 'intro' && INTRO_SLIDES.map((slide, i) => (
                <IntroSlide
                    key={i}
                    slide={slide}
                    visible={currentSlide === i}
                    isFirst={i === 0}
                />
            ))}

            {/* ─── Rain Phase ─── */}
            <div style={{
                opacity: rainVisible ? 1 : 0,
                transition: 'opacity 2s ease-in-out',
            }}>
                <PhotoRain visible={rainVisible} mediaFiles={RAIN_MEDIA} />
            </div>

            <AnimatedCounter
                target={TOTAL_COUNT}
                visible={counterVisible}
                duration={110000}
            />

            {/* ─── Rain End Text ─── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30,
                pointerEvents: 'none',
                opacity: rainText ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
            }}>
                <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(1.3rem, 3.5vw, 2.2rem)',
                    color: 'rgba(244, 143, 177, 0.95)',
                    fontWeight: 700,
                    textShadow: '0 2px 20px rgba(244, 143, 177, 0.5)',
                    margin: 0,
                    maxWidth: '600px',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    padding: '0 2rem',
                }}>
                    721 tiny windows into your world, and many more in view once, hehe 😊💕
                </p>
            </div>


            {/* ─── Promise Phase: Title (appears last, at top) ─── */}
            {phase === 'promise' && (
                <h2 style={{
                    position: 'absolute',
                    top: '8%',
                    left: 0,
                    right: 0,
                    zIndex: 30,
                    pointerEvents: 'none',
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                    color: 'rgba(255, 245, 238, 0.95)',
                    fontWeight: 700,
                    textShadow: '0 2px 25px rgba(244, 143, 177, 0.5), 0 1px 8px rgba(0,0,0,0.4)',
                    margin: 0,
                    textAlign: 'center',
                    letterSpacing: '1px',
                    padding: '0 2rem',
                    ...fadeStyle(promiseTitle),
                }}>
                    A Promise for the Little Things
                </h2>
            )}

            {/* ─── Promise Phase: Backdrop Video ─── */}
            {phase === 'promise' && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    opacity: backdropVisible ? 0.2 : 0,
                    transition: 'opacity 3s ease-in-out',
                }}>
                    <video
                        src={encodePath(backdropVideo.file)}
                        autoPlay muted loop playsInline
                        style={{
                            maxWidth: '60%',
                            maxHeight: '70%',
                            objectFit: 'contain',
                            borderRadius: '20px',
                            filter: 'blur(1px) brightness(0.9)',
                        }}
                    />
                </div>
            )}

            {/* ─── Promise Phase Text ─── */}
            {phase === 'promise' && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 30,
                    pointerEvents: 'none',
                    gap: '3.5rem',
                    padding: '0 2rem',
                }}>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(0.8rem, 1.7vw, 1rem)',
                        color: 'rgba(235, 210, 220, 0.9)',
                        fontStyle: 'italic',
                        textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                        margin: 0,
                        maxWidth: '500px',
                        lineHeight: 1.7,
                        textAlign: 'center',
                        ...fadeStyle(promiseText1),
                    }}>
                        You probably never thought twice about sending them...
                        <br />
                        But each one told me — "I noticed this little thing, and thought of you."
                    </p>
                    <p style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        color: 'rgba(244, 143, 177, 1)',
                        fontWeight: 700,
                        textShadow: '0 2px 25px rgba(244, 143, 177, 0.6), 0 1px 8px rgba(0,0,0,0.3)',
                        margin: 0,
                        maxWidth: '600px',
                        lineHeight: 1.5,
                        textAlign: 'center',
                        ...fadeStyle(promiseText2),
                    }}>
                        I promise to always notice the little things about you — just as you notice the little things in your world.
                    </p>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
                        color: 'rgba(235, 210, 220, 0.85)',
                        fontStyle: 'italic',
                        textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                        margin: 0,
                        maxWidth: '550px',
                        lineHeight: 1.8,
                        textAlign: 'center',
                        ...fadeStyle(promiseText3),
                    }}>
                        Every random selfie. Every "look what I found." Each one tells me something little about you too.
                    </p>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(0.8rem, 1.7vw, 1.1rem)',
                        color: 'rgba(251, 191, 36, 0.95)',
                        fontStyle: 'italic',
                        fontWeight: 600,
                        textShadow: '0 2px 15px rgba(251, 191, 36, 0.3), 0 1px 8px rgba(0,0,0,0.4)',
                        margin: 0,
                        maxWidth: '550px',
                        lineHeight: 1.8,
                        textAlign: 'center',
                        ...fadeStyle(promiseText4),
                    }}>
                        Because the little things were never little — they were everything that made you, you. 🧡
                    </p>
                </div>
            )}

            <audio
                ref={audioRef}
                src="/mycutusbdaycountdown2026/music/promise4.mp3"
                loop
                preload="auto"
            />

            {/* ─── Developer Controls ─── */}
            {new URLSearchParams(window.location.search).has('dev') && (() => {
                const activeTarget = phase === 'intro' ? 'intro'
                    : phase === 'rain' ? (rainText ? 'rainText' : 'rain')
                        : 'promise';
                return (
                    <div style={{
                        position: 'fixed',
                        top: '15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 200,
                        background: 'rgba(0,0,0,0.8)',
                        padding: '8px 14px',
                        borderRadius: '20px',
                        border: '1px solid rgba(244, 143, 177, 0.3)',
                        backdropFilter: 'blur(10px)',
                        fontFamily: "'Outfit', sans-serif",
                    }}>
                        <span style={{ color: 'rgba(244,143,177,0.5)', fontSize: '10px', marginRight: '4px' }}>
                            DEV
                        </span>
                        {[
                            { label: 'Intro', target: 'intro' },
                            { label: 'Rain', target: 'rain' },
                            { label: '→ Text', target: 'rainText' },
                            { label: 'Promise', target: 'promise' },
                        ].map(({ label, target }) => (
                            <button
                                key={target}
                                onClick={() => devSkip(target)}
                                style={{
                                    background: target === activeTarget
                                        ? 'rgba(244, 143, 177, 0.35)'
                                        : 'rgba(244, 143, 177, 0.1)',
                                    border: `1px solid rgba(244, 143, 177, ${target === activeTarget ? '0.6' : '0.25'})`,
                                    borderRadius: '12px',
                                    color: '#f48fb1',
                                    fontSize: '11px',
                                    padding: '4px 10px',
                                    cursor: 'pointer',
                                    fontFamily: "'Outfit', sans-serif",
                                    transition: 'all 0.2s',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                        <span style={{
                            color: 'rgba(244,143,177,0.4)',
                            fontSize: '10px',
                            marginLeft: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>
                            {phase}
                            {phase === 'intro' && currentSlide >= 0 ? ` ${currentSlide + 1}/${INTRO_SLIDES.length}` : ''}
                        </span>
                    </div>
                );
            })()}

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
                    border: `2px solid ${muteColor.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(244, 143, 177, 0.3)',
                    transition: 'all 0.3s ease',
                    zIndex: 100,
                    backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isMuted ? (
                    <VolumeX size={24} color={muteColor.icon} />
                ) : (
                    <Volume2 size={24} color={muteColor.icon} />
                )}
            </button>
        </div>
    );
};

export default Promise4LittleThings;
