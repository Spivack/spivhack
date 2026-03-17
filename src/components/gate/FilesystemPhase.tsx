import { useState, useRef, useEffect, useCallback } from 'react';
import {
  resolvePath,
  getNode,
  pathString,
  type FSDir,
} from '../../data/gate-filesystem';
import { findCompletions } from '../../utils/tab-complete';

interface FilesystemPhaseProps {
  onComplete: () => void;
  onSkip: () => void;
}

type LineType = 'prompt' | 'output' | 'error' | 'system' | 'file';

interface TerminalLine {
  type: LineType;
  text: string;
  promptPath?: string;
}

const BOOT_LINES: TerminalLine[] = [
  { type: 'system', text: 'spivhack-server — filesystem access granted' },
  { type: 'system', text: 'session opened for user: UNKNOWN' },
  { type: 'system', text: '' },
  { type: 'system', text: "objective: locate credentials for root terminal login" },
  { type: 'system', text: "type 'help' for available commands" },
  { type: 'system', text: '' },
];

const HELP_TEXT = [
  'available commands:',
  '  ls [-a]       list directory contents (-a shows hidden files)',
  '  cd <path>     change directory (.. to go up, / for root, ~ for /home/spiv)',
  '  cat <file>    display file contents',
  '  pwd           print working directory',
  '  clear         clear terminal',
  '  help          show this message',
];

