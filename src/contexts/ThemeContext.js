import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

export const THEMES = {
  light: {
    name: 'light',
    colors: {
      // Colores principales
      primary: '#4a7c59',
      secondary: '#6b8e23',
      accent: '#8BC34A',

      // Fondos
      background: '#ffffff',
      backgroundGradient: 'linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%)',
      surface: '#ffffff',
      surfaceHover: '#f8f9fa',

      // Textos
      text: '#333333',
      textSecondary: '#666666',
      textMuted: '#999999',
      textOnPrimary: '#ffffff',

      // Bordes y divisores
      border: '#e0e0e0',
      borderLight: '#f0f0f0',
      divider: '#eee',

      // Estados
      success: '#28a745',
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#17a2b8',

      // Sombras
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowHover: 'rgba(0, 0, 0, 0.15)',

      // Mapas
      mapTile: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      // Colores principales
      primary: '#5d8f6d',
      secondary: '#7ba428',
      accent: '#9CCC65',

      // Fondos
      background: '#1a1a1a',
      backgroundGradient: 'linear-gradient(135deg, #2d3e2d 0%, #1a2e1a 100%)',
      surface: '#2d2d2d',
      surfaceHover: '#3a3a3a',

      // Textos
      text: '#ffffff',
      textSecondary: '#cccccc',
      textMuted: '#999999',
      textOnPrimary: '#ffffff',

      // Bordes y divisores
      border: '#404040',
      borderLight: '#353535',
      divider: '#333',

      // Estados
      success: '#4caf50',
      warning: '#ff9800',
      danger: '#f44336',
      info: '#2196f3',

      // Sombras
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHover: 'rgba(0, 0, 0, 0.4)',

      // Mapas
      mapTile:
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  // Cargar tema desde localStorage al inicializar
  useEffect(() => {
    const savedTheme = localStorage.getItem('fumig-theme');
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Guardar tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('fumig-theme', currentTheme);

    // Aplicar clase CSS al body para CSS globales si es necesario
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = THEMES[currentTheme];

  const contextValue = {
    theme,
    currentTheme,
    toggleTheme,
    isLight: currentTheme === 'light',
    isDark: currentTheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeContext;
