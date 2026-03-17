import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2 } from 'lucide-react';
import { categories } from '../data/categories';

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400',
};

const categoryList = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const categoryCard = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-5xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-green-800 text-green-600 text-xs font-mono mb-6">
          <Code2 size={11} />
          DATA STRUCTURES &amp; ALGORITHMS REFERENCE
        </div>
        <h1 className="font-pixel text-4xl sm:text-5xl mb-5 leading-tight">
          <span className="text-green-100">Learn </span>
          <span className="text-gradient">Data Structures &amp; Algorithms</span>
        </h1>
<div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            to={`/topic/${categories[0].topics[0].id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-600 text-green-100 font-mono text-sm font-bold transition-colors"
          >
            &gt; START
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 border border-green-800 text-green-600 hover:text-green-300 hover:border-green-600 font-mono text-sm transition-colors"
          >
            &gt; BACK TO CHALLENGE
          </Link>
          <a
            href="https://github.com/Spivack/spivhack"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-green-800 text-green-600 hover:text-green-300 hover:border-green-600 font-mono text-sm transition-colors"
          >
            VIEW SOURCE
          </a>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        variants={categoryList}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
      >
        {categories.map((category) => (
          <motion.section key={category.id} variants={categoryCard} className="mb-10">
            <div className="flex items-center gap-2 mb-3 border-b border-green-900/50 pb-2">
              <span className="text-xl">{category.icon}</span>
              <h2 className="font-pixel text-2xl text-green-300">{category.title}</h2>
              <span className="text-xs font-mono text-green-800 ml-1">[ {category.topics.length} ]</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {category.topics.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  className="group p-4 border border-green-900 bg-[#0a120a] hover:border-green-600 hover:bg-[#0f1a0f] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-pixel text-xl text-green-200 group-hover:text-green-100 transition-colors leading-none">
                      {topic.title}
                    </h3>
                    <ArrowRight
                      size={14}
                      className="text-green-900 group-hover:text-green-500 flex-shrink-0 mt-1 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-green-800 font-mono leading-relaxed line-clamp-2 mb-3">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-between font-mono">
                    <span className={`text-xs font-bold ${DIFFICULTY_COLOR[topic.difficulty]}`}>
                      {topic.difficulty}
                    </span>
                    <span className="text-xs text-green-900">{topic.steps.length} steps</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </motion.div>
    </div>
  );
}
