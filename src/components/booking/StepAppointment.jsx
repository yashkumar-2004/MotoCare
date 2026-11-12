import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, AlertCircle, Building2, Star } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { centreService } from '../../services/centreService';

export const StepAppointment = ({ onNext, onPrev }) => {
  const { bookingData, updateBookingData } = useBooking();
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Minimum date: tomorrow or today
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  useEffect(() => {
    const loadCentres = async () => {
      try {
        setLoading(true);
        const data = await centreService.getAll();
        setCentres(data);

        // Pre-select first centre if none chosen
        if (!bookingData.serviceCentreId && data.length > 0) {
          updateBookingData({
            serviceCentreId: data[0].id,
            serviceCentreName: data[0].name,
          });
        }
      } catch (err) {
        console.error('Failed to load service centres', err);
      } finally {
        setLoading(false);
      }
    };
    loadCentres();
  }, []);

  const selectedCentre = centres.find((c) => c.id === bookingData.serviceCentreId) || centres[0];

  const handleSelectCentre = (c) => {
    updateBookingData({
      serviceCentreId: c.id,
      serviceCentreName: c.name,
      appointmentSlot: '', // reset slot when centre changes
    });
    setErrors((prev) => ({ ...prev, serviceCentreId: null }));
  };

  const handleContinue = () => {
    const errs = {};
    if (!bookingData.serviceCentreId) {
      errs.serviceCentreId = 'Please select a service centre';
    }
    if (!bookingData.appointmentDate) {
      errs.appointmentDate = 'Please pick a valid service date';
    }
    if (!bookingData.appointmentSlot) {
      errs.appointmentSlot = 'Please select an available appointment time slot';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Step 3: Select Service Centre & Bay Slot</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pick your preferred Delhi NCR workshop and an appointment time that suits you
        </p>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm">Loading Delhi NCR service hubs...</div>
      ) : (
        <div className="space-y-6">
          {/* Service Centre Hub Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Choose Delhi NCR Service Hub *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {centres.map((c) => {
                const isSelected = bookingData.serviceCentreId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCentre(c)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                          {c.zone}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{c.rating}</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-2">{c.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{c.address}</span>
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{c.totalBays} Active Service Bays</span>
                      <span className="text-blue-600 font-semibold">{c.openingHours}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.serviceCentreId && (
              <p className="text-xs text-rose-600 mt-2">{errors.serviceCentreId}</p>
            )}
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Date Picker */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                2. Select Service Date *
              </label>
              <input
                type="date"
                min={today}
                max={maxDate}
                value={bookingData.appointmentDate}
                onChange={(e) => {
                  updateBookingData({ appointmentDate: e.target.value });
                  setErrors((prev) => ({ ...prev, appointmentDate: null }));
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Bays operate 7 days a week. Bookings open up to 30 days in advance.
              </p>
              {errors.appointmentDate && (
                <p className="text-xs text-rose-600 mt-2">{errors.appointmentDate}</p>
              )}
            </div>

            {/* Time Slot Picker */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                3. Choose Available Time Slot *
              </label>

              {selectedCentre?.availableSlots ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedCentre.availableSlots.map((slot) => {
                    const isSelected = bookingData.appointmentSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => {
                          updateBookingData({ appointmentSlot: slot });
                          setErrors((prev) => ({ ...prev, appointmentSlot: null }));
                        }}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Please select a service centre first.</p>
              )}

              {errors.appointmentSlot && (
                <p className="text-xs text-rose-600 mt-2">{errors.appointmentSlot}</p>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onPrev}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
            >
              Back to Service
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              Continue to Confirmation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
