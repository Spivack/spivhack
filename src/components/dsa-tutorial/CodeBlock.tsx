import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Copy, Check } from 'lucide-react';
import type { Language } from '../../dsa-types';

interface CodeBlockProps {
  code: string;
  language: Language;
  highlightLines?: number[];
}

const PRISM_LANG: Record<Language, string> = {
  python: 'python',
  java: 'java',
  javascript: 'javascript',
  typescript: 'typescript',
};

export default function CodeBlock({ code, language, highlightLines = [] }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 2000);
    }).catch(() => { /* clipboard unavailable */ });
  };

  return (
    <div className="border border-[#2a2a2a] bg-[#161616]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 border border-[#333] bg-[#222]" />
          <div className="w-2.5 h-2.5 border border-[#333] bg-[#222]" />
          <div className="w-2.5 h-2.5 border border-[#333] bg-[#222]" />
        </div>
        <span className="text-xs text-gray-600 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#00FF00] transition-colors px-2 py-0.5 font-mono border border-transparent hover:border-[#2a2a2a]"
        >
          {copied ? (
            <>
              <Check size={11} className="text-[#00FF00]" />
              <span className="text-[#00FF00]">copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <Highlight
        theme={themes.nightOwl}
        code={code.trim()}
        language={PRISM_LANG[language]}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto p-4 text-sm leading-relaxed`}
            style={{ ...style, background: 'transparent', margin: 0 }}
          >
            {tokens.map((line, i) => {
              const lineNumber = i + 1;
              const isHighlighted = highlightLines.includes(lineNumber);
              return (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className={`relative flex transition-colors duration-200 ${
                    isHighlighted ? 'bg-[#00FF00]/5' : ''
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00FF00]" />
                  )}
                  <span className="select-none w-10 text-right pr-4 text-gray-700 text-xs leading-relaxed flex-shrink-0 font-mono">
                    {lineNumber}
                  </span>
                  <span className="flex-1">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
