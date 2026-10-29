import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransportation } from '../../context/TransportationContext';
import { LiveTransitMap } from '../../components/map/LiveTransitMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Bus,
  ArrowLeft,
  PhoneCall,
  AlertTriangle,
} from 'lucide-react';

export const BusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { buses, routes, drivers, alerts } = useTransportation();

  const bus = buses.find((b) => b.id === id) || buses[0];
  const route = routes.find((r) => r.id === bus.assignedRouteId) || routes[0];
  const driver = drivers.find((d) => d.id === bus.assignedDriverId);
  const busAlerts = alerts.filter((a) => a.busId === bus.id);

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={() => navigate('/admin/buses')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bus List</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={bus.operationalStatus} size="md" />
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {bus.registrationNumber}
          </span>
        </div>
      </div>

      {/* Main Bus Header Dossier (White Theme, Organized) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-lg">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {bus.fleetNumber}
                </h1>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {bus.model}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span>Registration: <strong className="text-slate-700 font-mono">{bus.registrationNumber}</strong></span>
                <span>•</span>
                <span>Capacity: <strong className="text-slate-700">{bus.capacity} seats</strong></span>
                <span>•</span>
                <span>Fuel: <strong className="text-slate-700">{bus.fuelLevelPercent}%</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {driver && (
              <button
                onClick={() => {
                  alert(`Calling Driver ${driver.name} at ${driver.phone}...`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Driver ({driver.phone})</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Status Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Last Updated</span>
            <span className="font-semibold text-slate-800">{bus.lastLocationUpdate}</span>
            <span className="text-slate-400 text-[11px] block font-mono">{bus.lastGpsTimestamp}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Current Speed</span>
            <span className="font-semibold text-slate-800">{bus.speedKmh} km/h</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Current Location</span>
            <span className="font-semibold text-slate-800 truncate block" title={bus.currentLocationName}>
              {bus.currentLocationName}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Next Stop</span>
            <span className="font-semibold text-teal-800 truncate block font-medium">
              {bus.nextStopName}
            </span>
          </div>
        </div>

        {bus.staleReason && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Notice:</strong> {bus.staleReason}
            </div>
          </div>
        )}
      </div>

      {/* Main Split: Left Map, Right Route Stops & Driver Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Route Map: {route.name} ({route.code})
              </h2>
              <p className="text-xs text-slate-500">
                {route.totalDistanceKm} km total • {route.stops.length} stops
              </p>
            </div>
          </div>

          <LiveTransitMap
            bus={bus}
            route={route}
            heightClass="h-[420px]"
            interactive={true}
          />
        </div>

        {/* Right Structured Sidepanel: Ordered Stops & Driver */}
        <div className="space-y-6">
          {/* Driver Assigned Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Assigned Driver
              </h3>
              {driver && <StatusBadge status={driver.dutyStatus} size="sm" />}
            </div>

            {driver ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{driver.name}</span>
                  <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                    {driver.employeeId}
                  </span>
                </div>
                <div className="text-slate-600">
                  <span className="text-slate-400 block text-[11px]">Phone:</span>
                  <strong className="text-slate-800 text-sm">{driver.phone}</strong>
                </div>
                <div className="text-slate-600">
                  <span className="text-slate-400 block text-[11px]">License:</span>
                  <span className="font-mono">{driver.licenseNumber}</span>
                </div>
                <div className="text-slate-600">
                  <span className="text-slate-400 block text-[11px]">Shift:</span>
                  <span>{driver.shift}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">No driver assigned.</div>
            )}
          </div>

          {/* Ordered Stop Timeline */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Stops Sequence
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {route.stops.length} Stops
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
              {route.stops.map((stop, idx) => {
                const isPast = stop.status === 'departed';
                const isCurrent = stop.status === 'approaching' || stop.status === 'arrived';

                return (
                  <div key={stop.id} className="flex items-start gap-2.5 text-xs">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isPast
                            ? 'bg-slate-200 text-slate-600'
                            : isCurrent
                            ? 'bg-teal-700 text-white'
                            : 'bg-white text-slate-700 border border-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      {idx < route.stops.length - 1 && (
                        <div className="w-0.5 h-6 my-0.5 bg-slate-200" />
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-baseline justify-between">
                        <span className={`font-semibold ${isCurrent ? 'text-teal-900 font-bold' : 'text-slate-800'}`}>
                          {stop.name}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{stop.scheduledTime}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{stop.address}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs">
                        <span className="text-teal-700 font-medium">{stop.studentCount} students</span>
                        <span>•</span>
                        <span className="capitalize text-slate-500">{stop.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Relevant Alerts for this Bus */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Recent Alerts for this Bus ({busAlerts.length})</span>
        </h2>

        {busAlerts.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {busAlerts.map((alt) => (
              <div key={alt.id} className="py-2.5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={alt.severity} size="sm" showDot={false} />
                    <span className="font-semibold text-slate-900">{alt.title}</span>
                    <span className="text-xs font-mono text-slate-400">({alt.timestamp})</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alt.description}</p>
                </div>
                <span className="text-xs text-slate-500 shrink-0">
                  {alt.acknowledged ? 'Acknowledged' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded">
            No active alerts recorded for this bus.
          </div>
        )}
      </div>
    </div>
  );
};
