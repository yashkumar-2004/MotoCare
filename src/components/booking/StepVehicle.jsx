import React, { useState, useEffect } from 'react';
import { Bike, Plus, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { vehicleService } from '../../services/vehicleService';
import { VEHICLE_TYPES, POPULAR_DELHI_BRANDS } from '../../utils/constants';

export const StepVehicle = ({ onNext }) => {
  const { currentUser } = useAuth();
  const { bookingData, updateBookingData } = useBooking();

  const [userVehicles, setUserVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errors, setErrors] = useState({});

  // New vehicle form state
  const [newVeh, setNewVeh] = useState({
    regNumber: '',
    brand: 'Honda',
    model: '',
    type: 'Scooter',
    odometer: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        if (currentUser?.id) {
          const data = await vehicleService.getByUserId(currentUser.id);
          setUserVehicles(data);
          
          // Auto select if only 1 vehicle exists and nothing selected yet
          if (data.length > 0 && !bookingData.selectedVehicleId) {
            handleSelectExisting(data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load user vehicles', err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, [currentUser]);

  const handleSelectExisting = (veh) => {
    setShowAddForm(false);
    updateBookingData({
      selectedVehicleId: veh.id,
      vehicleReg: veh.regNumber,
      vehicleBrand: veh.brand,
      vehicleModel: veh.model,
      vehicleType: veh.type,
      odometer: veh.odometer || '',
    });
    setErrors({});
  };

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const regPattern = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$/i;
    if (!newVeh.regNumber || !regPattern.test(newVeh.regNumber.trim())) {
      newErrors.regNumber = 'Please enter a valid Indian plate (e.g. DL 03 CB 4192)';
    }
    if (!newVeh.model.trim()) {
      newErrors.model = 'Please enter vehicle model';
    }
    if (!newVeh.odometer || isNaN(newVeh.odometer) || Number(newVeh.odometer) < 0) {
      newErrors.odometer = 'Please enter valid odometer reading in km';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Set temporary custom vehicle for this booking
    const customId = `temp_veh_${Date.now()}`;
    updateBookingData({
      selectedVehicleId: customId,
      vehicleReg: newVeh.regNumber.toUpperCase().trim(),
      vehicleBrand: newVeh.brand,
      vehicleModel: newVeh.model.trim(),
      vehicleType: newVeh.type,
      odometer: Number(newVeh.odometer),
    });
    setErrors({});
    onNext();
  };

  const handleContinue = () => {
    if (!bookingData.selectedVehicleId && !showAddForm) {
      setErrors({ general: 'Please select a registered vehicle or add a new one.' });
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 1: Select Your Two-Wheeler</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose from your registered Delhi NCR garage or add another ride
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setErrors({});
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-blue-200 text-blue-700 hover:bg-blue-50 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Use Saved Vehicle' : 'Add Another Vehicle'}
        </button>
      </div>

      {errors.general && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Existing Vehicles List */}
      {!showAddForm && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Loading your garage vehicles...
            </div>
          ) : userVehicles.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Bike className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No registered vehicles found for this profile.</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Add your two-wheeler details to proceed with service booking.</p>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Enter Vehicle Details
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userVehicles.map((veh) => {
                const isSelected = bookingData.selectedVehicleId === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => handleSelectExisting(veh)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                          {veh.regNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                          {veh.type}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-2.5">
                      {veh.brand} {veh.model}
                    </h3>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span>{veh.odometer ? `${veh.odometer.toLocaleString()} km` : 'Odometer N/A'}</span>
                      <span>•</span>
                      <span>{veh.fuelType || 'Petrol'}</span>
                      <span>•</span>
                      <span>Year: {veh.year}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!bookingData.selectedVehicleId}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm transition active:scale-95"
            >
              Continue to Select Service
            </button>
          </div>
        </div>
      )}

      {/* Add New Vehicle Form */}
      {showAddForm && (
        <form onSubmit={handleAddNewSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Enter Two-Wheeler Particulars</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration Plate (e.g. DL 03 CB 4192) *
              </label>
              <input
                type="text"
                value={newVeh.regNumber}
                onChange={(e) => {
                  setNewVeh({ ...newVeh, regNumber: e.target.value.toUpperCase() });
                  setErrors({ ...errors, regNumber: null });
                }}
                placeholder="DL 01 AB 1234"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.regNumber && (
                <p className="text-xs text-rose-600 mt-1">{errors.regNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Manufacturer / Brand *
              </label>
              <select
                value={newVeh.brand}
                onChange={(e) => setNewVeh({ ...newVeh, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {POPULAR_DELHI_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Name *
              </label>
              <input
                type="text"
                value={newVeh.model}
                onChange={(e) => {
                  setNewVeh({ ...newVeh, model: e.target.value });
                  setErrors({ ...errors, model: null });
                }}
                placeholder="e.g. Activa 6G / Classic 350 / Pulsar NS200"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.model && (
                <p className="text-xs text-rose-600 mt-1">{errors.model}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Category *
              </label>
              <select
                value={newVeh.type}
                onChange={(e) => setNewVeh({ ...newVeh, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Odometer (km) *
              </label>
              <input
                type="number"
                value={newVeh.odometer}
                onChange={(e) => {
                  setNewVeh({ ...newVeh, odometer: e.target.value });
                  setErrors({ ...errors, odometer: null });
                }}
                placeholder="e.g. 12500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.odometer && (
                <p className="text-xs text-rose-600 mt-1">{errors.odometer}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Manufacturing Year
              </label>
              <input
                type="number"
                value={newVeh.year}
                onChange={(e) => setNewVeh({ ...newVeh, year: Number(e.target.value) })}
                min="1995"
                max={new Date().getFullYear()}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              Save & Proceed to Service
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
