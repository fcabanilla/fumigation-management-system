module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos para el proyecto
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Corrección de bug
        'docs', // Cambios en documentación
        'style', // Formateo, puntos y coma faltantes, etc. (sin cambio de lógica)
        'refactor', // Refactorización de código (sin nueva funcionalidad ni fix)
        'test', // Agregar o corregir tests
        'chore', // Mantenimiento, dependencias, configuración
        'ci', // Cambios en CI/CD y workflows
        'perf', // Mejoras de rendimiento
        'revert', // Revertir un commit anterior
      ],
    ],
    // Scopes opcionales relevantes al dominio
    'scope-enum': [
      1, // warning (no obligatorio)
      'always',
      [
        'fumigacion', // Módulo de fumigaciones
        'lotes', // Módulo de lotes/parcelas
        'mapa', // Componentes de mapa y geoespacial
        'auth', // Autenticación
        'i18n', // Internacionalización
        'docs', // Documentación
        'ci', // CI/CD y automatización
        'deps', // Dependencias
        'ui', // Componentes visuales generales
        'hooks', // Custom hooks
        'config', // Configuración del proyecto
      ],
    ],
    // Longitud máxima del subject
    'subject-max-length': [2, 'always', 72],
    // No terminar el subject con punto
    'subject-full-stop': [2, 'never', '.'],
    // Subject en minúsculas
    'subject-case': [2, 'always', 'lower-case'],
  },
};
