// ==================== FUMIGACION STATE MACHINE ====================

/**
 * Sistema de gestión de estados para fumigaciones agrícolas
 * Implementa una máquina de estados robusta con transiciones válidas
 * y workflows definidos para el ciclo de vida completo de fumigaciones.
 */

// ==================== TYPES & INTERFACES ====================

/** Estados posibles de una fumigación */
export type FumigacionEstado =
  | 'Planificada'
  | 'En Proceso'
  | 'Completada'
  | 'Cancelada'
  | 'Pausada'
  | 'Pendiente Aprobacion';

/** Razones de transición para auditoría */
export interface TransicionRazon {
  motivo: string;
  usuario: string;
  timestamp: string;
  observaciones?: string;
}

/** Resultado de una transición de estado */
export interface TransicionResultado {
  exito: boolean;
  estadoAnterior: FumigacionEstado;
  estadoNuevo: FumigacionEstado;
  mensaje: string;
  requiereValidacion?: boolean;
  camposRequeridos?: string[];
}

/** Configuración de una transición */
export interface ConfiguracionTransicion {
  desde: FumigacionEstado[];
  hacia: FumigacionEstado;
  validaciones: ((fumigacion: any) => boolean)[];
  camposRequeridos?: string[];
  permisoRequerido?: string;
  descripcion: string;
}

/** Histórico de cambios de estado */
export interface HistorialEstado {
  id: string;
  fumigacionId: string;
  estadoAnterior: FumigacionEstado;
  estadoNuevo: FumigacionEstado;
  razon: TransicionRazon;
  timestamp: string;
}

// ==================== CONSTANTS ====================

/** Colores asociados a cada estado */
export const COLORES_ESTADO: Record<FumigacionEstado, string> = {
  Planificada: '#3498db', // Azul - planificación
  'Pendiente Aprobacion': '#9b59b6', // Morado - esperando
  'En Proceso': '#f39c12', // Naranja - acción
  Pausada: '#f1c40f', // Amarillo - pausa temporal
  Completada: '#27ae60', // Verde - éxito
  Cancelada: '#e74c3c', // Rojo - cancelación
};

/** Íconos asociados a cada estado */
export const ICONOS_ESTADO: Record<FumigacionEstado, string> = {
  Planificada: '📋',
  'Pendiente Aprobacion': '⏳',
  'En Proceso': '🚛',
  Pausada: '⏸️',
  Completada: '✅',
  Cancelada: '❌',
};

/** Descripciones de cada estado */
export const DESCRIPCIONES_ESTADO: Record<FumigacionEstado, string> = {
  Planificada: 'Fumigación programada y lista para ejecución',
  'Pendiente Aprobacion': 'Esperando aprobación de supervisor',
  'En Proceso': 'Fumigación en ejecución actualmente',
  Pausada: 'Fumigación temporalmente pausada',
  Completada: 'Fumigación finalizada exitosamente',
  Cancelada: 'Fumigación cancelada definitivamente',
};

// ==================== STATE MACHINE CONFIGURATION ====================

/** Configuración completa de transiciones válidas */
export const TRANSICIONES_CONFIGURACION: Record<
  string,
  ConfiguracionTransicion
