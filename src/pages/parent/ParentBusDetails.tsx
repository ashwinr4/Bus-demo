import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransportation } from '../../context/TransportationContext';
import { LiveTransitMap } from '../../components/map/LiveTransitMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';

export const ParentBusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    buses,
    routes,
    parentAssignedBus,
    parentStudent,
    setParentSelectedBusId,
  } = useTransportation();

  const selectedBus = buses.find((b) => b.id === id) || buses[0];
  const selectedRoute = routes.find((r) => r.id === selectedBus.assignedRouteId) || routes[0];
  const isAssignedBus = selectedBus.id === parentAssignedBus.id;

  const handleReturnToAssigned = () => {
    setParentSelectedBusId(parentAssignedBus.id);
    navigate('/parent');
  };

  return (
    <div className="space-y-4">
      {/* Top Navigation & Return to Assigned Bus Banner */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/parent/explore')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Routes</span>
        </button>

        {!isAssignedBus && (
          <button
            onClick={handleReturnToAssigned}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-300 rounded text-xs font-bold hover:bg-teal-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Back to {parentAssignedBus.fleetNumber}</span>
          </button>
        )}
      </div>

      {/* Alternative Bus Alert Notice */}
      {!isAssignedBus && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-sky-950 text-xs flex items-center justify-between">
          <span>Viewing route: <strong>{selectedRoute.name}</strong></span>
          <button
            onClick={handleReturnToAssigned}
            className="text-sky-800 underline font-bold text-xs"
          >
            Switch to My Bus
          </button>
        </div>
      )}

      {/* Bus Header Dossier (Strict White Theme) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                {selectedRoute.code}
              </span>
              {isAssignedBus ? (
                <span className="text-[10px] bg-teal-700 text-white font-bold px-1.5 py-0.2 rounded">
                  Assigned Bus
                </span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.2 rounded">
                  Alternate Route
                </span>
              )}
            </div>

            <h1 className="text-lg font-bold text-slate-900 mt-1">
              {selectedBus.fleetNumber}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              {selectedBus.registrationNumber} • {selectedBus.model}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <StatusBadge status={selectedBus.operationalStatus} size="sm" />
            <span className="text-xs text-slate-400 mt-1">
              {selectedBus.lastLocationUpdate}
            </span>
          </div>
        </div>

        {/* Status Strip */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-xs">Next Stop</span>
            <span className="font-bold text-slate-800 truncate block">{selectedBus.nextStopName}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-xs">Current Speed</span>
            <span className="font-bold text-slate-800">{selectedBus.speedKmh} km/h</span>
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-bold text-slate-800">
            Route: {selectedRoute.name}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {selectedRoute.totalDistanceKm} km
          </span>
        </div>
        <LiveTransitMap
          bus={selectedBus}
          route={selectedRoute}
          highlightStopId={isAssignedBus ? parentStudent.pickupStopId : undefined}
          heightClass="h-[270px]"
          interactive={true}
        />
      </div>

      {/* Ordered Stops */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
          Stops ({selectedRoute.stops.length})
        </h2>

        <div className="space-y-2.5">
          {selectedRoute.stops.map((stop, idx) => {
            const isDeparted = stop.status === 'departed';

            return (
              <div
                key={stop.id}
                className="p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isDeparted ? 'bg-slate-200 text-slate-600' : 'bg-teal-700 text-white'
                    }`}
                  >
                    {isDeparted ? '✓' : idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{stop.name}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[190px]">
                      {stop.address}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-800">{stop.scheduledTime}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{stop.status}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
