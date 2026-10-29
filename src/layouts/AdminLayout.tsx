import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { useTransportation } from '../context/TransportationContext';
import {
  LayoutDashboard,
  Bus as BusIcon,
  Users2,
  GraduationCap,
  Route as RouteIcon,
  MapPin,
  Radio,
  Bell,
  Menu,
  X,
  Shield,
  AlertTriangle,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { buses, alerts } = useTransportation();
  const location = useLocation();

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const activeBuses = buses.filter((b) => b.operationalStatus === 'in_transit');
  const staleOrOffline = buses.filter(
    (b) => b.operationalStatus === 'stale_gps' || b.operationalStatus === 'offline'
  );

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Bus Fleet', path: '/admin/buses', icon: BusIcon },
    { label: 'Drivers', path: '/admin/drivers', icon: Users2 },
    { label: 'Parents & Students', path: '/admin/parents-students', icon: GraduationCap },
    { label: 'Routes', path: '/admin/routes', icon: RouteIcon },
    { label: 'Stop Management', path: '/admin/stops', icon: MapPin },
    { label: 'Trip Monitoring', path: '/admin/trips', icon: Radio },
    {
      label: 'Alerts',
      path: '/admin/alerts',
      icon: Bell,
      badge: unacknowledgedAlerts.length > 0 ? unacknowledgedAlerts.length : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900">
      {/* Top Prototype Utility Bar */}
      <RoleSwitcher />

      {/* Main Admin Console Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar Navigation (Color Treatment: Deep Navy #17324D) */}
        <aside className="hidden md:flex flex-col w-64 bg-[#17324D] text-white border-r border-[#12273d] shrink-0">
          {/* School Operations Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                <BusIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight leading-none">
                  NaviTrack School Transit
                </h1>
                <p className="text-xs text-[#cbd5e1] mt-1">Oakridge South Campus</p>
              </div>
            </div>

            {/* Quick Fleet Summary Pill */}
            <div className="mt-3.5 p-2 bg-[#12273d]/70 rounded-md border border-white/10 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Active: <strong>{activeBuses.length}</strong></span>
              </span>
              {staleOrOffline.length > 0 && (
                <span className="flex items-center gap-1 text-amber-300 text-xs font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  <span>{staleOrOffline.length} Alert</span>
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-1.5 text-xs font-semibold text-[#cbd5e1]/70 uppercase tracking-wider">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0F766E] text-white font-semibold shadow-xs'
                      : 'text-[#cbd5e1] hover:bg-[#1f4265] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#cbd5e1]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-[#17324D]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Admin Station Footer */}
          <div className="p-3 border-t border-white/10 text-xs bg-[#12273d]">
            <div className="flex items-center gap-2 text-[#cbd5e1]">
              <Shield className="w-4 h-4 text-teal-300" />
              <div>
                <p className="font-semibold text-white leading-tight">Admin Station 01</p>
                <p className="text-xs text-[#cbd5e1]/80">Transport Supervisor Duty</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header Bar (Color Treatment: Light Cool Grey #F3F6F8 & Dark Navy #17324D) */}
        <div className="md:hidden bg-[#F3F6F8] border-b border-slate-200 text-[#17324D] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0F766E] flex items-center justify-center text-white text-xs font-bold">
              NT
            </div>
            <span className="font-bold text-sm text-[#17324D]">Oakridge Transit Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md border border-slate-300 text-[#17324D] hover:bg-slate-200/60"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu (Navy Background #17324D) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#17324D] border-b border-[#12273d] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors ${
                    isActive
                      ? 'bg-[#0F766E] text-white font-semibold'
                      : 'text-[#cbd5e1] hover:bg-[#1f4265] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#cbd5e1]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-amber-400 text-[#17324D] font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