> = {
  // INICIAR PROCESO
  planificada_to_proceso: {
    desde: ['Planificada'],
    hacia: 'En Proceso',
    validaciones: [
      f => !!f.responsable,
      f => !!f.equipoUtilizado,
      f => !!f.producto,
      f => f.dosis > 0,
      f => new Date(f.fechaPlanificada) <= new Date(),
    ],
    camposRequeridos: ['responsable', 'equipoUtilizado', 'producto', 'dosis'],
    permisoRequerido: 'INICIAR_FUMIGACION',
    descripcion: 'Iniciar ejecución de fumigación planificada',
  },

  // SOLICITAR APROBACIÓN
  planificada_to_pendiente: {
    desde: ['Planificada'],
    hacia: 'Pendiente Aprobacion',
    validaciones: [
      f => f.costo > 100000, // Fumigaciones costosas requieren aprobación
    ],
    permisoRequerido: 'SOLICITAR_APROBACION',
    descripcion: 'Solicitar aprobación para fumigación costosa',
  },

  // APROBAR Y PROCEDER
  pendiente_to_planificada: {
    desde: ['Pendiente Aprobacion'],
    hacia: 'Planificada',
    validaciones: [f => true],
    permisoRequerido: 'APROBAR_FUMIGACION',
    descripcion: 'Aprobar fumigación y devolver a planificada',
  },

  pendiente_to_proceso: {
    desde: ['Pendiente Aprobacion'],
    hacia: 'En Proceso',
    validaciones: [
      f => !!f.responsable,
      f => !!f.equipoUtilizado,
      f => !!f.producto,
    ],
    camposRequeridos: ['responsable', 'equipoUtilizado', 'producto'],
    permisoRequerido: 'APROBAR_E_INICIAR',
    descripcion: 'Aprobar e iniciar fumigación directamente',
  },

  // PAUSAR PROCESO
  proceso_to_pausada: {
    desde: ['En Proceso'],
    hacia: 'Pausada',
    validaciones: [f => true],
    permisoRequerido: 'PAUSAR_FUMIGACION',
    descripcion: 'Pausar fumigación en proceso por motivos operativos',
  },

  // REANUDAR PROCESO
  pausada_to_proceso: {
    desde: ['Pausada'],
    hacia: 'En Proceso',
    validaciones: [f => !!f.responsable, f => !!f.equipoUtilizado],
    permisoRequerido: 'REANUDAR_FUMIGACION',
    descripcion: 'Reanudar fumigación previamente pausada',
  },

  // COMPLETAR FUMIGACIÓN
  proceso_to_completada: {
    desde: ['En Proceso'],
    hacia: 'Completada',
    validaciones: [f => !!f.fechaRealizada, f => f.hectareas > 0],
    camposRequeridos: ['fechaRealizada', 'hectareas', 'observaciones'],
    permisoRequerido: 'COMPLETAR_FUMIGACION',
    descripcion: 'Marcar fumigación como completada exitosamente',
  },

  // CANCELACIONES
  planificada_to_cancelada: {
    desde: ['Planificada'],
    hacia: 'Cancelada',
    validaciones: [f => true],
    permisoRequerido: 'CANCELAR_FUMIGACION',
    descripcion: 'Cancelar fumigación planificada',
  },

  pendiente_to_cancelada: {
    desde: ['Pendiente Aprobacion'],
    hacia: 'Cancelada',
    validaciones: [f => true],
    permisoRequerido: 'CANCELAR_FUMIGACION',
    descripcion: 'Rechazar y cancelar fumigación pendiente',
  },

  proceso_to_cancelada: {
    desde: ['En Proceso'],
    hacia: 'Cancelada',
    validaciones: [f => true],
    permisoRequerido: 'CANCELAR_FUMIGACION_PROCESO',
    descripcion: 'Cancelar fumigación en proceso (requiere justificación)',
  },

  pausada_to_cancelada: {
    desde: ['Pausada'],
    hacia: 'Cancelada',
    validaciones: [f => true],
    permisoRequerido: 'CANCELAR_FUMIGACION',
    descripcion: 'Cancelar fumigación pausada',
  },
};

// ==================== STATE MACHINE CLASS ====================

export class FumigacionStateMachine {
  private historial: HistorialEstado[] = [];

  /**
   * Obtiene todas las transiciones válidas desde un estado
   */
  getTransicionesValidas(
    estadoActual: FumigacionEstado
  ): ConfiguracionTransicion[] {
    return Object.values(TRANSICIONES_CONFIGURACION).filter(config =>
      config.desde.includes(estadoActual)
    );
  }

  /**
   * Verifica si una transición es válida
   */
  esTransicionValida(
    estadoActual: FumigacionEstado,
    estadoDestino: FumigacionEstado
  ): boolean {
    return Object.values(TRANSICIONES_CONFIGURACION).some(
      config =>
        config.desde.includes(estadoActual) && config.hacia === estadoDestino
    );
  }

  /**
   * Ejecuta una transición de estado con validaciones completas
   */
  async ejecutarTransicion(
    fumigacion: any,
    estadoDestino: FumigacionEstado,
    razon: TransicionRazon
  ): Promise<TransicionResultado> {
    const estadoActual = fumigacion.estado as FumigacionEstado;

    // Buscar configuración de transición
    const configuracion = Object.values(TRANSICIONES_CONFIGURACION).find(
      config =>
        config.desde.includes(estadoActual) && config.hacia === estadoDestino
    );

    if (!configuracion) {
      return {
        exito: false,
        estadoAnterior: estadoActual,
        estadoNuevo: estadoActual,
        mensaje: `Transición no válida: ${estadoActual} → ${estadoDestino}`,
      };
    }

    // Ejecutar validaciones
    const validacionFallida = configuracion.validaciones.find(
      validacion => !validacion(fumigacion)
    );

    if (validacionFallida) {
      return {
        exito: false,
        estadoAnterior: estadoActual,
        estadoNuevo: estadoActual,
        mensaje: 'Fumigación no cumple requisitos para esta transición',
        requiereValidacion: true,
        camposRequeridos: configuracion.camposRequeridos,
      };
    }

    // Registrar en historial
    const registroHistorial: HistorialEstado = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fumigacionId: fumigacion.id,
      estadoAnterior: estadoActual,
      estadoNuevo: estadoDestino,
      razon,
      timestamp: new Date().toISOString(),
    };

