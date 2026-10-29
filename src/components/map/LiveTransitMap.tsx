import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import { Bus, Route, Stop } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { toLatLng } from '../../utils/geo';
import {
  Clock,
  MapPin,
  RotateCcw,
  Maximize2,
  ArrowLeft,
  Crosshair,
  X,
} from 'lucide-react';

interface LiveTransitMapProps {
  bus: Bus;
  route: Route;
  highlightStopId?: string;
  showAllStops?: boolean;
  heightClass?: string;
  interactive?: boolean;
  allowFullScreen?: boolean;
  initialFullScreen?: boolean;
  onFullScreenChange?: (fullScreen: boolean) => void;
}

// ============================================================================
// DEDICATED FULL-SCREEN MAP MODAL COMPONENT (Mounted via React Portal)
// ============================================================================
interface FullScreenModalProps {
  bus: Bus;
  route: Route;
  highlightStopId?: string;
  showAllStops?: boolean;
  onClose: () => void;
}

const FullScreenTransitMapModal: React.FC<FullScreenModalProps> = ({
  bus,
  route,
  highlightStopId,
  showAllStops = true,
  onClose,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  // Prevent background scrolling while full screen is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Initialize Full-Screen Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const busLatLng = toLatLng(bus.currentCoordinates);

    const map = L.map(mapContainerRef.current, {
      center: busLatLng,
      zoom: 14,
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      attributionControl: true,
    });

    // Street tiles layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);

    // 1. Draw Route Polyline (Teal)
    const latLngs: [number, number][] = route.pathPoints.map((pt) => toLatLng(pt));
    if (latLngs.length > 1) {
      // Soft casing
      L.polyline(latLngs, {
        color: '#99f6e4',
        weight: 8,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);

      // Core crisp teal route line
      L.polyline(latLngs, {
        color: '#0f766e',
        weight: 4.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);
    }

    // 2. Draw Sequenced Stops
    if (showAllStops) {
      route.stops.forEach((stop, idx) => {
        const stopLatLng = toLatLng(stop.coordinates);
        const isHighlighted = stop.id === highlightStopId;
        const isPast = stop.status === 'departed';
        const isApproaching = stop.status === 'approaching' || stop.status === 'arrived';

        const bgColor = isHighlighted ? '#d97706' : isPast ? '#94a3b8' : '#ffffff';
        const borderColor = isHighlighted ? '#ffffff' : isPast ? '#64748b' : '#0f766e';
        const textColor = isHighlighted ? '#ffffff' : isPast ? '#ffffff' : '#0f766e';
        const ringHtml = isHighlighted
          ? `<div style="position:absolute; inset:-6px; border-radius:9999px; border:2.5px dashed #f59e0b; background:rgba(254,243,199,0.5); pointer-events:none;"></div>`
          : isApproaching
          ? `<div style="position:absolute; inset:-4px; border-radius:9999px; border:2px solid #0d9488; opacity:0.75; pointer-events:none;"></div>`
          : '';

        const stopIcon = L.divIcon({
          className: 'custom-stop-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          html: `
            <div style="position:relative; width:28px; height:28px;">
              ${ringHtml}
              <div style="
                width:28px;
                height:28px;
                border-radius:9999px;
                background:${bgColor};
                border:${isHighlighted ? '3px' : '2.5px'} solid ${borderColor};
                display:flex;
                align-items:center;
                justify-content:center;
                color:${textColor};
                font-weight:700;
                font-size:11px;
                font-family:sans-serif;
                box-shadow:0 1px 4px rgba(0,0,0,0.25);
                cursor:pointer;
              ">
                ${idx + 1}
              </div>
            </div>
          `,
        });

        const marker = L.marker(stopLatLng, { icon: stopIcon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedStop(stop);
        });
      });
    }

    // 3. Draw Active Bus Marker
    const busIcon = L.divIcon({
      className: 'custom-bus-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      html: `
        <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
          <div style="
            width:32px;
            height:32px;
            border-radius:9999px;
            background:#0f766e;
            border:3px solid #ffffff;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6"/>
              <path d="M16 6v6"/>
              <path d="M2 12h20"/>
              <path d="M18 18h2a1 1 0 0 0 1-1v-8a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v8a1 1 0 0 0 1 1h2"/>
              <circle cx="7" cy="18" r="2"/>
              <path d="M9 18h6"/>
              <circle cx="17" cy="18" r="2"/>
            </svg>
          </div>
          <div style="
            position:absolute;
            bottom:-19px;
            left:50%;
            transform:translateX(-50%);
            white-space:nowrap;
            background:#ffffff;
            color:#0f172a;
            border:1.5px solid #0f766e;
            border-radius:4px;
            padding:1px 6px;
            font-size:10px;
            font-weight:700;
            box-shadow:0 1px 4px rgba(0,0,0,0.2);
            pointer-events:none;
          ">
            ${bus.fleetNumber}
          </div>
        </div>
      `,
    });

    L.marker(busLatLng, { icon: busIcon, zIndexOffset: 1000 }).addTo(layerGroup);
    mapInstanceRef.current = map;

    // Invalidate size immediately after DOM render and fit bounds to route
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (latLngs.length > 0) {
        const allPoints = [...latLngs, busLatLng];
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }, 100);

    const onResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const latLngs: [number, number][] = route.pathPoints.map((pt) => toLatLng(pt));
    const busLatLng = toLatLng(bus.currentCoordinates);
    const bounds = L.latLngBounds([...latLngs, busLatLng]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  };

  const handleFocusBus = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const busLatLng = toLatLng(bus.currentCoordinates);
    map.setView(busLatLng, 16, { animate: true });
  };

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-900 flex flex-col select-none overflow-hidden">
      {/* Full-Screen Top Navigation Bar (Deep Navy #17324D) */}
      <header className="bg-[#17324D] border-b border-[#12273d] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-sm transition-colors touch-manipulation cursor-pointer"
            title="Close Full-Screen Map (Esc)"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span>Close Map</span>
          </button>

          <div className="border-l border-white/20 pl-3 flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight">
              {bus.fleetNumber}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#12273d] text-slate-200 font-mono font-medium border border-white/10">
              {route.code}
            </span>
            <StatusBadge status={bus.operationalStatus} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetView}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-xs transition-colors touch-manipulation cursor-pointer"
            title="Fit Entire Route to Screen"
          >
            <RotateCcw className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Fit Route</span>
          </button>

          <button
            onClick={handleFocusBus}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F766E] hover:bg-teal-600 active:bg-teal-700 text-white font-semibold text-xs transition-colors touch-manipulation shadow-xs cursor-pointer"
            title="Focus on Current Bus Location"
          >
            <Crosshair className="w-4 h-4 text-white" />
            <span>Find Bus</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
            title="Exit Full Screen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Full-Screen Map Canvas */}
      <div className="flex-1 w-full h-full relative z-10 bg-[#e2e8f0]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Large Accessible Touch Controls */}
        <div className="absolute right-4 bottom-24 z-[500] flex flex-col gap-2.5 pointer-events-auto">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-12 h-12 bg-white border border-slate-300 rounded-xl shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-50 active:bg-slate-100 font-bold text-2xl transition-all touch-manipulation cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-12 h-12 bg-white border border-slate-300 rounded-xl shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-50 active:bg-slate-100 font-bold text-2xl transition-all touch-manipulation cursor-pointer"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleFocusBus}
            className="w-12 h-12 bg-[#0F766E] text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-teal-800 active:bg-teal-900 transition-all touch-manipulation cursor-pointer"
            title="Find Bus"
          >
            <Crosshair className="w-6 h-6" />
          </button>
        </div>

        {/* Selected Stop Details Popover */}
        {selectedStop && (
          <div className="absolute bottom-24 left-4 z-[500] bg-white border border-slate-200 rounded-xl p-4 text-xs shadow-xl text-slate-800 max-w-sm animate-in fade-in">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>
                  Stop #{selectedStop.sequence}: {selectedStop.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedStop(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-500 text-xs mb-2.5">{selectedStop.address}</p>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Scheduled:</span>
                <span className="font-semibold text-slate-800">{selectedStop.scheduledTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Est. Arrival:</span>
                <span className="font-semibold text-teal-700">{selectedStop.eta}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Students:</span>
                <span className="font-semibold text-slate-800">
                  {selectedStop.studentCount} boarding
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status:</span>
                <span className="capitalize font-semibold text-slate-800">
                  {selectedStop.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Footer Status Strip */}
      <footer className="bg-white border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
            <span>Route: <strong>{route.code}</strong> ({route.stops.length} stops)</span>
          </span>
          {highlightStopId && (
            <span className="flex items-center gap-1.5 text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Child's Designated Stop</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">GPS: {bus.lastGpsTimestamp}</span>
          </span>
          <span className="font-medium">
            Speed: <strong className="text-slate-900">{bus.speedKmh} km/h</strong>
          </span>
          <span className="truncate max-w-xs text-slate-500 hidden sm:inline">
            Near: {bus.currentLocationName}
          </span>
        </div>
      </footer>
    </div>
  );
};

// ============================================================================
// EMBEDDED MAP COMPONENT (Renders cleanly in cards without overlap)
// ============================================================================
export const LiveTransitMap: React.FC<LiveTransitMapProps> = ({
  bus,
  route,
  highlightStopId,
  showAllStops = true,
  heightClass = 'h-[380px]',
  interactive = true,
  allowFullScreen = true,
  initialFullScreen = false,
  onFullScreenChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(initialFullScreen);

  const toggleFullScreen = (targetState?: boolean) => {
    const nextState = typeof targetState === 'boolean' ? targetState : !isFullScreen;
    setIsFullScreen(nextState);
    if (onFullScreenChange) {
      onFullScreenChange(nextState);
    }
  };

  // Initialize Embedded Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const busLatLng = toLatLng(bus.currentCoordinates);

      const map = L.map(mapContainerRef.current, {
        center: busLatLng,
        zoom: 14,
        zoomControl: false,
        dragging: interactive,
        scrollWheelZoom: interactive,
        touchZoom: interactive,
        doubleClickZoom: interactive,
        attributionControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(map);

      routeLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Route Polyline, Stops, and Bus Marker on Embedded Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = routeLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Route Polyline (Teal)
    const latLngs: [number, number][] = route.pathPoints.map((pt) => toLatLng(pt));

    if (latLngs.length > 1) {
      L.polyline(latLngs, {
        color: '#99f6e4',
        weight: 7,
        opacity: 0.65,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);

      L.polyline(latLngs, {
        color: '#0f766e',
        weight: 3.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);
    }

    // 2. Draw Sequenced Stops
    if (showAllStops) {
      route.stops.forEach((stop, idx) => {
        const stopLatLng = toLatLng(stop.coordinates);
        const isHighlighted = stop.id === highlightStopId;
        const isPast = stop.status === 'departed';
        const isApproaching = stop.status === 'approaching' || stop.status === 'arrived';

        const bgColor = isHighlighted ? '#d97706' : isPast ? '#94a3b8' : '#ffffff';
        const borderColor = isHighlighted ? '#ffffff' : isPast ? '#64748b' : '#0f766e';
        const textColor = isHighlighted ? '#ffffff' : isPast ? '#ffffff' : '#0f766e';
        const ringHtml = isHighlighted
          ? `<div style="position:absolute; inset:-5px; border-radius:9999px; border:2px dashed #f59e0b; background:rgba(254,243,199,0.5); pointer-events:none;"></div>`
          : isApproaching
          ? `<div style="position:absolute; inset:-4px; border-radius:9999px; border:2px solid #0d9488; opacity:0.75; pointer-events:none;"></div>`
          : '';

        const stopIcon = L.divIcon({
          className: 'custom-stop-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          html: `
            <div style="position:relative; width:24px; height:24px;">
              ${ringHtml}
              <div style="
                width:24px;
                height:24px;
                border-radius:9999px;
                background:${bgColor};
                border:2.5px solid ${borderColor};
                display:flex;
                align-items:center;
                justify-content:center;
                color:${textColor};
                font-weight:700;
                font-size:10px;
                font-family:sans-serif;
                box-shadow:0 1px 3px rgba(0,0,0,0.2);
                cursor:pointer;
              ">
                ${idx + 1}
              </div>
            </div>
          `,
        });

        const marker = L.marker(stopLatLng, { icon: stopIcon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedStop(stop);
        });
      });
    }

    // 3. Draw Active Bus Marker
    const busLatLng = toLatLng(bus.currentCoordinates);
    const busIcon = L.divIcon({
      className: 'custom-bus-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      html: `
        <div style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
          <div style="
            width:28px;
            height:28px;
            border-radius:9999px;
            background:#0f766e;
            border:3px solid #ffffff;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6"/>
              <path d="M16 6v6"/>
              <path d="M2 12h20"/>
              <path d="M18 18h2a1 1 0 0 0 1-1v-8a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v8a1 1 0 0 0 1 1h2"/>
              <circle cx="7" cy="18" r="2"/>
              <path d="M9 18h6"/>
              <circle cx="17" cy="18" r="2"/>
            </svg>
          </div>
          <div style="
            position:absolute;
            bottom:-18px;
            left:50%;
            transform:translateX(-50%);
            white-space:nowrap;
            background:#ffffff;
            color:#0f172a;
            border:1.5px solid #0f766e;
            border-radius:4px;
            padding:1px 5px;
            font-size:9.5px;
            font-weight:700;
            box-shadow:0 1px 3px rgba(0,0,0,0.15);
            pointer-events:none;
          ">
            ${bus.fleetNumber}
          </div>
        </div>
      `,
    });

    L.marker(busLatLng, { icon: busIcon, zIndexOffset: 1000 }).addTo(layerGroup);

    // Initial Fit Bounds
    if (latLngs.length > 0) {
      const allPoints = [...latLngs, busLatLng];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
    }
  }, [bus.id, bus.currentCoordinates, route.id, highlightStopId, showAllStops]);

  // Window resize handler
  useEffect(() => {
    const onResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleResetView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const map = mapInstanceRef.current;
    if (!map) return;
    const latLngs: [number, number][] = route.pathPoints.map((pt) => toLatLng(pt));
    const busLatLng = toLatLng(bus.currentCoordinates);
    const bounds = L.latLngBounds([...latLngs, busLatLng]);
    map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
  };

  return (
    <>
      {/* Embedded Map Card View */}
      <div
        className={`relative isolate w-full ${heightClass} bg-slate-100 border border-slate-200 rounded-lg overflow-hidden select-none shadow-xs flex flex-col`}
      >
        {/* Simplified Un-cramped Top Overlay Bar */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-[20] flex items-center justify-between pointer-events-none">
          {/* Left Pill: Bus ID & Route Code (Never breaks lines) */}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 shadow-xs pointer-events-auto text-xs font-semibold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-teal-600 inline-block shrink-0" />
            <span>{bus.fleetNumber}</span>
            <span className="text-slate-400 font-normal">•</span>
            <span className="text-slate-600 font-normal">{route.code}</span>
          </div>

          {/* Right Controls: Fit Route & Full Screen Expand */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleResetView}
              className="p-1.5 bg-white/95 hover:bg-slate-100 rounded-md border border-slate-200 shadow-xs text-slate-600 transition-colors cursor-pointer"
              title="Reset view to entire route"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            {allowFullScreen && (
              <button
                onClick={() => toggleFullScreen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0F766E] hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
                title="Expand to Full Screen Map"
              >
                <Maximize2 className="w-3.5 h-3.5 text-white" />
                <span>Expand</span>
              </button>
            )}
          </div>
        </div>

        {/* Leaflet Map Div */}
        <div
          ref={mapContainerRef}
          className="flex-1 w-full h-full relative z-[1]"
          onClick={() => !interactive && allowFullScreen && toggleFullScreen(true)}
        />

        {/* Tap-to-expand overlay when map is in preview non-interactive mode */}
        {!interactive && allowFullScreen && (
          <div
            onClick={() => toggleFullScreen(true)}
            className="absolute inset-0 z-[10] cursor-pointer group flex items-end justify-center pb-8 pointer-events-auto"
            title="Tap to open full-screen interactive map"
          >
            <div className="bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs transition-all transform group-hover:scale-105">
              <Maximize2 className="w-3 h-3 text-teal-400" />
              <span>Tap to expand map</span>
            </div>
          </div>
        )}

        {/* Selected Stop Details Popover (Embedded) */}
        {selectedStop && (
          <div className="absolute bottom-10 left-3 z-[25] bg-white border border-slate-200 rounded-lg p-2.5 text-xs shadow-md text-slate-800 max-w-xs animate-in fade-in">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>
                  #{selectedStop.sequence}: {selectedStop.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedStop(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-500 text-[11px] mb-1.5">{selectedStop.address}</p>
            <div className="flex items-center justify-between text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
              <span className="text-slate-500">
                Scheduled: <strong className="text-slate-800">{selectedStop.scheduledTime}</strong>
              </span>
              <span className="text-teal-700 font-semibold">{selectedStop.eta}</span>
            </div>
          </div>
        )}

        {/* Simplified Embedded Bottom Status & Legend Strip */}
        <div className="bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-600 z-[20] shrink-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={bus.operationalStatus} size="sm" />
            <span className="text-slate-400 font-mono text-[11px] hidden xs:inline">
              {bus.lastGpsTimestamp}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {highlightStopId && (
              <span className="flex items-center gap-1 text-amber-800 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Child's Stop
              </span>
            )}
            <span className="text-slate-700 text-xs">
              Speed: <strong className="text-slate-900">{bus.speedKmh} km/h</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Full-Screen Map Portal (Mounts cleanly onto document.body) */}
      {isFullScreen &&
        createPortal(
          <FullScreenTransitMapModal
            bus={bus}
            route={route}
            highlightStopId={highlightStopId}
            showAllStops={showAllStops}
            onClose={() => toggleFullScreen(false)}
          />,
          document.body
        )}
    </>
  );
};
