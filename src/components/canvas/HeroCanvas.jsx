import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import styled from 'styled-components';
import OrganicScene from './OrganicScene';

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: var(--color-bg); /* Use theme background */
  transition: background-color 0.5s ease;
  /* Removed blur to see details, or reduced it significantly */
`;

const HeroCanvas = () => {
    return (
        <CanvasContainer>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <OrganicScene />
                    <ambientLight intensity={0.3} />
                </Suspense>
            </Canvas>
        </CanvasContainer>
    );
};

export default HeroCanvas;
