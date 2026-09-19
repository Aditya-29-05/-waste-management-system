import { request } from './api';

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  /**
   * Get current authenticated user
   */
  getMe: async () => {
    return await request('/auth/me', {
      method: 'GET'
    });
  }
};
