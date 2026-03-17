import { useState, useRef, useEffect } from 'react';
import { GATE_USERNAME, GATE_PASSWORD } from '../../data/gate-filesystem';

interface LoginPhaseProps {
  onSuccess: () => void;
  onSkip: () => void;
}

type LoginState = 'username' | 'password' | 'authenticating' | 'success' | 'failed';

const BOOT_SEQUENCE = [
  'authentication successful.',
  '',
  'welcome back, r00t.',
  `last login: never  (suspicious)`,
  '',
  'mounting /dsa_archive...',
  'decrypting index...',
  'loading topics...',
  'verifying data structures...',
  '',
  '[ access granted ]',
  '',
];

export default function LoginPhase({ onSuccess, onSkip }: LoginPhaseProps) {
  const [loginState, setLoginState] = useState<LoginState>('username');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [failMessage, setFailMessage] = useState('');
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [failCount, setFailCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [loginState]);

  const startBootSequence = () => {
    setLoginState('success');
    let i = 0;
    const tick = () => {
      if (i < BOOT_SEQUENCE.length) {
        setBootLines((prev) => [...prev, BOOT_SEQUENCE[i]]);
        i++;
        setTimeout(tick, i === 1 ? 300 : 120);
      } else {
        setTimeout(onSuccess, 600);
      }
    };
    setTimeout(tick, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginState === 'username') {
      setLoginState('password');
      return;
    }

    if (loginState === 'password') {
      setLoginState('authenticating');
      setTimeout(() => {
        const userOk = usernameInput.trim() === GATE_USERNAME;
        const passOk = passwordInput.trim().toUpperCase() === GATE_PASSWORD;
        if (userOk && passOk) {
          startBootSequence();
        } else {
          setFailCount((n) => n + 1);
          setFailMessage(
            !userOk
              ? 'Login incorrect. (hint: the username is not "root")'
              : 'Login incorrect. (hint: the password is the puzzle answer)'
          );
          setLoginState('failed');
          setTimeout(() => {
            setUsernameInput('');
            setPasswordInput('');
            setLoginState('username');
            setFailMessage('');
          }, 2000);
        }
      }, 900);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loginState === 'username') setUsernameInput(e.target.value);
    if (loginState === 'password') setPasswordInput(e.target.value);
  };

  const currentValue = loginState === 'username' ? usernameInput : passwordInput;
  const isPasswordField = loginState === 'password';

  return (
    <div className="flex flex-col gap-6 max-w-2xl w-full">
      <div>
        <div className="text-green-600 text-xs font-mono tracking-widest mb-1">// PHASE 3 OF 3 — ROOT TERMINAL LOGIN</div>
        <div className="text-green-800 text-xs font-mono">authenticate to unlock the dsa archive</div>
      </div>

      <div className="border border-green-900 bg-[#0a120a] p-6 font-mono text-sm space-y-1">
        {/* System banner */}
        <div className="text-green-700 mb-4 text-xs">
          spivhack-server — unauthorized access is monitored (it isn&apos;t)
        </div>

        {/* Completed lines */}
        {(loginState !== 'username') && (
          <div className="text-green-400">
            login: {usernameInput}
          </div>
        )}
        {(loginState === 'authenticating' || loginState === 'success' || loginState === 'failed') && (
          <div className="text-green-400">
            Password: {'•'.repeat(passwordInput.length)}
          </div>
        )}

        {/* Authenticating state */}
        {loginState === 'authenticating' && (
          <div className="text-green-600 animate-pulse mt-2">
            authenticating...
          </div>
        )}

        {/* Failed state */}
        {loginState === 'failed' && (
          <div className="space-y-1 mt-2">
            <div className="text-red-500">{failMessage}</div>
            {failCount >= 2 && (
              <div className="text-green-900 text-xs">
                {'// username: r00t  |  password: the output from phase 1'}
              </div>
            )}
          </div>
        )}

        {/* Boot sequence */}
        {loginState === 'success' && (
          <div className="mt-2 space-y-0.5">
            {bootLines.map((line, i) => (
              <div key={i} className={line === '[ access granted ]' ? 'text-green-300 font-bold' : 'text-green-600'}>
                {line || <br />}
              </div>
            ))}
          </div>
        )}

        {/* Active input */}
        {(loginState === 'username' || loginState === 'password') && (
          <form onSubmit={handleSubmit} className="flex items-center gap-0 mt-1">
            <span className="text-green-400 select-none">
              {loginState === 'username' ? 'login: ' : 'Password: '}
            </span>
            <input
              ref={inputRef}
              type={isPasswordField ? 'password' : 'text'}
              value={currentValue}
              onChange={handleChange}
              className="bg-transparent outline-none text-green-300 flex-1 caret-green-400"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="off"
            />
            <span className="w-2 h-4 bg-green-400 animate-pulse" />
          </form>
        )}
      </div>

      {(loginState === 'username' || loginState === 'password') && (
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="px-5 py-2.5 bg-green-800 hover:bg-green-700 text-green-100 font-mono text-sm transition-colors"
          >
            {loginState === 'username' ? 'ENTER →' : 'AUTHENTICATE →'}
          </button>
        </form>
      )}

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
