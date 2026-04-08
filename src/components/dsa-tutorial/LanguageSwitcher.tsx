import type { Language } from '../../dsa-types';

interface LanguageSwitcherProps {
  available: Language[];
  selected: Language;
  onChange: (lang: Language) => void;
}

const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'PY',
  java: 'JAVA',
  javascript: 'JS',
  typescript: 'TS',
};

export default function LanguageSwitcher({ available, selected, onChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-1">
      {available.map((lang) => (
        <button
          key={lang}
          onClick={() => { onChange(lang); }}
          className={`px-2 py-0.5 text-xs font-mono font-bold border transition-colors ${
            selected === lang
              ? 'border-[#00FF00] text-[#00FF00] bg-[#00FF00]/10'
              : 'border-[#2a2a2a] text-gray-600 hover:border-gray-500 hover:text-gray-400'
          }`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
