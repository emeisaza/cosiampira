import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articles } from '../data/articles';
import ArticleNode from '../components/ui/ArticleNode';
import ControlPanel from '../components/ui/ControlPanel';

const PageContainer = styled.div`
  width: 100%;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const HeroTitle = styled.h1`
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 6rem;
  color: #fff;
  text-align: center;
  letter-spacing: -2px;
  mix-blend-mode: normal; 
  /* Removed mix-blend-mode overlay to make glow visible and predictable against dark bg */
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1);
  opacity: 0.8;
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

const HeroSubtitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 200;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  letter-spacing: 4px;
  text-transform: lowercase;
  margin-top: 1rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CatalogSection = styled.section`
  position: relative;
  min-height: 200vh;
  padding: 4rem 2rem;
`;

const CatalogHeader = styled.div`
  text-align: center;
  margin-bottom: 6rem;
  position: sticky;
  top: 2rem;
  z-index: 5;
`;

const CatalogTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-weight: 100;
  font-size: 3rem;
  color: #fff;
  letter-spacing: -1px;
  margin-bottom: 0.5rem;
  mix-blend-mode: overlay;
`;

const DriftSpace = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  justify-items: center;
  padding-bottom: 4rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 900px;
    margin: 0 auto;
    gap: 4rem;
  }
`;