    this.historial.push(registroHistorial);

    return {
      exito: true,
      estadoAnterior: estadoActual,
      estadoNuevo: estadoDestino,
      mensaje: `Transición exitosa: ${estadoActual} → ${estadoDestino}`,
    };
  }

  /**
   * Obtiene el historial de cambios para una fumigación
   */
  getHistorialFumigacion(fumigacionId: string): HistorialEstado[] {
    return this.historial
      .filter(h => h.fumigacionId === fumigacionId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  /**
   * Obtiene estadísticas de transiciones
   */
  getEstadisticasTransiciones(): Record<string, number> {
    const stats: Record<string, number> = {};

    this.historial.forEach(h => {
      const transicion = `${h.estadoAnterior}_to_${h.estadoNuevo}`;
      stats[transicion] = (stats[transicion] || 0) + 1;
    });

    return stats;
  }

  /**
   * Verifica permisos del usuario para una transición
   */
  tienePermiso(usuario: any, permisoRequerido?: string): boolean {
    if (!permisoRequerido) return true;

    // Aquí implementarías la lógica de permisos según tu sistema
    // Por ahora asumimos que todos los usuarios tienen todos los permisos
    return true;
  }

  /**
   * Obtiene todas las acciones disponibles para un estado
   */
  getAccionesDisponibles(
    estadoActual: FumigacionEstado,
    fumigacion: any,
    usuario?: any
  ): Array<{
    estado: FumigacionEstado;
    accion: string;
    descripcion: string;
    disponible: boolean;
    razon?: string;
  }> {
    const transicionesValidas = this.getTransicionesValidas(estadoActual);

    return transicionesValidas.map(config => {
      const validacionesPasadas = config.validaciones.every(v => v(fumigacion));
      const tienePermiso = this.tienePermiso(usuario, config.permisoRequerido);

      return {
        estado: config.hacia,
        accion: this.getAccionLabel(estadoActual, config.hacia),
        descripcion: config.descripcion,
        disponible: validacionesPasadas && tienePermiso,
        razon: !validacionesPasadas
          ? 'No cumple requisitos'
          : !tienePermiso
            ? 'Sin permisos suficientes'
            : undefined,
      };
    });
  }

  /**
   * Genera etiquetas amigables para acciones
   */
  private getAccionLabel(
    desde: FumigacionEstado,
    hacia: FumigacionEstado
  ): string {
    const acciones: Record<string, string> = {
      'Planificada_to_En Proceso': 'Iniciar Fumigación',
      'Planificada_to_Pendiente Aprobacion': 'Solicitar Aprobación',
      Planificada_to_Cancelada: 'Cancelar',
      'Pendiente Aprobacion_to_Planificada': 'Aprobar',
      'Pendiente Aprobacion_to_En Proceso': 'Aprobar e Iniciar',
      'Pendiente Aprobacion_to_Cancelada': 'Rechazar',
      'En Proceso_to_Pausada': 'Pausar',
      'En Proceso_to_Completada': 'Completar',
      'En Proceso_to_Cancelada': 'Cancelar',
      'Pausada_to_En Proceso': 'Reanudar',
      Pausada_to_Cancelada: 'Cancelar',
    };

    return acciones[`${desde}_to_${hacia}`] || `Cambiar a ${hacia}`;
  }
}

// ==================== SINGLETON INSTANCE ====================

/** Instancia global de la máquina de estados */
export const fumigacionStateMachine = new FumigacionStateMachine();

// ==================== UTILITY FUNCTIONS ====================

/**
 * Función de utilidad para obtener el color de un estado
 */
export const getColorEstado = (estado: FumigacionEstado): string => {
  return COLORES_ESTADO[estado] || '#95a5a6';
};

/**
 * Función de utilidad para obtener el ícono de un estado
 */
export const getIconoEstado = (estado: FumigacionEstado): string => {
  return ICONOS_ESTADO[estado] || '📋';
};

/**
 * Función de utilidad para obtener la descripción de un estado
 */
export const getDescripcionEstado = (estado: FumigacionEstado): string => {
  return DESCRIPCIONES_ESTADO[estado] || 'Estado desconocido';
};

/**
 * Valida si todos los campos requeridos están presentes
 */
export const validarCamposRequeridos = (
  fumigacion: any,
  campos: string[]
): { valido: boolean; camposFaltantes: string[] } => {
  const camposFaltantes = campos.filter(campo => {
    const valor = fumigacion[campo];
    return valor === undefined || valor === null || valor === '';
  });

  return {
    valido: camposFaltantes.length === 0,
    camposFaltantes,
  };
};

export default FumigacionStateMachine;
