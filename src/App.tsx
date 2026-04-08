import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import LearnPage from './pages/LearnPage';
import PuzzlePage from './pages/PuzzlePage';
import ChallengesPage from './pages/ChallengesPage';
import DsaHomePage from './pages/DsaHomePage';
import DsaTopicPage from './pages/DsaTopicPage';
import { ProgressProvider } from './context/ProgressContext';

export default function App() {
  return (
    <ProgressProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/puzzle/:id" element={<PuzzlePage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/puzzles" element={<Navigate to="/challenges" replace />} />
        <Route path="/dsa" element={<DsaHomePage />} />
        <Route path="/dsa/topic/:topicId" element={<DsaTopicPage />} />
      </Routes>
    </HashRouter>
    </ProgressProvider>
  );
}
