import { request } from './api';

export const collectionService = {
  /**
   * Get all collection requests with optional filters
   */
  getCollections: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.wasteType) searchParams.append('wasteType', params.wasteType);
    if (params.myTasks) searchParams.append('myTasks', params.myTasks);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return await request(`/collections${query}`, { method: 'GET' });
  },

  /**
   * Get single collection request by ID
   */
  getCollectionById: async (id) => {
    return await request(`/collections/${id}`, { method: 'GET' });
  },

  /**
   * Create collection request
   */
  createCollection: async (data) => {
    return await request('/collections', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Update collection request
   */
  updateCollection: async (id, data) => {
    return await request(`/collections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Delete collection request
   */
  deleteCollection: async (id) => {
    return await request(`/collections/${id}`, {
      method: 'DELETE'
    });
  }
};
