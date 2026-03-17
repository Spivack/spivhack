import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TutorialViewer from '../components/tutorial/TutorialViewer';
import { topicMap } from '../data/categories';

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? topicMap.get(topicId) : undefined;

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="font-pixel text-6xl text-green-800 mb-4">404</div>
        <h2 className="font-pixel text-3xl text-green-300 mb-2">TOPIC NOT FOUND</h2>
        <p className="text-green-700 font-mono text-sm mb-6">
          &quot;{topicId}&quot; doesn&apos;t exist yet.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 border border-green-700 text-green-400 hover:bg-green-950 font-mono text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          BACK
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-green-900/50 px-4 py-2 flex items-center gap-2 text-xs font-mono text-green-800">
        <Link to="/" className="hover:text-green-500 transition-colors">
          ~
        </Link>
        <span>/</span>
        <span className="capitalize">{topic.category}</span>
        <span>/</span>
        <span className="text-green-500">{topic.title}</span>
      </div>
      <TutorialViewer topic={topic} />
    </div>
  );
}
