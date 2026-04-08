import type { Topic } from '../../../dsa-types';

const bfs: Topic = {
  id: 'bfs',
  title: 'Breadth-First Search',
  description:
    'Explores a graph level by level, visiting all neighbors of a node before going deeper. Uses a queue. Guarantees the shortest path (in unweighted graphs). Essential for network problems, social graphs, and maze solving.',
  difficulty: 'intermediate',
  category: 'graphs',
  tags: ['graph', 'BFS', 'queue', 'shortest-path', 'level-order'],
  steps: [
    {
      title: 'Problem Statement',
      explanation:
        'Given an unweighted graph and a start node, traverse every reachable node.\n\nTwo main uses:\n1. Visit all nodes (graph traversal)\n2. Find the shortest path from source to destination\n\nBFS explores the graph in "rings" outward from the start:\n• Level 0: start node\n• Level 1: immediate neighbors\n• Level 2: neighbors of neighbors\n• ...',
      visualization: {
        type: 'graph',
        nodes: [
          { id: 'A', label: 'A', x: 50, y: 20, state: 'start' },
          { id: 'B', label: 'B', x: 20, y: 55, state: 'default' },
          { id: 'C', label: 'C', x: 80, y: 55, state: 'default' },
          { id: 'D', label: 'D', x: 10, y: 85, state: 'default' },
          { id: 'E', label: 'E', x: 40, y: 85, state: 'default' },
          { id: 'F', label: 'F', x: 70, y: 85, state: 'default' },
        ],
        edges: [
          { from: 'A', to: 'B', state: 'default' },
          { from: 'A', to: 'C', state: 'default' },
          { from: 'B', to: 'D', state: 'default' },
          { from: 'B', to: 'E', state: 'default' },
          { from: 'C', to: 'F', state: 'default' },
        ],
      },
    },
    {
      title: 'The Queue Mechanism',
      explanation:
        'BFS uses a queue (FIFO) to track which nodes to visit next.\n\nAlgorithm:\n1. Enqueue the start node; mark it visited\n2. While queue is not empty:\n   a. Dequeue a node\n   b. Process it (record distance, check if target, etc.)\n   c. Enqueue all unvisited neighbors; mark them visited\n\nThe queue ensures we process all level-1 nodes before any level-2 nodes.',
      callout: {
        type: 'insight',
        text: 'The key invariant: when we dequeue a node at level k, all level-k nodes are already in the queue. This is why BFS finds the shortest path — the first time we reach a node, it\'s via the shortest route.',
      },
      visualization: {
        type: 'graph',
        nodes: [
          { id: 'A', label: 'A', x: 50, y: 20, state: 'visited' },
          { id: 'B', label: 'B', x: 20, y: 55, state: 'visiting' },
          { id: 'C', label: 'C', x: 80, y: 55, state: 'visiting' },
          { id: 'D', label: 'D', x: 10, y: 85, state: 'default' },
          { id: 'E', label: 'E', x: 40, y: 85, state: 'default' },
          { id: 'F', label: 'F', x: 70, y: 85, state: 'default' },
        ],
        edges: [
          { from: 'A', to: 'B', state: 'active' },
          { from: 'A', to: 'C', state: 'active' },
          { from: 'B', to: 'D', state: 'default' },
          { from: 'B', to: 'E', state: 'default' },
          { from: 'C', to: 'F', state: 'default' },
        ],
      },
    },
    {
      title: 'Implementation',
      explanation:
        'Graph represented as an adjacency list: a dictionary mapping each node to its list of neighbors.',
      code: {
        python: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue   = deque([start])
    visited.add(start)
    order   = []

    while queue:
        node = queue.popleft()        # dequeue from front
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor) # enqueue to back

    return order

# Example graph (adjacency list):
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'], 'E': ['B'], 'F': ['C']
}
# bfs(graph, 'A') → ['A', 'B', 'C', 'D', 'E', 'F']`,
        java: `public static List<String> bfs(Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    List<String> order  = new ArrayList<>();

    queue.add(start);
    visited.add(start);

    while (!queue.isEmpty()) {
        String node = queue.poll();
        order.add(node);

        for (String neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
    return order;
}`,
        javascript: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue   = [start];
  const order   = [];

  while (queue.length > 0) {
    const node = queue.shift();      // dequeue from front
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);        // enqueue to back
      }
    }
  }
  return order;
}`,
        typescript: `function bfs(graph: Record<string, string[]>, start: string): string[] {
  const visited = new Set<string>([start]);
  const queue   = [start];
  const order: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
      },
      highlightLines: {
        python: [9, 10, 13, 14, 15],
        java: [9, 10, 12, 13, 14, 15],
        javascript: [6, 7, 9, 10, 11, 12],
        typescript: [6, 7, 9, 10, 11, 12],
      },
      complexity: {
        time: 'O(V + E)',
        space: 'O(V)',
        note: 'V = vertices, E = edges. Every vertex and edge is visited exactly once.',
      },
    },
    {
      title: 'Shortest Path with BFS',
      explanation:
        'BFS naturally finds shortest paths in unweighted graphs. Track the distance to each node as you go.',
      code: {
        python: `from collections import deque

def shortest_path(graph, start, end):
    if start == end:
        return [start]

    visited  = {start}
    queue    = deque([(start, [start])])  # (node, path so far)

    while queue:
        node, path = queue.popleft()

        for neighbor in graph[node]:
            if neighbor == end:
                return path + [neighbor]  # found!
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    return []  # no path exists`,
        javascript: `function shortestPath(graph, start, end) {
  if (start === end) return [start];

  const visited = new Set([start]);
  const queue   = [[start, [start]]]; // [node, path]

  while (queue.length > 0) {
    const [node, path] = queue.shift();

    for (const neighbor of graph[node]) {
      if (neighbor === end) return [...path, neighbor];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  return [];
}`,
        java: `public static List<String> shortestPath(
        Map<String, List<String>> graph, String start, String end) {
    if (start.equals(end)) return List.of(start);

    Map<String, String> parent = new HashMap<>();
    Queue<String> queue = new LinkedList<>();
    queue.add(start);
    parent.put(start, null);

    while (!queue.isEmpty()) {
        String node = queue.poll();
        for (String nb : graph.get(node)) {
            if (!parent.containsKey(nb)) {
                parent.put(nb, node);
                if (nb.equals(end)) return buildPath(parent, end);
                queue.add(nb);
            }
        }
    }
    return Collections.emptyList();
}`,
        typescript: `function shortestPath(graph: Record<string, string[]>, start: string, end: string): string[] {
  if (start === end) return [start];
  const visited = new Set<string>([start]);
  const queue: [string, string[]][] = [[start, [start]]];

  while (queue.length > 0) {
    const [node, path] = queue.shift()!;
    for (const neighbor of graph[node]) {
      if (neighbor === end) return [...path, neighbor];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  return [];
}`,
      },
    },
    {
      title: 'BFS vs DFS — When to Use Each',
      explanation:
        'BFS and DFS are two fundamental graph traversal strategies:\n\n┌─────────────────┬─────────────────┬──────────────────┐\n│                 │      BFS        │      DFS         │\n├─────────────────┼─────────────────┼──────────────────┤\n│ Data structure  │     Queue       │  Stack/Recursion │\n│ Shortest path   │  ✓ Guaranteed   │  ✗ Not shortest  │\n│ Memory          │ O(width) — high │ O(depth) — low   │\n│ Find all paths  │    Slower       │    Faster        │\n│ Maze solving    │  Shortest maze  │  Any path        │\n│ Social networks │  "Degrees of    │                  │\n│                 │   separation"   │                  │\n└─────────────────┴─────────────────┴──────────────────┘\n\nUse BFS when:\n• Shortest path in unweighted graph\n• Level-by-level processing\n• Finding closest nodes\n\nUse DFS when:\n• Exploring all paths\n• Cycle detection\n• Topological sort\n• Connected components',
      callout: {
        type: 'interview',
        text: 'BFS on a matrix (2D grid) is extremely common in interviews. "Number of Islands", "Rotting Oranges", "Shortest Path in a Grid" are all BFS problems. Practice 2D BFS with (row, col) tuples in the queue.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Number of Islands',
      url: 'https://leetcode.com/problems/number-of-islands/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Rotting Oranges',
      url: 'https://leetcode.com/problems/rotting-oranges/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Word Ladder',
      url: 'https://leetcode.com/problems/word-ladder/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
    {
      title: 'Binary Tree Level Order Traversal',
      url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default bfs;
