import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 100;
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text);
  opacity: 0.7;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    opacity: 1;
    color: var(--color-accent);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--color-accent);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Navigation = () => {
    return (
        <Nav>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/catalogo">Catálogo</NavLink>
        </Nav>
    );
};

export default Navigation;
