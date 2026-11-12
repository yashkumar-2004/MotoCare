import React from 'react';
import { Calendar, Clock, MapPin, Bike, Receipt, AlertCircle, Ban } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export const BookingCard = ({
  booking,
  onViewDetails,
  onCancel,
}) => {
  const canCancel = ['Pending', 'Confirmed'].includes(booking.status);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
              {booking.id}
            </span>
            <span className="text-xs text-slate-400">
              Booked on {formatDate(booking.createdAt)}
            </span>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Main Info */}
        <div className="pt-4 space-y-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              {booking.serviceTitle}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
              <Bike className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800">{booking.vehicleModel}</span>
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-medium">
                {booking.vehicleReg}
              </span>
            </div>
          </div>

          {/* Appointment Schedule & Centre */}
          <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">
                {formatDate(booking.appointmentDate)}
              </span>
              <span className="text-slate-300">•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{booking.appointmentSlot}</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{booking.serviceCentreName}</span>
            </div>
          </div>

          {booking.pickupDrop && (
            <div className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span>Doorstep Pickup & Drop Included</span>
            </div>
          )}

          {booking.cancelReason && (
            <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-100 flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <span className="font-semibold">Cancellation Reason:</span> {booking.cancelReason}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Pricing & Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Total Paid / Due</span>
          <span className="text-base font-extrabold text-slate-900">
            {formatCurrency(booking.totalAmount)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(booking)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              Receipt
            </button>
          )}

          {canCancel && onCancel && (
            <button
              onClick={() => onCancel(booking)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
            >
              <Ban className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
