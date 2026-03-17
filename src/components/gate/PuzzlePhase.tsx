import { useState, useRef, useEffect } from 'react';
import { GATE_PASSWORD } from '../../data/gate-filesystem';

interface PuzzlePhaseProps {
  onSolve: () => void;
  onSkip: () => void;
}

const CODE_SNIPPET = `def mystery(s):
    stack = []
    for ch in s:
        stack.append(ch)
    result = ""
    while stack:
        result += stack.pop()
    return result

print(mystery("SSECCA"))`;

export default function PuzzlePhase({ onSolve, onSkip }: PuzzlePhaseProps) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'wrong' | 'solving'>('idle');
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toUpperCase() === GATE_PASSWORD) {
      setStatus('solving');
      setTimeout(onSolve, 900);
    } else {
      setAttempts((n) => n + 1);
      setStatus('wrong');
      setInput('');
      setTimeout(() => { setStatus('idle'); }, 1200);
    }
  };

  const wrongMessages = [
    'incorrect. try again.',
    'still wrong.',
    'nope.',
    'come on.',
    'trace it again. slowly.',
  ];

  return (
    <div className="flex flex-col gap-8 max-w-2xl w-full">
      {/* Header */}
      <div>
        <div className="text-green-600 text-xs font-mono tracking-widest mb-1">// PHASE 1 OF 3 — COMPETENCY VERIFICATION</div>
        <div className="text-green-800 text-xs font-mono">intercepted script recovered from target system — determine output to proceed</div>
      </div>

      {/* Code block */}
      <div className="border border-green-900 bg-[#0a120a]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-green-900/60">
          <span className="text-green-800 text-xs font-mono">mystery.py</span>
          <span className="text-green-900 text-xs font-mono">python 3.x</span>
        </div>
        <pre className="p-5 text-green-300 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre">
          {CODE_SNIPPET}
        </pre>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-green-600 text-xs font-mono tracking-widest">
          {'>'} WHAT IS THE OUTPUT?
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-mono text-sm select-none">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); }}
              disabled={status === 'solving'}
              className="w-full bg-[#0a120a] border border-green-900 pl-8 pr-4 py-2.5 text-green-300 font-mono text-sm outline-none focus:border-green-700 placeholder-green-900 disabled:opacity-50"
              placeholder="enter output..."
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'solving' || !input.trim()}
            className="px-5 py-2.5 bg-green-800 hover:bg-green-700 text-green-100 font-mono text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {status === 'solving' ? 'VERIFYING...' : 'SUBMIT'}
          </button>
        </div>

        {/* Feedback */}
        {status === 'wrong' && (
          <div className="text-red-500 font-mono text-xs">
            {'>'} {wrongMessages[Math.min(attempts - 1, wrongMessages.length - 1)]}
          </div>
        )}
        {status === 'solving' && (
          <div className="text-green-400 font-mono text-xs animate-pulse">
            {'>'} verifying credentials...
          </div>
        )}
      </form>

      {/* Skip */}
      <div className="pt-4 border-t border-green-900/30">
        <button
          onClick={onSkip}
          className="text-red-800 hover:text-red-600 font-mono text-xs transition-colors"
        >
          {'[ no time for the challenge, let me in → ]'}
        </button>
      </div>
    </div>
  );
}
