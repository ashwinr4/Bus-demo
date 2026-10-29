import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransportation } from '../../context/TransportationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Bus,
  Search,
  Plus,
  Filter,
  Edit2,
  Eye,
  CheckCircle2,
  X,
} from 'lucide-react';

export const BusManagement: React.FC = () => {
  const navigate = useNavigate();
  const { buses, routes, drivers, addBus } = useTransportation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Bus Form State
  const [fleetNumber, setFleetNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [model, setModel] = useState('Tata Starbus Ultra 34S');
  const [capacity, setCapacity] = useState('34');
  const [assignedRouteId, setAssignedRouteId] = useState(routes[0]?.id || 'route-04');
  const [assignedDriverId, setAssignedDriverId] = useState(drivers[0]?.id || 'drv-804');

  const filteredBuses = buses.filter((b) => {
    const matchesSearch =
      b.fleetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.operationalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fleetNumber || !registrationNumber) return;

    addBus({
      fleetNumber,
      registrationNumber,
      model,
      capacity: parseInt(capacity, 10) || 32,
      assignedRouteId,
      assignedDriverId,
    });

    setShowAddModal(false);
    setFleetNumber('');
    setRegistrationNumber('');
    setFeedbackMsg(`Bus ${fleetNumber} added to school fleet.`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="w-5 h-5 text-teal-700" />
            <span>Bus Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            School bus fleet directory, route assignments, and operational status
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bus</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by bus number, plate, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-md border border-slate-300 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-700"
          >
            <option value="all">All ({buses.length})</option>
            <option value="in_transit">In Transit</option>
            <option value="stopped">Stopped</option>
            <option value="not_started">Not Started</option>
            <option value="stale_gps">Stale GPS</option>
            <option value="offline">Offline</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Buses Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold">
                <th className="py-3 px-4">Bus</th>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBuses.map((bus) => {
                const route = routes.find((r) => r.id === bus.assignedRouteId);
                const driver = drivers.find((d) => d.id === bus.assignedDriverId);

                return (
                  <tr
                    key={bus.id}
                    onClick={() => navigate(`/admin/buses/${bus.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Bus className="w-3.5 h-3.5 text-teal-700" />
                        <span>{bus.fleetNumber}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {bus.model} ({bus.capacity} seats)
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      {bus.registrationNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">
                        {route ? `${route.code} — ${route.name}` : 'Unassigned'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">
                        {driver ? driver.name : 'Unassigned'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={bus.operationalStatus} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      <div>{bus.lastLocationUpdate}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{bus.lastGpsTimestamp}</div>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/buses/${bus.id}`)}
                          className="p-1.5 text-slate-600 hover:text-teal-800 hover:bg-slate-100 rounded border border-slate-200"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            alert(`Editing bus specifications for ${bus.fleetNumber}.`);
                          }}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200"
                          title="Edit Bus"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>{filteredBuses.length} buses found</span>
          <span>Click on any row to open bus details</span>
        </div>
      </div>

      {/* Add Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bus className="w-4 h-4 text-teal-700" />
                <span>Add New Bus</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBus} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bus ID (e.g. BUS-18)
                </label>
                <input
                  type="text"
                  required
                  placeholder="BUS-18"
                  value={fleetNumber}
                  onChange={(e) => setFleetNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="KA-01-EF-4099"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Route
                </label>
                <select
                  value={assignedRouteId}
                  onChange={(e) => setAssignedRouteId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} — {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Driver
                </label>
                <select
                  value={assignedDriverId}
                  onChange={(e) => setAssignedDriverId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded font-semibold"
                >
                  Save Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
