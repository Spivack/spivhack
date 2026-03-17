import type { Topic } from '../../../types';

const unionFind: Topic = {
  id: 'union-find',
  title: 'Union-Find',
  description:
    'Efficiently tracks which elements belong to the same group (connected component). With path compression and union by rank, nearly every operation runs in O(α(n)) — effectively constant time. Essential for Kruskal\'s MST and cycle detection.',
  difficulty: 'intermediate',
  category: 'trees',
  tags: ['union-find', 'disjoint-sets', 'path-compression', 'connected-components'],
  steps: [
    {
      title: 'The Problem: Disjoint Sets',
      explanation:
        'You have n elements. Initially, each is in its own group (disjoint set).\n\nYou need to support two operations efficiently:\n  union(a, b)    — merge the groups containing a and b\n  find(a)        — return an identifier for the group containing a\n\nTwo elements are in the same group if find(a) == find(b).\n\nApplications:\n  • Network connectivity: are two computers connected?\n  • Kruskal\'s MST: does adding this edge create a cycle?\n  • Image processing: connected regions of pixels\n  • Social networks: friend clusters\n  • Percolation problems\n\nA naïve approach (scan an array for group membership) takes O(n) per operation. Union-Find achieves nearly O(1).',
    },
    {
      title: 'The Forest Representation',
      explanation:
        'Represent each set as a tree where every node points to its parent. The root of each tree is the representative (or "leader") of that set.\n\nInitially: parent[i] = i (every element is its own root)\n\nfind(x): follow parent pointers up to the root.\nIf parent[x] == x, then x is the root.\n\nunion(a, b): find the roots of a and b; make one root point to the other.\n\nNaïve trees can become tall chains (O(n) find), so we need optimizations.',
      code: {
        python: `class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))  # parent[i] = i initially
        self.rank   = [0] * n         # for union by rank

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> bool:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False   # already in same set
        self.parent[ra] = rb
        return True

    def connected(self, a: int, b: int) -> bool:
        return self.find(a) == self.find(b)`,
        java: `class UnionFind {
    int[] parent, rank;

    UnionFind(int n) {
        parent = new int[n];
        rank   = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        while (parent[x] != x) x = parent[x];
        return x;
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        parent[ra] = rb;
        return true;
    }
}`,
        javascript: `class UnionFind {
  #parent;
  #rank;

  constructor(n) {
    this.#parent = Array.from({ length: n }, (_, i) => i);
    this.#rank   = new Array(n).fill(0);
  }

  find(x) {
    while (this.#parent[x] !== x) x = this.#parent[x];
    return x;
  }

  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    this.#parent[ra] = rb;
    return true;
  }
}`,
        typescript: `class UnionFind {
  #parent: number[];
  #rank:   number[];

  constructor(n: number) {
    this.#parent = Array.from({ length: n }, (_, i) => i);
    this.#rank   = new Array(n).fill(0);
  }

  find(x: number): number {
    while (this.#parent[x] !== x) x = this.#parent[x];
    return x;
  }

  union(a: number, b: number): boolean {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    this.#parent[ra] = rb;
    return true;
  }
}`,
      },
    },
    {
      title: 'Path Compression',
      explanation:
        'Path compression flattens the tree during find.\n\nAfter finding the root, update every node along the path to point directly to the root. Future finds on those nodes take O(1).\n\nTwo variants:\n  Full path compression: set parent[x] = root for every node on the path (two-pass)\n  Path halving: set parent[x] = parent[parent[x]] while walking up (one-pass, nearly as good)',
      code: {
        python: `def find(self, x: int) -> int:
    if self.parent[x] != x:
        self.parent[x] = self.find(self.parent[x])  # path compression
    return self.parent[x]

# One-pass path halving (slightly more efficient):
def find_halving(self, x: int) -> int:
    while self.parent[x] != x:
        self.parent[x] = self.parent[self.parent[x]]  # skip grandparent
        x = self.parent[x]
    return x`,
        java: `int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);  // path compression
    return parent[x];
}`,
        javascript: `find(x) {
  if (this.#parent[x] !== x)
    this.#parent[x] = this.find(this.#parent[x]); // path compression
  return this.#parent[x];
}`,
        typescript: `find(x: number): number {
  if (this.#parent[x] !== x)
    this.#parent[x] = this.find(this.#parent[x]);
  return this.#parent[x];
}`,
      },
    },
    {
      title: 'Union by Rank',
      explanation:
        'Union by rank prevents tall trees by always attaching the smaller tree under the larger one.\n\nRank is an upper bound on tree height:\n  • Two trees with different ranks: attach lower-rank root under higher-rank root. Rank unchanged.\n  • Two trees with equal ranks: attach either under the other. Increment the surviving root\'s rank by 1.\n\nWith union by rank alone (no path compression): O(log n) per operation.\nWith path compression alone: O(log n) amortized.\nWith both: O(α(n)) — the inverse Ackermann function, which grows so slowly it\'s ≤ 4 for any practical input size.',
      code: {
        python: `def union(self, a: int, b: int) -> bool:
    ra, rb = self.find(a), self.find(b)
    if ra == rb:
        return False
    # Attach smaller rank under larger rank
    if self.rank[ra] < self.rank[rb]:
        self.parent[ra] = rb
    elif self.rank[ra] > self.rank[rb]:
        self.parent[rb] = ra
    else:
        self.parent[rb] = ra
        self.rank[ra] += 1   # only increment when ranks are equal
    return True`,
        java: `boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    if (rank[ra] < rank[rb])      parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
}`,
        javascript: `union(a, b) {
  const ra = this.find(a), rb = this.find(b);
  if (ra === rb) return false;
  if (this.#rank[ra] < this.#rank[rb])      this.#parent[ra] = rb;
  else if (this.#rank[ra] > this.#rank[rb]) this.#parent[rb] = ra;
  else { this.#parent[rb] = ra; this.#rank[ra]++; }
  return true;
}`,
        typescript: `union(a: number, b: number): boolean {
  const ra = this.find(a), rb = this.find(b);
  if (ra === rb) return false;
  if (this.#rank[ra] < this.#rank[rb])      this.#parent[ra] = rb;
  else if (this.#rank[ra] > this.#rank[rb]) this.#parent[rb] = ra;
  else { this.#parent[rb] = ra; this.#rank[ra]++; }
  return true;
}`,
      },
      complexity: {
        time: 'O(α(n)) per operation — effectively O(1)',
        space: 'O(n)',
        note: 'α(n) is the inverse Ackermann function. For n = 2^65536, α(n) = 4. In practice, treat it as constant.',
      },
      callout: {
        type: 'interview',
        text: '"Number of Connected Components", "Redundant Connection", and "Accounts Merge" are all Union-Find problems. For any problem asking about groups, connectivity, or cycles in undirected graphs, reach for Union-Find.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Number of Connected Components in an Undirected Graph',
      url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Redundant Connection',
      url: 'https://leetcode.com/problems/redundant-connection/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Accounts Merge',
      url: 'https://leetcode.com/problems/accounts-merge/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default unionFind;
