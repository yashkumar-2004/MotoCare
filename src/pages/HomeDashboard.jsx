import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Bike,
  PlusCircle,
  FileText,
  Activity,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { servicePackageService } from '../services/servicePackageService';
import { VehicleCard } from '../components/cards/VehicleCard';
import { ServiceCard } from '../components/cards/ServiceCard';
import { DashboardCard } from '../components/cards/DashboardCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { CardSkeleton, DashboardStatsSkeleton } from '../components/common/LoadingSkeleton';
import { formatCurrency, formatDate } from '../utils/formatters';

export const HomeDashboard = () => {
  const { currentUser } = useAuth();
  const { selectVehicleForBooking, goToStep } = useBooking();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (currentUser?.id) {
          const [userVehicles, userBookings, allServices] = await Promise.all([
            vehicleService.getByUserId(currentUser.id),
            bookingService.getByUserId(currentUser.id),
            servicePackageService.getAll({ _limit: 3 }),
          ]);

          setVehicles(userVehicles);
          setBookings(userBookings);
          setPopularServices(allServices.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Find upcoming booking (Pending, Confirmed, or In Service)
  const upcomingBooking = bookings.find((b) =>
    ['Pending', 'Confirmed', 'In Service', 'Ready for Delivery'].includes(b.status)
  );

  // Find last completed service
  const lastCompletedBooking = bookings.find((b) => b.status === 'Completed');

  // Next service due across registered vehicles
  const primaryVehicle = vehicles[0];

  const handleBookVehicle = (veh) => {
    selectVehicleForBooking(veh);
    goToStep(2); // vehicle is selected, jump to service
    navigate('/booking');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome & Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Delhi NCR Authorized Dealership Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-blue-400">{currentUser?.name || 'Rider'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your registered two-wheeler garage status, service reminders, and maintenance history at a glance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/booking"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Bay Service
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold backdrop-blur-sm transition"
            >
              View Service History
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Statistics */}
      {loading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Registered Rides"
            value={vehicles.length}
            subtitle="In your MotoCare garage"
            icon={Bike}
            color="blue"
            onClick={() => navigate('/profile')}
          />
          <DashboardCard
            title="Total Services Done"
            value={bookings.filter((b) => b.status === 'Completed').length}
            subtitle="Verified dealer records"
            icon={ShieldCheck}
            color="emerald"
            onClick={() => navigate('/profile')}
          />
          <DashboardCard
            title="Active / Scheduled"
            value={upcomingBooking ? '1 In Bay' : '0 Pending'}
            subtitle={upcomingBooking ? upcomingBooking.status : 'All caught up'}
            icon={Activity}
            color="amber"
          />
          <DashboardCard
            title="Warranty Status"
            value="Active"
            subtitle="100% genuine OEM spares"
            icon={CheckCircle2}
            color="purple"
          />
        </div>
      )}

      {/* 3. Upcoming Service Reminder & Last Service Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Service or Recommended Due (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Service & Bay Alerts
            </h2>
            <Link to="/booking" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              Book another slot <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingBooking ? (
            <div className="bg-white rounded-2xl border-2 border-blue-600/30 p-6 shadow-card relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl">
                Active Appointment
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {upcomingBooking.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {upcomingBooking.serviceTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                    <Bike className="w-4 h-4 text-blue-600" />
                    <span>{upcomingBooking.vehicleModel}</span>
                    <span className="font-mono font-semibold">({upcomingBooking.vehicleReg})</span>
                  </div>
                </div>

                <StatusBadge status={upcomingBooking.status} size="lg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Scheduled Time</span>
                    <span className="text-slate-600">
                      {formatDate(upcomingBooking.appointmentDate)} • {upcomingBooking.appointmentSlot}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Delhi NCR Workshop</span>
                    <span className="text-slate-600 line-clamp-1">{upcomingBooking.serviceCentreName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Total Invoice: </span>
                  <span className="font-bold text-slate-900">{formatCurrency(upcomingBooking.totalAmount)}</span>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline"
                >
                  Manage or Cancel <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-subtle flex flex-col sm:flex-row items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-base font-bold text-slate-800">
                  {primaryVehicle ? `Periodic Service Due: ${primaryVehicle.brand} ${primaryVehicle.model}` : 'No Upcoming Bookings Scheduled'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {primaryVehicle?.nextServiceDue
                    ? `Recommended maintenance due on ${formatDate(primaryVehicle.nextServiceDue)}. Book your bay now to ensure optimal engine performance.`
                    : 'Keep your motorcycle or scooter in peak health with our 32-point inspection.'}
                </p>
              </div>
              <Link
                to="/booking"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition"
              >
                Schedule Bay Now
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Last Service Record (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Last Service Record
            </h2>
            <Link to="/profile" className="text-xs text-blue-600 font-semibold hover:underline">
              All records
            </Link>
          </div>

          {lastCompletedBooking ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-subtle space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  {lastCompletedBooking.serviceTitle}
                </span>
                <StatusBadge status="Completed" size="sm" />
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date Serviced</span>
                  <span className="font-semibold text-slate-800">{formatDate(lastCompletedBooking.appointmentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle</span>
                  <span className="font-medium">{lastCompletedBooking.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bay Location</span>
                  <span className="font-medium line-clamp-1">{lastCompletedBooking.serviceCentreName.split('-')[0]}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-slate-900 font-bold">
                  <span>Amount Paid</span>
                  <span className="text-emerald-700">{formatCurrency(lastCompletedBooking.totalAmount)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/profile"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  View Service Bill & Diagnostics
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-subtle">
              <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No past service bills recorded.</p>
              <p className="text-[11px] text-slate-400 mt-1">Book your first service to begin tracking digital records.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Registered Vehicles Summary (My Garage) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bike className="w-5 h-5 text-blue-600" />
              My Garage ({vehicles.length} Two-Wheelers)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Service history, odometer reading, and maintenance due dates
            </p>
          </div>

          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            Manage Vehicles
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((veh) => (
              <VehicleCard
                key={veh.id}
                vehicle={veh}
                onBookService={handleBookVehicle}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Popular Service Packages Quick Action */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              Featured Delhi NCR Service Packages
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent upfront pricing with genuine OEM spares and warranty
            </p>
          </div>

          <Link
            to="/services"
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            Explore all packages ({6}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};
