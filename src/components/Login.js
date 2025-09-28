import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FaUser, FaLock, FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiSpray } from "react-icons/gi";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #6b8e23 100%);
  padding: 20px;
  position: relative;

  &::before {
    content: "";
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &::before {
    content: "";
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

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;

  input[type="checkbox"] {
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
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar mensajes al empezar a escribir
    if (error) {
      setError("");
    }
    if (success) {
      setSuccess("");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    // Al menos 3 caracteres, solo letras, números y algunos caracteres especiales permitidos
    const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validaciones básicas
    if (!formData.username.trim()) {
      setError("Por favor ingresa tu usuario");
      setIsLoading(false);
      return;
    }

    // Validar formato de usuario (podría ser email o username)
    const isEmail = formData.username.includes("@");
    if (isEmail && !validateEmail(formData.username)) {
      setError("Por favor ingresa un email válido");
      setIsLoading(false);
      return;
    }

    if (!isEmail && !validateUsername(formData.username)) {
      setError(
        "El usuario debe tener entre 3-20 caracteres y solo puede contener letras, números, puntos, guiones y guiones bajos"
      );
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError("Por favor ingresa tu contraseña");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    // Validar que la contraseña tenga al menos una letra y un número
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      setError("La contraseña debe contener al menos una letra y un número");
      setIsLoading(false);
      return;
    }

    try {
      // Simulación de login (aquí iría tu lógica de autenticación)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Login demo exitoso - aceptar tanto admin como admin@fumigacion.com
      const validCredentials =
        (formData.username === "admin" ||
          formData.username === "admin@fumigacion.com") &&
        formData.password === "fumigacion123";

      if (validCredentials) {
        setSuccess("¡Inicio de sesión exitoso! Redirigiendo...");
        setTimeout(() => {
          onLogin && onLogin({ ...formData, rememberMe });
        }, 1000);
      } else {
        setError(
          "Usuario o contraseña incorrectos. Intenta con: admin / fumigacion123"
        );
      }
    } catch (err) {
      setError(
        "Error de conexión. Por favor verifica tu conexión a internet e inténtalo nuevamente."
      );
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
          <Title>Fumig App</Title>
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
                type={showPassword ? "text" : "password"}
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
            {isLoading && <LoadingSpinner />}
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </LoginButton>

          <ForgotPassword href="#forgot">
            ¿Olvidaste tu contraseña?
          </ForgotPassword>
        </Form>

        <Footer>
          <FooterText>
            <FaLeaf /> Fumig App v1.0 - Sistema Profesional de Fumigación
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
