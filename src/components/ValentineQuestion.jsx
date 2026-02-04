import { useState, useEffect, useRef } from 'react';
import { Heart, X } from 'lucide-react';

const ValentineQuestion = ({ onYesClick }) => {
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
    const [yesButtonScale, setYesButtonScale] = useState(1);
    const [noHoverCount, setNoHoverCount] = useState(0);
    const [questionVisible, setQuestionVisible] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(false);
    const containerRef = useRef(null);

    // Typewriter effect for the question (two parts)
    const line1 = "Okay, here we go ✨Feb 7th✨, ofcourse the obligatory question...";
    const line2 = "Will you be my Valentine cutu? 🥺";

    const [displayedLine1, setDisplayedLine1] = useState('');
    const [displayedLine2, setDisplayedLine2] = useState('');
    const [charIndex, setCharIndex] = useState(0);
    const [typingLine, setTypingLine] = useState(1); // 1 = first line, 2 = second line

    useEffect(() => {
        // Start typewriter after a short delay
        const startDelay = setTimeout(() => {
            setQuestionVisible(true);
        }, 500);
        return () => clearTimeout(startDelay);
    }, []);

    useEffect(() => {
        if (!questionVisible) return;

        if (typingLine === 1 && charIndex < line1.length) {
            const timer = setTimeout(() => {
                setDisplayedLine1(line1.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, 50);
            return () => clearTimeout(timer);
        } else if (typingLine === 1 && charIndex >= line1.length) {
            // Pause before starting line 2
            const pauseTimer = setTimeout(() => {
                setTypingLine(2);
                setCharIndex(0);
            }, 500);
            return () => clearTimeout(pauseTimer);
        } else if (typingLine === 2 && charIndex < line2.length) {
            const timer = setTimeout(() => {
                setDisplayedLine2(line2.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, 50);
            return () => clearTimeout(timer);
        } else if (typingLine === 2 && charIndex >= line2.length) {
            // Show buttons after typing is complete
            setTimeout(() => setButtonsVisible(true), 300);
        }
    }, [questionVisible, charIndex, typingLine, line1, line2]);

    // Move the No button to a random position (keep away from Yes button on left)
    const moveNoButton = () => {
        if (!containerRef.current) return;

        const container = containerRef.current.getBoundingClientRect();

        // Only allow No button to move to the RIGHT side (away from Yes button)
        // X: 50 to 200px (right side only)
        // Y: -80 to 80px (some vertical movement)
        const newX = 50 + Math.random() * 150;
        const newY = (Math.random() * 160) - 80;

        setNoButtonPosition({ x: newX, y: newY });
        setNoHoverCount(prev => prev + 1);

        // Make Yes button bigger each time
        setYesButtonScale(prev => Math.min(prev + 0.15, 2));
    };

    return (
        <div
            ref={containerRef}
            className="animate-fade-in"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '800px',
                minHeight: '400px',
                position: 'relative',
            }}
        >
            {/* Title Header - My Cutu's Birthday Countdown */}
            <h1
                className="font-heading text-heading animate-fade-in-up"
                style={{
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    textShadow: '2px 2px 8px rgba(136, 14, 79, 0.2)',
                    margin: 0,
                    textAlign: 'center',
                }}
            >
                My Cutu's Birthday Countdown
            </h1>

            {/* Date Header - Feb 7th */}
            <div
                className="animate-fade-in-up font-heading"
                style={{
                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                    color: '#c2185b',
                    textShadow: '1px 1px 4px rgba(136, 14, 79, 0.15)',
                    animationDelay: '0.2s',
                    opacity: 0,
                }}
            >
                ✨ Feb 7th ✨
            </div>

            {/* Animated Question - Using Playfair Display for readability */}
            <div
                className="glass-card"
                style={{
                    padding: '2rem',
                    maxWidth: '650px',
                    textAlign: 'center',
                    minHeight: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                {/* Line 1 - Intro */}
                <p
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                        color: '#5d4037',
                        lineHeight: 1.6,
                        margin: 0,
                        fontWeight: 400,
                        fontStyle: 'italic',
                    }}
                >
                    {displayedLine1}
                    {typingLine === 1 && charIndex < line1.length && (
                        <span className="animate-pulse" style={{ opacity: 0.7 }}>|</span>
                    )}
                </p>

                {/* Line 2 - The Question */}
                {typingLine === 2 && (
                    <p
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1.25rem, 3vw, 1.6rem)',
                            color: '#c2185b',
                            lineHeight: 1.6,
                            margin: 0,
                            fontWeight: 600,
                            fontStyle: 'italic',
                        }}
                    >
                        {displayedLine2}
                        {charIndex < line2.length && (
                            <span className="animate-pulse" style={{ opacity: 0.7 }}>|</span>
                        )}
                    </p>
                )}
            </div>

            {/* Yes / No Buttons */}
            {buttonsVisible && (
                <div
                    className="animate-fade-in-up"
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        width: '100%',
                        minHeight: '150px',
                    }}
                >
                    {/* Yes Button */}
                    <button
                        onClick={onYesClick}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem 2.5rem',
                            fontSize: '1.5rem',
                            fontFamily: "'Dancing Script', cursive",
                            fontWeight: 700,
                            color: '#fff',
                            background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: `0 4px ${20 + yesButtonScale * 10}px rgba(233, 30, 99, ${0.4 + yesButtonScale * 0.1})`,
                            transition: 'all 0.3s ease',
                            transform: `scale(${yesButtonScale})`,
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.boxShadow = `0 6px ${30 + yesButtonScale * 15}px rgba(233, 30, 99, 0.7)`;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.boxShadow = `0 4px ${20 + yesButtonScale * 10}px rgba(233, 30, 99, ${0.4 + yesButtonScale * 0.1})`;
                        }}
                    >
                        <Heart size={24} fill="currentColor" />
                        Yes!
                    </button>

                    {/* No Button - Runs away! (disappears at 6 hovers) */}
                    {noHoverCount < 6 && (
                        <button
                            onMouseEnter={moveNoButton}
                            onClick={moveNoButton}
                            onTouchStart={moveNoButton}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 500,
                                color: '#666',
                                background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px) scale(${Math.max(0.6, 1 - noHoverCount * 0.08)})`,
                            }}
                        >
                            <X size={18} />
                            No
                        </button>
                    )}

                    {/* Hint text - appears on the right side (away from Yes) */}
                    {noHoverCount >= 3 && (
                        <p
                            className="font-heading animate-fade-in"
                            style={{
                                position: 'absolute',
                                right: '0',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1.1rem',
                                color: '#c2185b',
                                fontWeight: 600,
                                textShadow: '1px 1px 3px rgba(136, 14, 79, 0.15)',
                                whiteSpace: 'nowrap',
                                paddingRight: '1rem',
                            }}
                        >
                            {noHoverCount >= 6
                                ? "le, bhaga hi dia usse, ab?🤭"
                                : noHoverCount >= 5
                                    ? "zyada ho raha hai😒"
                                    : noHoverCount >= 4
                                        ? "kya karlegi 'No' bolke😏"
                                        : "aise nhi karte, cutu🥱"}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ValentineQuestion;
