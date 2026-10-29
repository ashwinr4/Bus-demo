import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransportation } from '../../context/TransportationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Compass,
  Search,
  ArrowRight,
} from 'lucide-react';

export const ParentExploreBuses: React.FC = () => {
  const navigate = useNavigate();
  const { buses, routes, setParentSelectedBusId, parentAssignedBus } = useTransportation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBuses = buses.filter((bus) => {
    const rt = routes.find((r) => r.id === bus.assignedRouteId);
    const matchesSearch =
      bus.fleetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rt && rt.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rt && rt.code.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleSelectBus = (busId: string) => {
    setParentSelectedBusId(busId);
    navigate(`/parent/buses/${busId}`);
  };

  return (
    <div className="space-y-4">
      {/* Header (Strict White Theme) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              School Bus Routes
            </h1>
            <p className="text-xs text-slate-500">
              Check other authorized routes for Oakridge South Campus
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search bus number or route name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-700 shadow-xs"
        />
      </div>

      {/* Buses List */}
      <div className="space-y-2.5">
        {filteredBuses.map((bus) => {
          const rt = routes.find((r) => r.id === bus.assignedRouteId);
          const isAssigned = bus.id === parentAssignedBus.id;

          return (
            <div
              key={bus.id}
              onClick={() => handleSelectBus(bus.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isAssigned
                  ? 'bg-teal-50/50 border-teal-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {bus.fleetNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {bus.registrationNumber}
                    </span>
                    {isAssigned && (
                      <span className="text-[10px] bg-teal-700 text-white font-bold px-1.5 py-0.2 rounded">
                        Your Bus
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold text-slate-800 mt-1">
                    {rt ? `${rt.code} — ${rt.name}` : 'Unassigned'}
                  </h3>
                </div>

                <StatusBadge status={bus.operationalStatus} size="sm" />
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-xs">
                  Updated: <strong className="text-slate-700 font-medium">{bus.lastLocationUpdate}</strong>
                </span>

                <span className="text-teal-700 font-bold text-xs flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
