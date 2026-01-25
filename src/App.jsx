import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { GlobalStyles } from './styles/GlobalStyles';
import Layout from './components/ui/Layout';
import OnePage from './pages/OnePage';

function App() {
  return (
    <SettingsProvider>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OnePage />} />
            <Route path=":slug" element={<OnePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
