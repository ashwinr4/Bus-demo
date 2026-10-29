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
        {/* Desktop Sidebar Navigation (Strict White Theme) */}
        <aside className="hidden md:flex flex-col w-64 bg-white text-slate-700 border-r border-slate-200 shrink-0">
          {/* School Operations Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                <BusIcon className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                  NaviTrack School Transit
                </h1>
                <p className="text-xs text-slate-500 mt-1">Oakridge South Campus</p>
              </div>
            </div>

            {/* Quick Fleet Summary Pill */}
            <div className="mt-3.5 p-2 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active: <strong>{activeBuses.length}</strong></span>
              </span>
              {staleOrOffline.length > 0 && (
                <span className="flex items-center gap-1 text-amber-700 text-xs font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{staleOrOffline.length} Alert</span>
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                      ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Admin Station Footer */}
          <div className="p-3 border-t border-slate-200 text-xs bg-slate-50">
            <div className="flex items-center gap-2 text-slate-700">
              <Shield className="w-4 h-4 text-teal-700" />
              <div>
                <p className="font-semibold text-slate-900 leading-tight">Admin Station 01</p>
                <p className="text-xs text-slate-500">Transport Supervisor Duty</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header Bar for small screens */}
        <div className="md:hidden bg-white border-b border-slate-200 text-slate-900 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center text-white text-xs font-bold">
              NT
            </div>
            <span className="font-bold text-sm text-slate-900">Oakridge Transit Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-amber-100 text-amber-800 font-bold">
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
