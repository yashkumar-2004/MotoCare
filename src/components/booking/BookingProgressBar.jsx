import React from 'react';
import { Check, Bike, Wrench, Calendar, FileCheck } from 'lucide-react';

export const BookingProgressBar = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Vehicle', icon: Bike },
    { number: 2, title: 'Service & Addons', icon: Wrench },
    { number: 3, title: 'Slot & Bay', icon: Calendar },
    { number: 4, title: 'Summary & Confirm', icon: FileCheck },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-subtle mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto relative">
        {/* Background Connecting Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
        
        {/* Active Connecting Bar */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s) => {
          const Icon = s.icon;
          const isCompleted = currentStep > s.number;
          const isCurrent = currentStep === s.number;
          const isClickable = s.number < currentStep;

          return (
            <button
              key={s.number}
              type="button"
              onClick={() => isClickable && onStepClick(s.number)}
              disabled={!isClickable}
              className={`relative z-10 flex flex-col items-center group focus:outline-none ${
                isClickable ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold mt-2 tracking-tight ${
                  isCurrent
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
