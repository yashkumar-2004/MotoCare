import React from 'react';
import { useBooking } from '../context/BookingContext';
import { BookingProgressBar } from '../components/booking/BookingProgressBar';
import { StepVehicle } from '../components/booking/StepVehicle';
import { StepService } from '../components/booking/StepService';
import { StepAppointment } from '../components/booking/StepAppointment';
import { StepConfirm } from '../components/booking/StepConfirm';
import { BookingSuccess } from '../components/booking/BookingSuccess';

export const MultiStepBooking = () => {
  const {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    confirmedBooking,
    resetBooking,
    submitBooking,
    isSubmitting
  } = useBooking();

  // If already confirmed, display the receipt success screen
  if (confirmedBooking) {
    return <BookingSuccess booking={confirmedBooking} onReset={resetBooking} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Book Service Bay Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Reserve your certified service bay across 6 locations in Delhi NCR in 4 simple steps.
        </p>
      </div>

      {/* Progress Bar */}
      <BookingProgressBar
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      {/* Step Components */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-card">
        {currentStep === 1 && <StepVehicle onNext={nextStep} />}
        {currentStep === 2 && <StepService onNext={nextStep} onPrev={prevStep} />}
        {currentStep === 3 && <StepAppointment onNext={nextStep} onPrev={prevStep} />}
        {currentStep === 4 && (
          <StepConfirm
            onPrev={prevStep}
            onSubmit={submitBooking}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};
