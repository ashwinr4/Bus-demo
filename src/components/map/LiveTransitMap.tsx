import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Bus, Route, Stop } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { toLatLng } from '../../utils/geo';
import { Clock, MapPin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  // Initialize Leaflet Map
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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
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
        weight: 7,
        opacity: 0.65,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);

      // Core crisp teal route line
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
          ? `<div style="position:absolute; inset:-5px; border-radius:9999px; border:2px dashed #f59e0b; background:rgba(254,243,199,0.45); pointer-events:none;"></div>`
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
            border:1px solid #0f766e;
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

    // Initial Fit Bounds to accommodate route and bus
    if (latLngs.length > 0) {
      const allPoints = [...latLngs, busLatLng];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
    }
  }, [bus.id, bus.currentCoordinates, route.id, highlightStopId, showAllStops]);

  // Fit bounds helper to return to route overview
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const latLngs: [number, number][] = route.pathPoints.map((pt) => toLatLng(pt));
    const busLatLng = toLatLng(bus.currentCoordinates);
    const bounds = L.latLngBounds([...latLngs, busLatLng]);
    map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
  };

  return (
    <div className={`relative w-full ${heightClass} bg-slate-100 border border-slate-200 rounded-lg overflow-hidden select-none shadow-xs flex flex-col`}>
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
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors ml-0.5"
              title="Reset view to entire route"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full relative z-[1]" />

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
