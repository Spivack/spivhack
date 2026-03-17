import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { categories } from '../../data/categories';

// Email split to deter simple scrapers
const EMAIL = ['evan', 'spivack.io'] as const;

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060e06] text-green-100">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => { setSidebarOpen(!sidebarOpen); }}
      />
      <div className="flex pt-14">
        <Sidebar
          categories={categories}
          isOpen={sidebarOpen}
          onClose={() => { setSidebarOpen(false); }}
        />
        <main className="flex-1 min-w-0 flex flex-col">
          <Outlet />
          <footer className="mt-auto px-6 py-8 border-t border-green-900/40">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-pixel text-lg tracking-wide leading-none opacity-20 select-none">
                <span className="text-green-100">Spiv</span>
                <span className="text-gradient">Hack</span>
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs">
                <a href="https://github.com/Spivack" target="_blank" rel="noopener noreferrer"
                  className="text-green-800 hover:text-green-500 transition-colors">
                  github
                </a>
                <a href="https://www.linkedin.com/in/evan-spivack/" target="_blank" rel="noopener noreferrer"
                  className="text-green-800 hover:text-green-500 transition-colors">
                  linkedin
                </a>
                <a href="https://spivack.dev" target="_blank" rel="noopener noreferrer"
                  className="text-green-800 hover:text-green-500 transition-colors">
                  spivack.dev
                </a>
                <a href="https://spivack.io" target="_blank" rel="noopener noreferrer"
                  className="text-green-800 hover:text-green-500 transition-colors">
                  spivack.io
                </a>
                <a href={`mailto:${EMAIL[0]}@${EMAIL[1]}`}
                  className="text-green-800 hover:text-green-500 transition-colors">
                  {EMAIL[0]}&#64;{EMAIL[1]}
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
