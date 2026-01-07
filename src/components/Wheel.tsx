'use client';

import { useState, useEffect, useMemo } from 'react';
import type { ServiceWithSubservices, WheelSettings } from '@/lib/types';
import { DEFAULT_WHEEL_SETTINGS } from '@/lib/types';
import ServiceModal from './ServiceModal';
import Tooltip from './Tooltip';

interface WheelProps {
  services: ServiceWithSubservices[];
  settings?: Partial<WheelSettings>;
}

export default function Wheel({ services, settings: customSettings }: WheelProps) {
  const [selectedService, setSelectedService] = useState<{
    service: ServiceWithSubservices;
    angle: number;
    index: number;
  } | null>(null);
  const [tooltip, setTooltip] = useState<{ heading: string; text: string; color: string; x: number; y: number } | null>(null);
  const [touchedService, setTouchedService] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders fully on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Merge custom settings with defaults
  const settings = useMemo(() => ({
    ...DEFAULT_WHEEL_SETTINGS,
    ...customSettings,
  }), [customSettings]);

  // Split long service names into multiple lines
  const splitTextIntoLines = (text: string): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length === 0) {
        currentLine = word;
      } else if ((currentLine + ' ' + word).length <= settings.maxCharsPerLine) {
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

  // Calculate wheel dimensions dynamically based on font size
  const dimensions = useMemo(() => {
    // Base sizing - scale with font size
    const baseFontSize = 14;
    const scaleFactor = settings.fontSize / baseFontSize;

    // Find the longest service name to determine needed space
    const maxLines = Math.max(...services.map(s => {
      const words = s.name.split(' ');
      let lines = 1;
      let currentLine = '';
      for (const word of words) {
        if (currentLine.length === 0) {
          currentLine = word;
        } else if ((currentLine + ' ' + word).length <= settings.maxCharsPerLine) {
          currentLine += ' ' + word;
        } else {
          lines++;
          currentLine = word;
        }
      }
      return lines;
    }), 1);

    // Calculate segment depth needed for text (including padding)
    const textHeight = maxLines * settings.lineHeight;
    const totalPadding = settings.segmentPaddingInner + settings.segmentPaddingOuter;
    const minSegmentDepth = Math.max((textHeight + totalPadding) * scaleFactor, 120);

    const innerRadius = 90 * scaleFactor;
    const outerRadius = innerRadius + minSegmentDepth;
    const viewboxSize = (outerRadius + 40) * 2; // 40px margin
    const center = viewboxSize / 2;

    return {
      viewboxSize,
      center,
      innerRadius,
      outerRadius,
    };
  }, [settings.fontSize, settings.lineHeight, settings.maxCharsPerLine, settings.segmentPaddingInner, settings.segmentPaddingOuter, services]);

  const { viewboxSize, center, innerRadius, outerRadius } = dimensions;
  const centerX = center;
  const centerY = center;

  const totalServices = services.length;

  // Calculate total weight for weighted segment sizing
  const totalWeight = useMemo(() =>
    services.reduce((sum, s) => sum + (s.weight || 10), 0),
    [services]
  );

  // Calculate angle for each service based on its weight
  const getServiceAngle = (service: ServiceWithSubservices) => {
    const weight = service.weight || 10;
    return (weight / totalWeight) * 360;
  };

  // Calculate start angle for a service at given index
  const getStartAngle = (index: number) => {
    let angle = -90; // Start from top
    for (let i = 0; i < index; i++) {
      angle += getServiceAngle(services[i]);
    }
    return angle;
  };

  const handleServiceClick = (service: ServiceWithSubservices, startAngle: number, serviceAngle: number, index: number) => {
    setSelectedService({ service, angle: startAngle + serviceAngle / 2, index });
    setTooltip(null);
  };

  const handleServiceHover = (e: React.MouseEvent, service: ServiceWithSubservices) => {
    // Show tooltip with service name as heading and description as text
    const text = service.description || service.tooltip || '';
    if (text || service.name) {
      setTooltip({
        heading: service.name,
        text: text,
        color: service.color,
        x: e.clientX + 10,
        y: e.clientY + 10,
      });
    }
  };

  const handleServiceLeave = () => {
    setTooltip(null);
  };

  // Mobile touch handling
  const handleTouchStart = (service: ServiceWithSubservices, startAngle: number, serviceAngle: number, index: number) => {
    if (touchedService === service.id) {
      // Second tap - open modal
      setSelectedService({ service, angle: startAngle + serviceAngle / 2, index });
      setTouchedService(null);
      setTooltip(null);
    } else {
      // First tap - show tooltip
      setTouchedService(service.id);
    }
  };

  useEffect(() => {
    if (touchedService !== null) {
      const timer = setTimeout(() => {
        setTouchedService(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [touchedService]);

  const createArcPath = (startAngle: number, endAngle: number, segmentAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + innerRadius * Math.cos(startRad);
    const y1 = centerY + innerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(startRad);
    const y2 = centerY + outerRadius * Math.sin(startRad);
    const x3 = centerX + outerRadius * Math.cos(endRad);
    const y3 = centerY + outerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(endRad);
    const y4 = centerY + innerRadius * Math.sin(endRad);

    const largeArc = segmentAngle > 180 ? 1 : 0;

    return [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`,
      'Z',
    ].join(' ');
  };

  // Helper to lighten a hex color
  const lightenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * percent));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        className="flex items-center justify-center w-full min-h-screen p-4"
        style={{ backgroundColor: settings.backgroundColor }}
      />
    );
  }

  return (
    <>
      <div
        className="flex items-center justify-center w-full min-h-screen p-4"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        <svg
          viewBox={`0 0 ${viewboxSize} ${viewboxSize}`}
          className="w-full max-w-2xl h-auto"
          style={{ touchAction: 'manipulation' }}
        >
          {/* Gradient definitions for each service */}
          <defs>
            {services.map((service, index) => {
              const startAngle = getStartAngle(index);
              const serviceAngle = getServiceAngle(service);
              const midAngle = startAngle + serviceAngle / 2;
              const midRad = (midAngle * Math.PI) / 180;

              // Calculate gradient direction (from center outward along the segment)
              const x1 = 50 - Math.cos(midRad) * 50;
              const y1 = 50 - Math.sin(midRad) * 50;
              const x2 = 50 + Math.cos(midRad) * 50;
              const y2 = 50 + Math.sin(midRad) * 50;

              return (
                <linearGradient
                  key={`gradient-${service.id}`}
                  id={`gradient-${service.id}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                >
                  <stop offset="0%" stopColor={lightenColor(service.color, settings.gradientLightness)} />
                  <stop offset="100%" stopColor={service.color} />
                </linearGradient>
              );
            })}
          </defs>

          {/* Center circle - dark background */}
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius}
            fill={settings.backgroundColor}
            stroke="#333"
            strokeWidth={settings.strokeWidth}
          />

          {/* Service segments */}
          {services.map((service, index) => {
            const startAngle = getStartAngle(index);
            const serviceAngle = getServiceAngle(service);
            const path = createArcPath(startAngle, startAngle + serviceAngle, serviceAngle);

            return (
              <g key={service.id}>
                <path
                  d={path}
                  fill={`url(#gradient-${service.id})`}
                  stroke="white"
                  strokeWidth={2}
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => handleServiceClick(service, startAngle, serviceAngle, index)}
                  onMouseEnter={(e) => handleServiceHover(e, service)}
                  onMouseMove={(e) => handleServiceHover(e, service)}
                  onMouseLeave={handleServiceLeave}
                  onTouchStart={() => handleTouchStart(service, startAngle, serviceAngle, index)}
                  role="button"
                  aria-label={`${service.name}: ${service.tooltip || 'Click for details'}`}
                />
                {/* Radial text - runs from inner to outer edge */}
                {(() => {
                  const lines = splitTextIntoLines(service.name);
                  const midAngle = startAngle + serviceAngle / 2;
                  const rad = (midAngle * Math.PI) / 180;

                  // Calculate the available space for text (with padding)
                  const textInnerBound = innerRadius + settings.segmentPaddingInner;
                  const textOuterBound = outerRadius - settings.segmentPaddingOuter;

                  // Center the text block within the available padded area
                  const textCenterRadius = (textInnerBound + textOuterBound) / 2;
                  const textCenterX = centerX + textCenterRadius * Math.cos(rad);
                  const textCenterY = centerY + textCenterRadius * Math.sin(rad);

                  // Determine rotation - flip text on left side
                  // Normalize angle to 0-360 range for consistent left/right detection
                  // Use 100° and 260° as thresholds to give more leeway near horizontal
                  const normalizedMidAngle = ((midAngle % 360) + 360) % 360;
                  let rotation = midAngle;
                  const isLeftSide = normalizedMidAngle > 100 && normalizedMidAngle < 260;
                  if (isLeftSide) {
                    rotation = midAngle + 180;
                  }

                  return (
                    <text
                      fill={settings.textColor}
                      fontSize={settings.fontSize}
                      fontWeight={settings.fontWeight}
                      fontFamily="Poppins, sans-serif"
                      textAnchor="middle"
                      transform={`rotate(${rotation}, ${textCenterX}, ${textCenterY})`}
                      className="pointer-events-none select-none"
                    >
                      {lines.map((line, i) => {
                        // Position each line relative to the center
                        // On the left side (rotated 180°), we need to flip the Y offset direction
                        // so that line[0] appears at the inner edge (closer to center) in both cases
                        const yOffset = (i - (lines.length - 1) / 2) * settings.lineHeight;
                        const lineY = textCenterY + (isLeftSide ? -yOffset : yOffset);
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
                  );
                })()}
              </g>
            );
          })}

          {/* Center content - ITC logo and Total Support Strategy */}
          <image
            href="https://itcservice.co.uk/wp-content/uploads/2022/06/compresssed-ITC-logo.png"
            x={centerX - innerRadius * 0.55}
            y={centerY - innerRadius * 0.5}
            width={innerRadius * 1.1}
            height={innerRadius * 0.55}
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none"
          />
          <text
            x={centerX}
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontWeight="600"
            letterSpacing="0.5"
            fill={settings.textColor}
            className="pointer-events-none select-none"
          >
            <tspan
              x={centerX}
              y={centerY + innerRadius * 0.22}
              fontSize={innerRadius * 0.16}
            >
              Total Support
            </tspan>
            <tspan
              x={centerX}
              y={centerY + innerRadius * 0.45}
              fontSize={innerRadius * 0.16}
            >
              Strategy
            </tspan>
          </text>
        </svg>
      </div>

      <ServiceModal
        service={selectedService?.service || null}
        serviceColor={selectedService?.service.color || '#000'}
        angle={selectedService?.angle || 0}
        totalServices={totalServices}
        onClose={() => setSelectedService(null)}
      />

      {isMounted && (
        <Tooltip
          heading={tooltip?.heading || (touchedService !== null ? services.find(s => s.id === touchedService)?.name || '' : '')}
          text={tooltip?.text || (touchedService !== null ? (services.find(s => s.id === touchedService)?.description || services.find(s => s.id === touchedService)?.tooltip || '') : '')}
          color={tooltip?.color || (touchedService !== null ? services.find(s => s.id === touchedService)?.color : undefined)}
          x={tooltip?.x || window.innerWidth / 2}
          y={tooltip?.y || window.innerHeight / 2}
          visible={!!tooltip || touchedService !== null}
        />
      )}
    </>
  );
}
