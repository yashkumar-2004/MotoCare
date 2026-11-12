import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Bike,
  Plus,
  Edit2,
  Trash2,
  Ban,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { VehicleCard } from '../components/cards/VehicleCard';
import { BookingCard } from '../components/cards/BookingCard';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';
import { VEHICLE_TYPES, POPULAR_DELHI_BRANDS } from '../utils/constants';

export const UserProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const toast = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isCancelBookingOpen, setIsCancelBookingOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Profile Edit form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Delhi NCR',
    pincode: '',
    emergencyContact: '',
  });

  // Vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    regNumber: '',
    brand: 'Honda',
    model: '',
    type: 'Scooter',
    odometer: '',
    year: new Date().getFullYear(),
    fuelType: 'Petrol',
  });

  const [formErrors, setFormErrors] = useState({});

  const loadUserData = async () => {
    try {
      setLoading(true);
      if (currentUser?.id) {
        const [userVehicles, userBookings] = await Promise.all([
          vehicleService.getByUserId(currentUser.id),
          bookingService.getByUserId(currentUser.id),
        ]);
        setVehicles(userVehicles);
        setBookings(userBookings);

        setProfileForm({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: currentUser.address || '',
          city: currentUser.city || 'Delhi NCR',
          pincode: currentUser.pincode || '',
          emergencyContact: currentUser.emergencyContact || '',
        });
      }
    } catch (err) {
      console.error('Failed to load user profile data', err);
      toast.error('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      setFormErrors({ name: 'Name is required' });
      return;
    }
    try {
      await updateProfile(profileForm);
      toast.success('Profile details updated successfully');
      setIsEditProfileOpen(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  // Handle Add New Vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const errs = {};
    const regPattern = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$/i;
    if (!newVehicle.regNumber || !regPattern.test(newVehicle.regNumber.trim())) {
      errs.regNumber = 'Please enter a valid Indian plate (e.g. DL 03 CB 4192)';
    }
    if (!newVehicle.model.trim()) {
      errs.model = 'Model is required';
    }
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      const created = await vehicleService.create({
        ownerId: currentUser.id,
        regNumber: newVehicle.regNumber.toUpperCase().trim(),
        brand: newVehicle.brand,
        model: newVehicle.model.trim(),
        type: newVehicle.type,
        odometer: Number(newVehicle.odometer) || 0,
        year: Number(newVehicle.year),
        fuelType: newVehicle.fuelType,
        lastServiceDate: new Date().toISOString().split('T')[0],
        nextServiceDue: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
      });
      setVehicles((prev) => [created, ...prev]);
      toast.success('Two-wheeler registered to your garage');
      setIsAddVehicleOpen(false);
      setNewVehicle({
        regNumber: '',
        brand: 'Honda',
        model: '',
        type: 'Scooter',
        odometer: '',
        year: new Date().getFullYear(),
        fuelType: 'Petrol',
      });
      setFormErrors({});
    } catch {
      toast.error('Failed to register vehicle');
    }
  };

  // Handle Delete Vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to remove this vehicle from your garage?')) {
      try {
        await vehicleService.delete(vehicleId);
        setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
        toast.success('Vehicle removed from garage');
      } catch {
        toast.error('Failed to remove vehicle');
      }
    }
  };

  // Handle Cancel Booking
  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    try {
      const updated = await bookingService.cancel(selectedBooking.id, cancelReason || 'Customer requested cancellation');
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast.info(`Booking ${selectedBooking.id} has been cancelled`);
      setIsCancelBookingOpen(false);
      setSelectedBooking(null);
      setCancelReason('');
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const upcomingAppointments = bookings.filter((b) =>
    ['Pending', 'Confirmed', 'In Service', 'Ready for Delivery'].includes(b.status)
  );

  const pastHistory = bookings.filter((b) =>
    ['Completed', 'Cancelled'].includes(b.status)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Profile Header & Contact Info */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl sm:text-2xl font-black overflow-hidden ring-4 ring-blue-50">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser?.name?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentUser?.name}
                </h1>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full capitalize">
                  {currentUser?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rider Account • Member since {formatDate(currentUser?.joinedDate || '2024-01-01')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition self-start sm:self-auto"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        {/* Contact details row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 p-3 rounded-xl">
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Mobile</span>
              <span className="font-medium text-slate-800">{currentUser?.phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 p-3 rounded-xl">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Email</span>
              <span className="font-medium text-slate-800 truncate block">{currentUser?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 p-3 rounded-xl sm:col-span-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Address</span>
              <span className="font-medium text-slate-800 truncate block">{currentUser?.address || 'Delhi NCR'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Vehicles Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bike className="w-5 h-5 text-blue-600" />
              My Registered Rides ({vehicles.length})
            </h2>
            <p className="text-xs text-slate-500">
              Manage two-wheelers in your garage and check service intervals
            </p>
          </div>

          <button
            onClick={() => setIsAddVehicleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>

        {vehicles.length === 0 ? (
          <EmptyState
            icon={Bike}
            title="No vehicles registered yet"
            description="Add your scooter or motorcycle to begin tracking routine maintenance."
            actionLabel="Register Vehicle"
            onAction={() => setIsAddVehicleOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((veh) => (
              <div key={veh.id} className="relative group">
                <VehicleCard vehicle={veh} />
                <button
                  onClick={() => handleDeleteVehicle(veh.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white shadow-sm transition opacity-0 group-hover:opacity-100"
                  title="Remove vehicle"
                  aria-label="Remove vehicle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Appointments Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Upcoming Service Appointments ({upcomingAppointments.length})
          </h2>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center text-xs text-slate-500 shadow-subtle">
            No active appointments in the queue.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingAppointments.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={(b) => {
                  setSelectedBooking(b);
                  setIsReceiptOpen(true);
                }}
                onCancel={(b) => {
                  setSelectedBooking(b);
                  setIsCancelBookingOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Service History Tracker */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Past Service Records & History ({pastHistory.length})
          </h2>
          <p className="text-xs text-slate-500">
            Digital dealership service records for warranty protection and resale value
          </p>
        </div>

        {pastHistory.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center text-xs text-slate-500 shadow-subtle">
            No past service records on file yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pastHistory.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={(b) => {
                  setSelectedBooking(b);
                  setIsReceiptOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Rider Profile"
        subtitle="Update your contact details and address in Delhi NCR"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              placeholder="e.g. B-42, Defence Colony, New Delhi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
              <input
                type="text"
                value={profileForm.pincode}
                onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                placeholder="110024"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        title="Register Two-Wheeler"
        subtitle="Add your motorcycle or scooter to your digital MotoCare garage"
      >
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registration Number (e.g. DL 01 AZ 8840) *
            </label>
            <input
              type="text"
              value={newVehicle.regNumber}
              onChange={(e) => setNewVehicle({ ...newVehicle, regNumber: e.target.value.toUpperCase() })}
              placeholder="DL 01 AB 1234"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            {formErrors.regNumber && <p className="text-xs text-rose-600 mt-1">{formErrors.regNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
              <select
                value={newVehicle.brand}
                onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {POPULAR_DELHI_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name *</label>
              <input
                type="text"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                placeholder="e.g. Activa 6G"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {formErrors.model && <p className="text-xs text-rose-600 mt-1">{formErrors.model}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type *</label>
              <select
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Odometer (km)</label>
              <input
                type="number"
                value={newVehicle.odometer}
                onChange={(e) => setNewVehicle({ ...newVehicle, odometer: e.target.value })}
                placeholder="8500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddVehicleOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              Register Ride
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Booking Reason Modal */}
      <Modal
        isOpen={isCancelBookingOpen}
        onClose={() => setIsCancelBookingOpen(false)}
        title="Cancel Service Appointment"
        subtitle={`Booking Ref: ${selectedBooking?.id}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs flex items-start gap-2 border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Are you sure you want to cancel this booking? This slot will be released back to the dealership bay pool.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Cancellation</label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict, vehicle sold, travelling out of Delhi..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsCancelBookingOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm"
            >
              Yes, Cancel Slot
            </button>
          </div>
        </div>
      </Modal>

      {/* Printable Receipt Modal */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Official Service Bill / Receipt"
        subtitle={`Invoice No: ${selectedBooking?.id}`}
        maxWidth="max-w-2xl"
      >
        {selectedBooking && (
          <div className="space-y-5 text-xs printable-receipt">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedBooking.serviceTitle}</h3>
                  <p className="text-slate-500 font-medium">Workshop: {selectedBooking.serviceCentreName}</p>
                </div>
                <span className="font-mono bg-white px-2 py-1 rounded text-xs font-bold border border-slate-200">
                  {selectedBooking.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>Vehicle: <span className="font-semibold text-slate-800">{selectedBooking.vehicleModel} ({selectedBooking.vehicleReg})</span></div>
                <div>Date: <span className="font-semibold text-slate-800">{formatDate(selectedBooking.appointmentDate)}</span></div>
                <div>Customer: <span className="font-semibold text-slate-800">{selectedBooking.customerName}</span></div>
                <div>Status: <span className="font-semibold text-slate-800">{selectedBooking.status}</span></div>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-700">
                <span>Base Service Labor & Fluids</span>
                <span className="font-semibold">{formatCurrency(selectedBooking.servicePrice)}</span>
              </div>

              {(selectedBooking.additionalServices || []).map((add) => (
                <div key={add.id} className="flex justify-between text-slate-500 pl-2">
                  <span>+ {add.name}</span>
                  <span>{formatCurrency(add.price)}</span>
                </div>
              ))}

              {selectedBooking.pickupDrop && (
                <div className="flex justify-between text-slate-500 pl-2">
                  <span>+ Doorstep Transit Carrier (Delhi NCR)</span>
                  <span>{formatCurrency(299)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                <span>GST (18%)</span>
                <span>{formatCurrency(selectedBooking.tax)}</span>
              </div>

              <div className="flex justify-between text-slate-900 pt-2 border-t-2 border-slate-200 font-bold text-sm">
                <span>Total Amount</span>
                <span className="text-blue-700 text-base">{formatCurrency(selectedBooking.totalAmount)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between no-print">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
