import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransportation } from '../../context/TransportationContext';
import { LiveTransitMap } from '../../components/map/LiveTransitMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Bus,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { buses, routes, drivers, alerts, acknowledgeAlert } = useTransportation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-01');

  // Metrics calculation
  const totalBuses = buses.length;
  const onTrips = buses.filter((b) => b.operationalStatus === 'in_transit').length;
  const idleOrStopped = buses.filter(
    (b) => b.operationalStatus === 'stopped' || b.operationalStatus === 'not_started'
  ).length;
  const staleOrOffline = buses.filter(
    (b) => b.operationalStatus === 'stale_gps' || b.operationalStatus === 'offline'
  ).length;

  // Selected bus for map
  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];
  const activeRoute = routes.find((r) => r.id === activeBus.assignedRouteId) || routes[0];

  // Filtered fleet table
  const filteredBuses = buses.filter((bus) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'in_transit'
        ? bus.operationalStatus === 'in_transit'
        : statusFilter === 'issues'
        ? bus.operationalStatus === 'stale_gps' || bus.operationalStatus === 'offline'
        : bus.operationalStatus === statusFilter;

    const matchesSearch =
      bus.fleetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.currentLocationName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Fleet Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time tracking and route status for Oakridge South Campus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/stops')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Stop</span>
          </button>
        </div>
      </div>

      {/* Fleet Overview Metrics (Compact, purposeful, white theme) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Fleet</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalBuses}</span>
            <span className="text-xs text-slate-500">buses registered</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 border-t border-slate-100 pt-1.5">
            Morning shifts assigned
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>In Transit</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-800">{onTrips}</span>
            <span className="text-xs text-emerald-700 font-medium">on active trips</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 border-t border-slate-100 pt-1.5">
            Avg speed 34 km/h
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Stopped / Waiting</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{idleOrStopped}</span>
            <span className="text-xs text-slate-500">at stop or depot</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 border-t border-slate-100 pt-1.5">
            Scheduled on time
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>Needs Attention</span>
            {staleOrOffline > 0 && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-800">{staleOrOffline}</span>
            <span className="text-xs text-amber-700 font-medium">stale or offline</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 border-t border-slate-100 pt-1.5">
            Signal check required
          </div>
        </div>
      </div>

      {/* Meaningful Fleet Map Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Live Bus Location
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing route corridor: <strong className="text-slate-800">{activeRoute.name} ({activeRoute.code})</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="bus-select" className="text-xs text-slate-600 font-medium">Select Bus:</label>
            <select
              id="bus-select"
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-teal-700"
            >
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.fleetNumber} ({b.registrationNumber}) — {b.operationalStatus}
                </option>
              ))}
            </select>
          </div>
        </div>

        <LiveTransitMap
          bus={activeBus}
          route={activeRoute}
          heightClass="h-[360px]"
          interactive={true}
        />
      </div>

      {/* Clear Bus Table & Recent Alerts (Side by side on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bus Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Fleet Status List
              </h2>
              <p className="text-xs text-slate-500">
                Current location and status of school buses
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search bus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-700 w-36 sm:w-44"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-md border border-slate-300 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-700"
              >
                <option value="all">All Statuses</option>
                <option value="in_transit">In Transit</option>
                <option value="stopped">Stopped</option>
                <option value="issues">Issues / Offline</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold">
                  <th className="py-2.5 px-4">Bus</th>
                  <th className="py-2.5 px-4">Route & Driver</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Next Stop</th>
                  <th className="py-2.5 px-4">Last Updated</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBuses.map((bus) => {
                  const busRoute = routes.find((r) => r.id === bus.assignedRouteId);
                  const busDriver = drivers.find((d) => d.id === bus.assignedDriverId);
                  const isCurrentSelected = bus.id === selectedBusId;

                  return (
                    <tr
                      key={bus.id}
                      onClick={() => setSelectedBusId(bus.id)}
                      className={`cursor-pointer transition-colors ${
                        isCurrentSelected ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{bus.fleetNumber}</div>
                        <div className="text-xs text-slate-500 font-mono">
                          {bus.registrationNumber}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {busRoute ? busRoute.name : 'Unassigned'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {busDriver ? busDriver.name : 'No Driver'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={bus.operationalStatus} size="sm" />
                      </td>

                      <td className="py-3 px-4 max-w-[180px]">
                        <div className="font-medium text-slate-800 truncate">
                          {bus.nextStopName}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {bus.lastLocationUpdate}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/buses/${bus.id}`);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded border border-teal-200 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing {filteredBuses.length} of {buses.length} buses</span>
            <span className="text-teal-700 font-medium">Click a row to show on map</span>
          </div>
        </div>

        {/* Recent Alerts Feed (1 col) */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Alerts
              </h2>
              <p className="text-xs text-slate-500">Proximity & vehicle events</p>
            </div>

            <button
              onClick={() => navigate('/admin/alerts')}
              className="text-xs text-teal-700 hover:underline font-semibold flex items-center gap-0.5"
            >
              All Alerts <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[420px]">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="py-3 first:pt-1 last:pb-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={alert.severity} size="sm" showDot={false} />
                    <span className="font-bold text-xs text-slate-900">{alert.busFleetNumber}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{alert.timestamp}</span>
                </div>

                <p className="text-xs font-medium text-slate-800 mt-1">{alert.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {alert.description}
                </p>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{alert.routeName}</span>
                  {!alert.acknowledged ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-teal-700 hover:text-teal-900 font-semibold hover:underline text-xs"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 text-center">
            Automatic proximity alerts at 500m & 300m
          </div>
        </div>
      </div>
    </div>
  );
};
