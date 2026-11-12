import { apiClient } from './api';
import { generateBookingId, calculateBilling } from '../utils/formatters';

export const bookingService = {
  getAll: async (params = {}) => {
    return await apiClient.get('bookings', params);
  },

  getById: async (id) => {
    return await apiClient.getById('bookings', id);
  },

  getByUserId: async (userId) => {
    return await apiClient.get('bookings', { userId, _sort: 'createdAt', _order: 'desc' });
  },

  create: async (data) => {
    const bookingId = generateBookingId();
    const billing = calculateBilling(data.subtotal || data.servicePrice, data.pickupDrop);

    const newBooking = {
      id: bookingId,
      ...data,
      subtotal: billing.subtotal,
      tax: billing.tax,
      totalAmount: billing.total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      history: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Booking requested online via MotoCare Portal'
        }
      ]
    };

    return await apiClient.post('bookings', newBooking);
  },

  updateStatus: async (id, newStatus, note = '') => {
    const booking = await apiClient.getById('bookings', id);
    const history = Array.isArray(booking.history) ? [...booking.history] : [];
    
    history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`
    });

    return await apiClient.patch('bookings', id, {
      status: newStatus,
      history
    });
  },

  cancel: async (id, reason = 'Cancelled by customer') => {
    const booking = await apiClient.getById('bookings', id);
    const history = Array.isArray(booking.history) ? [...booking.history] : [];
    
    history.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      note: `Cancelled: ${reason}`
    });

    return await apiClient.patch('bookings', id, {
      status: 'Cancelled',
      cancelReason: reason,
      history
    });
  }
};
