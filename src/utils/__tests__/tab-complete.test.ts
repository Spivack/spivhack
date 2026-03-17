import { describe, it, expect } from 'vitest';
import { findCompletions } from '../tab-complete';
import { resolvePath, getNode, pathString, GATE_PASSWORD } from '../../data/gate-filesystem';

// ─── password case sensitivity ────────────────────────────────────────────────

describe('GATE_PASSWORD case insensitivity', () => {
  const check = (input: string) => input.trim().toUpperCase() === GATE_PASSWORD;

  it('accepts exact uppercase', () => { expect(check('ACCESS')).toBe(true); });
  it('accepts lowercase',        () => { expect(check('access')).toBe(true); });
  it('accepts mixed case',       () => { expect(check('AccESS')).toBe(true); });
  it('accepts with whitespace',  () => { expect(check('  Access  ')).toBe(true); });
  it('rejects a wrong answer',   () => { expect(check('DENIED')).toBe(false); });
});

// ─── resolvePath ──────────────────────────────────────────────────────────────

describe('resolvePath', () => {
  it('resolves an absolute path', () => {
    expect(resolvePath([], '/etc/passwd')).toEqual(['etc', 'passwd']);
  });

  it('resolves a relative path from root', () => {
    expect(resolvePath([], 'home/spiv')).toEqual(['home', 'spiv']);
  });

  it('resolves a relative path from a subdirectory', () => {
    expect(resolvePath(['home', 'spiv'], 'gobirds')).toEqual(['home', 'spiv', 'gobirds']);
  });

  it('resolves .. to go up one level', () => {
    expect(resolvePath(['home', 'spiv'], '..')).toEqual(['home']);
  });

  it('resolves multiple .. steps', () => {
    expect(resolvePath(['home', 'spiv', 'gobirds'], '../..')).toEqual(['home']);
  });

  it('resolves .. at root without crashing', () => {
    expect(resolvePath([], '..')).toEqual([]);
  });

  it('ignores . segments', () => {
    expect(resolvePath(['home'], './spiv')).toEqual(['home', 'spiv']);
  });
});

// ─── getNode ──────────────────────────────────────────────────────────────────

describe('getNode', () => {
  it('returns the root dir for an empty path', () => {
    const node = getNode([]);
    expect(node?.type).toBe('dir');
  });

  it('returns a known directory', () => {
    const node = getNode(['home', 'spiv']);
    expect(node?.type).toBe('dir');
  });

  it('returns a known file', () => {
    const node = getNode(['etc', 'passwd']);
    expect(node?.type).toBe('file');
  });

  it('returns null for a nonexistent path', () => {
    expect(getNode(['does', 'not', 'exist'])).toBeNull();
  });

  it('returns null when traversing through a file', () => {
    expect(getNode(['etc', 'passwd', 'deeper'])).toBeNull();
  });

  it('gobirds directory exists', () => {
    expect(getNode(['home', 'spiv', 'gobirds'])?.type).toBe('dir');
  });

  it('eagles.txt exists inside gobirds', () => {
    const node = getNode(['home', 'spiv', 'gobirds', 'eagles.txt']);
    expect(node?.type).toBe('file');
  });

  it('nothing directory exists and is empty', () => {
    const node = getNode(['home', 'spiv', 'nothing']);
    expect(node?.type).toBe('dir');
    if (node?.type === 'dir') {
      expect(Object.keys(node.children)).toHaveLength(0);
    }
  });

  it('dsa directory exists', () => {
    expect(getNode(['dsa'])?.type).toBe('dir');
  });

  it('passwd contains only r00t', () => {
    const node = getNode(['etc', 'passwd']);
    if (node?.type === 'file') {
      const lines = node.content.split('\n').filter((l) => l.includes(':x:'));
      expect(lines).toHaveLength(1);
      expect(lines[0]).toMatch(/^r00t:/);
    }
  });
});

// ─── pathString ───────────────────────────────────────────────────────────────

describe('pathString', () => {
  it('returns / for the root', () => {
    expect(pathString([])).toBe('/');
  });

  it('returns a slash-joined path', () => {
    expect(pathString(['home', 'spiv'])).toBe('/home/spiv');
  });
});

// ─── findCompletions ──────────────────────────────────────────────────────────

describe('findCompletions — command completion', () => {
  it('completes an unambiguous command prefix', () => {
    const result = findCompletions('pw', []);
    expect(result).toEqual({ type: 'single', value: 'pwd ' });
  });

  it('returns multiple when prefix matches several commands', () => {
    const result = findCompletions('c', []);
    expect(result.type).toBe('multiple');
    if (result.type === 'multiple') {
      expect(result.options).toContain('cd');
      expect(result.options).toContain('cat');
      expect(result.options).toContain('clear');
    }
  });

  it('returns none when no command matches', () => {
    expect(findCompletions('zz', [])).toEqual({ type: 'none' });
  });

  it('completes an exact command match', () => {
    const result = findCompletions('ls', []);
    expect(result).toEqual({ type: 'single', value: 'ls ' });
  });
});

describe('findCompletions — path completion', () => {
  it('completes a directory name from root', () => {
    const result = findCompletions('cd hom', []);
    expect(result).toEqual({ type: 'single', value: 'cd home/' });
  });

  it('appends / for directories', () => {
    const result = findCompletions('cd home/sp', []);
    expect(result.type).toBe('single');
    if (result.type === 'single') {
      expect(result.value).toBe('cd home/spiv/');
    }
  });

  it('completes a filename without trailing slash', () => {
    const result = findCompletions('cat etc/pass', []);
    expect(result).toEqual({ type: 'single', value: 'cat etc/passwd' });
  });

  it('completes a relative path from a non-root cwd', () => {
    const result = findCompletions('cat eag', ['home', 'spiv', 'gobirds']);
    expect(result).toEqual({ type: 'single', value: 'cat eagles.txt' });
  });

  it('completes an absolute path regardless of cwd', () => {
    const result = findCompletions('cat /etc/pass', ['home', 'spiv']);
    expect(result).toEqual({ type: 'single', value: 'cat /etc/passwd' });
  });

  it('returns multiple when several entries match', () => {
    // /etc has passwd, hostname, motd — all start with nothing in common uniquely
    const result = findCompletions('ls /etc/', []);
    expect(result.type).toBe('multiple');
  });

  it('returns none when no path matches', () => {
    expect(findCompletions('cd zzz', [])).toEqual({ type: 'none' });
  });

  it('returns none when completing into a file (not a dir)', () => {
    expect(findCompletions('cd etc/passwd/', [])).toEqual({ type: 'none' });
  });
});
