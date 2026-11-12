import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  User,
  Calendar,
  Layers,
  LayoutDashboard,
  Menu,
  X,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../utils/constants';

export const Navbar = () => {
  const { currentUser, allUsers, switchUser, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home', icon: LayoutDashboard },
    { to: '/services', label: 'Service Catalog', icon: Layers },
    { to: '/booking', label: 'Book Service', icon: Calendar },
    { to: '/profile', label: 'My Vehicles & History', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  Moto<span className="text-blue-600">Care</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                  Delhi NCR Network
                </span>
              </div>
            </Link>

            {/* Delhi NCR location badge */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Delhi • Gurugram • Noida (6 Hubs)</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </NavLink>
              );
            })}

            {/* Admin Link Badge */}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ml-2 border ${
                  isActive
                    ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                    : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                }`
              }
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Admin Bay
            </NavLink>
          </nav>

          {/* User Profile Switcher & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="text-left max-w-[120px]">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {currentUser?.name || 'Customer'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium capitalize">
                    {currentUser?.role || 'Customer'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Switcher Dropdown */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Active User (Demo)
                    </p>
                  </div>

                  <div className="py-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setUserDropdownOpen(false);
                          if (u.role === 'admin') navigate('/admin');
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition hover:bg-slate-50 ${
                          currentUser?.id === u.id ? 'bg-blue-50/60 font-semibold text-blue-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              u.name.charAt(0)
                            )}
                          </div>
                          <div className="truncate">
                            <p className="truncate font-medium">{u.name}</p>
                            <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                          </div>
                        </div>
                        {currentUser?.id === u.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="px-4 pt-2 pb-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      View Profile
                    </Link>
                    <span className="text-slate-400">Delhi NCR Portal</span>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/booking"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              Book Service
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="p-3 bg-slate-50 rounded-xl mb-2">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Signed in as:</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">{currentUser?.name}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                {currentUser?.role}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              );
            })}

            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive ? 'bg-navy-900 text-white' : 'bg-slate-900 text-white'
                }`
              }
            >
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Admin Dealership Hub
            </NavLink>
          </div>

          {/* Quick User Switcher on mobile */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 mb-2">Switch User:</p>
            <div className="grid grid-cols-2 gap-2">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border truncate ${
                    currentUser?.id === u.id
                      ? 'bg-blue-50 border-blue-300 text-blue-800'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {u.name.split(' ')[0]} ({u.role})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