export default function FilesystemPhase({ onComplete, onSkip }: FilesystemPhaseProps) {
  const [cwd, setCwd] = useState<string[]>([]);
  const [history, setHistory] = useState<TerminalLine[]>(BOOT_LINES);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const historyIdxRef = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const prompt = pathString(cwd) || '/';

  const addLines = useCallback((lines: TerminalLine[]) => {
    setHistory((prev) => [...prev, ...lines]);
  }, []);

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // echo the command
    const echo: TerminalLine = { type: 'prompt', text: trimmed, promptPath: prompt };
    const output: TerminalLine[] = [];

    const [cmd, ...args] = trimmed.split(/\s+/);

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'help') {
      HELP_TEXT.forEach((t) => output.push({ type: 'output', text: t }));
    }

    else if (cmd === 'pwd') {
      output.push({ type: 'output', text: prompt });
    }

    else if (cmd === 'ls') {
      const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const node = getNode(cwd);
      if (!node || node.type !== 'dir') {
        output.push({ type: 'error', text: 'ls: cannot read current directory' });
      } else {
          const entries = Object.entries(node.children);
          const visible = showHidden ? entries : entries.filter(([name]) => !name.startsWith('.'));
          if (visible.length === 0) {
            output.push({ type: 'output', text: '(empty)' });
          } else {
            visible.forEach(([name, child]) => {
              const isDir = child.type === 'dir';
              output.push({
                type: isDir ? 'output' : 'file',
                text: isDir ? `${name}/` : name,
              });
            });
          }
      }
    }

    else if (cmd === 'cd') {
      const target = args[0];
      if (!target || target === '~') {
        setCwd(['home', 'spiv']);
      } else {
        const resolved = resolvePath(cwd, target);
        const node = getNode(resolved);
        if (!node) {
          output.push({ type: 'error', text: `bash: cd: ${target}: No such file or directory` });
        } else if (node.type !== 'dir') {
          output.push({ type: 'error', text: `bash: cd: ${target}: Not a directory` });
        } else {
          setCwd(resolved);
        }
      }
    }

    else if (cmd === 'cat') {
      const target = args[0];
      if (!target) {
        output.push({ type: 'error', text: 'cat: missing file operand' });
      } else {
        const resolved = resolvePath(cwd, target);
        const node = getNode(resolved);
        if (!node) {
          output.push({ type: 'error', text: `cat: ${target}: No such file or directory` });
        } else if (node.type === 'dir') {
          output.push({ type: 'error', text: `cat: ${target}: Is a directory` });
        } else {
          node.content.split('\n').forEach((line) =>
            output.push({ type: 'file', text: line })
          );
        }
      }
    }

    else if (cmd === 'ssh' || cmd === 'login' || cmd === 'connect') {
      output.push({ type: 'system', text: "use the [ PROCEED TO LOGIN ] button below to authenticate" });
    }

    else if (cmd === '') {
      // do nothing
    }

    else {
      output.push({ type: 'error', text: `bash: ${cmd}: command not found` });
    }

    addLines([echo, ...output]);
  }, [cwd, prompt, addLines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const result = findCompletions(input, cwd);
      if (result.type === 'single') {
        setInput(result.value);
      } else if (result.type === 'multiple') {
        addLines([
          { type: 'prompt', text: input, promptPath: prompt },
          ...result.options.map((opt) => ({ type: 'output' as LineType, text: opt })),
        ]);
      }
    } else if (e.key === 'Enter') {
      const cmd = input;
      setCmdHistory((prev) => [cmd, ...prev].slice(0, 50));
      historyIdxRef.current = -1;
      runCommand(cmd);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdxRef.current + 1, cmdHistory.length - 1);
      historyIdxRef.current = next;
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdxRef.current - 1, -1);
      historyIdxRef.current = next;
      setInput(next === -1 ? '' : (cmdHistory[next] ?? ''));
    }
  };

  const lineColor = (type: LineType) => {
    switch (type) {
      case 'system':  return 'text-green-600';
      case 'error':   return 'text-red-500';
      case 'file':    return 'text-green-400';
      case 'output':  return 'text-green-300';
      default:        return 'text-green-200';
    }
  };

  // Get current dir node for display
  const cwdNode = getNode(cwd);
  const cwdDir = cwdNode?.type === 'dir' ? cwdNode : null;
  const hasChildren = cwdDir ? Object.keys((cwdDir as FSDir).children).length > 0 : false;

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl">
      <div>
        <div className="text-green-600 text-xs font-mono tracking-widest mb-1">// PHASE 2 OF 3 — FILESYSTEM EXPLORATION</div>
        <div className="text-green-800 text-xs font-mono">locate credentials — then proceed to login</div>
      </div>

      {/* Terminal window */}
      <div
        className="border border-green-900 bg-[#0a120a] flex flex-col"
        style={{ height: '420px' }}
        onClick={() => { inputRef.current?.focus(); }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-green-900/60">
          <span className="text-green-800 text-xs font-mono">spivhack-server — bash</span>
          <span className="text-green-900 text-xs font-mono">{hasChildren ? `${Object.keys((cwdNode as FSDir).children).length} items` : ''}</span>
        </div>

        {/* Output */}
        <div className="flex-1 overflow-y-auto p-4 space-y-0.5 font-mono text-sm">
          {history.map((line, i) => (
            <div key={i} className={lineColor(line.type)}>
              {line.type === 'prompt' ? (
                <span>
                  <span className="text-green-700">{line.promptPath ?? '/'}$</span>
                  {' '}{line.text}
                </span>
              ) : (
                line.text === '' ? <br /> : line.text
              )}
            </div>
          ))}

          {/* Current input line */}
          <div className="flex items-center text-green-200">
            <span className="text-green-700 select-none">{prompt}$&nbsp;</span>
            <span>{input}</span>
            <span className="w-2 h-4 bg-green-400 animate-pulse ml-px" />
          </div>
          <div ref={bottomRef} />
        </div>

        {/* Input (invisible, captures keystrokes) */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); }}
          onKeyDown={handleKeyDown}
          className="sr-only"
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
        />
      </div>

      {/* Proceed button */}
      <div className="flex items-center justify-between">
        <span className="text-green-900 text-xs font-mono">// find the login username — it&apos;s in here somewhere</span>
        <button
          onClick={onComplete}
          className="px-5 py-2.5 bg-green-800 hover:bg-green-700 text-green-100 font-mono text-sm transition-colors"
        >
          PROCEED TO LOGIN →
        </button>
      </div>

      {/* Skip */}
      <div className="pt-2 border-t border-green-900/30">
        <button
          onClick={onSkip}
          className="text-red-800 hover:text-red-600 font-mono text-xs transition-colors"
        >
          {'[ skip joke → ]'}
        </button>
      </div>
    </div>
  );
}
