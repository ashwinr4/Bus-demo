import React, { useState } from 'react';
import { useTransportation } from '../../context/TransportationContext';
import { SUGGESTED_LOCATIONS } from '../../data/mockData';
import { StopSelectorMap } from '../../components/map/StopSelectorMap';
import { GeoPoint } from '../../types';
import {
  MapPin,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const StopManagement: React.FC = () => {
  const { routes, addStopToRoute } = useTransportation();
  const [targetRouteId, setTargetRouteId] = useState(routes[0]?.id || 'route-04');
  const [stopName, setStopName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduledTime, setScheduledTime] = useState('07:38 AM');
  const [studentEstimate, setStudentEstimate] = useState('5');
  const [landmark, setLandmark] = useState('');

  // Selected Location for Map Preview
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    address: string;
    coordinates: GeoPoint;
  } | null>(SUGGESTED_LOCATIONS[0]);

  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Filter static suggestions based on query
  const filteredSuggestions = SUGGESTED_LOCATIONS.filter((loc) => {
    return (
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.zone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSelectSuggestion = (loc: typeof SUGGESTED_LOCATIONS[0]) => {
    setSelectedLocation({
      name: loc.name,
      address: loc.address,
      coordinates: loc.coordinates,
    });
    setStopName(loc.name);
    setSearchQuery(loc.address);
  };

  const handleCustomMapClick = (coords: GeoPoint) => {
    const customLoc = {
      name: stopName || `Stop at Pin (${coords.x}%, ${coords.y}%)`,
      address: `Campus Corridor Grid (${coords.x}%, ${coords.y}%), South Campus Zone`,
      coordinates: coords,
    };
    setSelectedLocation(customLoc);
    if (!stopName) setStopName(`Stop Pt-${coords.x}`);
    setSearchQuery(customLoc.address);
  };

  const handleConfirmAndSaveStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stopName || !selectedLocation) return;

    const targetRoute = routes.find((r) => r.id === targetRouteId);
    const nextSequence = targetRoute ? targetRoute.stops.length + 1 : 1;

    addStopToRoute(targetRouteId, {
      name: stopName,
      sequence: nextSequence,
      address: selectedLocation.address,
      eta: scheduledTime,
      scheduledTime: scheduledTime,
      coordinates: selectedLocation.coordinates,
      studentCount: parseInt(studentEstimate, 10) || 4,
      status: 'pending',
      landmark: landmark || 'Verified Stop',
    });

    setSavedSuccessMessage(
      `Stop "${stopName}" saved and added to ${targetRoute?.name || 'the route'}.`
    );

    // Reset fields
    setStopName('');
    setSearchQuery('');
    setLandmark('');

    setTimeout(() => {
      setSavedSuccessMessage(null);
    }, 5000);
  };

  const selectedRoute = routes.find((r) => r.id === targetRouteId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <MapPin className="w-5 h-5 text-teal-700" />
          <span>Stop Management</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Add and manage designated school bus pickup and drop-off stops
        </p>
      </div>

      {savedSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-medium flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="font-bold text-sm">Stop Saved</div>
            <p className="text-emerald-800">{savedSuccessMessage}</p>
          </div>
        </div>
      )}

      {/* Main Form & Map Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <form onSubmit={handleConfirmAndSaveStop} className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900">
                1. Select Location & Configure Stop
              </h2>
            </div>

            {/* Target Route */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Route Corridor
              </label>
              <select
                value={targetRouteId}
                onChange={(e) => setTargetRouteId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded bg-white font-medium text-slate-800 focus:ring-1 focus:ring-teal-700"
              >
                {routes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.code} — {rt.name} ({rt.stops.length} current stops)
                  </option>
                ))}
              </select>
            </div>

            {/* Search Location Input */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Search Address / Landmark
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type an address or neighborhood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
                />
              </div>

              {/* Suggestions Panel */}
              <div className="mt-2 border border-slate-200 rounded-md bg-white divide-y divide-slate-100 max-h-36 overflow-y-auto">
                <div className="p-1.5 bg-slate-50 text-[11px] font-semibold text-slate-500">
                  Sample Locations ({filteredSuggestions.length})
                </div>
                {filteredSuggestions.map((loc) => {
                  const isSelected = selectedLocation?.name === loc.name;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => handleSelectSuggestion(loc)}
                      className={`p-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-teal-50 border-l-4 border-teal-700'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 flex items-center justify-between">
                        <span>{loc.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {loc.zone}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{loc.address}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stop Display Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Stop Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Regal Palm Gardens Main Gate"
                value={stopName}
                onChange={(e) => setStopName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
              />
            </div>

            {/* Timetable & Student Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scheduled Time
                </label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Est. Students
                </label>
                <input
                  type="number"
                  value={studentEstimate}
                  onChange={(e) => setStudentEstimate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="Near security gate"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
              />
            </div>

            {/* Confirmation Action */}
            <div className="pt-3 border-t border-slate-200">
              <button
                type="submit"
                disabled={!selectedLocation || !stopName}
                className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Save Stop</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Map Preview & Verification Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  2. Preview Location on Map
                </h2>
                <p className="text-xs text-slate-500">
                  Click on the map to adjust the coordinates
                </p>
              </div>
            </div>

            <StopSelectorMap
              selectedLocation={selectedLocation}
              onMapClick={handleCustomMapClick}
            />

            {selectedLocation && (
              <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">{selectedLocation.name}</div>
                <p className="text-slate-600 text-xs mt-0.5">{selectedLocation.address}</p>
              </div>
            )}
          </div>

          {/* Current stops on route */}
          {selectedRoute && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
                <span>Existing Stops: {selectedRoute.name}</span>
                <span className="text-slate-500 font-mono text-xs">{selectedRoute.stops.length} stops</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {selectedRoute.stops.map((st, i) => (
                  <span
                    key={st.id}
                    className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1 text-xs"
                  >
                    <span className="font-bold text-teal-700">{i + 1}.</span>
                    <span>{st.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
