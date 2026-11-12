import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Bike, Printer, ArrowRight, User } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const BookingSuccess = ({ booking, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden printable-receipt">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 ring-8 ring-white/10">
            <CheckCircle2 className="w-10 h-10 text-emerald-300" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Service Slot Confirmed!</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-sm mx-auto">
            Your two-wheeler service has been reserved in our Delhi NCR dealership queue.
          </p>
          <div className="mt-4 inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-mono text-xs font-bold tracking-wider">
            Booking ID: {booking.id}
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Vehicle Booked</span>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">
                {booking.vehicleModel}
              </span>
              <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] inline-block mt-1">
                {booking.vehicleReg}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Customer Details</span>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">
                {booking.customerName}
              </span>
              <span className="text-slate-600 block mt-0.5">
                {booking.customerPhone} • {booking.customerEmail}
              </span>
            </div>
          </div>

          {/* Appointment Schedule & Center */}
          <div className="bg-slate-50 p-4 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800">Appointment:</span>
              <span className="text-slate-700">
                {formatDate(booking.appointmentDate)} ({booking.appointmentSlot})
              </span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Service Workshop: </span>
                <span className="text-slate-700">{booking.serviceCentreName}</span>
              </div>
            </div>

            {booking.pickupDrop && (
              <div className="text-blue-700 font-medium pt-1 border-t border-slate-200">
                Doorstep Pickup Location: {booking.pickupAddress}
              </div>
            )}
          </div>

          {/* Charges Breakdown */}
          <div className="space-y-2 text-xs pt-2">
            <div className="flex justify-between text-slate-700">
              <span>{booking.serviceTitle}</span>
              <span>{formatCurrency(booking.servicePrice)}</span>
            </div>

            {(booking.additionalServices || []).map((addon) => (
              <div key={addon.id} className="flex justify-between text-slate-500 pl-2">
                <span>+ {addon.name}</span>
                <span>{formatCurrency(addon.price)}</span>
              </div>
            ))}

            {booking.pickupDrop && (
              <div className="flex justify-between text-slate-500 pl-2">
                <span>+ Doorstep Transit Carrier</span>
                <span>{formatCurrency(299)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
              <span>Tax (GST 18%)</span>
              <span>{formatCurrency(booking.tax)}</span>
            </div>

            <div className="flex justify-between text-slate-900 pt-3 border-t-2 border-slate-200 font-bold text-base">
              <span>Total Amount (Pay on Delivery)</span>
              <span className="text-blue-600">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

          {/* Actions (Hidden in Print) */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 no-print">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <Printer className="w-4 h-4" />
              Print / Save Receipt
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              >
                Book Another Service
              </button>

              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                <User className="w-4 h-4" />
                View in My Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
