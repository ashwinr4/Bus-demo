import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransportation } from '../../context/TransportationContext';
import { LiveTransitMap } from '../../components/map/LiveTransitMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  MapPin,
  ChevronRight,
  Bell,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    parentStudent,
    parentAssignedBus,
    parentAssignedRoute,
    alerts,
  } = useTransportation();

  // Find child's pickup stop
  const childPickupStop =
    parentAssignedRoute.stops.find((s) => s.id === parentStudent.pickupStopId) ||
    parentAssignedRoute.stops[2];

  // Specific approach alert for child's bus
  const activeApproachAlert = alerts.find(
    (a) =>
      a.busId === parentAssignedBus.id &&
      (a.type === 'approaching_300m' || a.type === 'approaching_500m')
  );

  return (
    <div className="space-y-4">
      {/* Approach Alert Notice */}
      {activeApproachAlert && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-slate-900 flex items-start gap-2.5 shadow-xs">
          <Bell className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-900">
                {activeApproachAlert.title}
              </span>
              <span className="text-[11px] font-mono text-amber-700">{activeApproachAlert.timestamp}</span>
            </div>
            <p className="text-xs text-amber-900 mt-0.5">
              {activeApproachAlert.description}
            </p>
          </div>
        </div>
      )}

      {/* Main Bus Status Card (Answering parent's key questions immediately) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Assigned Bus
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              {parentAssignedBus.fleetNumber}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              {parentAssignedRoute.name} ({parentAssignedRoute.code})
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <StatusBadge status={parentAssignedBus.operationalStatus} size="sm" />
            <span className="text-[11px] text-slate-400 mt-1">
              Updated {parentAssignedBus.lastLocationUpdate}
            </span>
          </div>
        </div>

        {/* Child Stop ETA Callout */}
        <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-teal-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span>{parentStudent.name}'s Stop</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {childPickupStop?.name}
            </div>
          </div>

          <div className="text-right pl-2">
            <span className="text-[11px] text-teal-800 block">Est. Arrival</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {childPickupStop?.eta || '07:27 AM'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Map with Child Stop Highlighted */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
            <span>Bus Location</span>
          </div>
          <span className="text-xs text-slate-500">
            Speed: <strong className="text-slate-800">{parentAssignedBus.speedKmh} km/h</strong>
          </span>
        </div>

        <LiveTransitMap
          bus={parentAssignedBus}
          route={parentAssignedRoute}
          highlightStopId={childPickupStop?.id}
          heightClass="h-[270px]"
          interactive={true}
        />

        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between px-1">
          <span className="text-amber-800 font-medium">Gold pin shows {parentStudent.name}'s stop</span>
          <span className="font-mono text-slate-400">GPS: {parentAssignedBus.lastGpsTimestamp}</span>
        </div>
      </div>

      {/* Stops Sequence */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Route Stops
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {parentAssignedRoute.stops.length} Stops
          </span>
        </div>

        <div className="space-y-2.5">
          {parentAssignedRoute.stops.map((stop, idx) => {
            const isChildStop = stop.id === childPickupStop?.id;
            const isDeparted = stop.status === 'departed';
            const isApproaching = stop.status === 'approaching';

            return (
              <div
                key={stop.id}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  isChildStop
                    ? 'bg-amber-50/70 border-amber-300'
                    : isDeparted
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isChildStop
                        ? 'bg-amber-600 text-white'
                        : isDeparted
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-teal-700 text-white'
                    }`}
                  >
                    {isDeparted ? '✓' : idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{stop.name}</span>
                      {isChildStop && (
                        <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded">
                          Your Stop
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[190px]">
                      {stop.address}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-800">{stop.scheduledTime}</div>
                  <div
                    className={`text-[10px] font-medium capitalize ${
                      isApproaching ? 'text-teal-700' : 'text-slate-500'
                    }`}
                  >
                    {stop.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explore Other Buses CTA */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-900">
            Missed your assigned bus?
          </h3>
          <p className="text-xs text-slate-500">
            Check other authorized routes
          </p>
        </div>
        <button
          onClick={() => navigate('/parent/explore')}
          className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors shadow-xs"
        >
          <span>All Routes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
