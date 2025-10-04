// ==================== ADVANCED VALIDATION SYSTEM ====================

/**
 * Sistema robusto de validación para fumigaciones agrícolas
 * Incluye validaciones de campos, fechas, dosis, condiciones climáticas
 * y funcionalidad de carga de trabajos anteriores para reutilización
 */

import { Fumigacion } from '../components/FumigacionesList';

// ==================== VALIDATION INTERFACES ====================

export interface ValidationRule<T = any> {
  field: keyof T;
  validator: (value: any, data?: Partial<T>) => boolean;
  message: string;
  type: 'required' | 'format' | 'range' | 'logic' | 'dependency';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'range' | 'logic' | 'dependency';
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface ConditionalValidation {
  condition: (data: any) => boolean;
  rules: ValidationRule[];
}

// ==================== TRABAJOS PASADOS INTERFACES ====================

export interface TrabajoPasado {
  id: string;
  nombre: string;
  fechaRealizada: string;
  campo: string;
  hectareas: number;
  producto: string;
  dosis: number;
  tipoTratamiento: string;
  resultados?: {
    efectividad: number;
    plagas_controladas: string[];
  };
  condicionesClimaticas?: {
    temperatura: number;
    humedad: number;
    viento: number;
  };
  costo: number;
  observaciones?: string;
  etiquetas: string[];
}

export interface PlantillaTrabajo {
  id: string;
  nombre: string;
  descripcion: string;
  tipoTratamiento: string;
  producto: string;
  dosisRecomendada: number;
  condicionesIdeales: {
    temperaturaMin: number;
    temperaturaMax: number;
    humedadMax: number;
    vientoMax: number;
  };
  frecuenciaRecomendada: number; // días
  mejorEpoca: string[];
  costoPromedio: number;
  efectividad: number;
}

// ==================== VALIDATION CONSTANTS ====================

/** Productos químicos permitidos con sus rangos de dosis */
export const PRODUCTOS_PERMITIDOS = {
  'Cipermetrina 25%': { min: 1.0, max: 3.0, unidad: 'L/ha' },
  'Deltametrina 2.5%': { min: 0.5, max: 2.5, unidad: 'L/ha' },
  'Bacillus thuringiensis': { min: 2.0, max: 4.0, unidad: 'kg/ha' },
  'Imidacloprid 20%': { min: 0.3, max: 1.5, unidad: 'L/ha' },
  'Clorpirifos 48%': { min: 1.5, max: 3.5, unidad: 'L/ha' },
  'Aceite de Neem': { min: 3.0, max: 8.0, unidad: 'L/ha' },
  'Sulfato de Cobre': { min: 2.0, max: 5.0, unidad: 'kg/ha' },
};

/** Condiciones climáticas óptimas */
export const CONDICIONES_OPTIMAS = {
  temperatura: { min: 15, max: 30 },
  humedad: { max: 85 },
  viento: { max: 15 },
};

/** Tipos de tratamiento válidos */
export const TIPOS_TRATAMIENTO = [
  'Preventivo',
  'Correctivo',
  'Curativo',
  'Orgánico',
  'Integrado',
  'Emergencia',
];

// ==================== CORE VALIDATION RULES ====================

export const FUMIGACION_VALIDATION_RULES: ValidationRule<Fumigacion>[] = [
  // Campos obligatorios básicos
  {
    field: 'nombre',
    validator: value => !!value && value.trim().length >= 3,
    message: 'El nombre debe tener al menos 3 caracteres',
    type: 'required',
  },
  {
    field: 'campo',
    validator: value => !!value && value.trim().length > 0,
    message: 'Debe seleccionar un campo',
    type: 'required',
  },
  {
    field: 'producto',
    validator: value =>
      !!value && Object.keys(PRODUCTOS_PERMITIDOS).includes(value),
    message: 'Debe seleccionar un producto válido',
    type: 'format',
  },
  {
    field: 'tipoTratamiento',
    validator: value => !!value && TIPOS_TRATAMIENTO.includes(value),
    message: 'Debe seleccionar un tipo de tratamiento válido',
    type: 'format',
  },

  // Validaciones de rango numérico
  {
    field: 'hectareas',
    validator: value => typeof value === 'number' && value > 0 && value <= 1000,
    message: 'Las hectáreas deben ser entre 0.1 y 1000',
    type: 'range',
  },
  {
    field: 'dosis',
    validator: (value, data) => {
      if (typeof value !== 'number' || value <= 0) return false;
      if (!data?.producto) return true; // Se validará en producto
      const rango =
        PRODUCTOS_PERMITIDOS[
          data.producto as keyof typeof PRODUCTOS_PERMITIDOS
        ];
      return rango ? value >= rango.min && value <= rango.max : true;
    },
    message: 'La dosis debe estar dentro del rango permitido para el producto',
    type: 'range',
  },
  {
    field: 'costo',
    validator: value => typeof value === 'number' && value >= 0,
    message: 'El costo debe ser un número positivo',
    type: 'range',
  },

  // Validaciones de fecha
  {
    field: 'fechaPlanificada',
    validator: value => {
      if (!value) return false;
      const fecha = new Date(value);
      const hoy = new Date();
      const unAnoAdelante = new Date(hoy.getTime() + 365 * 24 * 60 * 60 * 1000);
      return fecha >= hoy && fecha <= unAnoAdelante;
    },
    message: 'La fecha debe ser entre hoy y máximo un año en el futuro',
    type: 'range',
  },

  // Validaciones de responsable
  {
    field: 'responsable',
    validator: value => !!value && value.trim().length >= 2,
    message: 'Debe especificar un responsable válido',
    type: 'required',
  },
];

// ==================== CONDITIONAL VALIDATIONS ====================

export const CONDITIONAL_VALIDATIONS: ConditionalValidation[] = [
  // Para fumigaciones completadas, requerir fecha realizada
  {
    condition: data => data.estado === 'Completada',
    rules: [
      {
        field: 'fechaRealizada',
        validator: value => !!value,
        message:
          'La fecha realizada es obligatoria para fumigaciones completadas',
        type: 'required',
      },
      {
        field: 'observaciones',
        validator: value => !!value && value.trim().length >= 10,
        message:
          'Las observaciones son obligatorias para fumigaciones completadas (mín. 10 caracteres)',
        type: 'required',
      },
    ],
  },

  // Para fumigaciones en proceso, requerir equipo
  {
    condition: data => data.estado === 'En Proceso',
    rules: [
      {
        field: 'equipoUtilizado',
        validator: value => !!value && value.trim().length > 0,
        message:
          'Debe especificar el equipo utilizado para fumigaciones en proceso',
        type: 'required',
      },
    ],
  },

  // Para fumigaciones costosas (>100k), validaciones adicionales
  {
    condition: data => data.costo > 100000,
    rules: [
      {
        field: 'tipoTratamiento',
        validator: value =>
          value !== 'Emergencia' ||
          confirm('Fumigación de emergencia costosa. ¿Confirmar?'),
        message:
          'Fumigaciones costosas de emergencia requieren confirmación especial',
        type: 'logic',
      },
    ],
  },
];

// ==================== MOCK TRABAJOS PASADOS ====================

export const TRABAJOS_PASADOS_MOCK: TrabajoPasado[] = [
  {
    id: 'tp_001',
    nombre: 'Control Pulgón Campo Norte 2024',
    fechaRealizada: '2024-08-15',
    campo: 'Campo Norte - Lote 1',
    hectareas: 15.5,
    producto: 'Imidacloprid 20%',
    dosis: 0.8,
    tipoTratamiento: 'Correctivo',
    resultados: {
      efectividad: 92,
      plagas_controladas: ['Pulgón verde', 'Trips'],
    },
    condicionesClimaticas: {
      temperatura: 24,
      humedad: 68,
      viento: 7,
    },
    costo: 67000,
    observaciones: 'Excelente resultado, aplicación temprana en la mañana',
    etiquetas: ['exitoso', 'pulgon', 'maiz', 'verano'],
  },
  {
    id: 'tp_002',
    nombre: 'Preventivo Orgánico Sur 2024',
    fechaRealizada: '2024-09-03',
    campo: 'Campo Sur - Lote 2',
    hectareas: 22.3,
    producto: 'Aceite de Neem',
    dosis: 4.5,
    tipoTratamiento: 'Preventivo',
    resultados: {
      efectividad: 87,
      plagas_controladas: ['Mosca blanca', 'Ácaros'],
    },
    condicionesClimaticas: {
      temperatura: 22,
      humedad: 72,
      viento: 5,
    },
    costo: 89000,
    observaciones: 'Aplicación orgánica exitosa, ideal para certificación',
    etiquetas: ['organico', 'preventivo', 'certificado', 'sostenible'],
  },
  {
    id: 'tp_003',
    nombre: 'Emergencia Plaga Este 2024',
    fechaRealizada: '2024-07-28',
    campo: 'Campo Este - Lote 4',
    hectareas: 12.8,
    producto: 'Cipermetrina 25%',
    dosis: 2.5,
    tipoTratamiento: 'Emergencia',
    resultados: {
      efectividad: 95,
      plagas_controladas: ['Oruga', 'Chinche verde'],
    },
    condicionesClimaticas: {
      temperatura: 26,
      humedad: 65,
      viento: 8,
    },
    costo: 78500,
    observaciones: 'Respuesta rápida a infestación severa, aplicación nocturna',
    etiquetas: ['emergencia', 'oruga', 'rapido', 'efectivo'],
  },
];

export const PLANTILLAS_TRABAJO: PlantillaTrabajo[] = [
  {
    id: 'pt_001',
    nombre: 'Control Preventivo Pulgón Maíz',
    descripcion:
      'Tratamiento preventivo estándar para pulgón en cultivos de maíz',
    tipoTratamiento: 'Preventivo',
    producto: 'Imidacloprid 20%',
    dosisRecomendada: 0.6,
    condicionesIdeales: {
      temperaturaMin: 18,
      temperaturaMax: 28,
      humedadMax: 80,
      vientoMax: 12,
    },
    frecuenciaRecomendada: 21,
    mejorEpoca: ['Primavera', 'Verano temprano'],
    costoPromedio: 45000,
    efectividad: 88,
  },
  {
    id: 'pt_002',
    nombre: 'Tratamiento Orgánico Universal',
    descripcion: 'Solución orgánica de amplio espectro para múltiples plagas',
    tipoTratamiento: 'Orgánico',
    producto: 'Aceite de Neem',
    dosisRecomendada: 4.0,
    condicionesIdeales: {
      temperaturaMin: 16,
      temperaturaMax: 30,
      humedadMax: 85,
      vientoMax: 10,
    },
    frecuenciaRecomendada: 14,
    mejorEpoca: ['Primavera', 'Otoño'],
    costoPromedio: 52000,
    efectividad: 82,
  },
];

// ==================== VALIDATION ENGINE ====================

export class FumigacionValidator {
  /**
   * Valida una fumigación completa con todas las reglas
   */
  static validate(data: Partial<Fumigacion>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Ejecutar validaciones básicas
    FUMIGACION_VALIDATION_RULES.forEach(rule => {
      const value = (data as any)[rule.field];
      if (!rule.validator(value, data)) {
        errors.push({
          field: rule.field as string,
          message: rule.message,
          type: rule.type,
          severity: 'error',
        });
      }
    });

    // Ejecutar validaciones condicionales
    CONDITIONAL_VALIDATIONS.forEach(conditional => {
      if (conditional.condition(data)) {
        conditional.rules.forEach(rule => {
          const value = (data as any)[rule.field];
          if (!rule.validator(value, data)) {
            errors.push({
              field: rule.field as string,
              message: rule.message,
              type: rule.type,
              severity: 'error',
            });
          }
        });
      }
    });

    // Generar warnings/sugerencias
    warnings.push(...this.generateWarnings(data));

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida un campo específico
   */
  static validateField(
    field: keyof Fumigacion,
    value: any,
    data: Partial<Fumigacion>
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Buscar regla para el campo específico
    const rule = FUMIGACION_VALIDATION_RULES.find(r => r.field === field);
    if (rule && !rule.validator(value, data)) {
      errors.push({
        field: field as string,
        message: rule.message,
        type: rule.type,
        severity: 'error',
      });
    }

    // Validaciones condicionales para el campo
    CONDITIONAL_VALIDATIONS.forEach(conditional => {
      if (conditional.condition(data)) {
        const conditionalRule = conditional.rules.find(r => r.field === field);
        if (conditionalRule && !conditionalRule.validator(value, data)) {
          errors.push({
            field: field as string,
            message: conditionalRule.message,
            type: conditionalRule.type,
            severity: 'error',
          });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Genera warnings basados en buenas prácticas
   */
  private static generateWarnings(
    data: Partial<Fumigacion>
  ): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    // Warning por condiciones climáticas
    if (data.condicionesClimaticas) {
      const { temperatura, humedad, viento } = data.condicionesClimaticas;

      if (
        temperatura &&
        (temperatura < CONDICIONES_OPTIMAS.temperatura.min ||
          temperatura > CONDICIONES_OPTIMAS.temperatura.max)
      ) {
        warnings.push({
          field: 'condicionesClimaticas',
          message: `Temperatura fuera del rango óptimo (${CONDICIONES_OPTIMAS.temperatura.min}°C - ${CONDICIONES_OPTIMAS.temperatura.max}°C)`,
          suggestion: 'Considere reprogramar para condiciones más favorables',
        });
      }

      if (humedad && humedad > CONDICIONES_OPTIMAS.humedad.max) {
        warnings.push({
          field: 'condicionesClimaticas',
          message: `Humedad muy alta (>${CONDICIONES_OPTIMAS.humedad.max}%)`,
          suggestion: 'Alta humedad puede reducir la efectividad del producto',
        });
      }

      if (viento && viento > CONDICIONES_OPTIMAS.viento.max) {
        warnings.push({
          field: 'condicionesClimaticas',
          message: `Viento muy fuerte (>${CONDICIONES_OPTIMAS.viento.max} km/h)`,
          suggestion: 'Viento fuerte puede causar deriva del producto',
        });
      }
    }

    // Warning por costo elevado
    if (data.costo && data.hectareas) {
      const costoPorHectarea = data.costo / data.hectareas;
      if (costoPorHectarea > 8000) {
        warnings.push({
          field: 'costo',
          message: 'Costo por hectárea elevado',
          suggestion: `$${costoPorHectarea.toFixed(0)}/ha está por encima del promedio`,
        });
      }
    }

    // Warning por dosis
    if (data.producto && data.dosis) {
      const rango =
        PRODUCTOS_PERMITIDOS[
          data.producto as keyof typeof PRODUCTOS_PERMITIDOS
        ];
      if (rango) {
        const porcentajeRango =
          ((data.dosis - rango.min) / (rango.max - rango.min)) * 100;
        if (porcentajeRango > 80) {
          warnings.push({
            field: 'dosis',
            message: 'Dosis cercana al límite máximo',
            suggestion: 'Considere si es necesaria una dosis tan alta',
          });
        }
      }
    }

    return warnings;
  }

  /**
   * Busca trabajos similares pasados para sugerencias
   */
  static findSimilarJobs(
    campo: string,
    tipoTratamiento: string,
    producto?: string
  ): TrabajoPasado[] {
    return TRABAJOS_PASADOS_MOCK.filter(trabajo => {
      let score = 0;

      // Mismo campo = alta prioridad
      if (trabajo.campo.includes(campo) || campo.includes(trabajo.campo)) {
        score += 5;
      }

      // Mismo tipo de tratamiento
      if (trabajo.tipoTratamiento === tipoTratamiento) {
        score += 3;
      }

      // Mismo producto
      if (producto && trabajo.producto === producto) {
        score += 4;
      }

      return score >= 3;
    })
      .sort(
        (a, b) =>
          new Date(b.fechaRealizada).getTime() -
          new Date(a.fechaRealizada).getTime()
      )
      .slice(0, 5);
  }

  /**
   * Obtiene plantilla recomendada basada en criterios
   */
  static getRecommendedTemplate(
    tipoTratamiento: string,
    hectareas?: number
  ): PlantillaTrabajo | null {
    const plantillas = PLANTILLAS_TRABAJO.filter(
      p => p.tipoTratamiento === tipoTratamiento
    );

    if (plantillas.length === 0) return null;

    // Retornar la más efectiva
    return plantillas.sort((a, b) => b.efectividad - a.efectividad)[0];
  }

  /**
   * Calcula costo estimado basado en trabajos similares
   */
  static estimateCost(
    producto: string,
    hectareas: number,
    tipoTratamiento: string
  ): { min: number; max: number; promedio: number } {
    const trabajosSimilares = TRABAJOS_PASADOS_MOCK.filter(
      t => t.producto === producto || t.tipoTratamiento === tipoTratamiento
    );

    if (trabajosSimilares.length === 0) {
      // Estimación base
      const baseRate = 4000;
      return {
        min: Math.round(hectareas * baseRate * 0.8),
        max: Math.round(hectareas * baseRate * 1.2),
        promedio: Math.round(hectareas * baseRate),
      };
    }

    const costosPorHectarea = trabajosSimilares.map(t => t.costo / t.hectareas);
    const min = Math.min(...costosPorHectarea);
    const max = Math.max(...costosPorHectarea);
    const promedio =
      costosPorHectarea.reduce((a, b) => a + b, 0) / costosPorHectarea.length;

    return {
      min: Math.round(hectareas * min),
      max: Math.round(hectareas * max),
      promedio: Math.round(hectareas * promedio),
    };
  }
}

export default FumigacionValidator;
