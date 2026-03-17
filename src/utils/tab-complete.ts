import { resolvePath, getNode } from '../data/gate-filesystem';

export const COMMANDS = ['ls', 'cd', 'cat', 'pwd', 'help', 'clear'] as const;

export type CompletionResult =
  | { type: 'single'; value: string }
  | { type: 'multiple'; options: string[] }
  | { type: 'none' };

export function findCompletions(input: string, cwd: string[]): CompletionResult {
  const tokens = input.split(/\s+/);
  const last = tokens[tokens.length - 1] ?? '';

  // Complete the command itself
  if (tokens.length <= 1) {
    const matches = COMMANDS.filter((c) => c.startsWith(last));
    if (matches.length === 1) return { type: 'single', value: matches[0] + ' ' };
    if (matches.length > 1)  return { type: 'multiple', options: [...matches] };
    return { type: 'none' };
  }

  // Complete a path argument
  const lastSlash = last.lastIndexOf('/');
  const dirPart  = lastSlash >= 0 ? last.slice(0, lastSlash + 1) : '';
  const filePart = lastSlash >= 0 ? last.slice(lastSlash + 1)    : last;

  const dirPath = dirPart ? resolvePath(cwd, dirPart) : cwd;
  const dirNode = getNode(dirPath);
  if (!dirNode || dirNode.type !== 'dir') return { type: 'none' };

  const matches = Object.entries(dirNode.children)
    .filter(([name]) => name.startsWith(filePart))
    .map(([name, node]) => ({ name, isDir: node.type === 'dir' }));

  if (matches.length === 0) return { type: 'none' };

  if (matches.length === 1) {
    const { name, isDir } = matches[0];
    const completed = dirPart + name + (isDir ? '/' : '');
    return { type: 'single', value: [...tokens.slice(0, -1), completed].join(' ') };
  }

  return {
    type: 'multiple',
    options: matches.map(({ name, isDir }) => (isDir ? `${name}/` : name)),
  };
}
