import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Tag } from 'lucide-react';
import type { Topic, Language } from '../../types';
import { getAvailableLanguages, clampStep, stepDirection } from '../../utils/tutorial';
import CodeBlock from './CodeBlock';
import LanguageSwitcher from './LanguageSwitcher';
import Visualization from './Visualization';
import StepCallout from './StepCallout';
import ComplexityBadge from './ComplexityBadge';

interface TutorialViewerProps {
  topic: Topic;
}

const DIFFICULTY_STYLE: Record<string, string> = {
  beginner: 'border-green-700 text-green-400',
  intermediate: 'border-yellow-700 text-yellow-400',
  advanced: 'border-red-800 text-red-400',
};

const PLATFORM_COLORS: Record<string, string> = {
  leetcode: 'text-orange-500 hover:text-orange-400',
  hackerrank: 'text-green-500 hover:text-green-400',
  other: 'text-green-700 hover:text-green-500',
};

export default function TutorialViewer({ topic }: TutorialViewerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [language, setLanguage] = useState<Language>('python');

  const step = topic.steps[stepIndex];
  const totalSteps = topic.steps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const availableLanguages = getAvailableLanguages(topic);

  const goTo = (index: number) => {
    setDirection(stepDirection(stepIndex, index));
    setStepIndex(index);
  };

  const prev = () => { goTo(clampStep(stepIndex, -1, totalSteps)); };
  const next = () => { goTo(clampStep(stepIndex, 1, totalSteps)); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
  };

  const currentCode = step.code?.[language];
  const highlightLines = step.highlightLines?.[language] ?? [];

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Topic Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 border ${DIFFICULTY_STYLE[topic.difficulty]}`}>
            {topic.difficulty}
          </span>
          {topic.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs text-green-800 font-mono border border-green-900 px-2 py-0.5">
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-pixel text-4xl sm:text-5xl text-green-100 mb-2 leading-tight">{topic.title}</h1>
        <p className="text-green-700 font-mono text-sm leading-relaxed">{topic.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-green-800 mb-1.5">
          <span>STEP {stepIndex + 1}/{totalSteps}</span>
          <span className="text-green-700 truncate ml-4">{step.title}</span>
        </div>
        <div className="h-1 bg-green-950 border border-green-900">
          <motion.div
            className="h-full bg-green-500"
            animate={{ width: `${String(progress)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {/* Step dots */}
        <div className="flex gap-1 mt-2 justify-center">
          {topic.steps.map((s, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); }}
              title={s.title}
              className={`h-1 transition-all ${
                i === stepIndex ? 'w-6 bg-green-400' : 'w-1.5 bg-green-900 hover:bg-green-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={stepIndex}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ x: dir * 30, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (dir: number) => ({ x: dir * -30, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="space-y-4"
        >
          {/* Step title & explanation */}
          <div className="border border-green-900 bg-[#0a120a] p-5">
            <h2 className="font-pixel text-2xl text-green-200 mb-3">{step.title}</h2>
            <p className="text-green-600 font-mono text-sm leading-relaxed whitespace-pre-line">{step.explanation}</p>
          </div>

          {/* Callout */}
          {step.callout && (
            <StepCallout type={step.callout.type} text={step.callout.text} />
          )}

          {/* Visualization */}
          {step.visualization && (
            <Visualization data={step.visualization} />
          )}

          {/* Code Block */}
          {(step.code && availableLanguages.length > 0) && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-green-800 tracking-widest">{'// CODE'}</span>
                <LanguageSwitcher
                  available={availableLanguages}
                  selected={language}
                  onChange={setLanguage}
                />
              </div>
              {currentCode ? (
                <CodeBlock
                  code={currentCode}
                  language={language}
                  highlightLines={highlightLines}
                />
              ) : (
                <div className="border border-green-900 bg-[#0a120a] p-6 text-center text-green-800 text-sm font-mono">
                  {'// not yet available in'} {language}
                </div>
              )}
            </div>
          )}

          {/* Complexity */}
          {step.complexity && (
            <div>
              <div className="text-xs font-mono text-green-800 tracking-widest mb-2">{'// COMPLEXITY'}</div>
              <ComplexityBadge complexity={step.complexity} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-green-900/50">
        <button
          onClick={prev}
          disabled={stepIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-green-900 text-green-600 hover:text-green-300 hover:border-green-600 font-mono text-sm transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          PREV
        </button>

        <span className="text-xs font-mono text-green-900">← → keys work</span>

        <button
          onClick={next}
          disabled={stepIndex === totalSteps - 1}
          className="flex items-center gap-2 px-4 py-2 bg-green-800 hover:bg-green-700 text-green-100 font-mono text-sm transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          NEXT
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Practice Problems */}
      {stepIndex === totalSteps - 1 && topic.practiceProblems && topic.practiceProblems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 border border-green-800 bg-[#0a120a] p-5"
        >
          <h3 className="font-pixel text-xl text-green-400 mb-3">
            &gt; PRACTICE
          </h3>
          <ul className="space-y-1.5">
            {topic.practiceProblems.map((p, i) => (
              <li key={i}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-2.5 border border-green-900/50 hover:border-green-700 hover:bg-green-950/30 transition-colors ${PLATFORM_COLORS[p.platform]}`}
                >
                  <span className="flex items-center gap-2 text-xs font-mono">
                    <ExternalLink size={11} />
                    {p.title}
                  </span>
                  <span className={`text-xs font-mono font-bold ${
                    p.difficulty === 'easy' ? 'text-green-400' :
                    p.difficulty === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    [{p.difficulty}]
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
