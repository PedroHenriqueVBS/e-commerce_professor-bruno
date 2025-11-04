import api from './api';
import { type User } from '../types/Users';

export const userService = {
  getById: async (id: number): Promise<User> => {
    return api.get(`/users/${id}`);
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    return api.post(`/users/${id}`, data); 
  },

  delete: async (id: number): Promise<void> => {
    return api.delete(`/users/${id}`);
  },
};
