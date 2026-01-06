'use client';

import { useEffect, useState, useMemo } from 'react';
import type { ServiceWithSubservices, NormalizedSubservice } from '@/lib/types';

interface ServiceModalProps {
  service: ServiceWithSubservices | null;
  serviceColor: string;
  angle: number;
  totalServices: number;
  onClose: () => void;
}

export default function ServiceModal({ service, serviceColor, angle, totalServices, onClose }: ServiceModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (service) {
      setIsAnimating(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [service]);

  useEffect(() => {
    if (!service) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [service, onClose]);

  // Normalize weights for subservices
  const normalizedSubservices: NormalizedSubservice[] = useMemo(() => {
    if (!service?.subservices.length) return [];
    const totalWeight = service.subservices.reduce((sum, sub) => sum + sub.weight, 0);
    return service.subservices.map(sub => ({
      ...sub,
      normalizedWeight: totalWeight > 0 ? (sub.weight / totalWeight) * 100 : 0,
      percentage: totalWeight > 0 ? (sub.weight / totalWeight) * 100 : 0,
    }));
  }, [service]);

  if (!service && !isAnimating) return null;

  // SVG dimensions - center the wheel circle in the viewport
  const svgWidth = 900;
  const svgHeight = 700;
  const centerX = svgWidth / 2; // Center the circle in the SVG
  const centerY = svgHeight / 2;
  const innerRadius = 90; // Same size as main wheel's inner radius
  const outerRadius = 320; // Larger segments extending outward for longer text

  // Subservices fan out to the right (from -90 to +90 degrees = 180 degree arc)
  const totalArcAngle = 180; // Half circle fanning to the right
  const startAngleOffset = -90; // Start from top

  // Helper to lighten a hex color
  const lightenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * percent));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Create SVG path for segment shape
  const createSegmentPath = (innerR: number, outerR: number, startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + innerR * Math.cos(startRad);
    const y1 = centerY + innerR * Math.sin(startRad);
    const x2 = centerX + outerR * Math.cos(startRad);
    const y2 = centerY + outerR * Math.sin(startRad);
    const x3 = centerX + outerR * Math.cos(endRad);
    const y3 = centerY + outerR * Math.sin(endRad);
    const x4 = centerX + innerR * Math.cos(endRad);
    const y4 = centerY + innerR * Math.sin(endRad);

    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1} Z`;
  };

  // Split text into lines for radial display
  const splitTextIntoLines = (text: string, maxChars: number = 10): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length === 0) {
        currentLine = word;
      } else if ((currentLine + ' ' + word).length <= maxChars) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Create subservice segments fanning out to the right
  const createSubserviceSegments = () => {
    if (!normalizedSubservices.length) return null;

    let currentAngle = startAngleOffset;

    return normalizedSubservices.map((sub, idx) => {
      const subAngle = (sub.percentage / 100) * totalArcAngle;
      const startAngle = currentAngle;
      const endAngle = currentAngle + subAngle;
      currentAngle = endAngle;

      const path = createSegmentPath(innerRadius, outerRadius, startAngle, endAngle);

      // Calculate text position - radial text running from inner to outer
      const midAngle = (startAngle + endAngle) / 2;
      const midRad = (midAngle * Math.PI) / 180;

      // Position text in the center of the segment
      const textRadius = (innerRadius + outerRadius) / 2;
      const textCenterX = centerX + textRadius * Math.cos(midRad);
      const textCenterY = centerY + textRadius * Math.sin(midRad);

      // Determine rotation - flip text on left side (but our segments are on the right)
      let rotation = midAngle;
      let lineOffset = 1;
      if (midAngle > 90 && midAngle < 270) {
        rotation = midAngle + 180;
        lineOffset = -1;
      }

      const lines = splitTextIntoLines(sub.name, 28); // More chars per line to fit on 2 lines max
      const lineHeight = 14;

      return (
        <g key={idx}>
          {/* Gradient definition for this segment */}
          <defs>
            <linearGradient
              id={`modal-gradient-${idx}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={lightenColor(sub.color, 0.12)} />
              <stop offset="100%" stopColor={sub.color} />
            </linearGradient>
          </defs>
          <path
            d={path}
            fill={`url(#modal-gradient-${idx})`}
            stroke="white"
            strokeWidth="2"
            className="transition-opacity hover:opacity-90 cursor-pointer"
          />
          {/* Radial text */}
          <text
            fill="white"
            fontSize="12"
            fontWeight="600"
            fontFamily="Poppins, sans-serif"
            textAnchor="middle"
            transform={`rotate(${rotation}, ${textCenterX}, ${textCenterY})`}
            className="pointer-events-none select-none"
          >
            {lines.map((line, i) => {
              const lineY = textCenterY + (i - (lines.length - 1) / 2) * lineHeight * lineOffset;
              return (
                <tspan
                  key={i}
                  x={textCenterX}
                  y={lineY}
                  dominantBaseline="middle"
                >
                  {line}
                </tspan>
              );
            })}
          </text>
        </g>
      );
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-80' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className={`pointer-events-auto transition-all duration-300 ease-out w-full max-w-6xl mx-4 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-0 relative">
            {/* Left side - Description panel */}
            <div
              className={`bg-white rounded-2xl shadow-2xl p-8 w-72 flex flex-col justify-center transition-all duration-300 delay-100 absolute left-0 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}
              style={{ zIndex: 10, maxHeight: '450px' }}
            >
              <h2
                id="modal-title"
                className="text-2xl font-bold mb-4"
                style={{ color: serviceColor }}
              >
                {service?.name}
              </h2>
              {service?.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
              )}
              {normalizedSubservices.length > 0 && (
                <div className="mt-auto pt-4 border-t">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {normalizedSubservices.length} Services
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {normalizedSubservices.slice(0, 6).map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: sub.color }}
                      >
                        {sub.name.length > 12 ? sub.name.substring(0, 12) + '...' : sub.name}
                      </span>
                    ))}
                    {normalizedSubservices.length > 6 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                        +{normalizedSubservices.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wheel segments - centered */}
            <div
              className={`relative transition-all duration-300 ${
                isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}
              style={{ width: `${svgWidth}px`, height: `${svgHeight}px` }}
            >
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))' }}
              >
                {/* Subservice segments fanning to the right */}
                {createSubserviceSegments()}

                {/* Center circle - overlaps the "ITC Service" area visually */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={innerRadius}
                  fill="#1a1a1a"
                  stroke="#333"
                  strokeWidth="3"
                />

                {/* Service name in center - properly centered */}
                {(() => {
                  const name = service?.name || '';
                  const words = name.split(' ');
                  // Split into two lines if more than one word
                  const lines = words.length <= 2
                    ? [name]
                    : [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')];
                  const lineHeight = 24;
                  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

                  return lines.map((line, i) => (
                    <text
                      key={i}
                      x={centerX}
                      y={startY + i * lineHeight}
                      fill="white"
                      fontSize="18"
                      fontWeight="700"
                      fontFamily="Poppins, sans-serif"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="select-none"
                    >
                      {line}
                    </text>
                  ));
                })()}
              </svg>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors z-10"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
