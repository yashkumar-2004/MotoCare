import React, { useState } from 'react';
import { Truck, Check, AlertCircle, FileText, Bike, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const StepConfirm = ({ onPrev, onSubmit, isSubmitting }) => {
  const { bookingData, updateBookingData } = useBooking();
  const [errors, setErrors] = useState({});

  const PICKUP_FEE = 299;

  // Calculate pricing breakdown
  const baseServicePrice = Number(bookingData.servicePrice) || 0;
  const addonsTotal = (bookingData.additionalServices || []).reduce((sum, item) => sum + item.price, 0);
  const transitFee = bookingData.pickupDrop ? PICKUP_FEE : 0;
  const subtotal = baseServicePrice + addonsTotal + transitFee;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handlePickupToggle = (e) => {
    updateBookingData({ pickupDrop: e.target.checked });
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!bookingData.customerName?.trim()) {
      errs.customerName = 'Customer name is required';
    }
    const phoneRegex = /^(\+91[\-\s]?)?[6789]\d{9}$/;
    if (!bookingData.customerPhone || !phoneRegex.test(bookingData.customerPhone.trim())) {
      errs.customerPhone = 'Enter a valid 10-digit mobile number';
    }
    if (!bookingData.customerEmail || !bookingData.customerEmail.includes('@')) {
      errs.customerEmail = 'Enter a valid email address';
    }
    if (bookingData.pickupDrop && !bookingData.pickupAddress?.trim()) {
      errs.pickupAddress = 'Street address is required for doorstep pickup & drop';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Step 4: Customer Details & Booking Summary</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review your appointment schedule, confirm customer contact, and submit
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer details & options (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={bookingData.customerName}
                  onChange={(e) => {
                    updateBookingData({ customerName: e.target.value });
                    setErrors({ ...errors, customerName: null });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {errors.customerName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (+91) *
                </label>
                <input
                  type="tel"
                  value={bookingData.customerPhone}
                  onChange={(e) => {
                    updateBookingData({ customerPhone: e.target.value });
                    setErrors({ ...errors, customerPhone: null });
                  }}
                  placeholder="9810123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {errors.customerPhone && (
                  <p className="text-xs text-rose-600 mt-1">{errors.customerPhone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (For Invoices & Updates) *
                </label>
                <input
                  type="email"
                  value={bookingData.customerEmail}
                  onChange={(e) => {
                    updateBookingData({ customerEmail: e.target.value });
                    setErrors({ ...errors, customerEmail: null });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {errors.customerEmail && (
                  <p className="text-xs text-rose-600 mt-1">{errors.customerEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Doorstep Pickup Toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Opt for Doorstep Pickup & Drop (+₹299)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our insured flatbed carrier will pick up your two-wheeler from your Delhi NCR home or office.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={Boolean(bookingData.pickupDrop)}
                  onChange={handlePickupToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {bookingData.pickupDrop && (
              <div className="pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delhi NCR Doorstep Address *
                </label>
                <textarea
                  rows={2}
                  value={bookingData.pickupAddress}
                  onChange={(e) => {
                    updateBookingData({ pickupAddress: e.target.value });
                    setErrors({ ...errors, pickupAddress: null });
                  }}
                  placeholder="e.g. Flat 302, Palm Heights, Sector 14, Dwarka, New Delhi"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {errors.pickupAddress && (
                  <p className="text-xs text-rose-600 mt-1">{errors.pickupAddress}</p>
                )}
              </div>
            )}
          </div>

          {/* Notes / Special Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Special Notes / Symptoms for Service Advisor (Optional)
            </label>
            <textarea
              rows={2}
              value={bookingData.notes}
              onChange={(e) => updateBookingData({ notes: e.target.value })}
              placeholder="e.g. Squeaking noise when applying front brake, check clutch cable tightness..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Right Column: Invoice summary breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Booking Invoice Summary
            </h3>

            {/* Vehicle & Time Brief */}
            <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Bike className="w-4 h-4 text-blue-600" />
                <span>{bookingData.vehicleBrand} {bookingData.vehicleModel}</span>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                  {bookingData.vehicleReg}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formatDate(bookingData.appointmentDate)} • {bookingData.appointmentSlot}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{bookingData.serviceCentreName}</span>
              </div>
            </div>

            {/* Price items */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-medium">{bookingData.serviceTitle}</span>
                <span className="font-semibold">{formatCurrency(baseServicePrice)}</span>
              </div>

              {(bookingData.additionalServices || []).map((addon) => (
                <div key={addon.id} className="flex items-center justify-between text-slate-600 pl-2 border-l-2 border-blue-200">
                  <span>+ {addon.name}</span>
                  <span className="font-medium">{formatCurrency(addon.price)}</span>
                </div>
              ))}

              {bookingData.pickupDrop && (
                <div className="flex items-center justify-between text-slate-600 pl-2 border-l-2 border-blue-200">
                  <span>+ Doorstep Transit (Pickup & Drop)</span>
                  <span className="font-medium">{formatCurrency(PICKUP_FEE)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-100">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>GST (18% Integrated Tax)</span>
                <span>{formatCurrency(tax)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-900 pt-3 border-t-2 border-slate-200 text-sm">
                <span className="font-bold">Total Estimated Amount</span>
                <span className="text-lg font-black text-blue-700">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pay after service completion at workshop or via UPI on delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
        >
          Back to Slot Selection
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition active:scale-95 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Securing Bay Slot...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirm & Book Service</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
