import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Wrench,
  Building2,
  ArrowLeft,
  X,
  ShieldCheck
} from 'lucide-react';

export const AdminSidebar = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const adminNavItems = [
    { id: 'overview', label: 'Metrics & Analytics', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings Management', icon: CalendarCheck },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'packages', label: 'Service Packages', icon: Wrench },
    { id: 'centres', label: 'Delhi NCR Bays', icon: Building2 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  MotoCare Admin
                </h2>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                  Delhi NCR Console
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Management Bays
            </p>

            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User Portal</span>
          </Link>
          <div className="p-3 bg-slate-800/60 rounded-xl text-[11px] text-slate-400">
            <span className="block text-white font-semibold mb-0.5">Live Bay Feed</span>
            <span>All 6 Delhi NCR centers synced</span>
          </div>
        </div>
      </aside>
    </>
  );
};
