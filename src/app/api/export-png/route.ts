import { NextRequest, NextResponse } from 'next/server';
import { getFullConfig } from '@/lib/db';
import sharp from 'sharp';

// Generate SVG string for the wheel
function generateWheelSVG(services: any[], size: number = 800): string {
  const center = size / 2;
  const innerRadius = size * 0.18;
  const outerRadius = size * 0.45;
  const strokeWidth = 2;

  const totalWeight = services.reduce((sum: number, s: any) => sum + (s.weight || 10), 0);

  const getServiceAngle = (service: any) => {
    const weight = service.weight || 10;
    return (weight / totalWeight) * 360;
  };

  const getStartAngle = (index: number) => {
    let angle = -90;
    for (let i = 0; i < index; i++) {
      angle += getServiceAngle(services[i]);
    }
    return angle;
  };

  const lightenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * percent));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const createArcPath = (startAngle: number, endAngle: number, inner: number, outer: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const segmentAngle = endAngle - startAngle;

    const x1 = center + inner * Math.cos(startRad);
    const y1 = center + inner * Math.sin(startRad);
    const x2 = center + outer * Math.cos(startRad);
    const y2 = center + outer * Math.sin(startRad);
    const x3 = center + outer * Math.cos(endRad);
    const y3 = center + outer * Math.sin(endRad);
    const x4 = center + inner * Math.cos(endRad);
    const y4 = center + inner * Math.sin(endRad);

    const largeArc = segmentAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outer} ${outer} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${inner} ${inner} 0 ${largeArc} 0 ${x1} ${y1} Z`;
  };

  const splitTextIntoLines = (text: string, maxChars: number = 12): string[] => {
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

  // Build gradient definitions
  let gradientDefs = '';
  services.forEach((service, index) => {
    const startAngle = getStartAngle(index);
    const serviceAngle = getServiceAngle(service);
    const midAngle = startAngle + serviceAngle / 2;
    const midRad = (midAngle * Math.PI) / 180;

    const x1 = 50 - Math.cos(midRad) * 50;
    const y1 = 50 - Math.sin(midRad) * 50;
    const x2 = 50 + Math.cos(midRad) * 50;
    const y2 = 50 + Math.sin(midRad) * 50;

    gradientDefs += `
      <linearGradient id="gradient-${index}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${lightenColor(service.color, 0.12)}" />
        <stop offset="100%" stop-color="${service.color}" />
      </linearGradient>
    `;
  });

  // Build segment paths and text
  let segments = '';
  const fontSize = size * 0.028;
  const lineHeight = size * 0.035;

  services.forEach((service, index) => {
    const startAngle = getStartAngle(index);
    const serviceAngle = getServiceAngle(service);
    const endAngle = startAngle + serviceAngle;
    const path = createArcPath(startAngle, endAngle, innerRadius, outerRadius);

    segments += `<path d="${path}" fill="url(#gradient-${index})" stroke="white" stroke-width="${strokeWidth}" />`;

    // Add text
    const lines = splitTextIntoLines(service.name);
    const midAngle = startAngle + serviceAngle / 2;
    const rad = (midAngle * Math.PI) / 180;

    const textRadius = (innerRadius + outerRadius) / 2;
    const textCenterX = center + textRadius * Math.cos(rad);
    const textCenterY = center + textRadius * Math.sin(rad);

    const normalizedMidAngle = ((midAngle % 360) + 360) % 360;
    const isLeftSide = normalizedMidAngle > 100 && normalizedMidAngle < 260;
    let rotation = midAngle;
    if (isLeftSide) {
      rotation = midAngle + 180;
    }

    let textContent = '';
    lines.forEach((line, i) => {
      const yOffset = (i - (lines.length - 1) / 2) * lineHeight;
      const lineY = textCenterY + (isLeftSide ? -yOffset : yOffset);
      textContent += `<tspan x="${textCenterX}" y="${lineY}" dominant-baseline="middle">${escapeXml(line)}</tspan>`;
    });

    segments += `
      <text
        fill="white"
        font-size="${fontSize}"
        font-weight="600"
        font-family="Arial, Helvetica, sans-serif"
        text-anchor="middle"
        transform="rotate(${rotation}, ${textCenterX}, ${textCenterY})"
      >${textContent}</text>
    `;
  });

  // Center circle with text
  const centerTextSize = innerRadius * 0.16;
  const centerCircle = `
    <circle cx="${center}" cy="${center}" r="${innerRadius}" fill="#1a1a1a" stroke="#333" stroke-width="${strokeWidth}" />
    <text x="${center}" y="${center - innerRadius * 0.15}" text-anchor="middle" fill="white" font-size="${centerTextSize}" font-weight="600" font-family="Arial, Helvetica, sans-serif">Total Support</text>
    <text x="${center}" y="${center + innerRadius * 0.15}" text-anchor="middle" fill="white" font-size="${centerTextSize}" font-weight="600" font-family="Arial, Helvetica, sans-serif">Strategy</text>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    ${gradientDefs}
  </defs>
  ${segments}
  ${centerCircle}
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sizeParam = searchParams.get('size');
    const size = sizeParam ? parseInt(sizeParam) : 1200;

    // Clamp size between 400 and 4000
    const clampedSize = Math.max(400, Math.min(4000, size));

    const services = getFullConfig();

    if (!services || services.length === 0) {
      return NextResponse.json({ error: 'No services found' }, { status: 404 });
    }

    const svgString = generateWheelSVG(services, clampedSize);

    // Convert SVG to PNG using sharp
    const pngBuffer = await sharp(Buffer.from(svgString))
      .png()
      .toBuffer();

    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="tss-wheel-${Date.now()}.png"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating PNG:', error);
    return NextResponse.json({ error: 'Failed to generate PNG' }, { status: 500 });
  }
}
