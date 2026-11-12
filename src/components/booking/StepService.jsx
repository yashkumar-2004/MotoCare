import React, { useState, useEffect } from 'react';
import { Check, Clock, Plus, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { servicePackageService } from '../../services/servicePackageService';
import { formatCurrency } from '../../utils/formatters';

export const StepService = ({ onNext, onPrev }) => {
  const { bookingData, updateBookingData } = useBooking();
  const [services, setServices] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [srvList, addList] = await Promise.all([
          servicePackageService.getAll(),
          servicePackageService.getAddons(),
        ]);
        setServices(srvList);
        setAddons(addList);

        // If no service selected yet, select the popular one
        if (!bookingData.selectedServiceId && srvList.length > 0) {
          const defaultSrv = srvList.find((s) => s.isPopular) || srvList[0];
          updateBookingData({
            selectedServiceId: defaultSrv.id,
            serviceTitle: defaultSrv.title,
            servicePrice: defaultSrv.price,
          });
        }
      } catch (err) {
        console.error('Failed to load services', err);
        setError('Failed to fetch services. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectService = (srv) => {
    updateBookingData({
      selectedServiceId: srv.id,
      serviceTitle: srv.title,
      servicePrice: srv.price,
    });
    setError('');
  };

  const handleToggleAddon = (addon) => {
    const currentAddons = bookingData.additionalServices || [];
    const exists = currentAddons.some((a) => a.id === addon.id);

    let updatedAddons;
    if (exists) {
      updatedAddons = currentAddons.filter((a) => a.id !== addon.id);
    } else {
      updatedAddons = [...currentAddons, { id: addon.id, name: addon.name, price: addon.price }];
    }

    updateBookingData({
      additionalServices: updatedAddons,
    });
  };

  const calculateSubtotal = () => {
    const base = Number(bookingData.servicePrice) || 0;
    const addonsTotal = (bookingData.additionalServices || []).reduce((sum, item) => sum + item.price, 0);
    return base + addonsTotal;
  };

  const handleContinue = () => {
    if (!bookingData.selectedServiceId) {
      setError('Please choose a primary service package to proceed.');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 2: Choose Service & Value Add-ons</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted solutions tailored for Delhi NCR riding conditions
          </p>
        </div>

        <div className="bg-blue-50 text-blue-900 px-3.5 py-1.5 rounded-xl border border-blue-200 text-xs font-semibold self-start sm:self-auto">
          Estimated Base: <span className="font-bold text-blue-700">{formatCurrency(calculateSubtotal())}</span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm">Loading available service plans...</div>
      ) : (
        <div className="space-y-6">
          {/* Service Packages List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Select Primary Service Package
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => {
                const isSelected = bookingData.selectedServiceId === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleSelectService(srv)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {srv.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {srv.title}
                          </h4>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                        {srv.shortDescription || srv.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{srv.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="truncate">{srv.warranty ? srv.warranty.split(' ')[0] + ' Warranty' : 'Guaranteed'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Package Fee</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        {formatCurrency(srv.price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add-on Services Checklist */}
          {addons.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                2. Recommended Add-On Services (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {addons.map((add) => {
                  const isChecked = (bookingData.additionalServices || []).some((a) => a.id === add.id);
                  return (
                    <div
                      key={add.id}
                      onClick={() => handleToggleAddon(add)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition flex items-start gap-3 ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border shrink-0 ${
                        isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800">{add.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                          {add.description}
                        </p>
                        <div className="text-xs font-bold text-blue-700 mt-2">
                          +{formatCurrency(add.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onPrev}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
            >
              Back to Vehicle
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              Continue to Select Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
