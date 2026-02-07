import { useState, useEffect } from 'react';

/**
 * Custom hook to track mouse/touch position with optional smoothing lag
 * @param {number} smoothing - Higher values = more lag (0-1 range, default 0.1)
 */
export const useMousePosition = (smoothing = 0.1) => {
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const [smoothedPosition, setSmoothedPosition] = useState({ x: 0, y: 0 });
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setTargetPosition({ x: e.clientX, y: e.clientY });
            setIsActive(true);
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                setTargetPosition({
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                });
                setIsActive(true);
            }
        };

        const handleMouseLeave = () => {
            setIsActive(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Smooth interpolation animation frame
    useEffect(() => {
        let animationFrame;

        const animate = () => {
            setSmoothedPosition(prev => ({
                x: prev.x + (targetPosition.x - prev.x) * smoothing,
                y: prev.y + (targetPosition.y - prev.y) * smoothing,
            }));
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [targetPosition, smoothing]);

    return {
        position: smoothedPosition,
        targetPosition,
        isActive
    };
};

export default useMousePosition;
