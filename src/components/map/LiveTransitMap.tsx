import React, { useState } from 'react';
import { Bus, Route, Stop } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, MapPin, ZoomIn, ZoomOut } from 'lucide-react';

interface LiveTransitMapProps {
  bus: Bus;
  route: Route;
  highlightStopId?: string;
  showAllStops?: boolean;
  heightClass?: string;
  interactive?: boolean;
}

export const LiveTransitMap: React.FC<LiveTransitMapProps> = ({
  bus,
  route,
  highlightStopId,
  showAllStops = true,
  heightClass = 'h-[380px]',
  interactive = true,
}) => {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Generate SVG path string from route path points
  const pathD = route.pathPoints.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x * 10} ${pt.y * 6}`;
  }, '');

  // Calculate bus position
  const busX = bus.currentCoordinates.x * 10;
  const busY = bus.currentCoordinates.y * 6;

  return (
    <div className={`relative w-full ${heightClass} bg-slate-50 border border-slate-200 rounded-lg overflow-hidden select-none shadow-xs flex flex-col`}>
      {/* Map Control / Status Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-md border border-slate-200 shadow-xs pointer-events-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
            <span>{bus.fleetNumber}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-normal">{route.code}</span>
          </div>
          <span className="text-slate-300">|</span>
          <StatusBadge status={bus.operationalStatus} size="sm" />
          <span className="text-slate-600 text-xs hidden sm:inline">
            Speed: <strong className="text-slate-800">{bus.speedKmh} km/h</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-md border border-slate-200 shadow-xs pointer-events-auto text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-xs">{bus.lastGpsTimestamp}</span>
          <div className="border-l border-slate-200 pl-1.5 ml-1 flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.35))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Light Vector Map Canvas */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#f8fafc]">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: `${busX}px ${busY}px` }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Subtle Clean Urban Block Pattern */}
            <pattern id="lightGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="#f8fafc" />
              <rect x="2" y="2" width="56" height="56" fill="#f1f5f9" rx="3" />
            </pattern>
          </defs>

          {/* Background Blocks */}
          <rect width="1000" height="600" fill="url(#lightGrid)" />

          {/* Natural Landmarks: Lakeview Reservoir */}
          <path
            d="M 280,320 Q 320,290 380,310 T 460,350 Q 480,410 420,440 T 310,420 Z"
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="1.5"
          />
          <text x="350" y="375" fill="#0284c7" fontSize="11" fontWeight="500">
            Lakeview Reservoir
          </text>

          {/* School Campus Zone */}
          <rect
            x="810"
            y="120"
            width="170"
            height="180"
            rx="8"
            fill="#ecfdf5"
            stroke="#a7f3d0"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text x="825" y="145" fill="#047857" fontSize="11" fontWeight="600">
            Oakridge Campus
          </text>
          <text x="825" y="160" fill="#059669" fontSize="9">
            Drop-off Zone A & B
          </text>

          {/* Arterial Roads Foundation */}
          <g stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 60,540 L 220,480 L 420,410 L 680,290 L 890,200 L 980,180" />
            <path d="M 160,80 L 220,480 L 270,580" />
            <path d="M 520,60 L 480,240 L 420,410 L 450,560" />
            <path d="M 680,60 L 680,290 L 760,540" />
            <path d="M 120,220 L 840,220" />
          </g>

          {/* Road Surface */}
          <g stroke="#ffffff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 60,540 L 220,480 L 420,410 L 680,290 L 890,200 L 980,180" />
            <path d="M 160,80 L 220,480 L 270,580" />
            <path d="M 520,60 L 480,240 L 420,410 L 450,560" />
            <path d="M 680,60 L 680,290 L 760,540" />
            <path d="M 120,220 L 840,220" />
          </g>

          {/* Road Centerlines */}
          <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="6 6" fill="none">
            <path d="M 60,540 L 220,480 L 420,410 L 680,290 L 890,200 L 980,180" />
            <path d="M 160,80 L 220,480 L 270,580" />
            <path d="M 520,60 L 480,240 L 420,410 L 450,560" />
            <path d="M 680,60 L 680,290 L 760,540" />
          </g>

          {/* Street Labels */}
          <text x="90" y="525" fill="#64748b" fontSize="9" fontWeight="500">Outer Ring Road</text>
          <text x="490" y="270" fill="#64748b" fontSize="9" fontWeight="500">8th Link Road</text>
          <text x="700" y="320" fill="#64748b" fontSize="9" fontWeight="500">Metro Corridor</text>
          <text x="730" y="212" fill="#64748b" fontSize="9" fontWeight="500">Campus Drive</text>

          {/* Active Bus Route Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#99f6e4"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
          <path
            d={pathD}
            fill="none"
            stroke="#0d9488"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ordered Stops */}
          {showAllStops &&
            route.stops.map((stop, idx) => {
              const sx = stop.coordinates.x * 10;
              const sy = stop.coordinates.y * 6;
              const isHighlighted = stop.id === highlightStopId;
              const isPast = stop.status === 'departed';
              const isApproaching = stop.status === 'approaching' || stop.status === 'arrived';

              return (
                <g
                  key={stop.id}
                  className="cursor-pointer transition-transform"
                  onClick={() => interactive && setSelectedStop(stop)}
                >
                  {/* Highlight Ring for Child's stop */}
                  {isHighlighted && (
                    <circle
                      cx={sx}
                      cy={sy}
                      r="20"
                      fill="#fef3c7"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  )}

                  {/* Approaching stop ring */}
                  {isApproaching && (
                    <circle
                      cx={sx}
                      cy={sy}
                      r="16"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Stop Marker Circle */}
                  <circle
                    cx={sx}
                    cy={sy}
                    r="11"
                    fill={isHighlighted ? '#d97706' : isPast ? '#94a3b8' : '#ffffff'}
                    stroke={isHighlighted ? '#ffffff' : isPast ? '#64748b' : '#0d9488'}
                    strokeWidth="2.5"
                    className="shadow-xs"
                  />

                  {/* Stop Number */}
                  <text
                    x={sx}
                    y={sy + 3.5}
                    textAnchor="middle"
                    fill={isHighlighted ? '#ffffff' : isPast ? '#ffffff' : '#0f766e'}
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    {idx + 1}
                  </text>

                  {/* Stop Label Pill */}
                  <g transform={`translate(${sx}, ${sy - 16})`}>
                    <rect
                      x={-(stop.name.length * 3.1 + 8)}
                      y="-12"
                      width={stop.name.length * 6.2 + 16}
                      height="17"
                      rx="4"
                      fill="#ffffff"
                      stroke={isHighlighted ? '#d97706' : '#cbd5e1'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill={isHighlighted ? '#b45309' : '#1e293b'}
                      fontSize="9"
                      fontWeight={isHighlighted ? '700' : '500'}
                    >
                      {stop.name}
                    </text>
                  </g>
                </g>
              );
            })}

          {/* Active Bus Marker */}
          <g transform={`translate(${busX}, ${busY})`}>
            {/* Bus Pin Outer Circle */}
            <circle
              cx="0"
              cy="0"
              r="17"
              fill="#ffffff"
              stroke="#0f766e"
              strokeWidth="3"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
            />

            {/* Inner fill */}
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="#0d9488"
            />

            {/* Bus Directional Arrow */}
            <path
              d="M 0,-6 L 4,4 L 0,2 L -4,4 Z"
              fill="#ffffff"
              transform="rotate(35)"
            />

            {/* Floating Tag */}
            <g transform="translate(18, -12)">
              <rect
                x="0"
                y="-10"
                width="84"
                height="22"
                rx="4"
                fill="#ffffff"
                stroke="#0d9488"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
              />
              <text x="8" y="5" fill="#0f172a" fontSize="10" fontWeight="700">
                {bus.fleetNumber}
              </text>
              <text x="50" y="5" fill="#0d9488" fontSize="9" fontWeight="600">
                {bus.speedKmh > 0 ? `${bus.speedKmh}k/h` : 'STOP'}
              </text>
            </g>
          </g>
        </svg>

        {/* Selected Stop Details Popover */}
        {selectedStop && (
          <div className="absolute bottom-12 left-4 z-30 bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-md text-slate-800 max-w-xs animate-in fade-in">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>
                  Stop #{selectedStop.sequence}: {selectedStop.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedStop(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-500 text-xs mb-2">{selectedStop.address}</p>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Scheduled:</span>
                <span className="font-medium text-slate-800">{selectedStop.scheduledTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Est. Arrival:</span>
                <span className="font-medium text-teal-700">{selectedStop.eta}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Students:</span>
                <span className="font-medium text-slate-800">{selectedStop.studentCount} boarding</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status:</span>
                <span className="capitalize font-medium text-slate-800">{selectedStop.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="bg-white border-t border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> Route
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-teal-600 inline-block" /> Stop
          </span>
          {highlightStopId && (
            <span className="flex items-center gap-1.5 text-xs text-amber-800 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Child's Stop
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[280px]">
            Near: <strong className="text-slate-700 font-normal">{bus.currentLocationName}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
