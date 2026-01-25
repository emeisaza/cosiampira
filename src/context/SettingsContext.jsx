import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    fontSizeBody: 18,
    lineHeight: 1.6,
    letterSpacing: 0,
    containerMaxWidth: 800,
    fontFamily: 'serif',
    theme: 'traslúcido', // 'traslúcido', 'oscura', 'clara', 'terminal', 'vapor'
    zenMode: false,
    bionicReading: false,
  });

  const availableThemes = ['traslúcido', 'oscura', 'clara', 'terminal', 'vapor'];

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const cycleTheme = () => {
    setSettings(prev => {
      const currentIndex = availableThemes.indexOf(prev.theme);
      const nextIndex = (currentIndex + 1) % availableThemes.length;
      return { ...prev, theme: availableThemes[nextIndex] };
    });
  };

  const toggleZenMode = () => {
    setSettings(prev => ({ ...prev, zenMode: !prev.zenMode }));
  };

  const toggleBionic = () => {
    setSettings(prev => ({ ...prev, bionicReading: !prev.bionicReading }));
  };

  // Apply settings to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-body', `${settings.fontSizeBody}px`);
    root.style.setProperty('--line-height', settings.lineHeight);
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
    root.style.setProperty('--container-max-width', `${settings.containerMaxWidth}px`);

    let family = '"Merriweather", serif'; // Default serif
    if (settings.fontFamily === 'sans') family = '"Inter", sans-serif';
    if (settings.fontFamily === 'mono') family = '"Fira Code", monospace';

    root.style.setProperty('--font-family-body', family);
    root.setAttribute('data-theme', settings.theme);

  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, cycleTheme, availableThemes, toggleZenMode, toggleBionic }}>
      {children}
    </SettingsContext.Provider>
  );
};
