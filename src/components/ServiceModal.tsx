'use client';

import { useEffect, useState } from 'react';
import type { ServiceWithSubservices, NormalizedSubservice } from '@/lib/types';
import WeightedChart from './WeightedChart';
import Tooltip from './Tooltip';

interface ServiceModalProps {
  service: ServiceWithSubservices | null;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

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

  if (!service) return null;

  // Normalize weights
  const totalWeight = service.subservices.reduce((sum, sub) => sum + sub.weight, 0);
  const normalizedSubservices: NormalizedSubservice[] = service.subservices.map(sub => ({
    ...sub,
    normalizedWeight: totalWeight > 0 ? (sub.weight / totalWeight) * 100 : 0,
    percentage: totalWeight > 0 ? (sub.weight / totalWeight) * 100 : 0,
  }));

  const handleSubserviceHover = (e: React.MouseEvent, text: string | null) => {
    if (!text) {
      setTooltip(null);
      return;
    }
    setTooltip({
      text,
      x: e.clientX + 10,
      y: e.clientY + 10,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 id="modal-title" className="text-2xl font-bold" style={{ color: service.color }}>
                  {service.name}
                </h2>
                {service.description && (
                  <p className="mt-2 text-gray-600">{service.description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {normalizedSubservices.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Service Breakdown</h3>
                <WeightedChart subservices={normalizedSubservices} />
              </div>
            )}
          </div>
        </div>
      </div>

      <Tooltip
        text={tooltip?.text || ''}
        x={tooltip?.x || 0}
        y={tooltip?.y || 0}
        visible={!!tooltip}
      />
    </>
  );
}
