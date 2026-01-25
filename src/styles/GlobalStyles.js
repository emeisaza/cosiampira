import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --font-size-body: 18px;
    --line-height: 1.6;
    --letter-spacing: 0px;
    --container-max-width: 800px;
    --font-family-body: "Merriweather", serif;
    
    /* Default (Traslúcido) */
    --color-bg: #0a0a0a;
    --color-text: #e0e0e0;
    --color-accent: #bfbaff; /* Soft lilac */
    --color-secondary: #a8e6cf; /* Mint */
    
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
  }

  [data-theme='traslúcido'] {
    --color-bg: #0a0a0a;
    --color-text: #e0e0e0;
    --color-accent: #bfbaff;
    --color-secondary: #a8e6cf;
    
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
  }

  [data-theme='oscura'] {
    --color-bg: #000000;
    --color-text: #ffffff;
    --color-accent: #ffffff; 
    --color-secondary: #888888;
    
    --glass-bg: #000000;
    --glass-border: #333333;
  }

  [data-theme='clara'] {
    --color-bg: #ffffff;
    --color-text: #1a1a1a;
    --color-accent: #6c5ce7; 
    --color-secondary: #00b894; 
    
    --glass-bg: rgba(255, 255, 255, 0.98); /* Less transparent for readability */
    --glass-border: rgba(0, 0, 0, 0.1);
  }

  [data-theme='terminal'] {
    --color-bg: #000000;
    --color-text: #00ff00;
    --color-accent: #008f11; 
    --color-secondary: #003b00;
    
    --glass-bg: rgba(0, 20, 0, 0.9);
    --glass-border: rgba(0, 255, 0, 0.3);
    
    --font-family-body: "Fira Code", monospace; 
  }

  [data-theme='vapor'] {
    --color-bg: #2b0642; 
    --color-text: #00f3ff; 
    --color-accent: #ff0099; 
    --color-secondary: #ffeb3b; 
    
    --glass-bg: rgba(43, 6, 66, 0.85);
    --glass-border: rgba(255, 0, 153, 0.3);
  }



  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: 'Inter', sans-serif; /* Default UI font */
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* Typography for Content */
  .article-content {
    font-family: var(--font-family-body);
    font-size: var(--font-size-body);
    line-height: var(--line-height);
    letter-spacing: var(--letter-spacing);
  }
`;
