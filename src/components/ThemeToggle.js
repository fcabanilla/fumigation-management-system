import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ToggleButton = styled.button`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 50px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
    box-shadow: 0 2px 8px ${(props) => props.theme.colors.shadow};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 1.1rem;
    color: ${(props) => props.theme.colors.text};
    transition: all 0.3s ease;
  }
`;

const ToggleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  transform: ${(props) =>
    props.isVisible
      ? "translateY(0) rotate(0deg)"
      : "translateY(20px) rotate(90deg)"};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  position: absolute;
`;

const ThemeToggle = ({ size = "normal", showLabel = false }) => {
  const { theme, toggleTheme, isLight } = useTheme();

  return (
    <ToggleWrapper>
      <ToggleButton
        onClick={toggleTheme}
        theme={theme}
        title={`Cambiar a modo ${isLight ? "oscuro" : "claro"}`}
      >
        <IconWrapper isVisible={isLight}>
          <FaSun />
        </IconWrapper>
        <IconWrapper isVisible={!isLight}>
          <FaMoon />
        </IconWrapper>
      </ToggleButton>
      {showLabel && (
        <span
          style={{
            marginLeft: "0.5rem",
            fontSize: "0.9rem",
            color: theme.colors.textSecondary,
          }}
        >
          {isLight ? "Claro" : "Oscuro"}
        </span>
      )}
    </ToggleWrapper>
  );
};

ThemeToggle.propTypes = {
  size: PropTypes.string,
  showLabel: PropTypes.bool,
};

export default ThemeToggle;
