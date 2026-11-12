import React, { useState } from 'react';
import { Calendar, Gauge, Fuel, Shield, Wrench, Bike } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const VehiclePlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 p-4">
    <Bike className="w-12 h-12 stroke-[1.5] text-slate-400 mb-1" />
    <span className="text-xs font-medium text-slate-500">MotoCare Registered Ride</span>
  </div>
);

export const VehicleCard = ({
  vehicle,
  onBookService,
  onEdit,
  compact = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Check if service is overdue or upcoming in 15 days
  const isUpcoming = vehicle.nextServiceDue ? new Date(vehicle.nextServiceDue) <= new Date(Date.now() + 15 * 86400000) : false;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col">
      {/* Vehicle Image / Fallback */}
      {!compact && (
        <div className="h-40 w-full relative bg-slate-100 overflow-hidden">
          {vehicle.image && !imageError ? (
            <img
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <VehiclePlaceholder />
          )}

          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-white/20 tracking-wider">
            {vehicle.regNumber}
          </div>

          <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
            {vehicle.type}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {compact && (
            <div className="flex items-center justify-between mb-2">
              <span className="bg-slate-900 text-white text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                {vehicle.regNumber}
              </span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {vehicle.type}
              </span>
            </div>
          )}

          <h4 className="text-base font-bold text-slate-900">
            {vehicle.brand} {vehicle.model}
          </h4>
          <p className="text-xs text-slate-500 mb-4">{vehicle.year} Model</p>

          <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium truncate">{vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : '—'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium truncate">{vehicle.fuelType || 'Petrol'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Last: {formatDate(vehicle.lastServiceDate)}</span>
            </div>

            <div className={`flex items-center gap-1.5 p-2 rounded-lg ${isUpcoming ? 'bg-amber-50 text-amber-800' : 'bg-slate-50'}`}>
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Due: {formatDate(vehicle.nextServiceDue)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onBookService && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => onBookService(vehicle)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold transition"
            >
              <Wrench className="w-3.5 h-3.5" />
              Book Bay Service
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(vehicle)}
                className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
