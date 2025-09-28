import axios from 'axios';
import {
  ApiResponse,
  PaginatedResponse,
  Fumigacion,
  Lote,
  User,
  LoginFormData,
  FumigacionFormData,
  LoteFormData,
  FumigacionFilters,
  LoteFilters,
} from '../types/index';

// Configurar axios con interceptores
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Interceptor para requests (agregar token si existe)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para responses (manejo de errores global)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH API
export const authApi = {
  login: async (
    credentials: LoginFormData
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.success && data.data.token) {
      localStorage.setItem('authToken', data.data.token);
    }
    return data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const { data } = await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    return data;
  },
};

// FUMIGACIONES API
export const fumigacionesApi = {
  getAll: async (
    filters?: FumigacionFilters & { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Fumigacion>> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.estado && filters.estado !== 'TODOS')
      params.append('estado', filters.estado);
    if (filters?.tipoTratamiento && filters.tipoTratamiento !== 'TODOS')
      params.append('tipoTratamiento', filters.tipoTratamiento);
    if (filters?.responsable) params.append('search', filters.responsable);
    if (filters?.campo) params.append('search', filters.campo);

    const { data } = await api.get(`/fumigaciones?${params}`);
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Fumigacion>> => {
    const { data } = await api.get(`/fumigaciones/${id}`);
    return data;
  },

  create: async (
    fumigacion: FumigacionFormData
  ): Promise<ApiResponse<Fumigacion>> => {
    const { data } = await api.post('/fumigaciones', fumigacion);
    return data;
  },

  update: async (
    id: string,
    fumigacion: Partial<FumigacionFormData>
  ): Promise<ApiResponse<Fumigacion>> => {
    const { data } = await api.put(`/fumigaciones/${id}`, fumigacion);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/fumigaciones/${id}`);
    return data;
  },
};

// LOTES API
export const lotesApi = {
  getAll: async (
    filters?: LoteFilters & { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Lote>> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.cultivo && filters.cultivo !== 'TODOS')
      params.append('cultivo', filters.cultivo);
    if (filters?.estado && filters.estado !== 'TODOS')
      params.append('estado', filters.estado);
    if (filters?.propietario) params.append('search', filters.propietario);

    const { data } = await api.get(`/lotes?${params}`);
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Lote>> => {
    const { data } = await api.get(`/lotes/${id}`);
    return data;
  },

  create: async (lote: LoteFormData): Promise<ApiResponse<Lote>> => {
    const { data } = await api.post('/lotes', lote);
    return data;
  },

  update: async (
    id: string,
    lote: Partial<LoteFormData>
  ): Promise<ApiResponse<Lote>> => {
    const { data } = await api.put(`/lotes/${id}`, lote);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/lotes/${id}`);
    return data;
  },
};

// Export default con todas las APIs
export default {
  auth: authApi,
  fumigaciones: fumigacionesApi,
  lotes: lotesApi,
};
