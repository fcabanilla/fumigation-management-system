// ==================== HOOKS PARA API DE FUMIGACIONES ====================

/**
 * Custom hooks para manejar estado y llamadas a la API de fumigaciones
 * Incluye loading states, error handling y cache básico
 */

import { useState, useEffect, useCallback } from 'react';
import { Fumigacion } from '../components/FumigacionesList';
import { TrabajoPasado } from '../utils/FumigacionValidator';
import {
  fumigacionesAPI,
  trabajosPasadosAPI,
  StatsResponse,
  PaginatedResponse,
} from '../api/fumigacionesService';
import {
  FumigacionCreateRequest,
  FumigacionUpdateRequest,
  FumigacionFiltersQuery,
} from '../api/fumigacionesHandlers';

// ==================== TYPES ====================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseApiMutationState<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>;
  loading: boolean;
  error: Error | null;
  data: TData | null;
  reset: () => void;
}

interface UsePaginatedApiState<T> extends UseApiState<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

// ==================== FUMIGACIONES HOOKS ====================

/**
 * Hook para obtener lista de fumigaciones con filtros y paginación
 */
export const useFumigaciones = (
  initialFilters: FumigacionFiltersQuery = {},
  autoFetch = true
): UsePaginatedApiState<Fumigacion> => {
  const [data, setData] = useState<Fumigacion[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchData = useCallback(
    async (newFilters?: FumigacionFiltersQuery, append = false) => {
      try {
        setLoading(true);
        setError(null);

        const actualFilters = newFilters || filters;
        const result = await fumigacionesAPI.getAll(actualFilters);

        if (append) {
          setData(prev => [...prev, ...result.data]);
        } else {
          setData(result.data);
        }
        setPagination(result.pagination);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching fumigaciones:', err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const refetch = useCallback(() => fetchData(), [fetchData]);

  const loadMore = useCallback(async () => {
    if (!pagination || pagination.page >= pagination.totalPages) return;

    const nextFilters = {
      ...filters,
      page: String(pagination.page + 1),
    };

    await fetchData(nextFilters, true);
  }, [filters, pagination, fetchData]);

  // Función para actualizar filtros
  const updateFilters = useCallback(
    (newFilters: FumigacionFiltersQuery) => {
      setFilters(newFilters);
      fetchData(newFilters);
    },
    [fetchData]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch,
    loadMore,
    hasMore: pagination ? pagination.page < pagination.totalPages : false,
    updateFilters,
  } as any;
};

/**
 * Hook para obtener una fumigación específica por ID
 */
export const useFumigacion = (id: string | null): UseApiState<Fumigacion> => {
  const [data, setData] = useState<Fumigacion | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const fumigacion = await fumigacionesAPI.getById(id);
      setData(fumigacion);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching fumigacion:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook para crear fumigaciones
 */
export const useCreateFumigacion = (): UseApiMutationState<
  Fumigacion,
  FumigacionCreateRequest
> => {
  const [data, setData] = useState<Fumigacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (fumigacion: FumigacionCreateRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fumigacionesAPI.create(fumigacion);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { mutate, loading, error, data, reset };
};

/**
 * Hook para actualizar fumigaciones
 */
export const useUpdateFumigacion = (): UseApiMutationState<
  Fumigacion,
  { id: string; updates: FumigacionUpdateRequest }
> => {
  const [data, setData] = useState<Fumigacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async ({
      id,
      updates,
    }: {
      id: string;
      updates: FumigacionUpdateRequest;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const result = await fumigacionesAPI.update(id, updates);
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { mutate, loading, error, data, reset };
};

/**
 * Hook para eliminar fumigaciones
 */
export const useDeleteFumigacion = (): UseApiMutationState<
  { id: string; nombre: string },
  string
> => {
  const [data, setData] = useState<{ id: string; nombre: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fumigacionesAPI.delete(id);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { mutate, loading, error, data, reset };
};

/**
 * Hook para cambiar estado de fumigaciones
 */
export const useChangeStatusFumigacion = (): UseApiMutationState<
  Fumigacion,
  { id: string; estado: string; observaciones?: string }
> => {
  const [data, setData] = useState<Fumigacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async ({
      id,
      estado,
      observaciones,
    }: {
      id: string;
      estado: string;
      observaciones?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const result = await fumigacionesAPI.changeStatus(
          id,
          estado,
          observaciones
        );
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { mutate, loading, error, data, reset };
};

/**
 * Hook para obtener estadísticas globales
 */
export const useFumigacionesStats = (): UseApiState<StatsResponse> => {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await fumigacionesAPI.getStats();
      setData(stats);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// ==================== TRABAJOS PASADOS HOOKS ====================

/**
 * Hook para obtener trabajos pasados
 */
export const useTrabajosPasados = (
  filters: { search?: string; tipoTratamiento?: string; producto?: string } = {}
): UseApiState<TrabajoPasado[]> => {
  const [data, setData] = useState<TrabajoPasado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const trabajos = await trabajosPasadosAPI.getAll(filters);
      setData(trabajos);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching trabajos pasados:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.tipoTratamiento, filters.producto]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook para buscar trabajos similares
 */
export const useTrabajosSimilares = (
  campo: string | null,
  tipoTratamiento: string | null,
  producto?: string | null
): UseApiState<TrabajoPasado[]> => {
  const [data, setData] = useState<TrabajoPasado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!campo || !tipoTratamiento) {
      setData([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const trabajos = await trabajosPasadosAPI.findSimilar(
        campo,
        tipoTratamiento,
        producto || undefined
      );
      setData(trabajos);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching trabajos similares:', err);
    } finally {
      setLoading(false);
    }
  }, [campo, tipoTratamiento, producto]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook para búsqueda en tiempo real con debounce
 */
export const useSearch = <T>(
  searchFunction: (query: string) => Promise<T[]>,
  debounceMs = 500
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const searchResults = await searchFunction(query);
        setResults(searchResults);
      } catch (err) {
        setError(err as Error);
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, searchFunction, debounceMs]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearResults: () => setResults([]),
  };
};

/**
 * Hook para manejar operaciones batch
 */
export const useBatchOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeBatch = useCallback(
    async <T>(operations: Array<() => Promise<T>>): Promise<T[]> => {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.allSettled(operations.map(op => op()));

        const successful: T[] = [];
        const failed: any[] = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successful.push(result.value);
          } else {
            failed.push({ index, error: result.reason });
          }
        });

        if (failed.length > 0) {
          console.warn('Some batch operations failed:', failed);
        }

        return successful;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { executeBatch, loading, error };
};

export default {
  useFumigaciones,
  useFumigacion,
  useCreateFumigacion,
  useUpdateFumigacion,
  useDeleteFumigacion,
  useChangeStatusFumigacion,
  useFumigacionesStats,
  useTrabajosPasados,
  useTrabajosSimilares,
  useSearch,
  useBatchOperations,
};
