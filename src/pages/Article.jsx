import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { articles } from '../data/articles';
import { useEffect } from 'react';
import ControlPanel from '../components/ui/ControlPanel';

const ArticleContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rem 2rem 4rem;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(40px);
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
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 3rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-accent);
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
  
  &::before {
    content: '← ';
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

const Article = () => {
    const { slug } = useParams();
    const article = articles.find(a => a.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!article) {
        return (
            <ArticleContainer>
                <BackLink to="/catalogo">Volver al Catálogo</BackLink>
                <h1>Artículo no encontrado</h1>
            </ArticleContainer>
        );
    }

    // Simple markdown-like parser for demonstration
    const renderContent = (content) => {
        const lines = content.split('\n');
        const elements = [];
        let currentParagraph = [];
        let listItems = [];
        let inList = false;

        lines.forEach((line, i) => {
            if (line.startsWith('# ')) {
                if (currentParagraph.length > 0) {
                    elements.push(<p key={`p-${i}`}>{currentParagraph.join(' ')}</p>);
                    currentParagraph = [];
                }
                if (inList && listItems.length > 0) {
                    elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
                    listItems = [];
                    inList = false;
                }
                elements.push(<h1 key={i}>{line.substring(2)}</h1>);
            } else if (line.startsWith('## ')) {
                if (currentParagraph.length > 0) {
                    elements.push(<p key={`p-${i}`}>{currentParagraph.join(' ')}</p>);
                    currentParagraph = [];
                }
                if (inList && listItems.length > 0) {
                    elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
                    listItems = [];
                    inList = false;
                }
                elements.push(<h2 key={i}>{line.substring(3)}</h2>);
            } else if (line.startsWith('### ')) {
                if (currentParagraph.length > 0) {
                    elements.push(<p key={`p-${i}`}>{currentParagraph.join(' ')}</p>);
                    currentParagraph = [];
                }
                if (inList && listItems.length > 0) {
                    elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
                    listItems = [];
                    inList = false;
                }
                elements.push(<h3 key={i}>{line.substring(4)}</h3>);
            } else if (line.match(/^\d+\.\s/) || line.startsWith('- ')) {
                if (currentParagraph.length > 0) {
                    elements.push(<p key={`p-${i}`}>{currentParagraph.join(' ')}</p>);
                    currentParagraph = [];
                }
                inList = true;
                const text = line.replace(/^\d+\.\s/, '').replace(/^-\s/, '');
                listItems.push(<li key={`li-${i}`}>{text}</li>);
            } else if (line.trim() === '') {
                if (currentParagraph.length > 0) {
                    elements.push(<p key={`p-${i}`}>{currentParagraph.join(' ')}</p>);
                    currentParagraph = [];
                }
                if (inList && listItems.length > 0) {
                    elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
                    listItems = [];
                    inList = false;
                }
            } else {
                if (inList) {
                    elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
                    listItems = [];
                    inList = false;
                }
                currentParagraph.push(line);
            }
        });

        if (currentParagraph.length > 0) {
            elements.push(<p key="final-p">{currentParagraph.join(' ')}</p>);
        }
        if (inList && listItems.length > 0) {
            elements.push(<ul key="final-ul">{listItems}</ul>);
        }

        return elements;
    };

    return (
        <>
            <ArticleContainer>
                <ContentWrapper>
                    <BackLink to="/catalogo">Volver al Catálogo</BackLink>
                    <Meta>
                        {article.author} · {article.date}
                    </Meta>
                    {renderContent(article.content)}
                </ContentWrapper>
            </ArticleContainer>
            <ControlPanel />
        </>
    );
};

export default Article;
