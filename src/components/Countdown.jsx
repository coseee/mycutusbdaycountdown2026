import { useState, useEffect } from 'react';

const Countdown = ({ targetDate, currentDate }) => {
    const calculateTimeLeft = () => {
        // Use passed currentDate if available, otherwise use real time
        const now = currentDate ? new Date(currentDate) : new Date();
        const difference = +new Date(targetDate) - +now;
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
    }, [currentDate, targetDate]);

    const timeUnits = Object.entries(timeLeft);

    if (timeUnits.length === 0) {
        return (
            <div className="font-heading text-primary-dark" style={{ fontSize: '2rem' }}>
                🎉 It's Time! 🎉
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
        }}>
            {timeUnits.map(([unit, value]) => (
                <div
                    key={unit}
                    className="countdown-bubble"
                    style={{
                        width: 'clamp(70px, 15vw, 100px)',
                        height: 'clamp(70px, 15vw, 100px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span
                        className="font-heading"
                        style={{
                            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                            fontWeight: 700,
                            color: '#c2185b',
                            lineHeight: 1,
                        }}
                    >
                        {value < 10 ? `0${value}` : value}
                    </span>
                    <span
                        className="font-body"
                        style={{
                            fontSize: 'clamp(0.6rem, 2vw, 0.8rem)',
                            textTransform: 'uppercase',
                            color: '#880e4f',
                            letterSpacing: '1px',
                            fontWeight: 600,
                        }}
                    >
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Countdown;
