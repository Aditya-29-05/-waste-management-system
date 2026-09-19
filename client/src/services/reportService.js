import { request } from './api';

export const reportService = {
  /**
   * Get all reports with optional query filters
   */
  getReports: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.wasteType) searchParams.append('wasteType', params.wasteType);
    if (params.myTasks) searchParams.append('myTasks', params.myTasks);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return await request(`/reports${query}`, { method: 'GET' });
  },

  /**
   * Get single report by ID
   */
  getReportById: async (id) => {
    return await request(`/reports/${id}`, { method: 'GET' });
  },

  /**
   * Create new waste report
   */
  createReport: async (reportData) => {
    return await request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },

  /**
   * Update report by ID
   */
  updateReport: async (id, data) => {
    return await request(`/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Delete report by ID
   */
  deleteReport: async (id) => {
    return await request(`/reports/${id}`, {
      method: 'DELETE'
    });
  }
};
