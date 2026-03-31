import { useState } from 'react';
import Nav from '../components/Nav';
import { REFERENCE_SECTIONS, CERT_COLORS, type ReferenceTopic } from '../data/reference-topics';

const ALL_CERTS = ['Security+', 'CEH', 'OSCP', 'CISSP'];

function TopicRow({ topic }: { topic: ReferenceTopic }) {
  const [open, setOpen] = useState(false);
  const canExpand = topic.available && !!topic.body;

  return (
    <div className={`border-b border-[#232323] transition-colors ${
      canExpand
        ? 'hover:bg-white/[0.02] cursor-pointer'
        : topic.available
        ? 'hover:bg-white/[0.02] cursor-pointer'
        : 'opacity-35 cursor-not-allowed'
    }`}>
      <div
        className="flex items-start justify-between px-4 py-3"
        onClick={() => { if (canExpand) setOpen((o) => !o); }}
      >
        <div className="min-w-0 flex-1 mr-4">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-pixel text-lg text-gray-100 leading-none">{topic.title}</span>
            {!topic.available && (
              <span className="font-mono text-sm text-gray-600 border border-gray-800 px-1.5 py-0 leading-5">
                soon
              </span>
            )}
          </div>
          <p className="font-mono text-sm text-gray-500 leading-relaxed">{topic.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-0.5">
          {topic.certs.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {topic.certs.map((cert) => (
                <span
                  key={cert}
                  className={`font-mono text-sm border px-1.5 py-0 leading-5 ${CERT_COLORS[cert] ?? 'text-gray-500 border-gray-800'}`}
                >
                  {cert}
                </span>
              ))}
            </div>
          )}
          {canExpand && (
            <span className="font-mono text-sm text-gray-600 w-4 text-center select-none">
              {open ? '−' : '+'}
            </span>
          )}
        </div>
      </div>

      {open && topic.body && (
        <div className="px-4 pb-5 space-y-4 border-t border-[#1e1e1e]">
          <BodySection label="How it works" text={topic.body.mechanism} />
          <BodySection label="Example" text={topic.body.example} />
          <BodySection label="Impact" text={topic.body.impact} />
          <BodySection label="Defense" text={topic.body.defense} />
        </div>
      )}
    </div>
  );
}

function BodySection({ label, text }: { label: string; text: string }) {
  return (
    <div className="pt-3">
      <div className="font-mono text-sm text-[#00FF00] mb-1">{label}</div>
      <p className="font-mono text-sm text-gray-400 leading-relaxed">{text}</p>
    </div>
  );
}

export default function LearnPage() {
  const [activeCert, setActiveCert] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = REFERENCE_SECTIONS.map((section) => ({
    ...section,
    topics: section.topics.filter((t) => {
      const matchesCert = !activeCert || t.certs.includes(activeCert);
      const matchesQuery = !query || t.title.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase());
      return matchesCert && matchesQuery;
    }),
  })).filter((s) => s.topics.length > 0);

  const totalVisible = filtered.reduce((n, s) => n + s.topics.length, 0);
  const totalAll = REFERENCE_SECTIONS.reduce((n, s) => n + s.topics.length, 0);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Nav />

      <div className="max-w-5xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-gray-600 text-sm tracking-widest mb-1">[ REFERENCE LIBRARY ]</div>
          <h1 className="font-pixel text-4xl text-white leading-none mb-2">Learn</h1>
          <p className="font-mono text-sm text-gray-400">
            {totalAll} topics across {REFERENCE_SECTIONS.length} sections. Study material for Security+, CEH, OSCP, and beyond.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); }}
            placeholder="search topics..."
            className="bg-[#161616] border border-[#2a2a2a] focus:border-[#00FF00] px-3 py-1.5 font-mono text-sm text-gray-300 outline-none placeholder-gray-700 w-52"
          />
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gray-600">filter:</span>
            {ALL_CERTS.map((cert) => (
              <button
                key={cert}
                onClick={() => { setActiveCert(activeCert === cert ? null : cert); }}
                className={`font-mono text-sm border px-2 py-0.5 transition-colors ${
                  activeCert === cert
                    ? `${CERT_COLORS[cert]} glow-sm`
                    : 'border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400'
                }`}
              >
                {cert}
              </button>
            ))}
          </div>
          {(activeCert || query) && (
            <button
              onClick={() => { setActiveCert(null); setQuery(''); }}
              className="font-mono text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              clear ×
            </button>
          )}
          <span className="font-mono text-sm text-gray-700 ml-auto">
            {totalVisible}/{totalAll} topics
          </span>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {filtered.map((section) => (
            <div key={section.id} className="panel">
              {/* Section header */}
              <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-baseline justify-between">
                <div>
                  <h2 className="font-pixel text-2xl text-white leading-none">{section.title}</h2>
                  <p className="font-mono text-sm text-gray-500 mt-0.5">{section.description}</p>
                </div>
                <span className="font-mono text-sm text-gray-600 shrink-0 ml-4">
                  {section.topics.length} topics
                </span>
              </div>
              {/* Topics */}
              <div>
                {section.topics.map((topic) => (
                  <TopicRow key={topic.slug} topic={topic} />
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="panel px-6 py-10 text-center font-mono text-base text-gray-600">
              no topics match — try a different filter
            </div>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-[#2a2a2a] font-mono text-sm text-gray-700 text-center">
          topics are added incrementally — check back or contribute at github.com/Spivack/spivhack
        </div>
      </div>
    </div>
  );
}
