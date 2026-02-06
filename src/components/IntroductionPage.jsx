import { useState, useEffect } from 'react';
import { Calendar, Sparkles, Lock, Clock } from 'lucide-react';

// Photos sorted chronologically (oldest to newest) for clockwise flow: Top → Right → Bottom → Left
const sortedPhotos = [
    '1.1.jpeg', '1.2.jpeg', '1.3.jpeg', '2.1.jpeg', '2.2.jpeg', '2.3.jpeg', '3.1.jpeg', '3.2.jpeg',
    '4.1.jpeg', '4.2.jpeg', '5.jpeg', '5.4.jpeg', '6.jpeg', '6.5.jpeg', '7.jpeg', '8.jpeg',
    '8.8.jpeg', '9.jpeg', '9.8.jpeg', '9.9.jpeg', '10.jpeg', '10.1.jpeg', '11.1.jpeg', '11.2.jpeg',
    '11.3.jpeg', '12.jpeg', '12.2.jpeg', '13.jpeg', '13.5.jpeg', '16.5.jpeg', '19.jpeg', '19.1.jpeg',
    '23.jpeg', '24.jpeg', '25.jpeg', '26.jpeg', '27.jpeg', '27.5.jpeg', '28.jpeg', '29.jpeg',
    '31.jpeg', '32.jpeg', '33.jpeg', '34.jpeg', '49.jpeg', '49.5.jpeg', '50.jpeg', '51.jpeg',
    '52.jpeg', '53.jpeg', '54.jpeg', '54.5.jpeg', '55.jpeg', '56.jpeg', '56.5.jpeg', '57.jpeg',
    '58.jpeg', '59.jpeg', '60.jpeg', '61.jpeg', '61.5.jpeg', '62.jpeg', '62.2.jpeg', '63.jpeg',
    '64.jpeg', '64.5.jpeg', '65.jpeg', '66.jpeg', '67.jpeg'
];

// Split photos for clockwise flow: Top (17) → Left (17) → Bottom (17) → Right (18)
const topPhotos = sortedPhotos.slice(0, 17);
const leftPhotos = sortedPhotos.slice(17, 34);
const bottomPhotos = sortedPhotos.slice(34, 51);
const rightPhotos = sortedPhotos.slice(51, 69);

