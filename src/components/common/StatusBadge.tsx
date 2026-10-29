import React from 'react';
import { AlertSeverity, BusStatus, DutyStatus } from '../../types';

interface StatusBadgeProps {
  status: BusStatus | DutyStatus | AlertSeverity | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  showDot = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1 font-semibold',
  }[size];

  let label = status;
  let colorClasses = 'bg-slate-50 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status) {
    case 'in_transit':
      label = 'In Transit';
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;
    case 'stopped':
      label = 'Stopped';
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      dotColor = 'bg-amber-500';
      break;
    case 'not_started':
      label = 'Not Started';
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
    case 'stale_gps':
      label = 'Stale GPS';
      colorClasses = 'bg-amber-50 text-amber-900 border-amber-300';
      dotColor = 'bg-amber-600';
      break;
    case 'offline':
      label = 'Offline';
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
      dotColor = 'bg-rose-500';
      break;
    case 'completed':
      label = 'Completed';
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      dotColor = 'bg-slate-400';
      break;

    // Duty statuses
    case 'on_duty':
      label = 'On Duty';
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;
    case 'off_duty':
      label = 'Off Duty';
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
    case 'on_break':
      label = 'On Break';
      colorClasses = 'bg-sky-50 text-sky-800 border-sky-200';
      dotColor = 'bg-sky-500';
      break;

    // Alert Severities
    case 'critical':
      label = 'Critical';
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
      dotColor = 'bg-rose-600';
      break;
    case 'high':
      label = 'High Priority';
      colorClasses = 'bg-orange-50 text-orange-800 border-orange-200';
      dotColor = 'bg-orange-600';
      break;
    case 'medium':
      label = 'Notice';
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      dotColor = 'bg-amber-500';
      break;
    case 'low':
    case 'info':
      label = status === 'low' ? 'Low' : 'Info';
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${colorClasses} ${sizeClasses} ${className}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      <span>{label}</span>
    </span>
  );
};
