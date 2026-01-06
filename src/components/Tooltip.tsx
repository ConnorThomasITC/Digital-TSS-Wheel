'use client';

import { useEffect, useRef, useState } from 'react';

interface TooltipProps {
  heading?: string;
  text: string;
  x: number;
  y: number;
  visible: boolean;
  color?: string;
}

export default function Tooltip({ heading, text, x, y, visible, color }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (!visible || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // Keep within viewport horizontally
    if (x + rect.width > viewportWidth - 10) {
      adjustedX = viewportWidth - rect.width - 10;
    }
    if (adjustedX < 10) {
      adjustedX = 10;
    }

    // Keep within viewport vertically
    if (y + rect.height > viewportHeight - 10) {
      adjustedY = y - rect.height - 10;
    }
    if (adjustedY < 10) {
      adjustedY = 10;
    }

    setPosition({ x: adjustedX, y: adjustedY });
  }, [x, y, visible]);

  if (!visible || (!text && !heading)) return null;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 px-4 py-3 text-white bg-gray-900 rounded-xl shadow-2xl pointer-events-none animate-fade-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '420px',
      }}
    >
      {heading && (
        <h3
          className="text-sm font-bold mb-1"
          style={{ color: color || '#fff' }}
        >
          {heading}
        </h3>
      )}
      {text && (
        <p className="text-xs text-gray-300 leading-relaxed">
          {text}
        </p>
      )}
    </div>
  );
}
