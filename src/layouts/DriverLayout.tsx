import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { useTransportation } from '../context/TransportationContext';
import { Navigation, ListOrdered, User, PhoneCall, Bus } from 'lucide-react';

export const DriverLayout: React.FC = () => {
  const { currentDriver, buses, driverTripState } = useTransportation();
  const assignedBus = buses.find((b) => b.id === currentDriver.assignedBusId) || buses[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center">
      {/* Top Prototype Utility Bar */}
      <div className="w-full">
        <RoleSwitcher />
      </div>

      {/* Mobile Shell Frame */}
      <div className="w-full max-w-md bg-white min-h-[calc(100vh-41px)] flex flex-col shadow-sm border-x border-slate-200">
        {/* Mobile Top Bar (Color Treatment: Light Cool Grey #F3F6F8 & Dark Navy #17324D) */}
        <header className="bg-[#F3F6F8] border-b border-slate-200 p-3.5 sticky top-[41px] z-30 flex items-center justify-between text-[#17324D]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0F766E] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#17324D] tracking-tight">
                  {assignedBus.fleetNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white text-[#17324D] font-mono font-medium border border-slate-200 shadow-2xs">
                  {assignedBus.registrationNumber}
                </span>
              </div>
              <p className="text-xs text-[#17324D]/80 font-medium">{currentDriver.name} • {currentDriver.employeeId}</p>
            </div>
          </div>

          <a
            href="tel:108"
            onClick={(e) => {
              e.preventDefault();
              alert("Calling Oakridge Transport Control Desk...");
            }}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            title="Emergency Control Desk"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-700" />
            <span>SOS Desk</span>
          </a>
        </header>

        {/* Dynamic Mobile Viewport Content */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto bg-white">
          <Outlet />
        </main>

        {/* Bottom Mobile Navigation Bar (Color Treatment: Light Cool Grey #F3F6F8 & Dark Navy #17324D, Active: Teal #0F766E) */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#F3F6F8] border-t border-slate-200 py-1.5 px-3 flex items-center justify-around z-40 shadow-md">
          <NavLink
            to="/driver"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'text-[#0F766E] font-bold bg-white shadow-2xs border border-slate-200/80'
                  : 'text-[#17324D]/70 hover:text-[#17324D]'
              }`
            }
          >
            <Navigation className="w-5 h-5 mb-1 text-[#0F766E]" />
            <span>Trip Console</span>
            {driverTripState === 'active_trip' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />
            )}
          </NavLink>

          <NavLink
            to="/driver/stops"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'text-[#0F766E] font-bold bg-white shadow-2xs border border-slate-200/80'
                  : 'text-[#17324D]/70 hover:text-[#17324D]'
              }`
            }
          >
            <ListOrdered className="w-5 h-5 mb-1" />
            <span>Stops</span>
          </NavLink>

          <NavLink
            to="/driver/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'text-[#0F766E] font-bold bg-white shadow-2xs border border-slate-200/80'
                  : 'text-[#17324D]/70 hover:text-[#17324D]'
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
