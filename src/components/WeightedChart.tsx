'use client';

import type { NormalizedSubservice } from '@/lib/types';

interface WeightedChartProps {
  subservices: NormalizedSubservice[];
}

export default function WeightedChart({ subservices }: WeightedChartProps) {
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  const strokeWidth = 40;

  let currentAngle = -90; // Start at top

  const paths = subservices.map((sub) => {
    const percentage = sub.percentage;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle = endAngle;

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate arc path
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    ].join(' ');

    return {
      ...sub,
      pathData,
    };
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-64 h-64">
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {paths.map((path, idx) => (
          <g key={idx}>
            <path
              d={path.pathData}
              fill="none"
              stroke={path.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>

      <div className="w-full space-y-2">
        {subservices.map((sub, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: sub.color }}
              />
              <span className="font-medium">{sub.name}</span>
            </div>
            <span className="text-gray-600">{sub.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
