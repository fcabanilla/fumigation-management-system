// Types para el sistema de fumigación

export interface User {
  id: string;
  username: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  rememberMe?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Fumigacion {
  id: string;
  nombre: string;
  campo: string;
  tipoTratamiento: 'preventivo' | 'correctivo' | 'masivo' | 'selectivo';
  producto: string;
  dosis: number;
  fechaPlanificada: string;
  fechaRealizada?: string;
  estado: 'PLANIFICADA' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
  hectareas: number;
  costo: number;
  responsable: string;
  equipoUtilizado: string;
  observaciones?: string;
  condicionesClimaticas?: {
    temperatura?: number;
    humedad?: number;
    viento?: number;
    presion?: number;
  };
  resultados?: {
    efectividad?: number;
    cobertura?: number;
    incidencias?: string[];
  };
  geometria?: GeoJSONFeature;
  createdAt: string;
  updatedAt: string;
}

export interface Lote {
  id: string | number;
  nombre: string;
  descripcion: string;
  hectareas: number;
  cultivo: string;
  propietario: string;
  fechaCreacion: string;
  geometria?: GeoJSONFeature;
  estado?: 'activo' | 'inactivo' | 'en_preparacion';
  createdAt: string;
  updatedAt: string;
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    nombre?: string;
    cultivo?: string;
    [key: string]: any;
  };
  geometry: {
    type: 'Polygon' | 'Point' | 'LineString' | 'MultiPolygon';
    coordinates: number[][][];
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

// Form types
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface FumigacionFormData
  extends Omit<Fumigacion, 'id' | 'createdAt' | 'updatedAt'> {}

export interface LoteFormData
  extends Omit<Lote, 'id' | 'createdAt' | 'updatedAt'> {}

// Filter types
export interface FumigacionFilters {
  estado?: Fumigacion['estado'] | 'TODOS';
  tipoTratamiento?: Fumigacion['tipoTratamiento'] | 'TODOS';
  fechaInicio?: string;
  fechaFin?: string;
  responsable?: string;
  campo?: string;
}

export interface LoteFilters {
  cultivo?: string | 'TODOS';
  estado?: Lote['estado'] | 'TODOS';
  propietario?: string;
  hectareasMin?: number;
  hectareasMax?: number;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    text: string;
    textSecondary: string;
    background: string;
    backgroundGradient: string;
    surface: string;
    border: string;
    shadow: string;
  };
  isDark: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: string;
}
