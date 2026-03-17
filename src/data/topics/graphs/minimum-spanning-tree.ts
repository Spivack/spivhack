import type { Topic } from '../../../types';

const minimumSpanningTree: Topic = {
  id: 'minimum-spanning-tree',
  title: 'Minimum Spanning Tree',
  description:
    'A spanning tree that connects all nodes in a weighted undirected graph with the minimum total edge cost. Kruskal\'s sorts edges and uses Union-Find; Prim\'s grows the tree greedily from a start node. Both run in O(E log E).',
  difficulty: 'intermediate',
  category: 'graphs',
  tags: ['graph', 'MST', 'kruskal', 'prim', 'greedy', 'union-find', 'spanning-tree'],
  steps: [
    {
      title: 'What Is a Spanning Tree?',
      explanation:
        'A spanning tree of a connected undirected graph is a subgraph that:\n  • Includes all V vertices\n  • Is a tree (connected with no cycles)\n  • Has exactly V - 1 edges\n\nA minimum spanning tree (MST) is the spanning tree with the smallest total edge weight.\n\nApplications:\n  • Network design: connect all cities with minimum total cable\n  • Cluster analysis: find natural groupings\n  • Approximation algorithms: MST gives a 2x approximation for TSP\n  • Circuit design: minimize wire length\n\nNote: MSTs exist only for connected, undirected, weighted graphs. The MST may not be unique if edge weights are tied.',
      visualization: {
        type: 'graph',
        nodes: [
          { id: 'A', label: 'A', x: 15, y: 50, state: 'default' },
          { id: 'B', label: 'B', x: 45, y: 15, state: 'default' },
          { id: 'C', label: 'C', x: 80, y: 30, state: 'default' },
          { id: 'D', label: 'D', x: 50, y: 75, state: 'default' },
        ],
        edges: [
          { from: 'A', to: 'B', weight: 4, state: 'default' },
          { from: 'A', to: 'D', weight: 6, state: 'default' },
          { from: 'B', to: 'C', weight: 2, state: 'default' },
          { from: 'B', to: 'D', weight: 3, state: 'default' },
          { from: 'C', to: 'D', weight: 5, state: 'default' },
        ],
      },
    },
    {
      title: "Kruskal's Algorithm",
      explanation:
        'Kruskal\'s builds the MST by greedily adding the cheapest edge that doesn\'t create a cycle.\n\n  1. Sort all edges by weight (ascending)\n  2. Initialize Union-Find with n isolated nodes\n  3. For each edge (u, v, w) in sorted order:\n     • If u and v are in different components (no cycle): add this edge to MST, union(u, v)\n     • If same component: skip (would create a cycle)\n  4. Stop when MST has V - 1 edges\n\nThe cycle check is exactly Union-Find\'s find(u) != find(v). This is the canonical use of Union-Find.',
      code: {
        python: `def kruskal(n, edges):
    # edges: list of (weight, u, v)
    edges.sort()   # sort by weight
    parent = list(range(n))
    rank   = [0] * n

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb: return False
        if rank[ra] < rank[rb]: parent[ra] = rb
        elif rank[ra] > rank[rb]: parent[rb] = ra
        else: parent[rb] = ra; rank[ra] += 1
        return True

    mst_edges = []
    mst_cost  = 0
    for w, u, v in edges:
        if union(u, v):
            mst_edges.append((u, v, w))
            mst_cost += w
            if len(mst_edges) == n - 1:
                break

    return mst_edges, mst_cost`,
        java: `public static int kruskal(int n, int[][] edges) {
    Arrays.sort(edges, Comparator.comparingInt(e -> e[2]));
    int[] parent = new int[n];
    int[] rank   = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;

    int cost = 0, count = 0;
    for (int[] e : edges) {
        int u = e[0], v = e[1], w = e[2];
        int pu = find(parent, u), pv = find(parent, v);
        if (pu == pv) continue;
        union(parent, rank, pu, pv);
        cost += w;
        if (++count == n - 1) break;
    }
    return cost;
}`,
        javascript: `function kruskal(n, edges) {
  edges.sort((a, b) => a[2] - b[2]);  // sort by weight
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank   = new Array(n).fill(0);

  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a, b) => {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb])      parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  };

  let cost = 0, count = 0;
  const mst = [];
  for (const [u, v, w] of edges) {
    if (union(u, v)) {
      mst.push([u, v, w]);
      cost += w;
      if (++count === n - 1) break;
    }
  }
  return { mst, cost };
}`,
        typescript: `function kruskal(n: number, edges: [number, number, number][]): number {
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank   = new Array(n).fill(0);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a: number, b: number): boolean => {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb])      parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  };

  let cost = 0, count = 0;
  for (const [u, v, w] of edges)
    if (union(u, v)) { cost += w; if (++count === n - 1) break; }
  return cost;
}`,
      },
      complexity: { time: 'O(E log E) — dominated by sorting', space: 'O(V)' },
    },
    {
      title: "Prim's Algorithm",
      explanation:
        'Prim\'s grows the MST one vertex at a time, always adding the cheapest edge that connects the current tree to an unvisited node.\n\n  1. Start from any node; mark it visited\n  2. Add all its edges to a min-heap (keyed by weight)\n  3. While heap is not empty and tree is incomplete:\n     a. Extract the minimum-weight edge (u, v, w)\n     b. If v is already in the tree: skip\n     c. Otherwise: add edge to MST, mark v visited, add v\'s edges to heap\n\nPrim\'s is similar to Dijkstra\'s — both use a min-heap and a visited set. The difference is the key: Dijkstra\'s uses path distance; Prim\'s uses edge weight.',
      code: {
        python: `import heapq

def prim(graph, start=0):
    # graph: {node: [(neighbor, weight), ...]}
    visited = set()
    heap    = [(0, start, -1)]   # (weight, node, from_node)
    mst_edges = []
    mst_cost  = 0

    while heap and len(visited) < len(graph):
        w, u, prev = heapq.heappop(heap)
        if u in visited:
            continue
        visited.add(u)
        if prev != -1:
            mst_edges.append((prev, u, w))
            mst_cost += w
        for v, weight in graph[u]:
            if v not in visited:
                heapq.heappush(heap, (weight, v, u))

    return mst_edges, mst_cost`,
        java: `public static int prim(List<List<int[]>> graph) {
    int n = graph.size();
    boolean[] visited = new boolean[n];
    PriorityQueue<int[]> pq =
        new PriorityQueue<>(Comparator.comparingInt(e -> e[0]));
    pq.offer(new int[]{0, 0}); // {weight, node}
    int cost = 0, count = 0;

    while (!pq.isEmpty() && count < n) {
        int[] curr = pq.poll();
        int w = curr[0], u = curr[1];
        if (visited[u]) continue;
        visited[u] = true;
        cost += w;
        count++;
        for (int[] edge : graph.get(u)) {
            if (!visited[edge[0]])
                pq.offer(new int[]{edge[1], edge[0]});
        }
    }
    return cost;
}`,
        javascript: `function prim(graph, n) {
  const visited = new Array(n).fill(false);
  // naive heap — replace with real min-heap for large inputs
  const heap = [[0, 0]];  // [weight, node]
  let cost = 0, count = 0;

  while (heap.length && count < n) {
    heap.sort((a, b) => a[0] - b[0]);
    const [w, u] = heap.shift();
    if (visited[u]) continue;
    visited[u] = true;
    cost += w;
    count++;
    for (const [v, weight] of graph[u])
      if (!visited[v]) heap.push([weight, v]);
  }
  return cost;
}`,
        typescript: `function prim(graph: [number, number][][], n: number): number {
  const visited = new Array<boolean>(n).fill(false);
  const heap: [number, number][] = [[0, 0]];
  let cost = 0, count = 0;

  while (heap.length && count < n) {
    heap.sort((a, b) => a[0] - b[0]);
    const [w, u] = heap.shift()!;
    if (visited[u]) continue;
    visited[u] = true;
    cost += w;
    count++;
    for (const [v, weight] of graph[u])
      if (!visited[v]) heap.push([weight, v]);
  }
  return cost;
}`,
      },
      complexity: { time: 'O(E log V) with a binary heap', space: 'O(V + E)' },
    },
    {
      title: "Kruskal's vs Prim's",
      explanation:
        'Both produce a valid MST. The choice depends on graph density:\n\n  Kruskal\'s:\n    • Better for sparse graphs (few edges)\n    • O(E log E) regardless of shape\n    • Easy to implement with Union-Find\n    • Processes edges globally — no start node needed\n\n  Prim\'s:\n    • Better for dense graphs (many edges)\n    • O(E log V) with a binary heap; O(E + V log V) with Fibonacci heap\n    • Grows from a single source\n    • More similar to Dijkstra\'s (easy to adapt)\n\nFor competitive programming and interviews: Kruskal\'s is usually simpler to code from scratch because Union-Find is easy to write.',
      callout: {
        type: 'interview',
        text: '"Min Cost to Connect All Points" (LeetCode 1584) is the canonical MST interview problem — build a complete graph from 2D points, then apply Kruskal\'s or Prim\'s. Kruskal\'s is usually cleaner for this type.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Min Cost to Connect All Points',
      url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Connecting Cities With Minimum Cost',
      url: 'https://leetcode.com/problems/connecting-cities-with-minimum-cost/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Optimize Water Distribution in a Village',
      url: 'https://leetcode.com/problems/optimize-water-distribution-in-a-village/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default minimumSpanningTree;
