import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Users,
  IndianRupee,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Building2,
  Wrench,
  Edit,
  TrendingUp,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { bookingService } from '../services/bookingService';
import { servicePackageService } from '../services/servicePackageService';
import { centreService } from '../services/centreService';
import { apiClient } from '../services/api';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DashboardCard } from '../components/cards/DashboardCard';
import { Modal } from '../components/common/Modal';
import { AdminSidebar } from '../components/common/Sidebar';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BOOKING_STATUS } from '../utils/constants';

export const AdminDashboard = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bookings' | 'customers' | 'packages' | 'centres'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search in Bookings Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Status Update Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Package Price Edit Modal
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [allBookings, allUsers, allPackages, allCentres] = await Promise.all([
        bookingService.getAll({ _sort: 'createdAt', _order: 'desc' }),
        apiClient.get('users'),
        servicePackageService.getAll(),
        centreService.getAll(),
      ]);

      setBookings(allBookings);
      setCustomers(allUsers.filter((u) => u.role !== 'admin'));
      setPackages(allPackages);
      setCentres(allCentres);
    } catch (err) {
      console.error('Failed to load admin data', err);
      toast.error('Failed to load dealership data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Aggregate Key Metrics
  const metrics = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const inService = bookings.filter((b) => ['In Service', 'Confirmed', 'Ready for Delivery'].includes(b.status)).length;
    const completed = bookings.filter((b) => b.status === 'Completed').length;
    const revenue = bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    return { total, pending, inService, completed, revenue };
  }, [bookings]);

  // Chart Data: Status Breakdown
  const statusPieData = useMemo(() => {
    const counts = {};
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });

    const colors = {
      Pending: '#f59e0b',
      Confirmed: '#3b82f6',
      'In Service': '#8b5cf6',
      'Ready for Delivery': '#10b981',
      Completed: '#0d9488',
      Cancelled: '#f43f5e',
    };

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#64748b',
    }));
  }, [bookings]);

  // Chart Data: Revenue by Service Centre
  const centreChartData = useMemo(() => {
    const map = {};
    centres.forEach((c) => {
      map[c.name.split('-')[0].trim()] = 0;
    });

    bookings.forEach((b) => {
      if (b.status !== 'Cancelled') {
        const shortName = (b.serviceCentreName || '').split('-')[0].trim();
        map[shortName] = (map[shortName] || 0) + (Number(b.totalAmount) || 0);
      }
    });

    return Object.entries(map).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  }, [centres, bookings]);

  // Filtered Bookings Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        (b.customerName && b.customerName.toLowerCase().includes(q)) ||
        (b.vehicleReg && b.vehicleReg.toLowerCase().includes(q)) ||
        (b.serviceTitle && b.serviceTitle.toLowerCase().includes(q));

      const matchesStatus = !statusFilter || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Handle Status Update
  const handleOpenStatusModal = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusNote('');
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    try {
      const updated = await bookingService.updateStatus(selectedBooking.id, newStatus, statusNote);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast.success(`Booking ${selectedBooking.id} updated to ${newStatus}`);
      setIsStatusModalOpen(false);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // Handle Edit Package Price
  const handleSavePackagePrice = async () => {
    if (!selectedPackage || !editPrice) return;
    try {
      const updated = await servicePackageService.update(selectedPackage.id, {
        price: Number(editPrice),
      });
      setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success(`Updated price for ${selectedPackage.title}`);
      setIsPackageModalOpen(false);
    } catch {
      toast.error('Failed to update package');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                  Dealership Command Center
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Delhi NCR Service Operations
              </h1>
            </div>
          </div>

          <button
            onClick={loadAdminData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            Sync Real-Time Bays
          </button>
        </div>

        {/* Tab 1: Overview & Analytics */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Key 5 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <DashboardCard
                title="Total Bookings"
                value={metrics.total}
                subtitle="All time requests"
                icon={CalendarCheck}
                color="blue"
              />
              <DashboardCard
                title="Pending Bays"
                value={metrics.pending}
                subtitle="Awaiting advisor"
                icon={Clock}
                color="amber"
              />
              <DashboardCard
                title="Active in Bays"
                value={metrics.inService}
                subtitle="In bay or inspection"
                icon={Wrench}
                color="purple"
              />
              <DashboardCard
                title="Completed"
                value={metrics.completed}
                subtitle="Delivered to riders"
                icon={CheckCircle2}
                color="emerald"
              />
              <DashboardCard
                title="Network Revenue"
                value={formatCurrency(metrics.revenue)}
                subtitle="Excl. cancelled"
                icon={IndianRupee}
                color="blue"
              />
            </div>

            {/* Recharts Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Revenue by Service Centre Bar Chart (7 cols) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Revenue Distribution by Delhi NCR Hub
                    </h3>
                    <p className="text-xs text-slate-400">Total billings per workshop location</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Live Data
                  </span>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={centreChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                      <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Pie Chart (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-subtle space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Booking Status Breakdown</h3>
                  <p className="text-xs text-slate-400">Current allocation across workshop pipeline</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Bookings Quick Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Latest Bay Requests</h3>
                  <p className="text-xs text-slate-400">Most recent service appointments</p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View All ({bookings.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Booking ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Service</th>
                      <th className="py-2.5 px-3">Workshop</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{b.id}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">{b.customerName}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {b.vehicleReg}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-[150px] truncate">{b.serviceTitle}</td>
                        <td className="py-3 px-3 text-slate-500 max-w-[120px] truncate">{b.serviceCentreName.split('-')[0]}</td>
                        <td className="py-3 px-3">
                          <StatusBadge status={b.status} size="sm" />
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          {formatCurrency(b.totalAmount)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleOpenStatusModal(b)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition font-medium"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bookings Management Full Table */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">All Dealership Bookings</h2>
                <p className="text-xs text-slate-400">Search, filter, inspect and update customer service jobs</p>
              </div>

              {/* Search & Status Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, reg..."
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-56 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:border-blue-600"
                >
                  <option value="">All Statuses</option>
                  {Object.values(BOOKING_STATUS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Booking ID</th>
                    <th className="py-3 px-3">Customer & Contact</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Appointment Slot</th>
                    <th className="py-3 px-3">Workshop Bay</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-center">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No bookings match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{b.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{b.customerName}</div>
                          <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{b.vehicleModel}</div>
                          <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">
                            {b.vehicleReg}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          <div>{formatDate(b.appointmentDate)}</div>
                          <div className="text-[10px] text-slate-400">{b.appointmentSlot}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-[130px] truncate">
                          {b.serviceCentreName}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={b.status} size="sm" />
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          {formatCurrency(b.totalAmount)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleOpenStatusModal(b)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition font-semibold text-xs shadow-sm"
                          >
                            Edit Status
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Management */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle p-5 space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Delhi NCR Customer Directory</h2>
              <p className="text-xs text-slate-400">Registered two-wheeler owners across the network</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {c.avatar ? <img src={c.avatar} alt={c.name} className="w-full h-full rounded-full object-cover" /> : c.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                      <p className="text-[11px] text-slate-400">ID: {c.id}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200">
                    <div><span className="text-slate-400">Phone:</span> {c.phone}</div>
                    <div className="truncate"><span className="text-slate-400">Email:</span> {c.email}</div>
                    <div className="truncate"><span className="text-slate-400">Address:</span> {c.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Service Package Management */}
        {activeTab === 'packages' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle p-5 space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Service Package Catalog & Pricing</h2>
              <p className="text-xs text-slate-400">Adjust standard retail pricing and popular service flags</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {pkg.category}
                      </span>
                      {pkg.isPopular && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Popular
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{pkg.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{pkg.shortDescription || pkg.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Bay Price</span>
                      <span className="text-base font-black text-slate-900">{formatCurrency(pkg.price)}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setEditPrice(String(pkg.price));
                        setIsPackageModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Delhi NCR Centres */}
        {activeTab === 'centres' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle p-5 space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Delhi NCR Service Bay Capacity</h2>
              <p className="text-xs text-slate-400">Workshop stations, operational timings, and location coverage</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centres.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                      {c.zone}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {c.totalBays} Active Bays
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.address}</p>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex justify-between">
                    <span>{c.openingHours}</span>
                    <span className="font-semibold">{c.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Update Booking Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Booking Stage"
        subtitle={`Booking Ref: ${selectedBooking?.id} (${selectedBooking?.customerName})`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select New Status *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              {Object.values(BOOKING_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Change Log / Advisor Note
            </label>
            <textarea
              rows={3}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Engine flush completed, bike moved to water wash bay #2..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveStatus}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              Save New Status
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Package Price Modal */}
      <Modal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        title="Update Package Fee"
        subtitle={selectedPackage?.title}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Package Rate in INR (₹)
            </label>
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsPackageModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePackagePrice}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              Update Price
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
