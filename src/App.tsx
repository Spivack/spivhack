import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import GatePage from './pages/GatePage';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<GatePage />} />
        <Route path="/topics" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/topic/:topicId" element={<Layout />}>
          <Route index element={<TopicPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
