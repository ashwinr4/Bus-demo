import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Users, ChevronRight, Layers } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRoleSelector = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');
  const isDriver = location.pathname.startsWith('/driver');
  const isParent = location.pathname.startsWith('/parent');

  return (
    <aside
      aria-label="Prototype Role Switcher"
      className="bg-[#F3F6F8] border-b border-slate-200 text-xs text-[#17324D] py-2 px-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-xs"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 font-semibold text-[#17324D] text-xs tracking-wide">
          <Layers className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>Demo Role Switcher</span>
        </span>
        <span className="text-slate-300 hidden sm:inline">•</span>
        <span className="text-[#17324D]/80 hidden md:inline text-xs">
          Oakridge South Campus
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
            isAdmin
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-xs'
              : 'bg-white text-[#17324D] border-slate-200 hover:bg-slate-100'
          }`}
          title="Admin Panel (Desktop-first)"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>

        <button
          onClick={() => navigate('/driver')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
            isDriver
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-xs'
              : 'bg-white text-[#17324D] border-slate-200 hover:bg-slate-100'
          }`}
          title="Driver Panel (Mobile-first)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Driver</span>
        </button>

        <button
          onClick={() => navigate('/parent')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
            isParent
              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-xs'
              : 'bg-white text-[#17324D] border-slate-200 hover:bg-slate-100'
          }`}
          title="Parent Panel (Mobile-first)"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Parent</span>
        </button>

        {!isRoleSelector && (
          <button
            onClick={() => navigate('/')}
            className="ml-2 text-[#17324D]/80 hover:text-[#17324D] text-xs flex items-center gap-0.5 transition-colors font-medium"
          >
            All Roles <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </aside>
  );
};