const IntroductionPage = ({ currentDate }) => {
    // Animation states
    const [line1Visible, setLine1Visible] = useState(false);
    const [line2Visible, setLine2Visible] = useState(false);
    const [line3Visible, setLine3Visible] = useState(false);
    const [message1Visible, setMessage1Visible] = useState(false);
    const [message2Visible, setMessage2Visible] = useState(false);
    const [finalVisible, setFinalVisible] = useState(false);
    const [showDates, setShowDates] = useState(false);

    // Photo strip sequential visibility states
    const [topStripVisible, setTopStripVisible] = useState(false);
    const [rightStripVisible, setRightStripVisible] = useState(false);
    const [bottomStripVisible, setBottomStripVisible] = useState(false);
    const [leftStripVisible, setLeftStripVisible] = useState(false);

    // Background collage visibility
    const [backgroundCollageVisible, setBackgroundCollageVisible] = useState(false);



    // Calculate which dates to show
    const getCurrentDay = () => {
        const startDate = new Date('2026-02-07');
        const diffTime = currentDate - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, Math.min(diffDays, 7));
    };

    const dayNumber = getCurrentDay();

    const allDates = [
        { date: 'Feb 8', label: 'Promise 1', day: 8 },
        { date: 'Feb 9', label: 'Promise 2', day: 9 },
        { date: 'Feb 10', label: 'Promise 3', day: 10 },
        { date: 'Feb 11', label: 'Promise 4', day: 11 },
        { date: 'Feb 12', label: 'Promise 5', day: 12 },
        { date: 'Feb 13', label: 'Promise 6', day: 13 },
        { date: 'Feb 14', label: 'Promise 7', day: 14 },
    ];

    const visibleDates = [allDates[0]]; // Only show Feb 8th as Coming Up

    // Helper to calculate time left until a specific date
    const getTimeLeft = (targetDay) => {
        const targetDate = new Date('2026-02-01'); // Base
        targetDate.setDate(targetDay);
        targetDate.setHours(0, 0, 0, 0);

        const diff = targetDate - currentDate;
        if (diff <= 0) return null;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (hours === 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${hours}h ${minutes}m`;
    };

    // Animation sequence
    useEffect(() => {
        const timers = [];

        // New timing sequence to match the song
        // Line 1: immediately (0ms)
        timers.push(setTimeout(() => setLine1Visible(true), 0));

        // Line 2: after 5 seconds (5000ms)
        timers.push(setTimeout(() => setLine2Visible(true), 5000));

        // Line 3: after 3 more seconds (8000ms total)
        timers.push(setTimeout(() => setLine3Visible(true), 8000));

        // Message 1 (journey story): after 5 more seconds (13000ms total)
        timers.push(setTimeout(() => setMessage1Visible(true), 13000));

        // Message 2 (seven visions): after 5 more seconds (18000ms total)
        timers.push(setTimeout(() => setMessage2Visible(true), 18000));

        // Final reveal (7 Vachan): after 4 more seconds (22000ms total)
        timers.push(setTimeout(() => setFinalVisible(true), 22000));

        // Show dates (Coming Up) AFTER all photo strips have appeared (Last strip at 45s)
        timers.push(setTimeout(() => setShowDates(true), 48000));

        // Background collages fade in AFTER final message (25s)
        timers.push(setTimeout(() => setBackgroundCollageVisible(true), 25000));

        // Sequential photo strip reveal - AFTER collages appear
        // Order: Top → Left → Bottom → Right
        const stripStartDelay = 30000;  // 3 seconds delay AFTER collages finish fading in (25s + 2s fade + 3s delay)
        const stripInterval = 5000;      // 5 seconds between each strip

        timers.push(setTimeout(() => setTopStripVisible(true), stripStartDelay));                      // Top: 28s
        timers.push(setTimeout(() => setLeftStripVisible(true), stripStartDelay + stripInterval));      // Left: 33s
        timers.push(setTimeout(() => setBottomStripVisible(true), stripStartDelay + stripInterval * 2)); // Bottom: 38s
        timers.push(setTimeout(() => setRightStripVisible(true), stripStartDelay + stripInterval * 3));  // Right: 43s

        return () => timers.forEach(t => clearTimeout(t));
    }, []);

    // Shared animation styles
    const fadeUpStyle = (visible) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    });

    // Select random photos for background collage
    const backgroundPhotos = sortedPhotos.slice(0, 24); // Use first 24 photos

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                minHeight: '70vh',
                padding: '1rem 2rem',
                gap: '1.25rem',
                position: 'relative',
                marginTop: '-2rem', // Move up to use header space
                // overflow removed to allow photos at edges
            }}
        >
            {/* Background Photo Collage - Scattered around outer edges ONLY */}

            {/* BACKGROUND PHOTO COLLAGES - fade in after final message */}
            {/* INNER LEFT STRIP - positioned at 24.5% */}
            <div style={{ position: 'fixed', top: '8%', left: '24.5%', opacity: backgroundCollageVisible ? 0.2 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[0]}`} alt="" style={{ width: '75px', height: '95px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-5deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '22%', left: '25.5%', opacity: backgroundCollageVisible ? 0.18 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.3s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[1]}`} alt="" style={{ width: '70px', height: '88px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(6deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '38%', left: '25%', opacity: backgroundCollageVisible ? 0.15 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.6s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[2]}`} alt="" style={{ width: '65px', height: '82px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-3deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '54%', left: '25.5%', opacity: backgroundCollageVisible ? 0.18 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.9s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[3]}`} alt="" style={{ width: '72px', height: '90px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(4deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '70%', left: '24.5%', opacity: backgroundCollageVisible ? 0.2 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.2s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[4]}`} alt="" style={{ width: '68px', height: '85px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-6deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>

            {/* RIGHT SIDE - mirroring left side position */}
            <div style={{ position: 'fixed', top: '12%', right: '27%', opacity: backgroundCollageVisible ? 0.2 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.15s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[5]}`} alt="" style={{ width: '75px', height: '95px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(7deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '28%', right: '26%', opacity: backgroundCollageVisible ? 0.18 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.45s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[6]}`} alt="" style={{ width: '70px', height: '88px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-5deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '44%', right: '27.5%', opacity: backgroundCollageVisible ? 0.15 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.75s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[7]}`} alt="" style={{ width: '68px', height: '85px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(4deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '60%', right: '26.5%', opacity: backgroundCollageVisible ? 0.18 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.05s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[8]}`} alt="" style={{ width: '72px', height: '90px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-6deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '76%', right: '27%', opacity: backgroundCollageVisible ? 0.2 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.35s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[9]}`} alt="" style={{ width: '65px', height: '82px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(5deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>

            {/* OUTER LEFT STRIP - positioned at 17.5% */}
            <div style={{ position: 'fixed', top: '5%', left: '17.5%', opacity: backgroundCollageVisible ? 0.18 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.2s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[12]}`} alt="" style={{ width: '70px', height: '88px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(4deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '20%', left: '18%', opacity: backgroundCollageVisible ? 0.15 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.5s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[13]}`} alt="" style={{ width: '65px', height: '82px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-3deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '35%', left: '17.5%', opacity: backgroundCollageVisible ? 0.2 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.8s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[14]}`} alt="" style={{ width: '72px', height: '90px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(5deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '50%', left: '18%', opacity: backgroundCollageVisible ? 0.16 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.1s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[15]}`} alt="" style={{ width: '68px', height: '85px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-4deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '65%', left: '17.5%', opacity: backgroundCollageVisible ? 0.18 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.4s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[16]}`} alt="" style={{ width: '70px', height: '88px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(3deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '80%', left: '18%', opacity: backgroundCollageVisible ? 0.15 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.7s', pointerEvents: 'none', zIndex: 0 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[17]}`} alt="" style={{ width: '65px', height: '82px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-5deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>

            {/* OUTER RIGHT STRIP */}
            <div style={{ position: 'fixed', top: '10%', right: '21%', opacity: backgroundCollageVisible ? 0.18 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.25s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[18]}`} alt="" style={{ width: '70px', height: '88px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-4deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '25%', right: '20%', opacity: backgroundCollageVisible ? 0.15 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.55s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[19]}`} alt="" style={{ width: '65px', height: '82px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(5deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '40%', right: '21.5%', opacity: backgroundCollageVisible ? 0.2 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '0.85s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[20]}`} alt="" style={{ width: '72px', height: '90px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-3deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '55%', right: '20.5%', opacity: backgroundCollageVisible ? 0.16 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.15s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[21]}`} alt="" style={{ width: '68px', height: '85px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(4deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '70%', right: '21%', opacity: backgroundCollageVisible ? 0.18 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.45s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[22]}`} alt="" style={{ width: '70px', height: '88px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(-5deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>
            <div style={{ position: 'fixed', top: '85%', right: '20%', opacity: backgroundCollageVisible ? 0.15 : 0, transition: 'opacity 2s ease-in-out', transitionDelay: '1.75s', pointerEvents: 'none', zIndex: 5 }}>
                <img src={`/mycutusbdaycountdown2026/photos/${backgroundPhotos[23]}`} alt="" style={{ width: '65px', height: '82px', objectFit: 'cover', borderRadius: '8px', transform: 'rotate(3deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} />
            </div>

            {/* Staggered question lines */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    maxWidth: '700px',
                    width: '100%',
                    padding: '1rem 2rem',
                }}
            >
                {/* Line 1 - Left aligned */}
                <p
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                        color: '#5d4037',
                        lineHeight: 1.6,
                        margin: 0,
                        fontStyle: 'italic',
                        textAlign: 'left',
                        ...fadeUpStyle(line1Visible),
                    }}
                >
                    You just signed up for a lifetime of me by saying <span style={{ color: '#e91e63', fontWeight: 'bold' }}>Yes</span> to that valentine request cutu 💕✨
                </p>

                {/* Line 2 - slightly indented */}
                <p
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                        color: '#5d4037',
                        lineHeight: 1.6,
                        margin: 0,
                        fontStyle: 'italic',
                        marginLeft: '2.5rem',
                        ...fadeUpStyle(line2Visible),
                    }}
                >
                    You must be wondering 🤔
                </p>

                {/* Line 3 - more indented */}
                <p
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                        color: '#5d4037',
                        lineHeight: 1.6,
                        margin: 0,
                        fontStyle: 'italic',
                        marginLeft: '5rem',
                        ...fadeUpStyle(line3Visible),
                    }}
                >
                    What's the intent here...? 💭
                </p>
            </div>

            {/* First big message - centered */}
            <p
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                    color: '#6a4c41',
                    lineHeight: 1.8,
                    margin: 0,
                    marginTop: '1rem',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    maxWidth: '650px',
                    padding: '0 1rem',
                    ...fadeUpStyle(message1Visible),
                }}
            >
                While our journey so far has been my favorite story 📖, this year I don't want to just look back at where we've been... 🌅
            </p>

            {/* Second big message - centered */}
            <p
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                    color: '#6a4c41',
                    lineHeight: 1.8,
                    margin: 0,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    maxWidth: '650px',
                    padding: '0 1rem',
                    ...fadeUpStyle(message2Visible),
                }}
            >
                Over the next seven days, I want to share seven visions of our future 🔮, seven promises I intend to keep for a lifetime 💫✨
            </p>

            {/* Final reveal - My 7 Vachan to you */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '1.5rem',
                    ...fadeUpStyle(finalVisible),
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <Sparkles
                        size={32}
                        style={{
                            color: '#e91e63',
                            animation: finalVisible ? 'pulse 1.5s ease-in-out infinite' : 'none',
                        }}
                    />
                    <h2
                        className="font-heading"
                        style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                            color: '#c2185b',
                            margin: 0,
                            textShadow: '2px 2px 8px rgba(194, 24, 91, 0.3)',
                        }}
                    >
                        Ek birthday, aur mere 7 Vachan. Ready?
                    </h2>
                    <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>💍</span>
                </div>
            </div>

            {/* 4-SIDED PHOTO FRAME - positioned around content area */}
            {/* TOP STRIP - scrolls right */}
            <div
                style={{
                    position: 'fixed',
                    top: '5%',
                    left: '10%',
                    right: '15%',
                    overflow: 'hidden',
                    zIndex: 10,
                    opacity: topStripVisible ? 1 : 0,
                    transition: 'opacity 2s ease-in-out',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        animation: 'scrollPhotos 80s linear infinite',
                        width: 'max-content',
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} style={{ display: 'flex', gap: '0.5rem' }}>
                            {topPhotos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={`/mycutusbdaycountdown2026/photos/${photo}`}
                                    alt=""
                                    style={{
                                        width: '85px',
                                        height: '120px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        border: '2px solid rgba(255,255,255,0.6)',
                                        flexShrink: 0,
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM STRIP - scrolls left */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '12%',
                    left: '10%',
                    right: '15%',
                    overflow: 'hidden',
                    zIndex: 10,
                    opacity: bottomStripVisible ? 1 : 0,
                    transition: 'opacity 2s ease-in-out',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        animation: 'scrollPhotosReverse 80s linear infinite',
                        width: 'max-content',
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} style={{ display: 'flex', gap: '0.5rem' }}>
                            {bottomPhotos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={`/mycutusbdaycountdown2026/photos/${photo}`}
                                    alt=""
                                    style={{
                                        width: '85px',
                                        height: '120px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        border: '2px solid rgba(255,255,255,0.6)',
                                        flexShrink: 0,
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* LEFT STRIP - scrolls up */}
            <div
                style={{
                    position: 'fixed',
                    left: 'calc(10% - 85px)',
                    top: 'calc(5% + 120px)',
                    bottom: 'calc(12% + 120px)',
                    width: '85px',
                    overflow: 'hidden',
                    zIndex: 10,
                    opacity: leftStripVisible ? 1 : 0,
                    transition: 'opacity 2s ease-in-out',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        animation: 'scrollPhotosDown 60s linear infinite',
                        height: 'max-content',
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {leftPhotos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={`/mycutusbdaycountdown2026/photos/${photo}`}
                                    alt=""
                                    style={{
                                        width: '85px',
                                        height: '120px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        border: '2px solid rgba(255,255,255,0.6)',
                                        flexShrink: 0,
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT STRIP - scrolls down */}
            <div
                style={{
                    position: 'fixed',
                    right: 'calc(15% - 85px)',
                    top: 'calc(5% + 120px)',
                    bottom: 'calc(12% + 120px)',
                    width: '85px',
                    overflow: 'hidden',
                    zIndex: 10,
                    opacity: rightStripVisible ? 1 : 0,
                    transition: 'opacity 2s ease-in-out',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        animation: 'scrollPhotosUp 60s linear infinite',
                        height: 'max-content',
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {rightPhotos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={`/mycutusbdaycountdown2026/photos/${photo}`}
                                    alt=""
                                    style={{
                                        width: '85px',
                                        height: '120px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        border: '2px solid rgba(255,255,255,0.6)',
                                        flexShrink: 0,
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>


            {/* Right Sidebar - Dates (extreme right edge) */}
            {
                showDates && (
                    <div
                        style={{
                            position: 'fixed',
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            zIndex: 20,
                        }}
                    >
                        <h3
                            className="font-heading"
                            style={{
                                fontSize: '1rem',
                                color: '#880e4f',
                                marginBottom: '0.5rem',
                                textAlign: 'center',
                            }}
                        >
                            Coming Up
                        </h3>

                        {visibleDates.map((item, index) => (
                            <div
                                key={item.day}
                                className="glass-card"
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    opacity: 0,
                                    animation: 'fadeInUp 0.5s ease-out forwards',
                                    animationDelay: `${index * 0.15}s`,
                                }}
                            >
                                <Calendar size={18} style={{ color: '#c2185b' }} />
                                <div>
                                    <p
                                        className="font-heading"
                                        style={{
                                            margin: 0,
                                            fontSize: '0.95rem',
                                            color: '#880e4f',
                                        }}
                                    >
                                        {item.date}
                                    </p>
                                    <p
                                        className="font-body"
                                        style={{
                                            margin: 0,
                                            fontSize: '0.75rem',
                                            color: '#888',
                                        }}
                                    >
                                        {item.label}
                                    </p>
                                </div>
                                {currentDate.getDate() < item.day && (
                                    <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Lock size={14} style={{ color: '#880e4f', marginBottom: '2px' }} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem', color: '#880e4f', opacity: 0.8 }}>
                                            <Clock size={10} />
                                            <span>{getTimeLeft(item.day)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            }


        </div >
    );
};

export default IntroductionPage;
