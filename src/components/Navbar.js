import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaArrowLeft,
  FaChartBar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { GiSpray, GiWheat } from "react-icons/gi";
import ThemeToggle from "./ThemeToggle";

// Styled Components
const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0;

    span {
      display: none;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BreadcrumbItem = styled.span`
  &:not(:last-child)::after {
    content: ">";
    margin-left: 0.5rem;
    opacity: 0.6;
  }

  &:last-child {
    color: white;
    font-weight: 500;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &.logout {
    background: rgba(244, 67, 54, 0.8);
    border-color: rgba(244, 67, 54, 1);

    &:hover {
      background: rgba(244, 67, 54, 1);
    }
  }
`;

// Mobile Menu
const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
  transition: transform 0.3s ease;
  z-index: 201;
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const MobileMenuTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.2rem;
  flex: 1;
`;

const CloseMenuButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MobileMenuContent = styled.div`
  flex: 1;
  padding: 1rem 0;
`;

const MobileMenuItem = styled.button`
  width: 100%;
  background: transparent;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-left-color: rgba(255, 255, 255, 0.5);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    border-left-color: white;
    font-weight: 600;
  }

  &.logout {
    margin-top: auto;
    color: #ffcdd2;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(244, 67, 54, 0.3);
      color: white;
    }
  }
`;

const MobileMenuIcon = styled.div`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MENU_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: FaHome,
  },
  {
    key: "fumigaciones",
    label: "Fumigaciones",
    icon: GiSpray,
  },
  {
    key: "lotes",
    label: "Lotes",
    icon: GiWheat,
  },
  {
    key: "mapas",
    label: "Mapas",
    icon: FaMapMarkerAlt,
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: FaChartBar,
  },
  {
    key: "profile",
    label: "Mi Perfil",
    icon: FaUser,
  },
];

const Navbar = ({
  currentView,
  onNavigate,
  onLogout,
  showBack = false,
  onBack,
  breadcrumbs = [],
  user,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
    closeMobileMenu();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleLogoClick = () => {
    handleNavigation("dashboard");
  };

  return (
    <>
      <NavbarContainer>
        <NavbarContent>
          <LeftSection>
            {showBack && (
              <BackButton onClick={handleBack}>
                <FaArrowLeft />
                <span>Volver</span>
              </BackButton>
            )}

            <Logo onClick={handleLogoClick}>
              <GiSpray />
              Fumig App
            </Logo>

            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem key={index}>{crumb}</BreadcrumbItem>
                ))}
              </Breadcrumb>
            )}
          </LeftSection>

          <RightSection>
            <DesktopMenu>
              <ThemeToggle />
              {MENU_ITEMS.map((item) => (
                <NavButton
                  key={item.key}
                  onClick={() => handleNavigation(item.key)}
                  className={currentView === item.key ? "active" : ""}
                >
                  <item.icon />
                  {item.label}
                </NavButton>
              ))}
              <NavButton onClick={onLogout} className="logout">
                <FaSignOutAlt />
                Cerrar Sesión
              </NavButton>
            </DesktopMenu>

            <MenuButton onClick={toggleMobileMenu}>
              <FaBars />
            </MenuButton>
          </RightSection>
        </NavbarContent>
      </NavbarContainer>

      {/* Mobile Menu */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileMenuHeader>
          <MobileMenuTitle>Menú</MobileMenuTitle>
          <CloseMenuButton onClick={closeMobileMenu}>
            <FaTimes />
          </CloseMenuButton>
        </MobileMenuHeader>

        <MobileMenuContent>
          {MENU_ITEMS.map((item) => (
            <MobileMenuItem
              key={item.key}
              onClick={() => handleNavigation(item.key)}
              className={currentView === item.key ? "active" : ""}
            >
              <MobileMenuIcon>
                <item.icon />
              </MobileMenuIcon>
              {item.label}
            </MobileMenuItem>
          ))}

          <MobileMenuItem onClick={onLogout} className="logout">
            <MobileMenuIcon>
              <FaSignOutAlt />
            </MobileMenuIcon>
            Cerrar Sesión
          </MobileMenuItem>
        </MobileMenuContent>
      </MobileMenu>
    </>
  );
};

Navbar.propTypes = {
  currentView: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  showBack: PropTypes.bool,
  onBack: PropTypes.func,
  breadcrumbs: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.object,
};

export default Navbar;
