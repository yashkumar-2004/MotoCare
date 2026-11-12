import { apiClient } from './api';

export const vehicleService = {
  getAll: async (params = {}) => {
    return await apiClient.get('vehicles', params);
  },

  getByUserId: async (userId) => {
    return await apiClient.get('vehicles', { ownerId: userId });
  },

  getById: async (id) => {
    return await apiClient.getById('vehicles', id);
  },

  create: async (vehicleData) => {
    return await apiClient.post('vehicles', vehicleData);
  },

  update: async (id, vehicleData) => {
    return await apiClient.patch('vehicles', id, vehicleData);
  },

  delete: async (id) => {
    return await apiClient.delete('vehicles', id);
  }
};
