import { apiClient } from './api';

export const servicePackageService = {
  getAll: async (params = {}) => {
    return await apiClient.get('services', params);
  },

  getById: async (id) => {
    return await apiClient.getById('services', id);
  },

  getAddons: async () => {
    return await apiClient.get('additionalAddons');
  },

  getReviews: async (serviceId) => {
    const params = serviceId ? { serviceId } : {};
    return await apiClient.get('reviews', params);
  },

  update: async (id, data) => {
    return await apiClient.patch('services', id, data);
  }
};
