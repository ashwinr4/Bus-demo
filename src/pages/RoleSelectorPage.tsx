import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Users, ChevronRight, School, ArrowUpRight } from 'lucide-react';
import { RoleSwitcher } from '../components/common/RoleSwitcher';

export const RoleSelectorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <RoleSwitcher />

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-10 flex flex-col justify-center">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-xs">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                School Bus Live Tracking System
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Oakridge International Academy • Campus South Transportation Portal
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Select a role below to preview the live bus tracking and route management interface for administrators, drivers, or parents.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Admin Role */}
          <div
            onClick={() => navigate('/admin')}
            className="cursor-pointer group bg-white border border-slate-200 hover:border-teal-600 rounded-xl p-5 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Shield className="w-5 h-5" />
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Desktop-first
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors flex items-center gap-1">
                Admin Panel
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Manage buses, routes, drivers, and parents. Monitor live bus positions, stops, and alerts in one central operations desk.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
              <span>Open Admin Panel</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Driver Role */}
          <div
            onClick={() => navigate('/driver')}
            className="cursor-pointer group bg-white border border-slate-200 hover:border-teal-600 rounded-xl p-5 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Smartphone className="w-5 h-5" />
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Mobile-first
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors flex items-center gap-1">
                Driver Panel
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Simple touch interface for drivers. Start your assigned route, view upcoming stops, and end your trip safely.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
              <span>Open Driver Panel</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Parent Role */}
          <div
            onClick={() => navigate('/parent')}
            className="cursor-pointer group bg-white border border-slate-200 hover:border-teal-600 rounded-xl p-5 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Users className="w-5 h-5" />
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Mobile-first
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors flex items-center gap-1">
                Parent Panel
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                View your child's assigned bus location in real time, check arrival estimates at your stop, and receive approach notifications.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
              <span>Open Parent Panel</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Oakridge Campus South Transportation Management System
        </div>
      </div>
    </div>
  );
};
