import { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, VolumeX, Heart } from 'lucide-react';
import { useMousePosition } from '../hooks/useMousePosition';

// ─── Adventure Data (Year → Photos + Caption) ───
// Phase 1 (2019-2022): Concerts, Food Exploration & Adventures
// Phase 2 (2022-2024): The Distant Times — Flowers & Food
// Phase 3 (2025-2026): Still distant, loving more than ever
// ┌─────────────────────────────────────────────────────────┐
// │  🔧 DEV_MODE: Set to true to drag photos into position │
// │  Photos become draggable polaroids. Positions are       │
// │  logged to console when you drop them.                  │
// │  Set to false for the final experience.                 │
// └─────────────────────────────────────────────────────────┘
const DEV_MODE = true;

const adventureYears = [
    {
        year: 2019,
        caption: 'Where it all began — Trips, Concerts, Food & Adventures 🎵✈️🍕⛰️',
        captionPos: { x: 19, y: 16 },
        phase: 1,
        photos: [
            { file: '1.jpeg', x: 6, y: 71, rotation: -5 },
            { file: '2.jpeg', x: 4, y: 38, rotation: 8 },
            { file: '3.jpeg', x: 11, y: 54, rotation: -12 },
        ],
    },
    {
        year: 2020,
        caption: '',
        phase: 1,
        photos: [
            { file: '1.jpeg', x: 31, y: 78, rotation: 6 },
            { file: '2.jpeg', x: 21, y: 84, rotation: -8 },
            { file: '3.jpeg', x: 28, y: 93, rotation: 3 },
        ],
    },
    {
        year: 2021,
        caption: '',
        phase: 1,
        photos: [
            { file: '1.jpeg', x: 23, y: 51, rotation: -7 },
            { file: '2.jpeg', x: 31, y: 50, rotation: 10 },
            { file: '3.jpeg', x: 25, y: 32, rotation: -3 },
        ],
    },
    {
        year: 2022,
        caption: 'The Distant Times — kept close by flowers, food & sheer will 💐🍕💪',
        captionPos: { x: 68, y: 93 },
        phase: 2,
        photos: [
            { file: '1.jpeg', x: 49, y: 66, rotation: 5 },
            { file: '2.jpeg', x: 49, y: 86, rotation: -10 },
            { file: '3.jpeg', x: 41, y: 76, rotation: 8 },
        ],
    },
    {
        year: 2023,
        caption: '',
        phase: 2,
        photos: [
            { file: '1.jpeg', x: 44, y: 42, rotation: -6 },
            { file: '2.jpeg', x: 48, y: 25, rotation: 12 },
            { file: '3.jpeg', x: 38, y: 28, rotation: -4 },
        ],
    },
    {
        year: 2024,
        caption: '',
        phase: 2,
        photos: [
            { file: '1.jpeg', x: 66, y: 51, rotation: 7 },
            { file: '2.jpeg', x: 65, y: 76, rotation: -9 },
            { file: '3.jpeg', x: 58, y: 59, rotation: 4 },
        ],
    },
    {
        year: 2025,
        caption: "The distance's still there, but loving harder than ever — till forever.",
        captionPos: { x: 83, y: 22 },
        phase: 3,
        photos: [
            { file: '1.jpeg', x: 73, y: 9, rotation: -8 },
            { file: '2.jpeg', x: 70, y: 33, rotation: 6 },
            { file: '3.jpeg', x: 61, y: 22, rotation: 11 },
            { file: '1.jpeg', x: 84, y: 33, rotation: -5, srcYear: 2026 },
            { file: '2.jpeg', x: 94, y: 9, rotation: 9, srcYear: 2026 },
            { file: '3.jpeg', x: 93, y: 32, rotation: -3, srcYear: 2026 },
        ],
    },
    {
        year: 2026,
        caption: '',
        phase: 3,
        photos: [],
    },
];

// Phase labels for the map
const phaseLabels = [
    { label: 'Concerts · Food · Adventures', x: 15, y: 95, phase: 1 },
    { label: 'The Distant Times — Flowers & Food', x: 55, y: 58, phase: 2 },
    { label: 'Still Distant, Loving More', x: 82, y: 8, phase: 3 },
];

// ─── Trail points (bottom-left → top-right), normalized 0-100 ───
const trailPoints = [
    { x: 10, y: 90 },  // 2019 - bottom left
    { x: 18, y: 74 },  // 2020
    { x: 32, y: 68 },  // 2021
    { x: 42, y: 56 },  // 2022
    { x: 52, y: 48 },  // 2023
    { x: 62, y: 38 },  // 2024
    { x: 76, y: 28 },  // 2025
    { x: 88, y: 15 },  // 2026 - top right
];

