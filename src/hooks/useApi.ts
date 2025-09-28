// hooks/useApi.ts - Hook tipado para reemplazar localStorage
import { useState, useEffect } from 'react';
import {
  User,
  Fumigacion,
  Lote,
  ApiResponse,
  FumigacionFormData,
  LoteFormData,
} from '../types';

// Tipos específicos para auth
interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

// Cliente HTTP simple
const apiClient = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();
  return data;
};

// Hook para autenticación
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Al inicializar, verificar si hay usuario logueado
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (
    username: string,
    password: string,
    rememberMe: boolean
  ): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await apiClient<{ user: User; token: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ username, password, rememberMe }),
        }
      );

      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData.user);

        // Solo guardamos en localStorage para persistencia de sesión, no datos de negocio
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData.user));
          localStorage.setItem('token', userData.token);
        } else {
          sessionStorage.setItem('user', JSON.stringify(userData.user));
          sessionStorage.setItem('token', userData.token);
        }

        return { success: true };
      } else {
        return { success: false, error: response.error || 'Error desconocido' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return { user, isLoading, login, logout };
}

// Hook para fumigaciones
export function useFumigaciones() {
  const [fumigaciones, setFumigaciones] = useState<Fumigacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFumigaciones = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiClient<Fumigacion[]>('/api/fumigaciones');
      if (response.success && response.data) {
        setFumigaciones(response.data);
      }
    } catch (error) {
      console.error('Error cargando fumigaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFumigacion = async (
    fumigacionData: FumigacionFormData
  ): Promise<LoginResult> => {
    try {
      const response = await apiClient<Fumigacion>('/api/fumigaciones', {
        method: 'POST',
        body: JSON.stringify(fumigacionData),
      });

      if (response.success && response.data) {
        setFumigaciones(prev => [response.data!, ...prev]);
        return { success: true };
      }
      return { success: false, error: response.error || 'Error desconocido' };
    } catch (error) {
      return { success: false, error: 'Error creando fumigación' };
    }
  };

  const updateFumigacion = async (
    id: string,
    fumigacionData: Partial<FumigacionFormData>
  ): Promise<LoginResult> => {
    try {
      const response = await apiClient<Fumigacion>(`/api/fumigaciones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fumigacionData),
      });

      if (response.success && response.data) {
        setFumigaciones(prev =>
          prev.map(f => (f.id === id ? response.data! : f))
        );
        return { success: true };
      }
      return { success: false, error: response.error || 'Error desconocido' };
    } catch (error) {
      return { success: false, error: 'Error actualizando fumigación' };
    }
  };

  const deleteFumigacion = async (id: string): Promise<LoginResult> => {
    try {
      const response = await apiClient<null>(`/api/fumigaciones/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setFumigaciones(prev => prev.filter(f => f.id !== id));
        return { success: true };
      }
      return { success: false, error: response.error || 'Error desconocido' };
    } catch (error) {
      return { success: false, error: 'Error eliminando fumigación' };
    }
  };

  useEffect(() => {
    loadFumigaciones();
  }, []);

  return {
    fumigaciones,
    isLoading,
    loadFumigaciones,
    createFumigacion,
    updateFumigacion,
    deleteFumigacion,
  };
}

// Hook para lotes
export function useLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLotes = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiClient<Lote[]>('/api/lotes');
      if (response.success && response.data) {
        setLotes(response.data);
      }
    } catch (error) {
      console.error('Error cargando lotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLote = async (loteData: LoteFormData): Promise<LoginResult> => {
    try {
      const response = await apiClient<Lote>('/api/lotes', {
        method: 'POST',
        body: JSON.stringify(loteData),
      });

      if (response.success && response.data) {
        setLotes(prev => [response.data!, ...prev]);
        return { success: true };
      }
      return { success: false, error: response.error || 'Error desconocido' };
    } catch (error) {
      return { success: false, error: 'Error creando lote' };
    }
  };

  const updateLote = async (
    id: string,
    loteData: Partial<LoteFormData>
  ): Promise<LoginResult> => {
    try {
      const response = await apiClient<Lote>(`/api/lotes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(loteData),
      });

      if (response.success && response.data) {
        setLotes(prev => prev.map(l => (l.id === id ? response.data! : l)));
        return { success: true };
      }
      return { success: false, error: response.error || 'Error desconocido' };
    } catch (error) {
      return { success: false, error: 'Error actualizando lote' };
    }
  };

  const deleteLote = async (id: string): Promise<LoginResult> => {
    try {
      const response = await apiClient<null>(`/api/lotes/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setLotes(prev => prev.filter(l => l.id !== id));
        return { success: true };
      }
      return { success: false, error: response.error || 'Error desconocido' };
    } catch (error) {
      return { success: false, error: 'Error eliminando lote' };
    }
  };

  useEffect(() => {
    loadLotes();
  }, []);

  return {
    lotes,
    isLoading,
    loadLotes,
    createLote,
    updateLote,
    deleteLote,
  };
}
