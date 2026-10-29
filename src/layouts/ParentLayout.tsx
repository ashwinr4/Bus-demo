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

      {/* Reassuring Mobile Phone Shell */}
      <div className="w-full max-w-md bg-white min-h-[calc(100vh-41px)] flex flex-col shadow-sm border-x border-slate-200">
        {/* Parent Top Navigation Bar (Color Treatment: Deep Navy #17324D) */}
        <header className="bg-[#17324D] text-white p-3.5 sticky top-[41px] z-30 flex items-center justify-between border-b border-[#12273d]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold uppercase tracking-wide">
              <HeartHandshake className="w-4 h-4 text-teal-300" />
              <span>Parent SafeTransit</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight mt-0.5">
              {parentStudent.name}
            </h1>
            <p className="text-xs text-slate-300">
              {parentStudent.grade} • Roll {parentStudent.rollNumber}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-300 block uppercase tracking-wider">Assigned Bus</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#0F766E] text-white text-xs font-bold border border-teal-500/30 shadow-2xs">
              {parentAssignedBus.fleetNumber}
            </span>
          </div>
        </header>

        {/* Dynamic Mobile Viewport Content */}
        <main className="flex-1 p-4 pb-32 overflow-y-auto bg-white">
          <Outlet />
        </main>

        {/* Bottom Mobile Tab Navigation (Color Treatment: Deep Navy #17324D, Active: Teal #0F766E) */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#17324D] border-t border-[#12273d] py-1.5 px-3 flex items-center justify-around z-50 shadow-lg">
          <NavLink
            to="/parent"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'bg-[#0F766E] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <MapPin className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>Live Bus</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/parent/explore"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'bg-[#0F766E] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Compass className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>All Routes</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/parent/notifications"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex-1 relative ${
                isActive
                  ? 'bg-[#0F766E] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Bell className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  {childAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#17324D]" />
                  )}
                </div>
                <span>Alerts</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/parent/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'bg-[#0F766E] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <User className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>Profile</span>
              </>
            )}
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
