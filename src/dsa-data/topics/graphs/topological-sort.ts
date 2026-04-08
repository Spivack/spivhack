import type { Topic } from '../../../dsa-types';

const topologicalSort: Topic = {
  id: 'topological-sort',
  title: 'Topological Sort',
  description:
    'Orders the nodes of a directed acyclic graph (DAG) so that every edge points forward — from earlier to later in the sequence. Essential for scheduling tasks with dependencies: build systems, course prerequisites, package managers.',
  difficulty: 'intermediate',
  category: 'graphs',
  tags: ['graph', 'DAG', 'topological-sort', 'BFS', 'DFS', 'scheduling'],
  steps: [
    {
      title: 'What Is a Topological Order?',
      explanation:
        'Given a directed acyclic graph (DAG), a topological ordering is a linear ordering of all nodes such that for every directed edge u → v, node u appears before node v.\n\nExample: course prerequisites\n  CS101 → CS201 → CS301\n  CS101 → CS202 → CS301\n\nValid topological orders: [CS101, CS201, CS202, CS301] or [CS101, CS202, CS201, CS301]\n\nA topological order exists if and only if the graph has no cycles (is a DAG). Cycles create contradictions: A must come before B, B before C, C before A — impossible.',
      visualization: {
        type: 'graph',
        nodes: [
          { id: 'A', label: 'CS101', x: 15, y: 50, state: 'start' },
          { id: 'B', label: 'CS201', x: 45, y: 20, state: 'default' },
          { id: 'C', label: 'CS202', x: 45, y: 80, state: 'default' },
          { id: 'D', label: 'CS301', x: 80, y: 50, state: 'default' },
        ],
        edges: [
          { from: 'A', to: 'B', state: 'default', directed: true },
          { from: 'A', to: 'C', state: 'default', directed: true },
          { from: 'B', to: 'D', state: 'default', directed: true },
          { from: 'C', to: 'D', state: 'default', directed: true },
        ],
      },
    },
    {
      title: "Kahn's Algorithm (BFS-based)",
      explanation:
        'Kahn\'s algorithm uses in-degrees (number of incoming edges per node).\n\n  1. Compute in-degree of every node\n  2. Enqueue all nodes with in-degree 0 (no prerequisites)\n  3. While queue is not empty:\n     a. Dequeue a node; add it to the result\n     b. For each neighbor: decrement its in-degree by 1\n     c. If a neighbor\'s in-degree hits 0, enqueue it\n  4. If result contains all n nodes → valid topological order\n     Otherwise → cycle detected (some nodes never reached in-degree 0)\n\nKahn\'s naturally detects cycles: if we process fewer than n nodes, there\'s a cycle.',
      code: {
        python: `from collections import deque, defaultdict

def topological_sort(graph, n):
    # graph: adjacency list {node: [neighbors]}
    in_degree = defaultdict(int)
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1

    queue = deque(node for node in graph if in_degree[node] == 0)
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(order) != n:
        return []   # cycle detected
    return order`,
        java: `public static int[] topologicalSort(int[][] edges, int n) {
    List<List<Integer>> graph = new ArrayList<>();
    int[] inDegree = new int[n];
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());

    for (int[] e : edges) {
        graph.get(e[0]).add(e[1]);
        inDegree[e[1]]++;
    }

    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < n; i++)
        if (inDegree[i] == 0) queue.offer(i);

    int[] order = new int[n];
    int idx = 0;
    while (!queue.isEmpty()) {
        int node = queue.poll();
        order[idx++] = node;
        for (int nb : graph.get(node))
            if (--inDegree[nb] == 0) queue.offer(nb);
    }
    return idx == n ? order : new int[0]; // empty = cycle
}`,
        javascript: `function topologicalSort(graph, n) {
  const inDegree = new Array(n).fill(0);
  for (const [node, neighbors] of Object.entries(graph))
    for (const nb of neighbors) inDegree[nb]++;

  const queue = [];
  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const nb of graph[node])
      if (--inDegree[nb] === 0) queue.push(nb);
  }
  return order.length === n ? order : [];
}`,
        typescript: `function topologicalSort(graph: Record<number, number[]>, n: number): number[] {
  const inDegree = new Array(n).fill(0);
  for (const neighbors of Object.values(graph))
    for (const nb of neighbors) inDegree[nb]++;

  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

  const order: number[] = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const nb of graph[node])
      if (--inDegree[nb] === 0) queue.push(nb);
  }
  return order.length === n ? order : [];
}`,
      },
      complexity: { time: 'O(V + E)', space: 'O(V)' },
    },
    {
      title: 'DFS-Based Approach',
      explanation:
        'The DFS approach: run DFS on each unvisited node. After all neighbors are fully processed, push the current node onto a stack.\n\nThe stack\'s reverse order is the topological order — because a node is pushed only after all its dependencies are pushed first.\n\nThis approach is equivalent to Kahn\'s but works naturally when you already have DFS infrastructure.',
      code: {
        python: `def topo_dfs(graph):
    visited = set()
    stack   = []

    def dfs(node):
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs(neighbor)
        stack.append(node)    # push after all descendants

    for node in graph:
        if node not in visited:
            dfs(node)

    return stack[::-1]   # reverse = topological order`,
        java: `public static List<String> topoDFS(Map<String, List<String>> graph) {
    Set<String> visited = new HashSet<>();
    Deque<String> stack = new ArrayDeque<>();

    for (String node : graph.keySet())
        if (!visited.contains(node))
            dfs(graph, node, visited, stack);

    List<String> result = new ArrayList<>(stack);
    Collections.reverse(result);
    return result;
}

private static void dfs(Map<String, List<String>> g, String node,
                        Set<String> visited, Deque<String> stack) {
    visited.add(node);
    for (String nb : g.getOrDefault(node, List.of()))
        if (!visited.contains(nb)) dfs(g, nb, visited, stack);
    stack.push(node);
}`,
        javascript: `function topoDFS(graph) {
  const visited = new Set();
  const stack   = [];

  function dfs(node) {
    visited.add(node);
    for (const nb of graph[node] ?? [])
      if (!visited.has(nb)) dfs(nb);
    stack.push(node);   // push after all descendants
  }

  for (const node of Object.keys(graph))
    if (!visited.has(node)) dfs(node);

  return stack.reverse();
}`,
        typescript: `function topoDFS(graph: Record<string, string[]>): string[] {
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string): void {
    visited.add(node);
    for (const nb of graph[node] ?? [])
      if (!visited.has(nb)) dfs(nb);
    stack.push(node);
  }

  for (const node of Object.keys(graph))
    if (!visited.has(node)) dfs(node);

  return stack.reverse();
}`,
      },
      callout: {
        type: 'interview',
        text: '"Course Schedule II" asks for a topological order. "Course Schedule I" asks if one exists (cycle detection). Both are solved by Kahn\'s algorithm — Course Schedule I returns true iff the result length == n.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Course Schedule',
      url: 'https://leetcode.com/problems/course-schedule/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Course Schedule II',
      url: 'https://leetcode.com/problems/course-schedule-ii/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Alien Dictionary',
      url: 'https://leetcode.com/problems/alien-dictionary/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default topologicalSort;
