import type { Language } from '../../types';

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
              ? 'border-green-500 text-green-300 bg-green-900/40'
              : 'border-green-900 text-green-800 hover:border-green-700 hover:text-green-500'
          }`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
