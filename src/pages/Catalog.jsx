import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { articles } from '../data/articles';
import ArticleNode from '../components/ui/ArticleNode';

const CatalogContainer = styled.div`
  position: relative;
  min-height: 200vh;
  padding: 8rem 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 8rem;
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 100;
  font-size: 3.5rem;
  color: #fff;
  letter-spacing: -1px;
  margin-bottom: 1rem;
  mix-blend-mode: overlay;
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: var(--color-text);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const DriftSpace = styled.div`
  position: relative;
  width: 100%;
  min-height: 150vh;
`;

const Catalog = () => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <CatalogContainer>
            <Header>
                <Title>DIGITAL DRIFT</Title>
                <Subtitle>Archivo en Movimiento</Subtitle>
            </Header>

            <DriftSpace>
                {articles.map((article, index) => (
                    <ArticleNode
                        key={article.id}
                        article={article}
                        index={index}
                        containerWidth={dimensions.width}
                        containerHeight={dimensions.height}
                    />
                ))}
            </DriftSpace>
        </CatalogContainer>
    );
};

export default Catalog;
