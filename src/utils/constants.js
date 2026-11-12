export const APP_NAME = 'MotoCare';
export const APP_TAGLINE = 'Delhi NCR Two-Wheeler Care & History Tracker';
export const SUPPORT_PHONE = '+91 1800 200 4040';
export const SUPPORT_EMAIL = 'support@motocare.in';

export const VEHICLE_TYPES = [
  { value: 'Scooter', label: 'Scooter (Gearless)' },
  { value: 'Commuter', label: 'Commuter (100cc - 160cc)' },
  { value: 'Sports', label: 'Sports / Naked (180cc - 400cc)' },
  { value: 'Cruiser', label: 'Cruiser / Touring (350cc+)' },
  { value: 'EV', label: 'Electric Two-Wheeler (EV)' },
];

export const SERVICE_CATEGORIES = [
  'All Categories',
  'Periodic Maintenance',
  'Express Care',
  'Engine & Diagnostics',
  'Deep Inspection & Safety',
  'EV Special Care'
];

export const SORT_OPTIONS = [
  { label: 'Popularity & Rating', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Duration: Quickest First', value: 'duration_asc' },
];

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_SERVICE: 'In Service',
  READY_FOR_DELIVERY: 'Ready for Delivery',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const STATUS_COLORS = {
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  Confirmed: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  'In Service': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500'
  },
  'Ready for Delivery': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  Completed: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    dot: 'bg-teal-600'
  },
  Cancelled: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500'
  }
};

export const POPULAR_DELHI_BRANDS = [
  'Honda',
  'Royal Enfield',
  'Hero MotoCorp',
  'TVS',
  'Bajaj',
  'Yamaha',
  'Suzuki',
  'Ather',
  'Ola Electric',
  'KTM',
  'BMW Motorrad'
];
