import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import LearnPage from './pages/LearnPage';
import PuzzlePage from './pages/PuzzlePage';
import { ProgressProvider } from './context/ProgressContext';

export default function App() {
  return (
    <ProgressProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
<Route path="/learn" element={<LearnPage />} />
        <Route path="/puzzle/:id" element={<PuzzlePage />} />
        {/* /puzzles redirects to menu for now */}
        <Route path="/puzzles" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
    </ProgressProvider>
  );
}
