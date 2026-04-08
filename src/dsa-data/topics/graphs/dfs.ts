import type { Topic } from '../../../dsa-types';

const dfs: Topic = {
  id: 'dfs',
  title: 'Depth-First Search',
  description:
    'Explores as far as possible down each branch before backtracking. Uses the call stack (or an explicit stack). The foundation of cycle detection, topological sort, path finding, and connected components.',
  difficulty: 'intermediate',
  category: 'graphs',
  tags: ['graph', 'DFS', 'stack', 'recursion', 'cycle-detection', 'backtracking'],
  steps: [
    {
      title: 'The Idea',
      explanation:
        'DFS explores a graph by diving as deep as possible along one path before backtracking and trying another.\n\nThe algorithm:\n  1. Visit the start node; mark it visited\n  2. For each unvisited neighbor, recursively DFS\n  3. When all neighbors are visited, backtrack\n\nDFS naturally uses the call stack (recursion) or an explicit stack (iterative).\n\nContrast with BFS (uses a queue): BFS explores level by level; DFS explores branch by branch.',
      visualization: {
        type: 'graph',
        nodes: [
          { id: 'A', label: 'A', x: 50, y: 15, state: 'start' },
          { id: 'B', label: 'B', x: 20, y: 50, state: 'default' },
          { id: 'C', label: 'C', x: 80, y: 50, state: 'default' },
          { id: 'D', label: 'D', x: 10, y: 85, state: 'default' },
          { id: 'E', label: 'E', x: 35, y: 85, state: 'default' },
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
      title: 'Recursive Implementation',
      explanation:
        'The recursive version is clean and matches the natural definition. The call stack IS the DFS stack — no explicit data structure needed.',
      code: {
        python: `def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node)                         # process current node

    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

    return visited

# DFS order from A: A, B, D, E, C, F

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'], 'E': ['B'], 'F': ['C'],
}`,
        java: `public static void dfs(Map<String, List<String>> graph,
                              String node, Set<String> visited) {
    visited.add(node);
    System.out.println(node);

    for (String neighbor : graph.get(node)) {
        if (!visited.contains(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}

// Call: dfs(graph, "A", new HashSet<>())`,
        javascript: `function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  console.log(node);

  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  return visited;
}`,
        typescript: `function dfs(
  graph: Record<string, string[]>,
  node: string,
  visited = new Set<string>()
): Set<string> {
  visited.add(node);
  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);
  }
  return visited;
}`,
      },
      complexity: {
        time: 'O(V + E)',
        space: 'O(V) — visited set + O(h) call stack where h = max depth',
      },
    },
    {
      title: 'Iterative Implementation',
      explanation:
        'Use an explicit stack to avoid recursion depth limits on very deep graphs.\n\nNote: iterative DFS with a stack visits neighbors in reverse order compared to recursive DFS (because the stack reverses them). For most problems this doesn\'t matter.',
      code: {
        python: `def dfs_iterative(graph, start):
    visited = set()
    stack   = [start]
    order   = []

    while stack:
        node = stack.pop()           # pop from top
        if node in visited:
            continue
        visited.add(node)
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)

    return order`,
        java: `public static List<String> dfsIterative(
        Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    Deque<String> stack = new ArrayDeque<>();
    List<String> order  = new ArrayList<>();

    stack.push(start);
    while (!stack.isEmpty()) {
        String node = stack.pop();
        if (visited.contains(node)) continue;
        visited.add(node);
        order.add(node);
        for (String nb : graph.get(node))
            if (!visited.contains(nb)) stack.push(nb);
    }
    return order;
}`,
        javascript: `function dfsIterative(graph, start) {
  const visited = new Set();
  const stack   = [start];
  const order   = [];

  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    for (const nb of graph[node])
      if (!visited.has(nb)) stack.push(nb);
  }
  return order;
}`,
        typescript: `function dfsIterative(graph: Record<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const stack   = [start];
  const order: string[] = [];

  while (stack.length) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    for (const nb of graph[node])
      if (!visited.has(nb)) stack.push(nb);
  }
  return order;
}`,
      },
    },
    {
      title: 'Cycle Detection',
      explanation:
        'DFS can detect cycles in both directed and undirected graphs.\n\nUndirected graph: a cycle exists if DFS encounters a visited node that isn\'t the immediate parent.\n\nDirected graph: use three states — unvisited, in-progress (currently in the DFS stack), done. A cycle exists if DFS encounters an in-progress node.',
      code: {
        python: `# Undirected cycle detection
def has_cycle_undirected(graph, node, visited, parent):
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            if has_cycle_undirected(graph, neighbor, visited, node):
                return True
        elif neighbor != parent:   # visited and not parent = cycle
            return True
    return False

# Directed cycle detection (3-color)
def has_cycle_directed(graph, node, state):
    state[node] = 'visiting'
    for neighbor in graph[node]:
        if state[neighbor] == 'visiting':   # back edge = cycle
            return True
        if state[neighbor] == 'unvisited':
            if has_cycle_directed(graph, neighbor, state):
                return True
    state[node] = 'done'
    return False`,
        javascript: `// Directed cycle detection
function hasCycle(graph, node, state) {
  state[node] = 'visiting';
  for (const neighbor of graph[node]) {
    if (state[neighbor] === 'visiting') return true;  // back edge
    if (!state[neighbor] && hasCycle(graph, neighbor, state)) return true;
  }
  state[node] = 'done';
  return false;
}`,
        java: `boolean hasCycle(Map<String, List<String>> graph,
                 String node, Map<String, String> state) {
    state.put(node, "visiting");
    for (String nb : graph.get(node)) {
        if ("visiting".equals(state.get(nb))) return true;
        if (!state.containsKey(nb) && hasCycle(graph, nb, state)) return true;
    }
    state.put(node, "done");
    return false;
}`,
        typescript: `function hasCycle(graph: Record<string, string[]>,
                  node: string,
                  state: Record<string, string>): boolean {
  state[node] = 'visiting';
  for (const nb of graph[node]) {
    if (state[nb] === 'visiting') return true;
    if (!state[nb] && hasCycle(graph, nb, state)) return true;
  }
  state[node] = 'done';
  return false;
}`,
      },
      callout: {
        type: 'interview',
        text: 'Cycle detection via DFS is the foundation of many graph problems: "Course Schedule" (can you complete all courses without circular dependencies?) is effectively directed cycle detection. Know the 3-color approach.',
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
      title: 'Course Schedule',
      url: 'https://leetcode.com/problems/course-schedule/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Clone Graph',
      url: 'https://leetcode.com/problems/clone-graph/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Path Sum II',
      url: 'https://leetcode.com/problems/path-sum-ii/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default dfs;
