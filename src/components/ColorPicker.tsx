'use client';

import { useState } from 'react';
import { ChromePicker } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
          style={{ backgroundColor: color }}
          aria-label="Pick color"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#000000"
        />
      </div>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute z-20 mt-2">
            <ChromePicker
              color={color}
              onChange={(c) => onChange(c.hex)}
              disableAlpha
            />
          </div>
        </>
      )}
    </div>
  );
}
