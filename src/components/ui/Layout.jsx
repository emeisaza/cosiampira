import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import HeroCanvas from '../canvas/HeroCanvas';

const MainContent = styled.main`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  pointer-events: none; 
  
  & > * {
    pointer-events: auto;
  }
`;

const Layout = () => {
  return (
    <>
      <HeroCanvas />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
};

export default Layout;
