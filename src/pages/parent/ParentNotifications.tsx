import React from 'react';
import { useTransportation } from '../../context/TransportationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Bell,
  MapPin,
  Shield,
} from 'lucide-react';

export const ParentNotifications: React.FC = () => {
  const { alerts, parentAssignedBus, parentStudent } = useTransportation();

  // Filter ONLY alerts relevant to the parent's assigned bus
  const parentAlerts = alerts.filter(
    (a) => a.busId === parentAssignedBus.id
  );

  return (
    <div className="space-y-4">
      {/* Header (Strict White Theme) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Bus Notifications
            </h1>
            <p className="text-xs text-slate-500">
              Updates for {parentStudent.name} • {parentAssignedBus.fleetNumber}
            </p>
          </div>
        </div>

        <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span>Showing alerts for your child's assigned bus and stop only.</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {parentAlerts.length > 0 ? (
          parentAlerts.map((alt) => {
            const isApproach = alt.type === 'approaching_300m' || alt.type === 'approaching_500m';

            return (
              <div
                key={alt.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isApproach
                    ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={alt.severity} size="sm" showDot={false} />
                    <span className="text-xs font-bold text-slate-900">{alt.title}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                    {alt.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {alt.description}
                </p>

                {alt.stopName && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 text-xs text-teal-800 font-medium">
                    <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
                    <span>Stop: {alt.stopName}</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No alerts for your bus at this time.
          </div>
        )}
      </div>
    </div>
  );
};
