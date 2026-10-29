import React from 'react';
import { GeoPoint } from '../../types';
import { MapPin, CheckCircle2 } from 'lucide-react';

interface StopSelectorMapProps {
  selectedLocation: {
    name: string;
    address: string;
    coordinates: GeoPoint;
  } | null;
  onMapClick?: (coords: GeoPoint) => void;
}

export const StopSelectorMap: React.FC<StopSelectorMapProps> = ({
  selectedLocation,
  onMapClick,
}) => {
  const pinX = selectedLocation ? selectedLocation.coordinates.x * 10 : 500;
  const pinY = selectedLocation ? selectedLocation.coordinates.y * 6 : 300;

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onMapClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    onMapClick({
      x: Math.round(clickX),
      y: Math.round(clickY),
    });
  };

  return (
    <div className="relative w-full h-[320px] bg-slate-50 rounded-lg border border-slate-200 overflow-hidden select-none shadow-xs">
      {/* Top Banner */}
      <div className="absolute top-2.5 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <span className="bg-white/95 text-slate-700 text-xs px-2.5 py-1 rounded border border-slate-200 pointer-events-auto flex items-center gap-1.5 font-medium shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-teal-700" />
          Location & Pin Preview
        </span>
        {selectedLocation && (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded flex items-center gap-1 pointer-events-auto font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selected: {selectedLocation.coordinates.x}%, {selectedLocation.coordinates.y}%
          </span>
        )}
      </div>

      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full cursor-crosshair bg-[#f8fafc]"
        onClick={handleSvgClick}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="lightSelectorGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="#f8fafc" />
            <rect x="2" y="2" width="46" height="46" fill="#f1f5f9" rx="2" />
          </pattern>
        </defs>

        <rect width="1000" height="600" fill="url(#lightSelectorGrid)" />

        {/* Roads Foundation */}
        <g stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" fill="none">
          <path d="M 100,500 L 300,450 L 550,380 L 850,200" />
          <path d="M 250,80 L 300,450 L 320,550" />
          <path d="M 650,80 L 550,380 L 580,550" />
          <path d="M 150,250 L 850,250" />
        </g>
        <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none">
          <path d="M 100,500 L 300,450 L 550,380 L 850,200" />
          <path d="M 250,80 L 300,450 L 320,550" />
          <path d="M 650,80 L 550,380 L 580,550" />
          <path d="M 150,250 L 850,250" />
        </g>

        {/* Route Line Reference */}
        <path
          d="M 140,468 L 260,432 L 380,384 L 500,330 L 620,264 L 740,210 L 860,132"
          fill="none"
          stroke="#0d9488"
          strokeWidth="3"
          strokeDasharray="4 3"
          opacity="0.6"
        />

        {/* Pin if Location is Selected */}
        {selectedLocation && (
          <g transform={`translate(${pinX}, ${pinY})`} className="animate-in fade-in zoom-in-75 duration-200">
            {/* Geofence 300m circle preview */}
            <circle
              cx="0"
              cy="0"
              r="45"
              fill="#ccfbf1"
              fillOpacity="0.4"
              stroke="#0d9488"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Dropped Pin */}
            <path
              d="M 0,0 C -10,-10 -10,-24 0,-30 C 10,-24 10,-10 0,0 Z"
              fill="#0d9488"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx="0" cy="-18" r="4.5" fill="#ffffff" />

            {/* Stop Label Banner */}
            <g transform="translate(0, -36)">
              <rect
                x={-(selectedLocation.name.length * 3.3 + 12)}
                y="-14"
                width={selectedLocation.name.length * 6.6 + 24}
                height="20"
                rx="4"
                fill="#ffffff"
                stroke="#0d9488"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              />
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="10"
                fontWeight="600"
              >
                {selectedLocation.name}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Selected Address Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 px-3 py-2 text-xs text-slate-700 flex items-center justify-between">
        <span className="truncate pr-2">
          {selectedLocation ? (
            <>
              <strong className="text-teal-800 font-semibold">Location:</strong> {selectedLocation.address}
            </>
          ) : (
            <span className="text-slate-500">Search an address or click anywhere on the map to set coordinates.</span>
          )}
        </span>
        <span className="text-slate-400 text-xs shrink-0">Click map to adjust pin</span>
      </div>
    </div>
  );
};
