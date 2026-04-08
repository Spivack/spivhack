import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Nav from '../components/Nav';
import TutorialViewer from '../components/dsa-tutorial/TutorialViewer';
import { topicMap } from '../dsa-data/categories';

export default function DsaTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? topicMap.get(topicId) : undefined;

  if (!topic) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="font-pixel text-6xl text-gray-700 mb-4">404</div>
          <h2 className="font-pixel text-3xl text-white mb-2">TOPIC NOT FOUND</h2>
          <p className="text-gray-500 font-mono text-sm mb-6">
            &quot;{topicId}&quot; doesn&apos;t exist yet.
          </p>
          <Link
            to="/dsa"
            className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] hover:border-[#00FF00] text-gray-400 hover:text-white font-mono text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            BACK TO DSA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Nav />
      <div className="border-b border-[#2a2a2a] px-5 py-2 flex items-center gap-2 text-sm font-mono text-gray-600">
        <Link to="/dsa" className="hover:text-[#00FF00] transition-colors">dsa</Link>
        <span>/</span>
        <span className="capitalize text-gray-500">{topic.category}</span>
        <span>/</span>
        <span className="text-gray-300">{topic.title}</span>
      </div>
      <TutorialViewer topic={topic} />
    </div>
  );
}
