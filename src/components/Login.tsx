import React, { useState, FormEvent, ChangeEvent } from 'react';
import styled from 'styled-components';

// ==================== INTERFACES ====================

/** Datos del formulario de login */
interface LoginFormData {
  username: string;
  password: string;
}

/** Credenciales de login con configuración adicional */
interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

/** Resultado del proceso de autenticación */
interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    username: string;
    email?: string;
  };
}

/** Props del componente Login */
interface LoginProps {
  /** Función callback que se ejecuta cuando el usuario se autentica exitosamente */
  onLogin?: (
    credentials: LoginCredentials
  ) => Promise<LoginResult> | LoginResult;
}

// ==================== STYLED COMPONENTS ====================

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #6b8e23 100%);
  padding: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="50" cy="50" r="2" fill="white"/></svg>');
    background-size: 50px 50px;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4a7c59, #6b8e23);
  border-radius: 50%;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(74, 124, 89, 0.3);
`;

const LogoIcon = styled.div`
  font-size: 40px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '🚁';
  }
`;

const Title = styled.h1`
  color: #2d5016;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  color: #4a7c59;
  z-index: 2;
  font-size: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 50px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  color: #333;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const PasswordInput = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  border-radius: 3px;
  transition: color 0.3s ease;

  &:hover:not(:disabled) {
    color: #4a7c59;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-size: 14px;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: #4a7c59;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  label {
    cursor: pointer;
    user-select: none;

    &:hover {
      color: #4a7c59;
    }
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #4a7c59, #6b8e23);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 124, 89, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ForgotPassword = styled.a`
  color: #4a7c59;
  text-decoration: none;
  text-align: center;
  font-size: 14px;
  margin-top: 15px;
  transition: color 0.3s ease;

  &:hover {
    color: #6b8e23;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #c62828;
`;

const SuccessMessage = styled.div`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #4a7c59;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const FooterText = styled.p`
  color: #666;
  font-size: 0.8rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

// ==================== VALIDATION HELPERS ====================

/**
 * Valida el formato de un email
 * @param email - Email a validar
 * @returns true si el email es válido
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida el formato de un username
 * @param username - Username a validar
 * @returns true si el username es válido
 */
const validateUsername = (username: string): boolean => {
  // Al menos 3 caracteres, solo letras, números y algunos caracteres especiales permitidos
  const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Valida la fortaleza de una contraseña
 * @param password - Contraseña a validar
 * @returns true si la contraseña cumple los requisitos mínimos
 */
const validatePassword = (password: string): boolean => {
  return password.length >= 6 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password);
};

// ==================== MAIN COMPONENT ====================

/**
 * Componente de inicio de sesión con validación avanzada y UX moderna
 *
 * @description
 * Maneja la autenticación de usuarios con soporte para:
 * - Username o email como identificador
 * - Validación en tiempo real
 * - Opción "Recordarme"
 * - Estados de carga y error
 * - Interfaz responsive y accesible
 *
 * @example
 * ```tsx
 * <Login
 *   onLogin={async (credentials) => {
 *     const result = await authService.login(credentials);
 *     return result;
 *   }}
 * />
 * ```
 */
const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // ==================== STATE ====================

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ==================== EVENT HANDLERS ====================

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar mensajes al empezar a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Maneja el envío del formulario con validación completa
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!onLogin) {
      setError('Función de login no configurada');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones básicas
      const validationError = validateFormData(formData);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Ejecutar login
      const result = await onLogin({
        username: formData.username.trim(),
        password: formData.password,
        rememberMe,
      });

      if (result.success) {
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
      } else {
        setError(result.error || 'Error en el inicio de sesión');
      }
    } catch (err) {
      setError(
        'Error de conexión. Por favor verifica tu conexión a internet e inténtalo nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Alterna la visibilidad de la contraseña
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };

  /**
   * Maneja cambios en el checkbox "Recordarme"
   */
  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(e.target.checked);
  };

  // ==================== VALIDATION LOGIC ====================

  /**
   * Valida todos los datos del formulario
   * @param data - Datos a validar
   * @returns Mensaje de error o null si es válido
   */
  const validateFormData = (data: LoginFormData): string | null => {
    const { username, password } = data;

    // Validar username
    if (!username.trim()) {
      return 'Por favor ingresa tu usuario';
    }

    const isEmail = username.includes('@');
    if (isEmail && !validateEmail(username)) {
      return 'Por favor ingresa un email válido';
    }

    if (!isEmail && !validateUsername(username)) {
      return 'El usuario debe tener entre 3-20 caracteres y solo puede contener letras, números, puntos, guiones y guiones bajos';
    }

    // Validar password
    if (!password.trim()) {
      return 'Por favor ingresa tu contraseña';
    }

    if (!validatePassword(password)) {
      return 'La contraseña debe tener al menos 6 caracteres y contener al menos una letra y un número';
    }

    return null;
  };

  // ==================== RENDER ====================

  return (
    <LoginContainer>
      <LoginCard>
        <Header>
          <Logo>
            <LogoIcon />
          </Logo>
          <Title>Fumig App</Title>
          <Subtitle>Sistema de Gestión de Fumigación</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <InputGroup>
            <InputIcon>👤</InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Usuario o Email"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="username"
              aria-label="Usuario o Email"
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>🔒</InputIcon>
            <PasswordInput>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="current-password"
                aria-label="Contraseña"
              />
              <TogglePassword
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showPassword ? '🙈' : '👁️'}
              </TogglePassword>
            </PasswordInput>
          </InputGroup>

          <RememberMe>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              disabled={isLoading}
            />
            <label htmlFor="remember">Recordarme</label>
          </RememberMe>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading && <LoadingSpinner />}
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </LoginButton>

          <ForgotPassword href="#forgot">
            ¿Olvidaste tu contraseña?
          </ForgotPassword>
        </Form>

        <Footer>
          <FooterText>
            🍃 Fumig App v1.0 - Sistema Profesional de Fumigación
          </FooterText>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
export type { LoginProps, LoginCredentials, LoginResult, LoginFormData };
