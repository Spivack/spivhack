import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category, Topic } from '../../types';

interface SidebarProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

const difficultyColor: Record<string, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400',
};

function CategorySection({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-1">
      <button
        onClick={() => { setExpanded(!expanded); }}
        className="w-full flex items-center gap-2 px-3 py-2 text-green-600 hover:text-green-300 hover:bg-green-950/50 transition-colors group"
      >
        <span className="text-base leading-none">{category.icon}</span>
        <span className="flex-1 text-left text-xs font-mono font-bold tracking-widest uppercase text-green-700 group-hover:text-green-400 transition-colors">
          {category.title}
        </span>
        <span className="text-green-900">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {category.topics.map((topic: Topic) => (
              <li key={topic.id}>
                <NavLink
                  to={`/topic/${topic.id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2 pl-8 pr-3 py-1.5 text-sm font-mono transition-colors ${
                      isActive
                        ? 'bg-green-950 text-green-300 border-l-2 border-green-400 pl-7'
                        : 'text-green-700 hover:text-green-300 hover:bg-green-950/30'
                    }`
                  }
                >
                  <Circle
                    size={5}
                    className={`flex-shrink-0 fill-current ${difficultyColor[topic.difficulty]}`}
                  />
                  <span className="truncate">{topic.title}</span>
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
  return (
    <div className="p-3">
      <div className="flex items-center gap-3 px-3 py-2 mb-3 text-xs font-mono text-green-900 border-b border-green-900/50">
        <span className="flex items-center gap-1">
          <Circle size={5} className="fill-green-400 text-green-400" /> easy
        </span>
        <span className="flex items-center gap-1">
          <Circle size={5} className="fill-yellow-400 text-yellow-400" /> mid
        </span>
        <span className="flex items-center gap-1">
          <Circle size={5} className="fill-red-400 text-red-400" /> hard
        </span>
      </div>
      {categories.map((category) => (
        <CategorySection key={category.id} category={category} onClose={onClose} />
      ))}
    </div>
  );
}

export default function Sidebar({ categories, isOpen, onClose }: SidebarProps) {
  const sidebarClass = "w-64 bg-[#060e06] border-r border-green-900/80 overflow-y-auto";

  return (
    <>
      {/* Desktop: always visible static sidebar */}
      <aside className={`hidden lg:block flex-shrink-0 ${sidebarClass}`}>
        <SidebarContent categories={categories} onClose={onClose} />
      </aside>

      {/* Mobile: overlay + animated drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-30 bg-black/70 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-14 left-0 bottom-0 z-40 lg:hidden ${sidebarClass}`}
            >
              <SidebarContent categories={categories} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
