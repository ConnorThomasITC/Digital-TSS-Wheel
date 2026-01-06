'use client';

import { useState, useEffect } from 'react';
import type { ServiceWithSubservices } from '@/lib/types';
import ServiceModal from './ServiceModal';
import Tooltip from './Tooltip';

interface WheelProps {
  services: ServiceWithSubservices[];
}

export default function Wheel({ services }: WheelProps) {
  const [selectedService, setSelectedService] = useState<ServiceWithSubservices | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [touchedService, setTouchedService] = useState<number | null>(null);

  const centerX = 250;
  const centerY = 250;
  const innerRadius = 80;
  const outerRadius = 200;

  const totalServices = services.length;
  const anglePerService = 360 / totalServices;

  const handleServiceClick = (service: ServiceWithSubservices) => {
    setSelectedService(service);
    setTooltip(null);
  };

  const handleServiceHover = (e: React.MouseEvent, service: ServiceWithSubservices) => {
    if (service.tooltip) {
      setTooltip({
        text: service.tooltip,
        x: e.clientX + 10,
        y: e.clientY + 10,
      });
    }
  };

  const handleServiceLeave = () => {
    setTooltip(null);
  };

  // Mobile touch handling
  const handleTouchStart = (service: ServiceWithSubservices) => {
    if (touchedService === service.id) {
      // Second tap - open modal
      setSelectedService(service);
      setTouchedService(null);
      setTooltip(null);
    } else {
      // First tap - show tooltip
      setTouchedService(service.id);
      // Tooltip will be shown via state, positioned at center
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

  const createArcPath = (startAngle: number, endAngle: number) => {
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

    const largeArc = anglePerService > 180 ? 1 : 0;

    return [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`,
      'Z',
    ].join(' ');
  };

  const getTextPosition = (startAngle: number) => {
    const midAngle = startAngle + anglePerService / 2;
    const textRadius = (innerRadius + outerRadius) / 2;
    const rad = (midAngle * Math.PI) / 180;

    return {
      x: centerX + textRadius * Math.cos(rad),
      y: centerY + textRadius * Math.sin(rad),
      rotation: midAngle + 90,
    };
  };

  return (
    <>
      <div className="flex items-center justify-center w-full min-h-screen p-4">
        <svg
          viewBox="0 0 500 500"
          className="w-full max-w-2xl h-auto"
          style={{ touchAction: 'manipulation' }}
        >
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Service segments */}
          {services.map((service, index) => {
            const startAngle = -90 + index * anglePerService;
            const endAngle = startAngle + anglePerService;
            const path = createArcPath(startAngle, endAngle);
            const textPos = getTextPosition(startAngle);

            return (
              <g key={service.id}>
                <path
                  d={path}
                  fill={service.color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => handleServiceClick(service)}
                  onMouseEnter={(e) => handleServiceHover(e, service)}
                  onMouseMove={(e) => handleServiceHover(e, service)}
                  onMouseLeave={handleServiceLeave}
                  onTouchStart={() => handleTouchStart(service)}
                  role="button"
                  aria-label={`${service.name}: ${service.tooltip || 'Click for details'}`}
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="600"
                  className="pointer-events-none select-none"
                  transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                >
                  {service.name}
                </text>
              </g>
            );
          })}

          {/* Center text */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fontWeight="700"
            fill="#333"
            className="pointer-events-none select-none"
          >
            TSS
          </text>
          <text
            x={centerX}
            y={centerY + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#666"
            className="pointer-events-none select-none"
          >
            Services
          </text>
        </svg>
      </div>

      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />

      <Tooltip
        text={tooltip?.text || (touchedService !== null ? services.find(s => s.id === touchedService)?.tooltip || '' : '')}
        x={tooltip?.x || window.innerWidth / 2}
        y={tooltip?.y || window.innerHeight / 2}
        visible={!!tooltip || touchedService !== null}
      />
    </>
  );
}