// Build smooth SVG path through all points
const buildTrailPath = (pts) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const curr = pts[i];
        const next = pts[i + 1];
        const cpx1 = curr.x + (next.x - curr.x) * 0.5;
        const cpy1 = curr.y;
        const cpx2 = curr.x + (next.x - curr.x) * 0.5;
        const cpy2 = next.y;
        d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${next.x} ${next.y}`;
    }
    return d;
};

const TRAIL_PATH = buildTrailPath(trailPoints);

// Build individual segment paths (point i → point i+1)
const buildSegmentPath = (i, pts) => {
    const curr = pts[i];
    const next = pts[i + 1];
    const cpx1 = curr.x + (next.x - curr.x) * 0.5;
    const cpy1 = curr.y;
    const cpx2 = curr.x + (next.x - curr.x) * 0.5;
    const cpy2 = next.y;
    return `M ${curr.x} ${curr.y} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${next.x} ${next.y}`;
};

const SEGMENT_PATHS = trailPoints.slice(0, -1).map((_, i) => buildSegmentPath(i, trailPoints));

// ─── Parchment Background ───
const ParchmentBackground = () => (
    <div style={{
        position: 'absolute', inset: 0,
        background: `
            radial-gradient(ellipse at 20% 50%, rgba(139, 109, 63, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 30%, rgba(139, 109, 63, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 80%, rgba(101, 67, 33, 0.08) 0%, transparent 45%),
            linear-gradient(135deg, #f5e6c8 0%, #e8d5a3 25%, #f0deb8 50%, #dcc898 75%, #f2e0b6 100%)
        `,
        zIndex: 0,
    }}>
        {/* Coffee stain watermarks */}
        <div style={{
            position: 'absolute', top: '15%', left: '10%',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 90, 43, 0.08) 0%, rgba(139, 90, 43, 0.03) 40%, transparent 70%)',
            border: '2px solid rgba(139, 90, 43, 0.06)',
        }} />
        <div style={{
            position: 'absolute', bottom: '25%', right: '15%',
            width: '90px', height: '90px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 90, 43, 0.06) 0%, transparent 60%)',
            border: '1.5px solid rgba(139, 90, 43, 0.05)',
        }} />

        {/* Burnt edges (vignette) */}
        <div style={{
            position: 'absolute', inset: 0,
            boxShadow: 'inset 0 0 100px rgba(80, 50, 20, 0.4), inset 0 0 200px rgba(60, 35, 10, 0.15)',
            pointerEvents: 'none',
        }} />

        {/* Subtle grid lines (old map look) */}
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
                linear-gradient(rgba(139, 90, 43, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 90, 43, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
        }} />
    </div>
);

// ─── Compass Rose ───
const CompassRose = ({ settled, shrunk }) => {
    const compassRef = useRef(null);
    const { position: mousePos, isActive } = useMousePosition(0.15);

    // Calculate needle angle pointing toward cursor
    let needleAngle = -45; // default (matches compass-settle end position)
    if (settled && shrunk && isActive && compassRef.current) {
        const rect = compassRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        needleAngle = Math.atan2(mousePos.x - cx, -(mousePos.y - cy)) * (180 / Math.PI);
    }

    return (
        <div style={{
            position: shrunk ? 'absolute' : 'absolute',
            bottom: shrunk ? '5%' : '50%',
            right: shrunk ? '5%' : '50%',
            transform: shrunk
                ? 'translate(0, 0) scale(0.5)'
                : 'translate(50%, 50%) scale(1)',
            transition: 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 15,
            pointerEvents: 'none',
            opacity: settled ? 1 : 0,
        }}>
            {/* Compass outer ring */}
            <div ref={compassRef} style={{
                width: '120px', height: '120px',
                borderRadius: '50%',
                border: '3px solid rgba(139, 90, 43, 0.6)',
                background: 'radial-gradient(circle, rgba(245, 230, 200, 0.95) 0%, rgba(220, 200, 160, 0.9) 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 15px rgba(139, 90, 43, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
            }}>
                {/* Cardinal letters */}
                {['N', 'E', 'S', 'W'].map((dir, i) => (
                    <span key={dir} style={{
                        position: 'absolute',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: dir === 'N' ? '#8b2500' : 'rgba(101, 67, 33, 0.7)',
                        ...(i === 0 ? { top: '8px', left: '50%', transform: 'translateX(-50%)' } :
                            i === 1 ? { right: '8px', top: '50%', transform: 'translateY(-50%)' } :
                                i === 2 ? { bottom: '8px', left: '50%', transform: 'translateX(-50%)' } :
                                    { left: '8px', top: '50%', transform: 'translateY(-50%)' }),
                    }}>
                        {dir}
                    </span>
                ))}

                {/* Needle */}
                <div style={{
                    width: '4px', height: '70px',
                    position: 'relative',
                    animation: settled
                        ? (shrunk ? 'none' : 'compass-settle 3s ease-out forwards')
                        : 'compass-spin 1s linear infinite',
                    transform: settled && shrunk ? `rotate(${needleAngle}deg)` : undefined,
                }}>
                    {/* North (red) */}
                    <div style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                        width: 0, height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderBottom: '32px solid #8b2500',
                    }} />
                    {/* South (dark) */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                        width: 0, height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '32px solid rgba(60, 40, 20, 0.6)',
                    }} />
                    {/* Center pin */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#8b6914',
                        border: '1px solid rgba(139, 90, 43, 0.5)',
                    }} />
                </div>
            </div>
        </div>
    );
};

// ─── Terrain Decorations (CSS only) ───
const TerrainDecorations = ({ visible }) => {
    const trees = useMemo(() => [
        { x: 3, y: 70, size: 16, opacity: 0.4 },
        { x: 6, y: 73, size: 12, opacity: 0.3 },
        { x: 14, y: 82, size: 14, opacity: 0.35 },
        { x: 25, y: 62, size: 10, opacity: 0.25 },
        { x: 45, y: 42, size: 12, opacity: 0.3 },
        { x: 70, y: 22, size: 14, opacity: 0.35 },
        { x: 85, y: 10, size: 10, opacity: 0.25 },
        { x: 93, y: 8, size: 16, opacity: 0.3 },
    ], []);

    const mountains = useMemo(() => [
        { x: 78, y: 14, w: 60, h: 40, opacity: 0.15 },
        { x: 90, y: 10, w: 50, h: 35, opacity: 0.12 },
        { x: 68, y: 20, w: 40, h: 28, opacity: 0.1 },
    ], []);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            opacity: visible ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            pointerEvents: 'none', zIndex: 2,
        }}>
            {/* Mountains (triangles) */}
            {mountains.map((m, i) => (
                <div key={`mt-${i}`} style={{
                    position: 'absolute',
                    left: `${m.x}%`, top: `${m.y}%`,
                    width: 0, height: 0,
                    borderLeft: `${m.w / 2}px solid transparent`,
                    borderRight: `${m.w / 2}px solid transparent`,
                    borderBottom: `${m.h}px solid rgba(101, 67, 33, ${m.opacity})`,
                    transform: 'translate(-50%, 0)',
                }} />
            ))}

            {/* Trees (simple triangles) */}
            {trees.map((t, i) => (
                <div key={`tree-${i}`} style={{
                    position: 'absolute',
                    left: `${t.x}%`, top: `${t.y}%`,
                    opacity: t.opacity,
                }}>
                    <div style={{
                        width: 0, height: 0,
                        borderLeft: `${t.size / 2}px solid transparent`,
                        borderRight: `${t.size / 2}px solid transparent`,
                        borderBottom: `${t.size}px solid rgba(60, 80, 40, 0.7)`,
                        transform: 'translate(-50%, 0)',
                    }} />
                    <div style={{
                        width: '2px', height: `${t.size / 3}px`,
                        background: 'rgba(101, 67, 33, 0.5)',
                        margin: '0 auto',
                    }} />
                </div>
            ))}

            {/* Waves (bottom-left, near 2019) */}
            <div style={{
                position: 'absolute', left: '2%', bottom: '5%',
                fontSize: '1.2rem', opacity: 0.2,
                fontFamily: "'Playfair Display', serif",
                color: '#4a6fa5',
                letterSpacing: '4px',
            }}>
                ~ ~ ~ ~ ~
            </div>

            {/* Sunrise glow (top-right, near 2026) */}
            <div style={{
                position: 'absolute', top: '2%', right: '2%',
                width: '150px', height: '80px',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(251, 191, 36, 0.15) 0%, rgba(251, 146, 60, 0.08) 40%, transparent 70%)',
                borderRadius: '50%',
            }} />
        </div>
    );
};


// ─── Draggable Map Photo (DEV_MODE) ───
const DraggablePhoto = ({ year, photo, initialX, initialY, rotation, visible, onPhotoClick }) => {
    const [pos, setPos] = useState({ x: initialX, y: initialY });
    const [dragging, setDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
        if (!DEV_MODE) return;
        e.preventDefault();
        const rect = containerRef.current.parentElement.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - (pos.x / 100) * rect.width,
            y: e.clientY - (pos.y / 100) * rect.height,
        };
        setDragging(true);
    };

    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e) => {
            const rect = containerRef.current.parentElement.getBoundingClientRect();
            const newX = ((e.clientX - dragOffset.current.x) / rect.width) * 100;
            const newY = ((e.clientY - dragOffset.current.y) / rect.height) * 100;
            setPos({ x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
        };
        const handleUp = () => {
            setDragging(false);
            console.log(`📸 Photo placed: { file: '${photo}', x: ${Math.round(pos.x)}, y: ${Math.round(pos.y)}, rotation: ${rotation} }  (year: ${year})`);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [dragging, pos]);

    return (
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                width: 'clamp(80px, 10vw, 130px)',
                height: 'clamp(100px, 12vw, 160px)',
                border: '2px solid rgba(255,255,255,0.8)',
                overflow: 'hidden',
                boxShadow: dragging
                    ? '0 8px 30px rgba(0,0,0,0.35)'
                    : '0 4px 15px rgba(0,0,0,0.2)',
                borderRadius: '4px',
                cursor: DEV_MODE ? (dragging ? 'grabbing' : 'grab') : 'pointer',
                zIndex: dragging ? 100 : 8,
                opacity: visible ? 1 : 0,
                transition: dragging ? 'none' : 'opacity 0.8s ease-in-out, box-shadow 0.3s ease',
                pointerEvents: visible ? 'auto' : 'none',
            }}
            onClick={(e) => {
                if (!DEV_MODE && !dragging && onPhotoClick) {
                    e.stopPropagation();
                    onPhotoClick(`/mycutusbdaycountdown2026/assets/promise3/${year}/${photo}`, year);
                }
            }}
        >
            <img
                src={`/mycutusbdaycountdown2026/assets/promise3/${year}/${photo}`}
                alt={`${year} memory`}
                draggable={false}
                style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    borderRadius: '1px',
                    background: `linear-gradient(135deg, hsl(${(year - 2019) * 45}, 30%, 85%) 0%, hsl(${(year - 2019) * 45 + 20}, 35%, 75%) 100%)`,
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML += `<div style="position:absolute;inset:6px 6px 22px 6px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, hsl(${(year - 2019) * 45}, 30%, 85%), hsl(${(year - 2019) * 45 + 20}, 35%, 75%));font-size:0.75rem;color:#555;font-family:'Outfit',sans-serif;text-align:center;border-radius:1px"><span>${year}<br/>📸</span></div>`;
                }}
            />
            {/* DEV label */}
            {DEV_MODE && (
                <div style={{
                    position: 'absolute', bottom: '2px', left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.55rem',
                    fontFamily: 'monospace',
                    color: '#999',
                    whiteSpace: 'nowrap',
                }}>
                    {year} · ({Math.round(pos.x)}, {Math.round(pos.y)})
                </div>
            )}
        </div>
    );
};

// ─── Map Photos Layer ───
const MapPhotos = ({ openedChests, onPhotoClick }) => (
    <>
        {adventureYears.map((adventure, yearIndex) =>
            adventure.photos.map((photo, photoIndex) => (
                <DraggablePhoto
                    key={`${adventure.year}-${photoIndex}`}
                    year={photo.srcYear || adventure.year}
                    photo={photo.file}
                    initialX={photo.x}
                    initialY={photo.y}
                    rotation={photo.rotation}
                    visible={openedChests.has(yearIndex)}
                    onPhotoClick={onPhotoClick}
                />
            ))
        )}
    </>
);

// ─── Draggable Caption ───
const DraggableCaption = ({ year, caption, initialX, initialY, visible }) => {
    const [pos, setPos] = useState({ x: initialX, y: initialY });
    const [dragging, setDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const ref = useRef(null);

    const handleMouseDown = (e) => {
        if (!DEV_MODE) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = ref.current.parentElement.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - (pos.x / 100) * rect.width,
            y: e.clientY - (pos.y / 100) * rect.height,
        };
        setDragging(true);
    };

    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e) => {
            const rect = ref.current.parentElement.getBoundingClientRect();
            const newX = ((e.clientX - dragOffset.current.x) / rect.width) * 100;
            const newY = ((e.clientY - dragOffset.current.y) / rect.height) * 100;
            setPos({ x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
        };
        const handleUp = () => {
            setDragging(false);
            console.log(`🏷️ Caption placed: captionPos: { x: ${Math.round(pos.x)}, y: ${Math.round(pos.y)} }  // ${year}`);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [dragging, pos]);

    return (
        <div
            ref={ref}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: dragging ? 100 : 25,
                cursor: DEV_MODE ? (dragging ? 'grabbing' : 'grab') : 'default',
                pointerEvents: visible && (DEV_MODE || true) ? 'auto' : 'none',
                opacity: visible ? 1 : 0,
                transition: dragging ? 'none' : 'opacity 0.8s ease-in-out',
                whiteSpace: 'nowrap',
            }}
        >
            <span style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.6rem',
                fontWeight: 600,
                color: '#6b4f10',
                textShadow: '0 2px 6px rgba(245, 230, 200, 0.9)',
                background: 'rgba(245, 230, 200, 0.7)',
                padding: '2px 10px',
                borderRadius: '6px',
            }}>
                {caption}
            </span>
            {DEV_MODE && (
                <div style={{
                    fontSize: '0.55rem', fontFamily: 'monospace',
                    color: '#999', textAlign: 'center', marginTop: '2px',
                }}>
                    {year} caption · ({Math.round(pos.x)}, {Math.round(pos.y)})
                </div>
            )}
        </div>
    );
};

