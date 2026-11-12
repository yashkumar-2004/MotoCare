import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, PhoneCall, Mail, MapPin, ShieldCheck, Heart, Clock } from 'lucide-react';
import { APP_NAME, SUPPORT_PHONE, SUPPORT_EMAIL } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Moto<span className="text-blue-500">Care</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Delhi NCR's authorized two-wheeler multi-brand service network. Certified technicians, transparent pricing, genuine OEM parts, and digital service history tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>30-Day or 1,000 km Service Warranty on All Repairs</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Service Bay Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Periodic Maintenance Packages
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-white transition">
                  Book Multi-Step Bay Slot
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  Service History & Garage Records
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">
                  Dealership Admin Hub
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Doorstep Pickup in Delhi NCR</span>
              </li>
            </ul>
          </div>

          {/* Delhi NCR Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Delhi NCR Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Central: Barakhamba Rd, Connaught Place</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>South: Ring Road, South Extension Part II</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>West: Sector 12, Dwarka</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>East / Tech: Phase 3, Okhla Ind. Area</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>NCR: Cyber City (Gurugram) & Sec 62 (Noida)</span>
              </li>
            </ul>
          </div>

          {/* Support & Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Emergency & Support
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-medium transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Toll-Free Helpline</div>
                  <div>{SUPPORT_PHONE}</div>
                </div>
              </a>

              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition"
              >
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">{SUPPORT_EMAIL}</span>
              </a>

              <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Bays Open: 08:30 AM – 08:00 PM (Daily)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Meta */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MotoCare Dealership Services (India) Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Delhi riders
            </span>
            <span>•</span>
            <span className="text-blue-400 font-medium">PWA Offline Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
