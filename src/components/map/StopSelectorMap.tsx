import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GeoPoint } from '../../types';
import { toLatLng, fromLatLng } from '../../utils/geo';
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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLatLng: [number, number] = selectedLocation
        ? toLatLng(selectedLocation.coordinates)
        : [12.965, 80.245];

      const map = L.map(mapContainerRef.current, {
        center: initialLatLng,
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(map);

      markerLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map click to drop / move pin
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (!onMapClick) return;
        const newCoords = fromLatLng(e.latlng.lat, e.latlng.lng);
        onMapClick(newCoords);
      });

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

  // Update Pin & Geofence on selectedLocation change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markerLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (selectedLocation) {
      const latLng = toLatLng(selectedLocation.coordinates);

      // Draw 300m Geofence Radius Circle
      L.circle(latLng, {
        radius: 300,
        color: '#0f766e',
        fillColor: '#99f6e4',
        fillOpacity: 0.25,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(layerGroup);

      // Dropped Pin DivIcon
      const pinIcon = L.divIcon({
        className: 'custom-selector-pin',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        html: `
          <div style="position:relative; width:32px; height:42px; display:flex; flex-direction:column; align-items:center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 24 32" fill="#0f766e" stroke="#ffffff" stroke-width="2">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12zm0 17c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/>
            </svg>
            <div style="
              position:absolute;
              top:-20px;
              white-space:nowrap;
              background:#ffffff;
              color:#0f172a;
              border:1px solid #0f766e;
              border-radius:4px;
              padding:1px 6px;
              font-size:9.5px;
              font-weight:700;
              box-shadow:0 1px 4px rgba(0,0,0,0.2);
              pointer-events:none;
            ">
              ${selectedLocation.name}
            </div>
          </div>
        `,
      });

      L.marker(latLng, { icon: pinIcon }).addTo(layerGroup);
      map.panTo(latLng);
    }
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-[340px] bg-slate-100 rounded-lg border border-slate-200 overflow-hidden select-none shadow-xs">
      {/* Top Banner */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[500] flex items-center justify-between pointer-events-none">
        <span className="bg-white/95 text-slate-800 text-xs px-2.5 py-1 rounded border border-slate-200 pointer-events-auto flex items-center gap-1.5 font-medium shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-teal-700" />
          Interactive Location Picker
        </span>
        {selectedLocation && (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded flex items-center gap-1 pointer-events-auto font-medium shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Coords: {selectedLocation.coordinates.lat || selectedLocation.coordinates.x}°, {selectedLocation.coordinates.lng || selectedLocation.coordinates.y}°
          </span>
        )}
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full relative z-[1]" />

      {/* Selected Address Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 px-3 py-2 text-xs text-slate-700 flex items-center justify-between z-[500]">
        <span className="truncate pr-2">
          {selectedLocation ? (
            <>
              <strong className="text-teal-800 font-semibold">Selected Location:</strong> {selectedLocation.address}
            </>
          ) : (
            <span className="text-slate-500">Search an address or click anywhere on the street map to set stop pin.</span>
          )}
        </span>
        <span className="text-slate-400 text-xs shrink-0">Click map to move pin</span>
      </div>
    </div>
  );
};
