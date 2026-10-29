import React, { useState } from 'react';
import { useTransportation } from '../../context/TransportationContext';
import { LiveTransitMap } from '../../components/map/LiveTransitMap';
import {
  Route as RouteIcon,
  Plus,
  Bus,
  Clock,
} from 'lucide-react';

export const RouteManagement: React.FC = () => {
  const { routes, buses, drivers } = useTransportation();
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || 'route-04');

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const bus = buses.find((b) => b.id === selectedRoute.busId) || buses[0];
  const driver = drivers.find((d) => d.id === selectedRoute.driverId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-teal-700" />
            <span>Route Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            School bus routes, assigned vehicles, and ordered stops
          </p>
        </div>

        <button
          onClick={() => {
            alert('Opening route planner...');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </button>
      </div>

      {/* Main Grid: Left Route Cards / Selector, Right Route Visualization & Stop Order */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Selector List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            All Routes ({routes.length})
          </h2>

          <div className="space-y-2">
            {routes.map((rt) => {
              const assignedBus = buses.find((b) => b.id === rt.busId);
              const isSelected = rt.id === selectedRouteId;

              return (
                <div
                  key={rt.id}
                  onClick={() => setSelectedRouteId(rt.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-teal-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-teal-800">
                      {rt.code}
                    </span>
                    <span className="text-xs text-slate-500">
                      {rt.stops.length} Stops
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {rt.name}
                  </h3>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Bus className="w-3.5 h-3.5 text-teal-700" />
                      <span>{assignedBus ? assignedBus.fleetNumber : 'Unassigned'}</span>
                    </span>
                    <span>
                      {rt.totalDistanceKm} km • {rt.estimatedDurationMins} min
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Route Visualizer and Stop Sequencing (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Corridor Map Visualizer */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                    {selectedRoute.code}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedRoute.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned Bus: <strong className="text-slate-700">{bus.fleetNumber}</strong> • Driver: <strong className="text-slate-700">{driver?.name}</strong>
                </p>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
                <span>Status: </span>
                <span className="font-semibold text-slate-800 capitalize">{selectedRoute.status}</span>
              </div>
            </div>

            <LiveTransitMap
              bus={bus}
              route={selectedRoute}
              heightClass="h-[340px]"
              interactive={true}
            />
          </div>

          {/* Chronological Stop Order Schedule Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Stop Schedule ({selectedRoute.stops.length} Stops)</span>
              </h3>
              <span className="text-xs text-slate-500">
                Morning: 07:00 AM - 07:55 AM
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {selectedRoute.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{stop.name}</span>
                        {stop.landmark && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({stop.landmark})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-sm mt-0.5">
                        {stop.address}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-800">
                      {stop.scheduledTime}
                    </div>
                    <div className="text-xs text-slate-500">
                      {stop.studentCount} students
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
              <span>All stops geofenced with 300m/500m proximity triggers</span>
              <button
                onClick={() => {
                  alert(`Exporting corridor manifest for ${selectedRoute.code}...`);
                }}
                className="text-teal-700 hover:underline font-semibold"
              >
                Export Route Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
