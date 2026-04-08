import type { Topic } from '../../../dsa-types';

const generalTrees: Topic = {
  id: 'general-trees',
  title: 'General Trees',
  description:
    'A tree where each node can have any number of children. The natural model for file systems, organizational charts, HTML/XML documents, and programming language parse trees.',
  difficulty: 'intermediate',
  category: 'trees',
  tags: ['tree', 'general-tree', 'n-ary', 'traversal', 'recursive'],
  steps: [
    {
      title: 'Structure and Terminology',
      explanation:
        'A tree is a hierarchical structure with one key constraint: there is exactly one path between any two nodes (no cycles).\n\nA general tree differs from a binary tree in that each node can have zero or more children (not limited to 2).\n\nKey terms:\n  Root    — the single node with no parent\n  Parent  — the node directly above\n  Child   — a node directly below\n  Sibling — nodes sharing the same parent\n  Leaf    — a node with no children\n  Depth   — distance from root (root = 0)\n  Height  — max depth of any leaf\n  Subtree — a node and all of its descendants\n\nEvery file system is a general tree: the root is /, each directory is an internal node, each file is a leaf.',
    },
    {
      title: 'Node Representations',
      explanation:
        'Three common ways to represent a general tree node:\n\n  1. List of children (most intuitive):\n     Each node holds a list of child pointers.\n     Fast to iterate children; wastes memory if children count varies wildly.\n\n  2. Left-child right-sibling (LCRS):\n     Each node has one pointer to its first child and one to its next sibling.\n     Uses exactly two pointers per node — same as a binary tree node.\n     Efficiently represents trees where child count varies.\n\n  3. Parent array (for trees stored in arrays):\n     parent[i] = index of node i\'s parent.\n     Compact, but traversal from parent to children requires scanning.',
      code: {
        python: `# Representation 1: list of children
class TreeNode:
    def __init__(self, val):
        self.val      = val
        self.children = []   # list of TreeNode

# Representation 2: left-child right-sibling
class LCRSNode:
    def __init__(self, val):
        self.val     = val
        self.child   = None   # leftmost child
        self.sibling = None   # next sibling

# Build a tree: root(A) with children B, C, D
root = TreeNode('A')
root.children = [TreeNode('B'), TreeNode('C'), TreeNode('D')]`,
        java: `// Representation 1: list of children
class TreeNode<T> {
    T val;
    List<TreeNode<T>> children = new ArrayList<>();
    TreeNode(T val) { this.val = val; }
}

// Representation 2: left-child right-sibling
class LCRSNode<T> {
    T val;
    LCRSNode<T> child   = null;  // leftmost child
    LCRSNode<T> sibling = null;  // next sibling
    LCRSNode(T val) { this.val = val; }
}`,
        javascript: `// List of children (most common in JS/web)
class TreeNode {
  constructor(val) {
    this.val      = val;
    this.children = [];
  }
}

// DOM tree is effectively this structure:
// document.childNodes, element.children — all lists of children`,
        typescript: `class TreeNode<T> {
  val: T;
  children: TreeNode<T>[] = [];
  constructor(val: T) { this.val = val; }
}`,
      },
    },
    {
      title: 'Traversals',
      explanation:
        'General trees have two main traversal orders:\n\n  Preorder (depth-first): visit the node, then recursively visit each child.\n    Use: print directory structure, copy a tree, serialize.\n\n  Postorder (depth-first): recursively visit all children, then visit the node.\n    Use: compute sizes, delete a tree, evaluate expression trees.\n\n  Level-order (breadth-first): visit all nodes at depth 0, then depth 1, etc.\n    Use: find the shallowest node matching a condition.',
      code: {
        python: `def preorder(node):
    if not node: return
    print(node.val)               # visit node first
    for child in node.children:
        preorder(child)

def postorder(node):
    if not node: return
    for child in node.children:
        postorder(child)
    print(node.val)               # visit node last

from collections import deque
def level_order(root):
    if not root: return
    queue = deque([root])
    while queue:
        node = queue.popleft()
        print(node.val)
        queue.extend(node.children)

# Print a directory tree (preorder + depth tracking):
def print_tree(node, depth=0):
    print("  " * depth + node.val)
    for child in node.children:
        print_tree(child, depth + 1)`,
        java: `void preorder(TreeNode<String> node) {
    if (node == null) return;
    System.out.println(node.val);
    for (var child : node.children) preorder(child);
}

void levelOrder(TreeNode<String> root) {
    if (root == null) return;
    Queue<TreeNode<String>> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        var node = q.poll();
        System.out.println(node.val);
        q.addAll(node.children);
    }
}`,
        javascript: `function preorder(node) {
  if (!node) return;
  console.log(node.val);
  for (const child of node.children) preorder(child);
}

function levelOrder(root) {
  if (!root) return;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    console.log(node.val);
    queue.push(...node.children);
  }
}`,
        typescript: `function preorder<T>(node: TreeNode<T> | null): void {
  if (!node) return;
  console.log(node.val);
  for (const child of node.children) preorder(child);
}`,
      },
      complexity: { time: 'O(n) — visits every node once', space: 'O(h) DFS / O(w) BFS' },
    },
    {
      title: 'Real-World Applications',
      explanation:
        'General trees model naturally hierarchical data:\n\n  File systems: directories contain files and subdirectories\n  DOM: HTML elements contain nested child elements\n  JSON/XML: nested objects and arrays\n  Organization charts: managers have direct reports\n  Programming ASTs: expressions contain subexpressions\n  Category hierarchies: department → subdepartment → items\n\nMany algorithms on general trees reduce to the same patterns:\n  • Compute size: size = 1 + sum(size(child) for child)\n  • Compute height: height = 1 + max(height(child) for child)\n  • Find all paths: recurse, carrying the current path\n  • Find a node: DFS/BFS returning on first match',
      callout: {
        type: 'interview',
        text: '"Serialize and deserialize an N-ary tree" and "Maximum depth of N-ary tree" are common interview problems. Both reduce to straightforward recursive patterns — know preorder traversal cold.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Maximum Depth of N-ary Tree',
      url: 'https://leetcode.com/problems/maximum-depth-of-n-ary-tree/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'N-ary Tree Preorder Traversal',
      url: 'https://leetcode.com/problems/n-ary-tree-preorder-traversal/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Serialize and Deserialize N-ary Tree',
      url: 'https://leetcode.com/problems/serialize-and-deserialize-n-ary-tree/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default generalTrees;
