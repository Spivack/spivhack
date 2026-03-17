import type { Topic } from '../../../types';

const dijkstras: Topic = {
  id: 'dijkstras',
  title: "Dijkstra's Algorithm",
  description:
    'Finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edges. Uses a priority queue to always process the closest unvisited node. The backbone of GPS routing, network routing protocols, and game pathfinding.',
  difficulty: 'intermediate',
  category: 'graphs',
  tags: ['graph', 'shortest-path', 'dijkstra', 'priority-queue', 'greedy', 'weighted'],
  steps: [
    {
      title: 'The Shortest Path Problem',
      explanation:
        'Given a weighted graph and a source node, find the minimum-cost path to every other node.\n\nBFS finds shortest paths in unweighted graphs (fewest edges), but fails with weights — a path with more edges might have lower total cost.\n\nExample: getting from A to C:\n  Path 1: A → C, cost = 10\n  Path 2: A → B → C, cost = 1 + 2 = 3\n\nBFS would pick Path 1 (fewer hops). Dijkstra\'s picks Path 2 (lower cost).\n\nConstraint: Dijkstra\'s requires all edge weights to be non-negative. Negative edges require Bellman-Ford.',
      visualization: {
        type: 'graph',
        nodes: [
          { id: 'A', label: 'A', x: 15, y: 50, state: 'start', distance: 0 },
          { id: 'B', label: 'B', x: 50, y: 15, state: 'default', distance: 999 },
          { id: 'C', label: 'C', x: 85, y: 50, state: 'default', distance: 999 },
          { id: 'D', label: 'D', x: 50, y: 85, state: 'default', distance: 999 },
        ],
        edges: [
          { from: 'A', to: 'B', weight: 4, state: 'default' },
          { from: 'A', to: 'D', weight: 1, state: 'default' },
          { from: 'B', to: 'C', weight: 1, state: 'default' },
          { from: 'D', to: 'B', weight: 2, state: 'default' },
          { from: 'D', to: 'C', weight: 5, state: 'default' },
        ],
      },
    },
    {
      title: 'The Greedy Insight',
      explanation:
        'Dijkstra\'s key observation: the node with the currently smallest known distance must already have its final (optimal) distance — no future path through other nodes can improve it (because all weights are non-negative).\n\nAlgorithm:\n  1. Initialize dist[source] = 0; dist[all others] = ∞\n  2. Use a min-heap keyed on distance\n  3. While heap is not empty:\n     a. Extract the node with minimum distance (call it u)\n     b. For each neighbor v of u:\n        if dist[u] + weight(u,v) < dist[v]:\n           update dist[v]; push (dist[v], v) to heap\n\nThis "relaxation" step is the core: try to improve the known distance to each neighbor.',
    },
    {
      title: 'Implementation',
      explanation:
        'The min-heap stores (distance, node) pairs. We may push the same node multiple times with different distances — on extraction, skip nodes already finalized.',
      code: {
        python: `import heapq

def dijkstra(graph, source):
    # graph: {node: [(neighbor, weight), ...]}
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    heap = [(0, source)]   # (distance, node)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue        # stale entry, skip

        for v, weight in graph[u]:
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))

    return dist

# Example:
graph = {
    'A': [('B', 4), ('D', 1)],
    'B': [('C', 1)],
    'C': [],
    'D': [('B', 2), ('C', 5)],
}
# dijkstra(graph, 'A') → {'A': 0, 'B': 3, 'C': 4, 'D': 1}`,
        java: `public static Map<Integer, Integer> dijkstra(
        List<List<int[]>> graph, int src) {
    int n = graph.size();
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.offer(new int[]{0, src});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];
        if (d > dist[u]) continue;   // stale entry

        for (int[] edge : graph.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    // Convert to map...
    Map<Integer, Integer> result = new HashMap<>();
    for (int i = 0; i < n; i++) result.put(i, dist[i]);
    return result;
}`,
        javascript: `function dijkstra(graph, source) {
  const dist = {};
  for (const node of Object.keys(graph)) dist[node] = Infinity;
  dist[source] = 0;

  // Min-heap: [distance, node]
  const heap = [[0, source]];

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);   // naive — use a real heap in prod
    const [d, u] = heap.shift();
    if (d > dist[u]) continue;

    for (const [v, weight] of graph[u]) {
      const newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        heap.push([newDist, v]);
      }
    }
  }
  return dist;
}`,
        typescript: `function dijkstra(
  graph: Record<string, [string, number][]>,
  source: string
): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const node of Object.keys(graph)) dist[node] = Infinity;
  dist[source] = 0;

  const heap: [number, string][] = [[0, source]];

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift()!;
    if (d > dist[u]) continue;

    for (const [v, weight] of graph[u]) {
      const newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        heap.push([newDist, v]);
      }
    }
  }
  return dist;
}`,
      },
      complexity: {
        time: 'O((V + E) log V) with a binary heap',
        space: 'O(V)',
        note: 'The log V factor comes from heap operations. With a Fibonacci heap: O(E + V log V) — rarely worth it in practice.',
      },
    },
    {
      title: 'Reconstructing the Path',
      explanation:
        'Dijkstra\'s returns distances, but often you need the actual path. Track a prev map alongside dist:\n\nWhen you relax edge u → v and update dist[v], set prev[v] = u.\n\nAfterward, trace back from the target to the source using prev.',
      code: {
        python: `def dijkstra_path(graph, source, target):
    dist = {node: float('inf') for node in graph}
    prev = {}
    dist[source] = 0
    heap = [(0, source)]

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                heapq.heappush(heap, (dist[v], v))

    # Reconstruct path
    path, node = [], target
    while node in prev:
        path.append(node)
        node = prev[node]
    path.append(source)
    return path[::-1], dist[target]`,
        javascript: `function dijkstraPath(graph, source, target) {
  const dist = {}, prev = {};
  for (const n of Object.keys(graph)) dist[n] = Infinity;
  dist[source] = 0;
  const heap = [[0, source]];

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        heap.push([dist[v], v]);
      }
    }
  }

  const path = [];
  let node = target;
  while (node) { path.push(node); node = prev[node]; }
  return { path: path.reverse(), cost: dist[target] };
}`,
        java: `// Same logic — track prev[] array alongside dist[]`,
        typescript: `// Same logic — track prev record alongside dist`,
      },
      callout: {
        type: 'warning',
        text: 'Dijkstra\'s fails with negative edge weights — it may finalize a node\'s distance before a cheaper negative-edge path is discovered. Use Bellman-Ford for graphs with negative weights (but no negative cycles).',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Network Delay Time',
      url: 'https://leetcode.com/problems/network-delay-time/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Path with Minimum Effort',
      url: 'https://leetcode.com/problems/path-with-minimum-effort/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Cheapest Flights Within K Stops',
      url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default dijkstras;