// ─── Map Captions Layer ───
const MapCaptions = ({ openedChests }) => (
    <>
        {adventureYears.map((adventure, yearIndex) =>
            adventure.caption && adventure.captionPos ? (
                <DraggableCaption
                    key={`caption-${adventure.year}`}
                    year={adventure.year}
                    caption={adventure.caption}
                    initialX={adventure.captionPos.x}
                    initialY={adventure.captionPos.y}
                    visible={openedChests.has(yearIndex)}
                />
            ) : null
        )}
    </>
);

// ─── Draggable Heart Easter Egg (DEV_MODE) ───
const DraggableHeart = ({ id, color, message, initialX, initialY, visible }) => {
    const [pos, setPos] = useState({ x: initialX, y: initialY });
    const [dragging, setDragging] = useState(false);
    const [hovered, setHovered] = useState(false);
    const containerRef = useRef(null);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (!DEV_MODE) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = containerRef.current.parentElement.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - (pos.x / 100) * rect.width,
            y: e.clientY - (pos.y / 100) * rect.height,
        };
        setDragging(true);
    };

    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e) => {
            const rect = containerRef.current.parentElement.getBoundingClientRect();
            const newX = ((e.clientX - dragOffset.current.x) / rect.width) * 100;
            const newY = ((e.clientY - dragOffset.current.y) / rect.height) * 100;
            setPos({ x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
        };
        const handleUp = () => {
            setDragging(false);
            console.log(`💖 Heart placed: { id: '${id}', x: ${Math.round(pos.x)}, y: ${Math.round(pos.y)} }`);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [dragging, pos]);

    return (
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: dragging ? 100 : 30,
                opacity: visible ? 1 : 0,
                transition: dragging ? 'none' : 'opacity 0.8s ease-in-out',
                pointerEvents: visible ? 'auto' : 'none',
                cursor: DEV_MODE ? (dragging ? 'grabbing' : 'grab') : 'pointer',
            }}
        >
            {/* Heart icon */}
            <Heart
                size={28}
                fill={color}
                color={color}
                style={{
                    filter: `drop-shadow(0 2px 6px ${color}66)`,
                    animation: hovered ? 'none' : 'hint-pulse 2.5s ease-in-out infinite',
                    transform: hovered ? 'scale(1.3)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                }}
            />

            {/* Hover tooltip */}
            <div style={{
                position: 'absolute',
                bottom: '120%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #fff 0%, #fce4ec 100%)',
                color: '#5d4037',
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 15px ${color}33`,
                border: `1.5px solid ${color}55`,
                opacity: hovered ? 1 : 0,
                visibility: hovered ? 'visible' : 'hidden',
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
            }}>
                {message}
                {/* Tooltip arrow */}
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #fff',
                }} />
            </div>

            {/* DEV label */}
            {DEV_MODE && (
                <div style={{
                    position: 'absolute', top: '110%', left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.55rem', fontFamily: 'monospace',
                    color: '#999', whiteSpace: 'nowrap',
                }}>
                    {id} · ({Math.round(pos.x)}, {Math.round(pos.y)})
                </div>
            )}
        </div>
    );
};

const TreasureChest = ({ year, caption, isOpen, isAvailable, isActive, onClick, position, index }) => {
    const [showCaption, setShowCaption] = useState(false);
    const [pos, setPos] = useState({ x: position.x, y: position.y });
    const [dragging, setDragging] = useState(false);
    const chestRef = useRef(null);
    const dragOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (isOpen && isActive) {
            const timer = setTimeout(() => setShowCaption(true), 400);
            return () => clearTimeout(timer);
        }
        if (!isActive) setShowCaption(false);
    }, [isOpen, isActive]);

    // DEV_MODE drag
    const handleMouseDown = (e) => {
        if (!DEV_MODE) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = chestRef.current.parentElement.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - (pos.x / 100) * rect.width,
            y: e.clientY - (pos.y / 100) * rect.height,
        };
        setDragging(true);
    };

    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e) => {
            const rect = chestRef.current.parentElement.getBoundingClientRect();
            const newX = ((e.clientX - dragOffset.current.x) / rect.width) * 100;
            const newY = ((e.clientY - dragOffset.current.y) / rect.height) * 100;
            setPos({ x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
        };
        const handleUp = () => {
            setDragging(false);
            console.log(`📦 Chest placed: { x: ${Math.round(pos.x)}, y: ${Math.round(pos.y)} }  // ${year} (index ${index})`);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [dragging, pos]);

    return (
        <div
            ref={chestRef}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: dragging ? 100 : (isActive ? 30 : 10),
                cursor: DEV_MODE ? (dragging ? 'grabbing' : 'grab') : (isAvailable && !isOpen ? 'pointer' : (isOpen ? 'pointer' : 'default')),
                pointerEvents: isAvailable || isOpen || DEV_MODE ? 'auto' : 'none',
            }}
        >
            {/* DEV coordinate label */}
            {DEV_MODE && (
                <div style={{
                    position: 'absolute', top: '-18px', left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.55rem', fontFamily: 'monospace',
                    color: '#999', whiteSpace: 'nowrap',
                    background: 'rgba(255,255,255,0.7)', padding: '1px 4px',
                    borderRadius: '3px', zIndex: 20,
                }}>
                    ({Math.round(pos.x)}, {Math.round(pos.y)})
                </div>
            )}
            {/* Chest body */}
            <div
                onClick={(e) => {
                    if (DEV_MODE && dragging) return;
                    if (isAvailable && !isOpen) onClick();
                    else if (isOpen) onClick();
                }}
                style={{
                    position: 'relative',
                    width: '52px', height: '42px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center',
                    transition: dragging ? 'none' : 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    if (!DEV_MODE && isAvailable && !isOpen) e.currentTarget.style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e) => {
                    if (!DEV_MODE) e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                {/* Chest icon (CSS drawn) */}
                <div style={{
                    position: 'relative', width: '44px', height: '34px',
                }}>
                    {/* Lid */}
                    <div style={{
                        position: 'absolute', top: 0, left: '-2px', right: '-2px',
                        height: isOpen ? '12px' : '14px',
                        background: isOpen
                            ? 'linear-gradient(to bottom, #8b6914, #a07828)'
                            : 'linear-gradient(to bottom, #8b6914, #6b4f10)',
                        borderRadius: '6px 6px 2px 2px',
                        borderBottom: '2px solid #5a3e0a',
                        transform: isOpen ? 'rotateX(-30deg) translateY(-6px)' : 'none',
                        transformOrigin: 'bottom center',
                        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        zIndex: 2,
                    }}>
                        {/* Lock/clasp */}
                        <div style={{
                            position: 'absolute', bottom: '-4px', left: '50%',
                            transform: 'translateX(-50%)',
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: isOpen ? '#fbbf24' : '#a07828',
                            border: '1.5px solid #5a3e0a',
                            boxShadow: isOpen ? '0 0 8px rgba(251, 191, 36, 0.6)' : 'none',
                            transition: 'all 0.5s ease',
                        }} />
                    </div>
                    {/* Body */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '22px',
                        background: 'linear-gradient(to bottom, #a07828, #8b6914, #6b4f10)',
                        borderRadius: '2px 2px 4px 4px',
                        border: '1px solid #5a3e0a',
                        boxShadow: isOpen
                            ? '0 0 15px rgba(251, 191, 36, 0.4), 0 4px 10px rgba(0,0,0,0.2)'
                            : '0 3px 8px rgba(0,0,0,0.2)',
                        transition: 'box-shadow 0.5s ease',
                    }}>
                        {isOpen && (
                            <div style={{
                                position: 'absolute', top: '-8px', left: '20%', right: '20%',
                                height: '12px',
                                background: 'radial-gradient(ellipse, rgba(251, 191, 36, 0.7) 0%, transparent 70%)',
                                animation: 'chest-inner-glow 2s ease-in-out infinite alternate',
                            }} />
                        )}
                        <div style={{
                            position: 'absolute', top: '50%', left: 0, right: 0,
                            height: '3px', marginTop: '-1.5px',
                            background: '#5a3e0a',
                        }} />
                    </div>
                </div>

                {/* Year label — positioned below chest */}
                <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: isOpen ? '#6b4f10' : (isAvailable ? '#8b6914' : 'rgba(101, 67, 33, 0.4)'),
                    marginTop: '8px',
                    textShadow: isAvailable && !isOpen ? '0 0 10px rgba(139, 105, 20, 0.3)' : 'none',
                    transition: 'color 0.5s ease',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    zIndex: 15,
                    background: 'rgba(245, 230, 200, 0.85)',
                    padding: '1px 8px',
                    borderRadius: '4px',
                }}>
                    {year}
                </span>



                {/* Pulse ring */}
                {isAvailable && !isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        width: '60px', height: '60px',
                        borderRadius: '50%',
                        border: '2px solid rgba(139, 105, 20, 0.3)',
                        transform: 'translate(-50%, -55%)',
                        animation: 'chest-pulse 2s ease-in-out infinite',
                        pointerEvents: 'none',
                    }} />
                )}
            </div>
        </div>
    );
};

