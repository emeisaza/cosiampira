import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NodeContainer = styled.div`
  position: absolute;
  width: 420px;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  z-index: 1;
`;

const Thumbnail = styled.div`
  width: 100%;
  aspect-ratio: 1;
  /* Removed border-radius for square look */
  overflow: hidden;
  position: relative;
  transition: filter 0.3s ease, box-shadow 0.3s ease;
  
  /* Ghostly glow */
  box-shadow: 0 0 20px rgba(180, 200, 255, 0.1); 
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Much slower fade for ethereal feel */
    transition: transform 1.5s ease-out, opacity 1.5s ease-out; 
  }

  /* Vanishing effect: image opacity decreases */
  ${NodeContainer}:hover & {
    box-shadow: 0 0 40px rgba(200, 220, 255, 0.4); 
  }

  ${NodeContainer}:hover & img {
    /* transform: scale(1.1); Removed scale on hover */
    opacity: 0.1; /* More ghost-like transparency */
    filter: blur(2px); /* Subtle blur to enhance ghostly feel */
    transform: scale(1.05); /* Very subtle movement */
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  transition: opacity 0.2s ease;
  z-index: 3;
`;

const Title = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
  line-height: 1.3;
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: var(--color-accent);
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Plasma texture overlay removed

const ArticleNode = ({ article, index }) => {
  // Centered grid layout - 2 columns
  const col = index % 2;
  const row = Math.floor(index / 2);

  // Center the grid and make items larger
  const columnWidth = 450;
  const rowHeight = 500;
  const gridWidth = columnWidth * 2;

  // Calculate centered position
  const startX = `calc(50% - ${gridWidth / 2}px)`;
  const offsetX = col * columnWidth;
  const offsetY = row * rowHeight;

  return (
    <NodeContainer
      style={{
        left: `calc(${startX} + ${offsetX}px)`,
        top: `${offsetY}px`
      }}
    >
      <Thumbnail>
        <img src={article.thumbnail} alt={article.title} />
        <Overlay>
          <Title>{article.title}</Title>
          <Meta>{article.author}</Meta>
        </Overlay>
      </Thumbnail>
    </NodeContainer>
  );
};

export default ArticleNode;
