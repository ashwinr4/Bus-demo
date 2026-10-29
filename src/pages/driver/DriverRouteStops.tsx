import React from 'react';
import { useTransportation } from '../../context/TransportationContext';
import { LiveTransitMap } from '../../components/map/LiveTransitMap';
import { Navigation, Users } from 'lucide-react';

export const DriverRouteStops: React.FC = () => {
  const { currentDriver, buses, routes } = useTransportation();
  const assignedBus = buses.find((b) => b.id === currentDriver.assignedBusId) || buses[0];
  const assignedRoute = routes.find((r) => r.id === assignedBus.assignedRouteId) || routes[0];

  return (
    <div className="space-y-4">
      {/* Route Header Banner (Strict White Theme) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-900 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {assignedRoute.code}
          </span>
          <span className="text-slate-500">
            {assignedRoute.totalDistanceKm} km • {assignedRoute.stops.length} Stops
          </span>
        </div>

        <h1 className="text-lg font-bold text-slate-900 mt-1">
          {assignedRoute.name}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Morning Route Stops
        </p>
      </div>

      {/* Overview Map */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-teal-700" />
            <span>Route Stops Overview</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {assignedBus.fleetNumber}
          </span>
        </div>
        <LiveTransitMap
          bus={assignedBus}
          route={assignedRoute}
          heightClass="h-[210px]"
          interactive={false}
        />
      </div>

      {/* Ordered Stops List */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs text-slate-900">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Ordered Stops List
        </h2>

        <div className="space-y-2.5">
          {assignedRoute.stops.map((stop, idx) => {
            const isDeparted = stop.status === 'departed';
            const isApproaching = stop.status === 'approaching';

            return (
              <div
                key={stop.id}
                className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                  isApproaching
                    ? 'bg-teal-50 border-teal-500 shadow-xs'
                    : isDeparted
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Step Number */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isApproaching
                      ? 'bg-teal-700 text-white'
                      : isDeparted
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {isDeparted ? '✓' : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className={`font-bold text-sm ${isApproaching ? 'text-teal-900' : 'text-slate-900'}`}>
                      {stop.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-700 shrink-0">
                      {stop.scheduledTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {stop.address}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{stop.studentCount} students</span>
                    </span>
                    <span
                      className={`font-semibold capitalize text-xs px-2 py-0.5 rounded ${
                        isApproaching
                          ? 'bg-amber-100 text-amber-800'
                          : isDeparted
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {stop.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
