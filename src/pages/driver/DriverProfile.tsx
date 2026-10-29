import React from 'react';
import { useTransportation } from '../../context/TransportationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Bus,
  Clock,
  Settings,
  HelpCircle,
} from 'lucide-react';

export const DriverProfile: React.FC = () => {
  const { currentDriver, buses } = useTransportation();
  const assignedBus = buses.find((b) => b.id === currentDriver.assignedBusId) || buses[0];

  return (
    <div className="space-y-4">
      {/* Driver Identity Card (Strict White Theme) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-slate-900">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold text-base flex items-center justify-center">
            RV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{currentDriver.name}</h1>
              <StatusBadge status={currentDriver.dutyStatus} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              ID: {currentDriver.employeeId}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-xs">Phone</span>
            <span className="font-bold text-slate-900">{currentDriver.phone}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-xs">License</span>
            <span className="font-mono text-slate-900 text-xs">{currentDriver.licenseNumber}</span>
          </div>
        </div>
      </div>

      {/* Vehicle & Shift Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-slate-900 space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Bus Assignment
        </h2>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-teal-700" />
              <span>Assigned Bus:</span>
            </span>
            <span className="font-bold text-slate-900">
              {assignedBus.fleetNumber} ({assignedBus.registrationNumber})
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-700" />
              <span>Shift:</span>
            </span>
            <span className="text-slate-800 font-medium">{currentDriver.shift}</span>
          </div>
        </div>
      </div>

      {/* Settings & Support */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs text-xs space-y-1">
        <button
          onClick={() => alert("Notification chime test sounded.")}
          className="w-full p-2.5 text-left text-slate-700 hover:bg-slate-50 rounded-md flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Test Sound Alert on Stop Arrival</span>
          </span>
          <span className="text-teal-700 font-semibold">Test</span>
        </button>

        <button
          onClick={() => alert("Connecting to Oakridge Transportation Support...")}
          className="w-full p-2.5 text-left text-slate-700 hover:bg-slate-50 rounded-md flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>School Transport Desk</span>
          </span>
          <span className="text-slate-500">Contact</span>
        </button>
      </div>
    </div>
  );
};
