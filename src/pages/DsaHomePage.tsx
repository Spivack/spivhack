import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { categories } from '../dsa-data/categories';

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     'text-[#00FF00]',
  intermediate: 'text-yellow-500',
  advanced:     'text-[#FF0080]',
};

const totalTopics = categories.reduce((n, c) => n + c.topics.length, 0);

export default function DsaHomePage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Nav />

      <div className="max-w-5xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-gray-600 text-sm tracking-widest mb-1">[ DATA STRUCTURES & ALGORITHMS ]</div>
          <h1 className="font-pixel text-4xl text-white leading-none mb-2">DSA</h1>
          <p className="font-mono text-sm text-gray-400">
            {totalTopics} topics across {categories.length} categories. Step-by-step breakdowns with code and visualizations.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="panel">
              <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-baseline justify-between">
                <div>
                  <h2 className="font-pixel text-2xl text-white leading-none">
                    {category.icon} {category.title}
                  </h2>
                  <p className="font-mono text-sm text-gray-500 mt-0.5">{category.description}</p>
                </div>
                <span className="font-mono text-sm text-gray-600 shrink-0 ml-4">
                  {category.topics.length} topics
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                {category.topics.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/dsa/topic/${topic.id}`}
                    className="group flex items-baseline justify-between border-b border-r border-[#232323] hover:bg-white/[0.02] px-4 py-3 transition-colors"
                  >
                    <div className="min-w-0 mr-3">
                      <div className="font-pixel text-lg text-gray-100 group-hover:text-white leading-none truncate transition-colors">
                        {topic.title}
                      </div>
                      <div className="font-mono text-sm text-gray-600 mt-0.5">
                        {topic.steps.length} steps
                      </div>
                    </div>
                    <span className={`font-mono text-sm shrink-0 ${DIFFICULTY_COLOR[topic.difficulty]}`}>
                      {topic.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-[#2a2a2a] font-mono text-sm text-gray-700 text-center">
          topics added incrementally — contribute at github.com/Spivack/spivhack
        </div>
      </div>
    </div>
  );
}
