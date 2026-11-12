import { apiClient } from './api';

export const centreService = {
  getAll: async (params = {}) => {
    return await apiClient.get('serviceCentres', params);
  },

  getById: async (id) => {
    return await apiClient.getById('serviceCentres', id);
  }
};
