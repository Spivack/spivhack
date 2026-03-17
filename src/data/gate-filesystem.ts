export type FSFile = { type: 'file'; content: string };
export type FSDir = { type: 'dir'; children: Record<string, FSNode> };
export type FSNode = FSFile | FSDir;

export const GATE_USERNAME = 'r00t';
// this is a joke
export const GATE_PASSWORD = 'ACCESS';

export const FILESYSTEM: FSDir = {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        spiv: {
          type: 'dir',
          children: {
            gobirds: {
              type: 'dir',
              children: {
                'eagles.txt': {
                  type: 'file',
                  content:
                    'Fly Eagles Fly!',
                },
              },
            },
            nothing: {
              type: 'dir',
              children: {},
            },
          },
        },
      },
    },
    etc: {
      type: 'dir',
      children: {
        passwd: {
          type: 'file',
          content:
            'r00t:x:0:0:System Administrator:/root:/bin/zsh\n\n// format: username:password_hash:uid:gid:comment:home:shell\n// first field is the username',
        },
        hostname: {
          type: 'file',
          content: 'spivhack-server',
        },
        motd: {
          type: 'file',
          content:
            'Welcome to spivhack-server.\n\nUnauthorized access will be... studied.\nAll activity is monitored and logged.\n(it is not)',
        },
      },
    },
    dsa: {
      type: 'dir',
      children: {
        'README.txt': {
          type: 'file',
          content:
            '[ACCESS DENIED]\n\nThis archive requires authenticated access.\nAuthenticate via root terminal to unlock.',
        },
      },
    },
  },
};

// ── Path utilities ──────────────────────────────────────────────────────────

export function resolvePath(cwd: string[], input: string): string[] {
  const parts = input.startsWith('/')
    ? input.slice(1).split('/').filter(Boolean)
    : [...cwd, ...input.split('/').filter(Boolean)];

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    if (part === '..') { resolved.pop(); }
    else resolved.push(part);
  }
  return resolved;
}

export function getNode(path: string[]): FSNode | null {
  let node: FSNode = FILESYSTEM;
  for (const part of path) {
    if (node.type !== 'dir') return null;
    const child: FSNode | undefined = node.children[part];
    if (!child) return null;
    node = child;
  }
  return node;
}

export function pathString(path: string[]): string {
  return '/' + path.join('/');
}
