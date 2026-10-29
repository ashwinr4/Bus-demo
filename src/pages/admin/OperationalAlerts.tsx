import React, { useState } from 'react';
import { useTransportation } from '../../context/TransportationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Bell,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const OperationalAlerts: React.FC = () => {
  const { alerts, acknowledgeAlert } = useTransportation();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredAlerts = alerts.filter((alt) => {
    const matchesSeverity = severityFilter === 'all' || alt.severity === severityFilter;
    const matchesType = typeFilter === 'all' || alt.type === typeFilter;
    return matchesSeverity && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-700" />
            <span>Operational Alerts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Approaching stops (500m & 300m), GPS updates, and trip milestones
          </p>
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-2">
          <span>Active Notices: </span>
          <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            {alerts.filter((a) => !a.acknowledged).length} Pending
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Severity:
          </span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-md bg-white text-slate-800 font-medium"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Notice</option>
            <option value="info">Info</option>
          </select>

          <span className="font-semibold text-slate-700 ml-2">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-md bg-white text-slate-800 font-medium"
          >
            <option value="all">All Types</option>
            <option value="approaching_300m">Approaching Stop (300m)</option>
            <option value="approaching_500m">Approaching Stop (500m)</option>
            <option value="stale_gps">Stale GPS</option>
            <option value="offline">Offline</option>
            <option value="trip_started">Trip Started</option>
            <option value="trip_completed">Trip Completed</option>
          </select>
        </div>

        <div className="text-slate-500 text-xs">
          {filteredAlerts.length} alerts listed
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Bus</th>
                <th className="py-3 px-4">Route / Stop</th>
                <th className="py-3 px-4">Alert Event</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map((alt) => (
                <tr
                  key={alt.id}
                  className={`transition-colors ${
                    !alt.acknowledged ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 text-slate-600 font-mono text-xs whitespace-nowrap">
                    {alt.timestamp}
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={alt.severity} size="sm" showDot={false} />
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {alt.busFleetNumber}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{alt.routeName}</div>
                    {alt.stopName && (
                      <div className="text-xs text-teal-700 mt-0.5">
                        Stop: {alt.stopName}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 max-w-md">
                    <div className="font-semibold text-slate-900">{alt.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {alt.description}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {!alt.acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alt.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>Operational notifications update automatically</span>
          <span>Geofence radius: 500m & 300m</span>
        </div>
      </div>
    </div>
  );
};
