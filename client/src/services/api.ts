import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Machine {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  yearOfManufacture: number;
  specifications: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  businessType: string;
  location: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  isOpen: boolean;
  openToNewBusiness: boolean;
  machinery: Machine[];
  operatingHours: {
    [key: string]: { open: string; close: string };
  };
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const businessService = {
  getAll: async (): Promise<Business[]> => {
    const response = await api.get('/businesses');
    return response.data;
  },

  getById: async (id: string): Promise<Business> => {
    const response = await api.get(`/businesses/${id}`);
    return response.data;
  },

  create: async (business: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business> => {
    const response = await api.post('/businesses', business);
    return response.data;
  },

  update: async (id: string, business: Partial<Business>): Promise<Business> => {
    const response = await api.put(`/businesses/${id}`, business);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/businesses/${id}`);
  },
};

export default api; 