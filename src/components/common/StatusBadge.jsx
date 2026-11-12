import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

export const StatusBadge = ({ status, size = 'md' }) => {
  const currentStatus = STATUS_COLORS[status] || STATUS_COLORS.Pending;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} animate-pulse`} />
      {status}
    </span>
  );
};