// ─── Finale Scroll ───
const FinaleScroll = ({ visible, onComplete }) => {
    const [text1, setText1] = useState(false);
    const [text2, setText2] = useState(false);
    const [text3, setText3] = useState(false);
    const [text4, setText4] = useState(false);

    // DEV: draggable + resizable
    const [scrollPos, setScrollPos] = useState({ x: 85, y: 63 });
    const [scrollWidth, setScrollWidth] = useState(584);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const scrollRef = useRef(null);
    const dragOffset = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ mouseX: 0, mouseY: 0, startWidth: 0 });

    useEffect(() => {
        if (!visible) return;
        const timers = [];
        timers.push(setTimeout(() => setText1(true), 1000));
        timers.push(setTimeout(() => setText2(true), 3500));
        timers.push(setTimeout(() => setText3(true), 6500));
        timers.push(setTimeout(() => setText4(true), 9500));
        timers.push(setTimeout(() => onComplete?.(), 12000));
        return () => timers.forEach(t => clearTimeout(t));
    }, [visible]);

    const fadeStyle = (show, delay = 0) => ({
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(15px)',
        transition: `all 1.2s ease-out ${delay}s`,
    });

    // DEV drag
    const handleMouseDown = (e) => {
        if (!DEV_MODE) return;
        e.preventDefault();
        const rect = scrollRef.current.parentElement.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - (scrollPos.x / 100) * rect.width,
            y: e.clientY - (scrollPos.y / 100) * rect.height,
        };
        setDragging(true);
    };
    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e) => {
            const rect = scrollRef.current.parentElement.getBoundingClientRect();
            setScrollPos({
                x: Math.max(0, Math.min(100, ((e.clientX - dragOffset.current.x) / rect.width) * 100)),
                y: Math.max(0, Math.min(100, ((e.clientY - dragOffset.current.y) / rect.height) * 100)),
            });
        };
        const handleUp = () => {
            setDragging(false);
            console.log(`📜 Scroll: pos { x: ${Math.round(scrollPos.x)}, y: ${Math.round(scrollPos.y)} }, width: ${Math.round(scrollWidth)}px`);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
    }, [dragging, scrollPos]);

    // DEV corner-drag resize
    const handleResizeDown = (e) => {
        if (!DEV_MODE) return;
        e.preventDefault();
        e.stopPropagation();
        resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, startWidth: scrollWidth };
        setResizing(true);
    };
    useEffect(() => {
        if (!resizing) return;
        const handleMove = (e) => {
            const dx = e.clientX - resizeStart.current.mouseX;
            const dy = e.clientY - resizeStart.current.mouseY;
            // Diagonal distance — positive when dragging outward (down-right)
            const diag = (dx + dy) / Math.SQRT2;
            const nw = Math.max(300, Math.min(900, resizeStart.current.startWidth + diag * 2));
            setScrollWidth(nw);
        };
        const handleUp = () => {
            setResizing(false);
            console.log(`📜 Scroll width: ${Math.round(scrollWidth)}px`);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
    }, [resizing, scrollWidth]);

    return (
        <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${scrollPos.x}%`,
                top: `${scrollPos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `min(85vw, ${scrollWidth}px)`,
                zIndex: 40,
                opacity: visible ? 1 : 0,
                transition: dragging ? 'none' : 'opacity 1.5s ease-in-out',
                pointerEvents: visible ? 'auto' : 'none',
                cursor: DEV_MODE ? (dragging ? 'grabbing' : 'grab') : 'default',
            }}
        >
            {DEV_MODE && visible && (
                <div style={{
                    position: 'absolute', top: '-22px', left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.55rem', fontFamily: 'monospace',
                    color: '#999', whiteSpace: 'nowrap',
                    background: 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: '3px',
                }}>
                    scroll · ({Math.round(scrollPos.x)}, {Math.round(scrollPos.y)}) · {Math.round(scrollWidth)}px — drag corner to resize
                </div>
            )}
            {/* DEV resize handle (bottom-right corner) */}
            {DEV_MODE && visible && (
                <div
                    onMouseDown={handleResizeDown}
                    style={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-4px',
                        width: '20px',
                        height: '20px',
                        cursor: 'nwse-resize',
                        zIndex: 50,
                        background: 'linear-gradient(135deg, transparent 50%, rgba(139, 90, 43, 0.6) 50%)',
                        borderRadius: '0 0 4px 0',
                    }}
                />
            )}
            {/* Scroll background */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(245, 230, 200, 0.95) 0%, rgba(232, 213, 163, 0.92) 50%, rgba(240, 222, 184, 0.95) 100%)',
                borderRadius: '8px',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                boxShadow: '0 10px 40px rgba(80, 50, 20, 0.3), inset 0 0 30px rgba(139, 90, 43, 0.08)',
                border: '2px solid rgba(139, 90, 43, 0.25)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '1rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative corners */}
                {[
                    { top: '8px', left: '8px' },
                    { top: '8px', right: '8px' },
                    { bottom: '8px', left: '8px' },
                    { bottom: '8px', right: '8px' },
                ].map((pos, i) => (
                    <div key={i} style={{
                        position: 'absolute', ...pos,
                        width: '20px', height: '20px',
                        borderColor: 'rgba(139, 90, 43, 0.3)',
                        borderStyle: 'solid',
                        borderWidth: i === 0 ? '2px 0 0 2px' : i === 1 ? '2px 2px 0 0' : i === 2 ? '0 0 2px 2px' : '0 2px 2px 0',
                    }} />
                ))}

                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
                    color: '#5d4037',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.7,
                    ...fadeStyle(text1),
                }}>
                    "Look at all the places we've been, all the things we've done..."
                </p>

                <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                    color: '#8b6914',
                    fontWeight: 700,
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.5,
                    ...fadeStyle(text2),
                }}>
                    But peru, this map? It's barely even started.
                </p>

                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(0.9rem, 2.2vw, 1.15rem)',
                    color: '#6a4c41',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.8,
                    ...fadeStyle(text3),
                }}>
                    I promise you more concerts of every singer in our playlist,
                    exploring fooood every chance we get, adventures like Kolhapur and beyond,
                    showing up wherever you are the moment you need me —
                    and a lifetime of firsts we haven't even dreamed of yet,
                    every single one with you.
                </p>

                <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
                    color: '#8b2500',
                    fontWeight: 700,
                    textAlign: 'center',
                    margin: 0,
                    textShadow: '0 0 10px rgba(139, 37, 0, 0.15)',
                    ...fadeStyle(text4),
                }}>
                    Aaao, Meelon Chalein, Jaana Kahan, Na Ho Pata 🎶✨🚶‍♂️🚶‍♀️💫
                </p>
            </div>
        </div>
    );
};


