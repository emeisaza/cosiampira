import { useState } from 'react';
import styled from 'styled-components';
import { useSettings } from '../../context/SettingsContext';

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 1.2rem 2rem;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  transition: transform 0.3s ease;
  transform: ${props => props.$visible ? 'translateY(0)' : 'translateY(-100%)'};
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 768px) {
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 0px;
    &::-webkit-scrollbar { display: none; }
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #ffffff;
  font-weight: 500;
  white-space: nowrap;
`;

const CompactSlider = styled.input`
  width: 80px;
  -webkit-appearance: none;
  appearance: none;
  height: 2px;
  background: var(--glass-border);
  outline: none;
  border-radius: 1px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.2);
      background: var(--color-accent);
    }
  }
`;

const SelectButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  opacity: ${props => props.$active ? 1 : 0.6};
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  transition: all 0.2s;
  font-weight: ${props => props.$active ? '600' : '400'};

  &:hover {
    opacity: 1;
  }
`;

const ThemeToggle = styled.button`
  background: var(--glass-border);
  border: none;
  border-radius: 6px;
  height: 36px;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #ffffff;
  text-transform: uppercase;
  transition: all 0.2s ease;
  min-width: 100px;
  justify-content: center;

  &:hover {
    background: var(--color-accent);
    color: var(--color-bg);
  }
`;

const ToggleTrigger = styled.button`
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    color: var(--color-text);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(10px);
    opacity: ${props => props.$visible ? 0 : 1};
    pointer-events: ${props => props.$visible ? 'none' : 'auto'};
    transition: opacity 0.3s;
`;

const ControlPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { settings, updateSetting, cycleTheme } = useSettings();

  return (
    <>
      <ToggleTrigger $visible={isVisible} onClick={() => setIsVisible(true)}>
        ↓
      </ToggleTrigger>

      <TopBar $visible={isVisible}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle onClick={cycleTheme}>
            {settings.theme}
          </ThemeToggle>
          <button
            onClick={() => setIsVisible(false)}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>

        <ControlsContainer>
          <ControlGroup>
            <Label>Size</Label>
            <CompactSlider
              type="range"
              min="14"
              max="24"
              value={settings.fontSizeBody}
              onChange={(e) => updateSetting('fontSizeBody', Number(e.target.value))}
            />
          </ControlGroup>

          <ControlGroup>
            <Label>Line</Label>
            <CompactSlider
              type="range"
              min="1.2"
              max="2.0"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => updateSetting('lineHeight', Number(e.target.value))}
            />
          </ControlGroup>

          <ControlGroup>
            <Label>Width</Label>
            <CompactSlider
              type="range"
              min="600"
              max="1000"
              step="50"
              value={settings.containerMaxWidth}
              onChange={(e) => updateSetting('containerMaxWidth', Number(e.target.value))}
            />
          </ControlGroup>

          <ControlGroup style={{ gap: '0.2rem' }}>
            <SelectButton
              $active={settings.fontFamily === 'serif'}
              onClick={() => updateSetting('fontFamily', 'serif')}
            >
              Serif
            </SelectButton>
            <SelectButton
              $active={settings.fontFamily === 'sans'}
              onClick={() => updateSetting('fontFamily', 'sans')}
            >
              Sans
            </SelectButton>
            <SelectButton
              $active={settings.fontFamily === 'mono'}
              onClick={() => updateSetting('fontFamily', 'mono')}
            >
              Mono
            </SelectButton>
          </ControlGroup>
        </ControlsContainer>
      </TopBar>
    </>
  );
};

export default ControlPanel;
