import React, { useState } from 'react';
import { useTransportation } from '../../context/TransportationContext';
import { LiveTransitMap } from '../../components/map/LiveTransitMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Radio,
  MapPin,
  User,
} from 'lucide-react';

export const TripMonitoring: React.FC = () => {
  const { buses, routes, drivers } = useTransportation();
  const [activeBusId, setActiveBusId] = useState<string>('bus-01');

  const selectedBus = buses.find((b) => b.id === activeBusId) || buses[0];
  const selectedRoute = routes.find((r) => r.id === selectedBus.assignedRouteId) || routes[0];
  const selectedDriver = drivers.find((d) => d.id === selectedBus.assignedDriverId);

  // Active vs other trips
  const inProgressTrips = buses.filter(
    (b) => b.operationalStatus === 'in_transit' || b.operationalStatus === 'stopped'
  );
  const otherTrips = buses.filter(
    (b) => b.operationalStatus !== 'in_transit' && b.operationalStatus !== 'stopped'
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Live Trip Monitoring
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active morning runs, bus locations, and stop progress
          </p>
        </div>

        <div>
          <span className="text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{inProgressTrips.length} Trips In Progress</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Trip List (5 cols), Right Live Map & Info (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Trips List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Active Trips ({inProgressTrips.length})</span>
            </h2>

            <div className="space-y-2.5">
              {inProgressTrips.map((bus) => {
                const rt = routes.find((r) => r.id === bus.assignedRouteId);
                const drv = drivers.find((d) => d.id === bus.assignedDriverId);
                const isSelected = bus.id === activeBusId;

                return (
                  <div
                    key={bus.id}
                    onClick={() => setActiveBusId(bus.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{bus.fleetNumber}</span>
                        <span className="text-xs text-slate-500 font-mono">
                          {bus.registrationNumber}
                        </span>
                      </div>
                      <StatusBadge status={bus.operationalStatus} size="sm" />
                    </div>

                    <p className="text-xs font-semibold text-slate-800">
                      {rt ? `${rt.code} — ${rt.name}` : 'Route'}
                    </p>

                    <div className="mt-2 text-xs flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{drv?.name}</span>
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        {bus.speedKmh} km/h • {bus.lastLocationUpdate}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
                      <span className="truncate">Next: <strong>{bus.nextStopName}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standby / Other Runs */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Standby & Completed Buses
            </h2>

            <div className="space-y-2">
              {otherTrips.map((bus) => {
                const rt = routes.find((r) => r.id === bus.assignedRouteId);
                const isSelected = bus.id === activeBusId;

                return (
                  <div
                    key={bus.id}
                    onClick={() => setActiveBusId(bus.id)}
                    className={`p-2.5 rounded border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-slate-100 border-slate-400' : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{bus.fleetNumber}</span>
                        <span className="text-xs text-slate-400 font-mono">{bus.registrationNumber}</span>
                      </div>
                      <div className="text-xs text-slate-500">{rt?.name}</div>
                    </div>
                    <StatusBadge status={bus.operationalStatus} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Live Map & Info (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">
                    {selectedBus.fleetNumber}
                  </span>
                  <StatusBadge status={selectedBus.operationalStatus} size="sm" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Route: <strong className="text-slate-800">{selectedRoute.name} ({selectedRoute.code})</strong>
                </p>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Updated: <strong className="text-slate-700">{selectedBus.lastGpsTimestamp}</strong>
              </div>
            </div>

            <LiveTransitMap
              bus={selectedBus}
              route={selectedRoute}
              heightClass="h-[380px]"
              interactive={true}
            />

            {/* Quick Trip Stats Strip */}
            <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-xs block">Driver</span>
                <span className="font-bold text-slate-900">{selectedDriver?.name || 'Unassigned'}</span>
                <span className="text-slate-400 text-xs block font-mono">{selectedDriver?.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Next Stop</span>
                <span className="font-bold text-slate-900 truncate block">{selectedBus.nextStopName}</span>
                <span className="text-slate-400 text-xs block">Stop #{selectedBus.currentStopIndex + 1}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Current Speed</span>
                <span className="font-bold text-slate-900">{selectedBus.speedKmh} km/h</span>
                <span className="text-slate-400 text-xs block">Live update</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
