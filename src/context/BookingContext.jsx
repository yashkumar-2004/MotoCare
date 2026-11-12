import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const BookingContext = createContext(null);

const INITIAL_BOOKING_DATA = {
  // Step 1: Vehicle
  selectedVehicleId: '',
  vehicleReg: '',
  vehicleBrand: '',
  vehicleModel: '',
  vehicleType: '',
  odometer: '',
  
  // Step 2: Service
  selectedServiceId: '',
  serviceTitle: '',
  servicePrice: 0,
  additionalServices: [],

  // Step 3: Appointment
  serviceCentreId: '',
  serviceCentreName: '',
  appointmentDate: '',
  appointmentSlot: '',

  // Step 4: Customer Details & Preferences
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  pickupDrop: false,
  pickupAddress: '',
  notes: '',
};

export const BookingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState(INITIAL_BOOKING_DATA);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user details when user changes
  useEffect(() => {
    if (currentUser) {
      setBookingData((prev) => ({
        ...prev,
        customerName: prev.customerName || currentUser.name || '',
        customerPhone: prev.customerPhone || currentUser.phone || '',
        customerEmail: prev.customerEmail || currentUser.email || '',
        pickupAddress: prev.pickupAddress || currentUser.address || '',
      }));
    }
  }, [currentUser]);

  const updateBookingData = (fields) => {
    setBookingData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= 4) {
      setCurrentStep(stepNumber);
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setBookingData({
      ...INITIAL_BOOKING_DATA,
      customerName: currentUser?.name || '',
      customerPhone: currentUser?.phone || '',
      customerEmail: currentUser?.email || '',
      pickupAddress: currentUser?.address || '',
    });
    setConfirmedBooking(null);
  };

  // Pre-select service directly from Service Listing or Details page
  const selectServiceForBooking = (service) => {
    setBookingData((prev) => ({
      ...prev,
      selectedServiceId: service.id,
      serviceTitle: service.title,
      servicePrice: service.price,
    }));
  };

  // Pre-select vehicle from Home or Profile page
  const selectVehicleForBooking = (vehicle) => {
    setBookingData((prev) => ({
      ...prev,
      selectedVehicleId: vehicle.id,
      vehicleReg: vehicle.regNumber,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      vehicleType: vehicle.type,
      odometer: vehicle.odometer,
    }));
  };

  const submitBooking = async () => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        userId: currentUser?.id || 'guest_user',
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        customerEmail: bookingData.customerEmail,
        vehicleId: bookingData.selectedVehicleId,
        vehicleReg: bookingData.vehicleReg,
        vehicleModel: `${bookingData.vehicleBrand ? bookingData.vehicleBrand + ' ' : ''}${bookingData.vehicleModel}`,
        vehicleType: bookingData.vehicleType,
        odometer: Number(bookingData.odometer) || 0,
        serviceId: bookingData.selectedServiceId,
        serviceTitle: bookingData.serviceTitle,
        servicePrice: Number(bookingData.servicePrice) || 0,
        serviceCentreId: bookingData.serviceCentreId,
        serviceCentreName: bookingData.serviceCentreName,
        appointmentDate: bookingData.appointmentDate,
        appointmentSlot: bookingData.appointmentSlot,
        pickupDrop: Boolean(bookingData.pickupDrop),
        pickupAddress: bookingData.pickupDrop ? bookingData.pickupAddress : '',
        additionalServices: bookingData.additionalServices || [],
        notes: bookingData.notes || '',
      };

      const result = await bookingService.create(payload);
      setConfirmedBooking(result);
      toast.success(`Booking confirmed! ID: ${result.id}`);
      return result;
    } catch (err) {
      console.error('Booking submission failed:', err);
      toast.error('Failed to submit booking. Please check details and try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        currentStep,
        bookingData,
        confirmedBooking,
        isSubmitting,
        updateBookingData,
        nextStep,
        prevStep,
        goToStep,
        resetBooking,
        selectServiceForBooking,
        selectVehicleForBooking,
        submitBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
