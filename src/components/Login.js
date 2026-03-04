import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaUser, FaLock, FaLeaf, FaEye, FaEyeSlash } from 'react-icons/fa';
import { GiSpray } from 'react-icons/gi';

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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const LogoIcon = styled(GiSpray)`
  font-size: 3rem;
  color: #4a7c59;
`;

const Title = styled.h1`
  color: #2d5016;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a7c59;
  font-size: 1.1rem;
  z-index: 2;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 50px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    background: white;
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const PasswordInput = styled.div`
  position: relative;
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #4a7c59;
  cursor: pointer;
  font-size: 1.1rem;
  z-index: 2;
  padding: 5px;

  &:hover {
    color: #2d5016;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 124, 89, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;

  input[type='checkbox'] {
    accent-color: #4a7c59;
  }
`;

const ForgotPassword = styled.a`
  color: #4a7c59;
  text-decoration: none;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
  display: block;

  &:hover {
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

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar mensajes al empezar a escribir
    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.username.trim()) {
      setError('Por favor ingresa tu usuario');
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('Por favor ingresa tu contraseña');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      // Simulación de login (aquí iría tu lógica de autenticación)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Login demo exitoso
      if (
        formData.username === 'admin' &&
        formData.password === 'fumigacion123'
      ) {
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        setTimeout(() => {
          onLogin && onLogin(formData);
        }, 1000);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Header>
          <Logo>
            <LogoIcon />
          </Logo>
          <Title>AgriControl</Title>
          <Subtitle>Sistema de Gestión de Fumigación</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Usuario"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <PasswordInput>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <TogglePassword
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </TogglePassword>
            </PasswordInput>
          </InputGroup>

          <RememberMe>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="remember">Recordarme</label>
          </RememberMe>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </LoginButton>

          <ForgotPassword href="#forgot">
            ¿Olvidaste tu contraseña?
          </ForgotPassword>
        </Form>

        <Footer>
          <FooterText>
            <FaLeaf /> AgriControl Pro v1.0 - Sistema Profesional de Fumigación
          </FooterText>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func,
};

export default Login;
