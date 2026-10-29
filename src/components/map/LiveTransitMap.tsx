import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Bus, Route, Stop } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { toLatLng } from '../../utils/geo';
import {
  Clock,
  MapPin,
  ZoomIn,
  ZoomOut,
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

  // Lock background scroll when full-screen is active
  useEffect(() => {
    if (isFullScreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isFullScreen]);

  // Handle Escape key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        toggleFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const busLatLng = toLatLng(bus.currentCoordinates);

      const map = L.map(mapContainerRef.current, {
        center: busLatLng,
        zoom: 14,
        zoomControl: false,
        dragging: isFullScreen ? true : interactive,
        scrollWheelZoom: isFullScreen ? true : interactive,
        touchZoom: isFullScreen ? true : interactive,
        doubleClickZoom: isFullScreen ? true : interactive,
        attributionControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(map);

      routeLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Force size recalculation after mount
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

  // Update Route Polyline, Stops, and Bus Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = routeLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Route Polyline (Teal)
    const latLngs: [number, number][] = route.pathPoints.map((pt) => toLatLng(pt));

    if (latLngs.length > 1) {
      // Soft translucent casing
      L.polyline(latLngs, {
        color: '#99f6e4',
        weight: isFullScreen ? 8 : 7,
        opacity: 0.65,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);

      // Core crisp teal route line
      L.polyline(latLngs, {
        color: '#0f766e',
        weight: isFullScreen ? 4.5 : 3.5,
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
          ? `<div style="position:absolute; inset:-6px; border-radius:9999px; border:2.5px dashed #f59e0b; background:rgba(254,243,199,0.5); pointer-events:none; animation:pulse 2s infinite;"></div>`
          : isApproaching
          ? `<div style="position:absolute; inset:-4px; border-radius:9999px; border:2px solid #0d9488; opacity:0.75; pointer-events:none;"></div>`
          : '';

        const markerSize = isFullScreen ? 28 : 24;
        const stopIcon = L.divIcon({
          className: 'custom-stop-marker',
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize / 2, markerSize / 2],
          html: `
            <div style="position:relative; width:${markerSize}px; height:${markerSize}px;">
              ${ringHtml}
              <div style="
                width:${markerSize}px;
                height:${markerSize}px;
                border-radius:9999px;
                background:${bgColor};
                border:${isHighlighted ? '3px' : '2.5px'} solid ${borderColor};
                display:flex;
                align-items:center;
                justify-content:center;
                color:${textColor};
                font-weight:700;
                font-size:${isFullScreen ? '11px' : '10px'};
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
    const busLatLng = toLatLng(bus.currentCoordinates);
    const busMarkerDim = isFullScreen ? 36 : 32;
    const busInnerDim = isFullScreen ? 32 : 28;
    const busIcon = L.divIcon({
      className: 'custom-bus-marker',
      iconSize: [busMarkerDim, busMarkerDim],
      iconAnchor: [busMarkerDim / 2, busMarkerDim / 2],
      html: `
        <div style="position:relative; width:${busMarkerDim}px; height:${busMarkerDim}px; display:flex; align-items:center; justify-content:center;">
          <div style="
            width:${busInnerDim}px;
            height:${busInnerDim}px;
            border-radius:9999px;
            background:#0f766e;
            border:3px solid #ffffff;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="${isFullScreen ? 16 : 14}" height="${isFullScreen ? 16 : 14}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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

    // Initial Fit Bounds to accommodate route and bus
    if (latLngs.length > 0) {
      const allPoints = [...latLngs, busLatLng];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, {
        padding: isFullScreen ? [50, 50] : [35, 35],
        maxZoom: 15,
      });
    }
  }, [bus.id, bus.currentCoordinates, route.id, highlightStopId, showAllStops, isFullScreen]);

  // Handle Full-Screen Transitions and Map Invalidation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isFullScreen) {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
    } else {
      if (!interactive) {
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
      } else {
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
      }
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
      // Auto-frame route and bus cleanly
      const latLngs: [number, number][] = route.pathPoints.map((pt) => toLatLng(pt));
      const busLatLng = toLatLng(bus.currentCoordinates);
      const bounds = L.latLngBounds([...latLngs, busLatLng]);
      map.fitBounds(bounds, {
        padding: isFullScreen ? [60, 60] : [35, 35],
        maxZoom: 15,
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [isFullScreen, interactive]);

  // Listen to window resize
  useEffect(() => {
    const onResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Fit bounds helper to return to route overview
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const latLngs: [number, number][] = route.pathPoints.map((pt) => toLatLng(pt));
    const busLatLng = toLatLng(bus.currentCoordinates);
    const bounds = L.latLngBounds([...latLngs, busLatLng]);
    map.fitBounds(bounds, {
      padding: isFullScreen ? [60, 60] : [35, 35],
      maxZoom: 15,
    });
  };

  // Focus directly on the bus marker
  const handleFocusBus = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const busLatLng = toLatLng(bus.currentCoordinates);
    map.setView(busLatLng, 16, { animate: true });
  };

  // -------------------------------------------------------------
  // RENDER: FULL-SCREEN VIEW (Takes over whole screen)
  // -------------------------------------------------------------
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-900 flex flex-col select-none">
        {/* Full-Screen Top Navigation Bar (Deep Navy #17324D) */}
        <header className="bg-[#17324D] border-b border-[#12273d] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFullScreen(false)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-sm transition-colors touch-manipulation shadow-xs cursor-pointer"
              title="Close Full-Screen Map (Esc)"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              <span>Close Map</span>
            </button>

            <div className="border-l border-white/20 pl-3 hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  {bus.fleetNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#12273d] text-slate-200 font-mono font-medium border border-white/10">
                  {route.code}
                </span>
                <StatusBadge status={bus.operationalStatus} size="sm" />
              </div>
              <p className="text-xs text-slate-300 truncate max-w-xs">{route.name}</p>
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
              onClick={() => toggleFullScreen(false)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
              title="Exit Full Screen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Full-Screen Map Canvas */}
        <div className="flex-1 w-full h-full relative z-10 bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Large Touchscreen Zoom & Navigation Controls */}
          <div className="absolute right-4 bottom-20 z-[500] flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-12 h-12 bg-white border border-slate-300 rounded-xl shadow-md flex items-center justify-center text-slate-800 hover:bg-slate-50 active:bg-slate-100 font-bold text-xl transition-all touch-manipulation cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-12 h-12 bg-white border border-slate-300 rounded-xl shadow-md flex items-center justify-center text-slate-800 hover:bg-slate-50 active:bg-slate-100 font-bold text-xl transition-all touch-manipulation cursor-pointer"
              title="Zoom Out"
            >
              −
            </button>
            <button
              onClick={handleFocusBus}
              className="w-12 h-12 bg-[#0F766E] text-white rounded-xl shadow-md flex items-center justify-center hover:bg-teal-800 active:bg-teal-900 transition-all touch-manipulation cursor-pointer"
              title="Find Bus"
            >
              <Crosshair className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Stop Details Popover (Full-Screen) */}
          {selectedStop && (
            <div className="absolute bottom-20 left-4 z-[500] bg-white border border-slate-200 rounded-xl p-4 text-xs shadow-xl text-slate-800 max-w-sm animate-in fade-in">
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
  }

  // -------------------------------------------------------------
  // RENDER: STANDARD EMBEDDED PREVIEW
  // -------------------------------------------------------------
  return (
    <div
      className={`relative w-full ${heightClass} bg-slate-100 border border-slate-200 rounded-lg overflow-hidden select-none shadow-xs flex flex-col`}
    >
      {/* Map Control / Status Overlay Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[500] flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-200 shadow-xs pointer-events-auto">
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
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors ml-0.5 cursor-pointer"
              title="Reset view to entire route"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            {allowFullScreen && (
              <button
                onClick={() => toggleFullScreen(true)}
                className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded bg-[#0F766E] hover:bg-teal-800 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
                title="Expand to Full Screen Map"
              >
                <Maximize2 className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Full Screen</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full relative z-[1]" />

      {/* Tap-to-expand overlay when map is in preview non-interactive mode */}
      {!interactive && allowFullScreen && (
        <div
          onClick={() => toggleFullScreen(true)}
          className="absolute inset-0 z-[10] cursor-pointer group flex items-end justify-center pb-10 pointer-events-auto"
          title="Tap to open full-screen interactive map"
        >
          <div className="bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs transition-all transform group-hover:scale-105">
            <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Tap to open full-screen map</span>
          </div>
        </div>
      )}

      {/* Selected Stop Details Popover */}
      {selectedStop && (
        <div className="absolute bottom-12 left-4 z-[500] bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-md text-slate-800 max-w-xs animate-in fade-in">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span>
                Stop #{selectedStop.sequence}: {selectedStop.name}
              </span>
            </div>
            <button
              onClick={() => setSelectedStop(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1 cursor-pointer"
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

      {/* Map Legend Footer Bar */}
      <div className="bg-white border-t border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 z-[500]">
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
