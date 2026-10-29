import React, { useState } from 'react';
import { useTransportation } from '../../context/TransportationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users2,
  Search,
  Plus,
  Phone,
  Bus,
  Edit2,
  CheckCircle2,
  X,
  PhoneCall,
} from 'lucide-react';

export const DriverManagement: React.FC = () => {
  const { drivers, buses, routes, addDriver } = useTransportation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Driver Form State
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [assignedBusId, setAssignedBusId] = useState(buses[0]?.id || 'bus-01');

  const filteredDrivers = drivers.filter((d) => {
    return (
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm)
    );
  });

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const selectedBus = buses.find((b) => b.id === assignedBusId);

    addDriver({
      name,
      employeeId: employeeId || `DRV-${Math.floor(Math.random() * 900 + 100)}`,
      phone,
      licenseNumber: licenseNumber || 'KA-01-2023-99999',
      assignedBusId,
      assignedRouteId: selectedBus ? selectedBus.assignedRouteId : 'route-04',
      dutyStatus: 'on_duty',
      rating: 4.9,
    });

    setShowAddModal(false);
    setName('');
    setEmployeeId('');
    setPhone('');
    setLicenseNumber('');
    setFeedbackMsg(`Driver profile for ${name} added.`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users2 className="w-5 h-5 text-teal-700" />
            <span>Driver Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            School bus drivers directory, assigned vehicles, and contact details
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Driver</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search driver by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Active Drivers: <strong className="text-slate-900">{drivers.length}</strong>
        </span>
      </div>

      {/* Driver Records Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold">
                <th className="py-3 px-4">Driver Name & ID</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Assigned Bus</th>
                <th className="py-3 px-4">Assigned Route</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrivers.map((driver) => {
                const bus = buses.find((b) => b.id === driver.assignedBusId);
                const route = routes.find((r) => r.id === driver.assignedRouteId);

                return (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{driver.name}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {driver.employeeId}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{driver.phone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {bus ? (
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <Bus className="w-3.5 h-3.5 text-teal-700" />
                          <span>{bus.fleetNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {route ? (
                        <div>
                          <span className="font-medium text-slate-900">{route.code}</span>
                          <span className="text-xs text-slate-500 block truncate max-w-[170px]">
                            {route.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={driver.dutyStatus} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {driver.shift}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            alert(`Calling ${driver.name} at ${driver.phone}...`);
                          }}
                          className="p-1.5 text-teal-700 hover:bg-teal-50 rounded border border-teal-200"
                          title="Call Driver"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            alert(`Editing driver details for ${driver.name}.`);
                          }}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded border border-slate-200"
                          title="Edit Driver"
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
          <span>{filteredDrivers.length} drivers listed</span>
          <span>Shift schedules updated daily</span>
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users2 className="w-4 h-4 text-teal-700" />
                <span>Add Driver</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="DRV-820"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Driver License Number
                </label>
                <input
                  type="text"
                  placeholder="KA-04-2019-001293"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Bus
                </label>
                <select
                  value={assignedBusId}
                  onChange={(e) => setAssignedBusId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.fleetNumber} ({b.registrationNumber})
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
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
