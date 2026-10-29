import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { useTransportation } from '../context/TransportationContext';
import { MapPin, Compass, Bell, User, HeartHandshake } from 'lucide-react';

export const ParentLayout: React.FC = () => {
  const { parentStudent, parentAssignedBus, alerts } = useTransportation();

  const childAlerts = alerts.filter(
    (a) => a.busId === parentAssignedBus.id && (a.stopId === parentStudent.pickupStopId || !a.stopId)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center">
      {/* Top Prototype Utility Bar */}
      <div className="w-full">
        <RoleSwitcher />
      </div>

      {/* Reassuring Mobile Phone Shell (Strict White Theme) */}
      <div className="w-full max-w-md bg-white min-h-[calc(100vh-41px)] flex flex-col shadow-sm border-x border-slate-200">
        {/* Parent Header Bar (Strict White Theme) */}
        <header className="bg-white text-slate-900 p-3.5 sticky top-[41px] z-30 flex items-center justify-between border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold uppercase tracking-wide">
              <HeartHandshake className="w-4 h-4 text-teal-700" />
              <span>Parent SafeTransit</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight mt-0.5">
              {parentStudent.name}
            </h1>
            <p className="text-xs text-slate-500">
              {parentStudent.grade} • Roll {parentStudent.rollNumber}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Assigned Bus</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              {parentAssignedBus.fleetNumber}
            </span>
          </div>
        </header>

        {/* Dynamic Mobile Viewport Content */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto bg-white">
          <Outlet />
        </main>

        {/* Bottom Reassuring Mobile Tab Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 py-1.5 px-3 flex items-center justify-around z-40 shadow-md">
          <NavLink
            to="/parent"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'text-teal-800 font-bold bg-teal-50'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <MapPin className="w-5 h-5 mb-1 text-teal-700" />
            <span>Live Bus</span>
          </NavLink>

          <NavLink
            to="/parent/explore"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'text-teal-800 font-bold bg-teal-50'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Compass className="w-5 h-5 mb-1" />
            <span>All Routes</span>
          </NavLink>

          <NavLink
            to="/parent/notifications"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex-1 relative ${
                isActive
                  ? 'text-teal-800 font-bold bg-teal-50'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <div className="relative">
              <Bell className="w-5 h-5 mb-1" />
              {childAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
              )}
            </div>
            <span>Alerts</span>
          </NavLink>

          <NavLink
            to="/parent/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'text-teal-800 font-bold bg-teal-50'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <User className="w-5 h-5 mb-1" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
