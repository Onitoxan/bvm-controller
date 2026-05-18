import { useState, useRef, useEffect, useCallback } from "react";

interface KnobProps {
  label: string;
  encoderId: number;
  disabled?: boolean;
  onTick: (id: number, ticks: number) => void;
}

const SIZE = 80;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 30;
const PIXELS_PER_TICK = 5;
const SEND_INTERVAL_MS = 100;
const GRIP_COUNT = 16;

function polarToXY(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + Math.cos(rad) * radius, y: CY + Math.sin(rad) * radius };
}

export function Knob({ label, encoderId, disabled = false, onTick }: KnobProps): JSX.Element {
  const [angle, setAngle] = useState(225);
  const isDraggingRef  = useRef(false);
  const lastYRef       = useRef(0);
  const pendingRef     = useRef(0);
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const flushTicks = useCallback(() => {
    const ticks = Math.trunc(pendingRef.current);
    if (ticks !== 0) {
      onTick(encoderId, ticks);
      pendingRef.current -= ticks;
    }
  }, [encoderId, onTick]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    flushTicks();
  }, [flushTicks]);

  const startInterval = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      flushTicks();
      if (!isDraggingRef.current) stopInterval();
    }, SEND_INTERVAL_MS);
  }, [flushTicks, stopInterval]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    isDraggingRef.current = true;
    lastYRef.current = e.clientY;
    startInterval();
  }, [disabled, startInterval]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault(); // prevent the page from scrolling during knob drag
      const dy = lastYRef.current - e.clientY; // drag up → positive ticks
      lastYRef.current = e.clientY;
      pendingRef.current += dy / PIXELS_PER_TICK;
      setAngle((a) => ((a + dy * 2) % 360 + 360) % 360);
    };
    const onUp = () => { isDraggingRef.current = false; };
    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const indicator = polarToXY(angle, R * 0.62);
  const gradId    = `kg${encoderId}`;
  const shadowId  = `ks${encoderId}`;

  // Build grip notch lines
  const gripLines = Array.from({ length: GRIP_COUNT }, (_, i) => {
    const a = (i * (360 / GRIP_COUNT) - 90) * (Math.PI / 180);
    return {
      x1: CX + Math.cos(a) * (R - 5),
      y1: CY + Math.sin(a) * (R - 5),
      x2: CX + Math.cos(a) * (R - 1),
      y2: CY + Math.sin(a) * (R - 1),
    };
  });

  return (
    <div className={`knob-wrapper${disabled ? " knob-wrapper--disabled" : ""}`}>
      <svg
        width={SIZE}
        height={SIZE}
        style={{ cursor: disabled ? "default" : "ns-resize", userSelect: "none" }}
        onMouseDown={handleMouseDown}
      >
        <defs>
          <radialGradient id={gradId} cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#606060" />
            <stop offset="100%" stopColor="#1c1c1c" />
          </radialGradient>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.65" />
          </filter>
        </defs>

        {/* Outer groove ring */}
        <circle cx={CX} cy={CY} r={R + 5} fill="#111" />
        <circle cx={CX} cy={CY} r={R + 4} fill="none" stroke="#0a0a0a" strokeWidth="3" />

        {/* Main body */}
        <circle cx={CX} cy={CY} r={R} fill={`url(#${gradId})`} filter={`url(#${shadowId})`} />

        {/* Grip notches */}
        {gripLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#111" strokeWidth="1.5" />
        ))}

        {/* Inner cap */}
        <circle cx={CX} cy={CY} r={R * 0.68} fill="#282828" />

        {/* Indicator line */}
        <line
          x1={CX} y1={CY}
          x2={indicator.x} y2={indicator.y}
          stroke={disabled ? "#404040" : "#f0a000"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Indicator tip */}
        <circle
          cx={indicator.x} cy={indicator.y} r="3.5"
          fill={disabled ? "#404040" : "#f0a000"}
        />

        {/* Center pivot */}
        <circle cx={CX} cy={CY} r="4" fill="#111" />
      </svg>

      <span className="knob-label">{label}</span>
    </div>
  );
}