const AboutSection = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
`;

const AboutContent = styled.div`
  max-width: 800px;
  text-align: center;
  color: #ffffff;
  font-family: var(--font-family-body);

  p {
    margin-bottom: 2rem;
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .definition {
    font-style: italic;
    font-size: 1.4rem;
    margin-bottom: 3rem;
    display: block;
    opacity: 0.9;
  }

  a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid var(--color-accent);
    transition: all 0.2s;

    &:hover {
      color: var(--color-accent);
      border-bottom-color: transparent;
    }
  }

  .credits {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 4rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const Footer = styled.footer`
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.7;
  border-top: 1px solid var(--glass-border);
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 10;

  a {
    transition: color 0.2s;
    &:hover {
      color: var(--color-accent);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const ArticleSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rem 2rem 4rem;
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
`;

const ContentWrapper = styled.article`
  width: 100%;
  max-width: var(--container-max-width);

  h1, h2, h3, p {
    font-family: var(--font-family-body);
    font-size: var(--font-size-body);
    line-height: var(--line-height);
    letter-spacing: var(--letter-spacing);
  }

  h1 {
    font-size: calc(var(--font-size-body) * 2.5);
    line-height: 1.2;
    margin-bottom: 2rem;
    letter-spacing: -1px;
    font-weight: 300;
  }

  h2 {
    font-size: calc(var(--font-size-body) * 1.5);
    line-height: 1.3;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    font-weight: 400;
  }

  h3 {
    font-size: calc(var(--font-size-body) * 1.2);
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  p {
    margin-bottom: 1.5rem;
    text-align: justify;
  }

  ul, ol {
    font-family: var(--font-family-body);
    font-size: var(--font-size-body);
    line-height: var(--line-height);
    padding-left: 2rem;
    margin-bottom: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
    text-align: justify;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 6rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--color-text);
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-accent);
    transform: scale(1.1);
  }
`;

const Meta = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.5;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ContentImage = styled.img`
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: 2rem auto;
  display: block;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ImageModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: pointer;
  backdrop-filter: blur(5px);
`;

const FullImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
`;

const CloseModalButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2001;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const OnePage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      const article = articles.find(a => a.slug === slug);
      if (article) {
        setSelectedArticle(article);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Handle 404/not found - just go home for now
        navigate('/');
      }
    } else {
      setSelectedArticle(null);
    }
  }, [slug, navigate]);

  // Grid layout logic moved to CSS


  // Simple markdown renderer with footnote support
  const parseInline = (text) => {
    // Split by footnote references like [^1], [^23]
    const parts = text.split(/(\[\^\d+\])/);
    return parts.map((part, index) => {
      const match = part.match(/^\[\^(\d+)\]$/);
      if (match) {
        const num = match[1];
        return (
          <sup key={index} id={`ref-${num}`}>
            <a
              href={`#fn-${num}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(`fn-${num}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // Highlight effect
                  element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  setTimeout(() => element.style.backgroundColor = 'transparent', 1000);
                }
              }}
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'none',
                marginLeft: '2px',
                cursor: 'pointer'
              }}
            >
              [{num}]
            </a>
          </sup>
        );
      }
      return part;
    });
  };

  const renderContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let currentParagraph = [];
    let listItems = [];
    let inList = false;
    let inFootnotes = false;
    let footnoteIndex = 0;

    lines.forEach((line, i) => {
      // Check for footnote section headers
      if (line.match(/^##\s+.*(NOTAS|REFERENCIAS|BIBLIOGRAFÍA|Notes|References)/i) ||
        line.includes('NOTAS DE TRADUCCIÓN')) {
        inFootnotes = true;
      }

      const processText = (text) => parseInline(text);

      if (line.startsWith('# ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${i}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(<h1 key={i}>{processText(line.substring(2))}</h1>);
      } else if (line.startsWith('## ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${i}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(<h2 key={i}>{processText(line.substring(3))}</h2>);
      } else if (line.startsWith('### ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${i}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(<h3 key={i}>{processText(line.substring(4))}</h3>);
      } else if (line.match(/^\d+\.\s/) || line.startsWith('- ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${i}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
        inList = true;
        const text = line.replace(/^\d+\.\s/, '').replace(/^-\s/, '');

        let itemContent = processText(text);
        let itemProps = { key: `li-${i}` };

        if (inFootnotes) {
          footnoteIndex++;
          itemProps.id = `fn-${footnoteIndex}`;
          // Append back link
          itemContent = (
            <>
              {itemContent}
              <a
                href={`#ref-${footnoteIndex}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`ref-${footnoteIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                style={{ marginLeft: '10px', textDecoration: 'none', cursor: 'pointer' }}
              >
                ↩
              </a>
            </>
          );
        }

        listItems.push(<li {...itemProps}>{itemContent}</li>);
      } else if (line.trim() === '') {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${i}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
      } else if (line.match(/^!\[(.*?)\]\((.*?)\)/)) {
        // Handle images
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${i}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        const match = line.match(/^!\[(.*?)\]\((.*?)\)/);
        const alt = match[1];
        const src = match[2];
        elements.push(
          <ContentImage
            key={`img-${i}`}
            src={src}
            alt={alt}
            onClick={(e) => {
              e.stopPropagation();
              setModalImage(src);
            }}
          />
        );
      } else {
        if (inList) {
          elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        // Accumulate paragraph text with parsing
        if (currentParagraph.length > 0) {
          // Add space between lines
          currentParagraph.push(' ');
        }
        currentParagraph.push(processText(line));
      }
    });

    if (currentParagraph.length > 0) {
      elements.push(<p key="final-p">{currentParagraph}</p>);
    }
    if (inList && listItems.length > 0) {
      elements.push(<ul key="final-ul">{listItems}</ul>);
    }

    return elements;
  };

  const handleArticleClick = (article) => {
    // Instead of setting state directly, navigate to the slug
    navigate(`/${article.slug}`);
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      {/* 
        If an article is selected (via slug), hide the main feed.
        This behavior matches the previous state-based toggle, 
        but driven by URL.
      */}
      {!selectedArticle && (
        <>
          <HeroSection>
            <div>
              <HeroTitle>COSIÁMPIRA</HeroTitle>
              <HeroSubtitle>ecología especulativa</HeroSubtitle>
            </div>
          </HeroSection>

          <CatalogSection>
            <CatalogHeader>
              <CatalogTitle>ARCHIVO</CatalogTitle>
            </CatalogHeader>

            <DriftSpace>
              {articles.map((article, index) => (
                <div key={article.id} onClick={() => handleArticleClick(article)} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <ArticleNode
                    article={article}
                    index={index}
                  />
                </div>
              ))}
            </DriftSpace>
          </CatalogSection>

          <AboutSection>
            <AboutContent>
              <span className="definition">
                "una cosiámpira es una cosa cualquiera, de cualquier procedencia, momento, tamaño o realidad, de la que no necesariamente sabes el nombre, género o categoría."
              </span>
              <p>
                Cosiámpira es una editorial de investigación transdisciplinar. Publicamos textos que conectan una cosa con otra, que nacen de cualquier raíz, proyectan cualquier espacio y no necesariamente se ubican en lo ya conocido, lo humano o lo fijo.
              </p>
              <div className="credits">
                Coordinado por <a href="https://kathiuska.com/" target="_blank" rel="noopener noreferrer">Kathiuska</a> y <a href="https://emeisaza.com" target="_blank" rel="noopener noreferrer">eme</a> desde 2021 en Guarne, Colombia.
              </div>
            </AboutContent>
          </AboutSection>

          <Footer>
            <div>© 2026</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://bsky.app/profile/cosiampira.com" target="_blank" rel="noopener noreferrer">Bluesky</a>
              <a href="https://instagram.com/cosiampira_" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            <div>hola (arroba) cosiampira (punto) com</div>
            <div>
              /♡ @ <a href="https://momoto.wtf" target="_blank" rel="noopener noreferrer">momoto</a>
            </div>
          </Footer>
        </>
      )}

      <ArticleSection $isOpen={selectedArticle !== null}>
        {selectedArticle && (
          <>
            <CloseButton onClick={handleClose}>
              ✕
            </CloseButton>
            <ContentWrapper>
              <Meta>
                {selectedArticle.author} · {selectedArticle.date}
              </Meta>
              {renderContent(selectedArticle.content)}
            </ContentWrapper>
            <ControlPanel />
          </>
        )}
      </ArticleSection>

      {modalImage && (
        <ImageModalOverlay onClick={() => setModalImage(null)}>
          <CloseModalButton onClick={() => setModalImage(null)}>✕</CloseModalButton>
          <FullImage
            src={modalImage}
            onClick={(e) => e.stopPropagation()}
            alt="Full size view"
          />
        </ImageModalOverlay>
      )}
    </PageContainer>
  );
};

export default OnePage;
