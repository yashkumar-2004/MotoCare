import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-subtle animate-pulse space-y-4">
    <div className="h-44 bg-slate-200 rounded-xl w-full"></div>
    <div className="space-y-2">
      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-100 rounded w-full"></div>
      <div className="h-4 bg-slate-100 rounded w-5/6"></div>
    </div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-6 bg-slate-200 rounded w-1/4"></div>
      <div className="h-9 bg-slate-200 rounded-lg w-1/3"></div>
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="animate-pulse border-b border-slate-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded w-full max-w-[120px]"></div>
      </td>
    ))}
  </tr>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle animate-pulse flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          <div className="h-6 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

export const VehicleCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-subtle animate-pulse flex flex-col md:flex-row gap-5 items-center">
    <div className="w-full md:w-44 h-32 bg-slate-200 rounded-xl shrink-0"></div>
    <div className="flex-1 space-y-3 w-full">
      <div className="h-5 bg-slate-200 rounded w-1/2"></div>
      <div className="h-4 bg-slate-100 rounded w-1/3"></div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="h-4 bg-slate-100 rounded"></div>
        <div className="h-4 bg-slate-100 rounded"></div>
      </div>
    </div>
  </div>
);
