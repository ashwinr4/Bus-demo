import React from 'react';
import { useTransportation } from '../../context/TransportationContext';
import {
  GraduationCap,
} from 'lucide-react';

export const ParentProfile: React.FC = () => {
  const { currentParent, parentStudent, parentAssignedBus, parentAssignedRoute } = useTransportation();

  const designatedStop = parentAssignedRoute.stops.find(
    (s) => s.id === parentStudent.pickupStopId
  );

  return (
    <div className="space-y-4">
      {/* Guardian Profile Dossier (Strict White Theme) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold text-base flex items-center justify-center">
            PR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">{currentParent.name}</h1>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                {currentParent.relationship}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentParent.email}</p>
            <p className="text-xs font-mono text-slate-700 font-medium">{currentParent.phone}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400 block text-xs">Address</span>
          <p className="text-slate-700 mt-0.5 leading-snug">{currentParent.address}</p>
        </div>
      </div>

      {/* Linked Child Profile */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-teal-700" />
            <span>Enrolled Student</span>
          </h2>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded">
            Roll: {parentStudent.rollNumber}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500">Name:</span>
            <span className="font-bold text-slate-900">{parentStudent.name}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500">Grade / Class:</span>
            <span className="font-semibold text-slate-800">{parentStudent.grade}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500">Blood Group:</span>
            <span className="font-mono font-bold text-slate-900">{parentStudent.bloodGroup}</span>
          </div>
        </div>
      </div>

      {/* Assigned Transit Carrier & Stop */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          Bus & Stop Assignment
        </h2>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Assigned Bus:</span>
              <span className="font-bold text-slate-900">{parentAssignedBus.fleetNumber}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-mono">
              {parentAssignedBus.registrationNumber} • {parentAssignedBus.model}
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Route:</span>
              <span className="font-semibold text-slate-900">{parentAssignedRoute.name}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-mono">
              {parentAssignedRoute.code} ({parentAssignedRoute.stops.length} stops)
            </div>
          </div>

          <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between text-amber-900 font-semibold">
              <span>Designated Stop:</span>
              <span className="font-mono text-amber-900 font-bold">{designatedStop?.scheduledTime}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              {designatedStop?.name}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {designatedStop?.address}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Alert Preferences
        </h2>

        <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
          <span className="text-slate-700">500m Approach Notification</span>
          <input
            type="checkbox"
            defaultChecked
            className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
          <span className="text-slate-700">300m Arrival Alert</span>
          <input
            type="checkbox"
            defaultChecked
            className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
          <span className="text-slate-700">Trip Departure & Arrival Status</span>
          <input
            type="checkbox"
            defaultChecked
            className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
          />
        </label>
      </div>
    </div>
  );
};