// ─── Cursor Sparkle Trail (Canvas) ───
const SparkleTrail = ({ mousePos, isActive }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const prevPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animFrame;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn particles if mouse moved
            const dx = mousePos.x - prevPosRef.current.x;
            const dy = mousePos.y - prevPosRef.current.y;
            const moved = Math.abs(dx) + Math.abs(dy) > 1;
            prevPosRef.current = { x: mousePos.x, y: mousePos.y };

            if (isActive && moved) {
                const rect = canvas.getBoundingClientRect();
                const cx = mousePos.x - rect.left;
                const cy = mousePos.y - rect.top;
                for (let i = 0; i < 2; i++) {
                    particlesRef.current.push({
                        x: cx + (Math.random() - 0.5) * 8,
                        y: cy + (Math.random() - 0.5) * 8,
                        vx: (Math.random() - 0.5) * 0.6,
                        vy: Math.random() * 0.5 + 0.2,
                        size: Math.random() * 2 + 2,
                        opacity: 1,
                        decay: 0.015 + Math.random() * 0.01,
                    });
                }
            }

            // Update and draw
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 6;
            particlesRef.current = particlesRef.current.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= p.decay;
                p.size *= 0.98;
                if (p.opacity <= 0) return false;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity})`;
                ctx.fill();
                return true;
            });
            ctx.shadowBlur = 0;

            animFrame = requestAnimationFrame(animate);
        };
        animFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener('resize', resize);
        };
    }, [mousePos, isActive]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                zIndex: 6,
                pointerEvents: 'none',
            }}
        />
    );
};

// ═══════════════════════════════════════════
// ─── MAIN COMPONENT ───
// ═══════════════════════════════════════════
const Promise3Adventure = ({ isMuted, toggleMute }) => {
    // Phase: 'intro' → 'compass' → 'exploring' → 'finale'
    const [phase, setPhase] = useState('intro');

    // Intro text states
    const [introText1, setIntroText1] = useState(false);
    const [introText2, setIntroText2] = useState(false);
    const [introText3, setIntroText3] = useState(false);

    // Map states
    const [compassSettled, setCompassSettled] = useState(false);
    const [compassShrunk, setCompassShrunk] = useState(false);
    const [trailDrawn, setTrailDrawn] = useState(false);
    const [terrainVisible, setTerrainVisible] = useState(false);
    const [chestsVisible, setChestsVisible] = useState(false);

    // Treasure states
    const [openedChests, setOpenedChests] = useState(new Set());
    const [activeChest, setActiveChest] = useState(null);

    // Lightbox
    const [lightboxPhoto, setLightboxPhoto] = useState(null);

    // Title reveal (after finale scroll completes)
    const [showTitle, setShowTitle] = useState(false);

    // Mouse tracking for sparkle trail
    const { position: mousePos, isActive: isMouseOnMap } = useMousePosition(0.08);

    // Audio ref
    const musicRef = useRef(null);

    // ─── Intro Sequence ───
    useEffect(() => {
        if (phase !== 'intro') return;
        const timers = [];

        // Storm/intro text: "Where have we been? And where are we going?"
        timers.push(setTimeout(() => setIntroText1(true), 500));
        timers.push(setTimeout(() => setIntroText2(true), 3000));
        timers.push(setTimeout(() => setIntroText3(true), 5500));

        // Transition to compass phase
        timers.push(setTimeout(() => {
            setPhase('compass');
        }, 9000));

        return () => timers.forEach(t => clearTimeout(t));
    }, [phase]);

    // ─── Compass Sequence ───
    useEffect(() => {
        if (phase !== 'compass') return;
        const timers = [];

        // Compass appears and spins
        timers.push(setTimeout(() => setCompassSettled(true), 300));

        // Compass settles after 3s (animation duration), then shrinks
        timers.push(setTimeout(() => setCompassShrunk(true), 4000));

        // Terrain decorations appear
        timers.push(setTimeout(() => setTerrainVisible(true), 4500));

        // Trail starts drawing
        timers.push(setTimeout(() => setTrailDrawn(true), 5000));

        // Chests appear after trail is drawn
        timers.push(setTimeout(() => {
            setChestsVisible(true);
            setPhase('exploring');
        }, 8500));

        return () => timers.forEach(t => clearTimeout(t));
    }, [phase]);

    // ─── Audio ───
    useEffect(() => {
        if (musicRef.current && !isMuted) {
            musicRef.current.volume = 0.4;
            musicRef.current.play().catch(e => console.log('Promise 3 audio:', e));
        }
    }, []);

    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.muted = isMuted;
            if (!isMuted && musicRef.current.paused) {
                musicRef.current.play().catch(e => console.log(e));
            }
        }
    }, [isMuted]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (musicRef.current) musicRef.current.pause();
        };
    }, []);

    // ─── Chest Handlers ───
    const nextAvailable = useMemo(() => {
        for (let i = 0; i < adventureYears.length; i++) {
            if (!openedChests.has(i)) return i;
        }
        return -1; // All opened
    }, [openedChests]);

    const handleChestClick = (index) => {
        if (!openedChests.has(index) && index === nextAvailable) {
            // Open this chest
            const newOpened = new Set(openedChests);
            newOpened.add(index);
            setOpenedChests(newOpened);
            setActiveChest(index);


            // Check for finale — 2026 chest (last one) triggers finale directly
            if (index === adventureYears.length - 1) {
                setTimeout(() => {
                    setActiveChest(null);
                    setPhase('finale');
                }, 1500);
            }
        } else if (openedChests.has(index)) {
            // Toggle active (show/hide photos)
            setActiveChest(activeChest === index ? null : index);
        }
    };

    // ─── Fade helpers ───
    const introFade = (visible) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 1s ease-out',
    });

    // Calculate trail dash for progressive reveal
    const TRAIL_LENGTH = 800; // Approximate SVG path length
    const trailDashOffset = trailDrawn ? 0 : TRAIL_LENGTH;

    // Mute button styling
    const muteColor = phase === 'intro'
        ? { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.3)', icon: '#e2e8f0' }
        : { bg: 'rgba(139, 105, 20, 0.15)', border: 'rgba(139, 105, 20, 0.4)', icon: '#8b6914' };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            zIndex: 100,
            overflow: 'hidden',
        }}>
            {/* ─── PHASE: INTRO (Dark + Storm Text) ─── */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                zIndex: phase === 'intro' ? 5 : 0,
                opacity: phase === 'intro' ? 1 : 0,
                transition: 'opacity 2s ease-in-out',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '1.5rem',
                padding: '2rem',
            }}>
                {/* Subtle stars */}
                {useMemo(() => Array.from({ length: 40 }, (_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${1 + Math.random() * 2}px`,
                        height: `${1 + Math.random() * 2}px`,
                        borderRadius: '50%',
                        background: '#fff',
                        opacity: 0.3 + Math.random() * 0.4,
                        animation: `star-twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 3}s`,
                    }} />
                )), [])}

                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                    color: 'rgba(226, 232, 240, 0.9)',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    margin: 0,
                    maxWidth: '500px',
                    ...introFade(introText1),
                }}>
                    Where have we been...? 🌍
                </p>

                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                    color: 'rgba(226, 232, 240, 0.8)',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    margin: 0,
                    maxWidth: '500px',
                    marginLeft: '2rem',
                    ...introFade(introText2),
                }}>
                    And where are we going...? 🧭
                </p>

                <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
                    color: '#fbbf24',
                    fontWeight: 700,
                    textAlign: 'center',
                    margin: 0,
                    marginTop: '1rem',
                    textShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
                    ...introFade(introText3),
                }}>
                    Let's unfold the map... 🗺️
                </p>
            </div>

            {/* ─── PHASE: MAP (Parchment + Trail + Chests) ─── */}
            <div style={{
                position: 'absolute', inset: 0,
                opacity: phase !== 'intro' ? 1 : 0,
                transition: 'opacity 2s ease-in-out',
                zIndex: phase !== 'intro' ? 3 : 1,
            }}>
                <ParchmentBackground />
                <TerrainDecorations visible={terrainVisible} />

                {/* Sparkle trail — only during exploring/finale */}
                {(phase === 'exploring' || phase === 'finale') && (
                    <SparkleTrail mousePos={mousePos} isActive={isMouseOnMap} />
                )}

                {/* Phase Labels */}
                {phaseLabels.map((pl) => (
                    <div
                        key={pl.phase}
                        style={{
                            position: 'absolute',
                            left: `${pl.x}%`,
                            top: `${pl.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 4,
                            pointerEvents: 'none',
                            opacity: chestsVisible ? 0.45 : 0,
                            transition: 'opacity 2s ease-in-out 0.5s',
                        }}
                    >
                        <span style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)',
                            fontStyle: 'italic',
                            color: '#8b6914',
                            letterSpacing: '1px',
                            whiteSpace: 'nowrap',
                            textShadow: '0 1px 3px rgba(245, 230, 200, 0.9)',
                        }}>
                            {pl.label}
                        </span>
                    </div>
                ))}

                {/* Title */}
                <div style={{
                    position: 'absolute',
                    top: '3%', width: '100%',
                    textAlign: 'center', zIndex: 20,
                    pointerEvents: 'none',
                    opacity: showTitle ? 1 : 0,
                    transition: 'opacity 1.5s ease-in-out',
                }}>
                    <h1 style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                        color: '#5d4037',
                        margin: 0,
                        textShadow: '0 2px 8px rgba(245, 230, 200, 0.8)',
                    }}>
                        The Promise of Adventure
                    </h1>
                </div>

                {/* SVG Trail */}
                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        zIndex: 5,
                        pointerEvents: 'none',
                    }}
                >
                    {/* Base trail (drawn in) */}
                    <path
                        d={TRAIL_PATH}
                        fill="none"
                        stroke="rgba(101, 67, 33, 0.4)"
                        strokeWidth="0.5"
                        strokeDasharray={TRAIL_LENGTH}
                        strokeDashoffset={trailDashOffset}
                        strokeLinecap="round"
                        style={{
                            transition: 'stroke-dashoffset 3s ease-in-out',
                        }}
                    />
                    {/* Dotted overlay */}
                    <path
                        d={TRAIL_PATH}
                        fill="none"
                        stroke="rgba(101, 67, 33, 0.25)"
                        strokeWidth="0.3"
                        strokeDasharray="2 3"
                        opacity={trailDrawn ? 1 : 0}
                        style={{ transition: 'opacity 2s ease-in-out 2s' }}
                    />
                    {/* Golden glow trail — per-segment */}
                    {SEGMENT_PATHS.map((segPath, i) => (
                        <path
                            key={`glow-${i}`}
                            d={segPath}
                            fill="none"
                            stroke="rgba(251, 191, 36, 0.6)"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            opacity={openedChests.has(i) ? 1 : 0}
                            style={{
                                transition: 'opacity 1s ease-in-out',
                                filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.4))',
                            }}
                        />
                    ))}
                </svg>

                {/* Treasure Chests */}
                {adventureYears.map((adventure, index) => (
                    <div
                        key={adventure.year}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 10,
                            opacity: chestsVisible ? 1 : 0,
                            transform: chestsVisible ? 'scale(1)' : 'scale(0)',
                            transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`,
                            pointerEvents: 'none',
                        }}
                    >
                        <TreasureChest
                            year={adventure.year}
                            caption={adventure.caption}
                            position={trailPoints[index]}
                            index={index}
                            isOpen={openedChests.has(index)}
                            isAvailable={index === nextAvailable}
                            isActive={activeChest === index}
                            onClick={() => handleChestClick(index)}
                        />
                    </div>
                ))}

                {/* Scattered Photos Layer */}
                <MapPhotos openedChests={openedChests} onPhotoClick={(src, year) => setLightboxPhoto({ src, year })} />
                <MapCaptions openedChests={openedChests} />

                {/* Hidden Heart Easter Eggs */}
                <DraggableHeart
                    id="orange"
                    color="#e65100"
                    message="I don't know if you remember this, but I got you that gajra and earrings when I went to Pune, from the Dagdusheth Ganpati Mandir🥰"
                    initialX={53}
                    initialY={85}
                    visible={openedChests.has(3)}
                />
                <DraggableHeart
                    id="pink"
                    color="#e91e63"
                    message="You got this homemade Rajma Chawal specially for me because I mentioned I have never had it, haha.😋"
                    initialX={17}
                    initialY={86}
                    visible={openedChests.has(1)}
                />

                {/* Instruction hint */}
                {phase === 'exploring' && nextAvailable >= 0 && activeChest === null && (
                    <div style={{
                        position: 'absolute',
                        bottom: '8%', left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 20, pointerEvents: 'none',
                        animation: 'hint-pulse 2s ease-in-out infinite',
                    }}>
                        <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                            color: 'rgba(101, 67, 33, 0.6)',
                            whiteSpace: 'nowrap',
                        }}>
                            {nextAvailable === 0
                                ? 'Click the first treasure to begin your journey...'
                                : `Open ${adventureYears[nextAvailable].year} to continue...`
                            }
                        </span>
                    </div>
                )}

                <CompassRose settled={compassSettled} shrunk={compassShrunk} />
            </div>

            {/* ─── PHASE: FINALE ─── */}
            <FinaleScroll visible={phase === 'finale'} onComplete={() => setShowTitle(true)} />

            {/* Full trail glow burst in finale */}
            {phase === 'finale' && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)',
                    zIndex: 35, pointerEvents: 'none',
                    animation: 'chest-inner-glow 3s ease-in-out infinite alternate',
                }} />
            )}

            {/* ─── Mute Button ─── */}
            <button
                onClick={toggleMute}
                style={{
                    position: 'fixed',
                    bottom: '20px', right: '20px',
                    width: '50px', height: '50px',
                    borderRadius: '50%',
                    background: muteColor.bg,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${muteColor.border}`,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    transition: 'all 0.5s ease',
                    zIndex: 200,
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

            {/* ─── Audio ─── */}
            <audio
                ref={musicRef}
                src="/mycutusbdaycountdown2026/music/promise3.mp3"
                loop
                preload="auto"
            />

            {/* ─── Photo Lightbox ─── */}
            {lightboxPhoto && (
                <div
                    onClick={() => setLightboxPhoto(null)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0, 0, 0, 0.85)',
                        zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                    onKeyDown={(e) => { if (e.key === 'Escape') setLightboxPhoto(null); }}
                    tabIndex={0}
                    ref={(el) => el && el.focus()}
                >
                    <img
                        src={lightboxPhoto.src}
                        alt={`${lightboxPhoto.year} memory`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 10px 60px rgba(0,0,0,0.5)',
                            cursor: 'default',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute', top: '20px', right: '30px',
                            fontSize: '2rem', color: 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            fontFamily: "'Outfit', sans-serif",
                        }}
                        onClick={() => setLightboxPhoto(null)}
                    >
                        ✕
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promise3Adventure;
