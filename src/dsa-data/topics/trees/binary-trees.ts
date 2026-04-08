import type { Topic } from '../../../dsa-types';

const binaryTrees: Topic = {
  id: 'binary-trees',
  title: 'Binary Trees & BSTs',
  description:
    'A binary tree is a hierarchical structure where each node has at most two children. A Binary Search Tree adds an ordering property that enables O(log n) search, insert, and delete on sorted data.',
  difficulty: 'intermediate',
  category: 'trees',
  tags: ['tree', 'binary-tree', 'BST', 'traversal', 'recursive'],
  steps: [
    {
      title: 'Structure and Terminology',
      explanation:
        'A binary tree is built from nodes, each containing:\n  • A value\n  • A left child (pointer to another node or null)\n  • A right child (pointer to another node or null)\n\nKey terms:\n  Root — the topmost node (no parent)\n  Leaf — a node with no children\n  Height — length of the longest path from root to a leaf\n  Depth — distance from root to a node\n  Subtree — a node and all its descendants\n\nA full binary tree: every node has 0 or 2 children.\nA complete binary tree: all levels fully filled except possibly the last (filled left to right).\nA balanced tree: height is O(log n) for n nodes.',
      visualization: {
        type: 'tree',
        root: '4',
        nodes: [
          { id: '4', value: 4, left: '2', right: '6', state: 'default' },
          { id: '2', value: 2, left: '1', right: '3', state: 'default' },
          { id: '6', value: 6, left: '5', right: '7', state: 'default' },
          { id: '1', value: 1, state: 'default' },
          { id: '3', value: 3, state: 'default' },
          { id: '5', value: 5, state: 'default' },
          { id: '7', value: 7, state: 'default' },
        ],
      },
    },
    {
      title: 'Node Definition',
      explanation:
        'The tree node is simple: a value and two child pointers. The tree itself is just the root node — you can reconstruct the full tree from it by following pointers.',
      code: {
        python: `class TreeNode:
    def __init__(self, val):
        self.val   = val
        self.left  = None
        self.right = None

# Build a small tree manually:
root = TreeNode(4)
root.left  = TreeNode(2)
root.right = TreeNode(6)
root.left.left  = TreeNode(1)
root.left.right = TreeNode(3)`,
        java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}`,
        javascript: `class TreeNode {
  constructor(val) {
    this.val   = val;
    this.left  = null;
    this.right = null;
  }
}`,
        typescript: `class TreeNode<T> {
  val: T;
  left:  TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  constructor(val: T) { this.val = val; }
}`,
      },
    },
    {
      title: 'Tree Traversals',
      explanation:
        'There are four ways to visit all nodes in a binary tree:\n\n  Inorder (Left → Root → Right):\n    Visits nodes in sorted order for a BST.\n    Result for tree above: [1, 2, 3, 4, 5, 6, 7]\n\n  Preorder (Root → Left → Right):\n    Root comes first — useful for copying or serializing a tree.\n    Result: [4, 2, 1, 3, 6, 5, 7]\n\n  Postorder (Left → Right → Root):\n    Root comes last — useful for deleting a tree or evaluating expressions.\n    Result: [1, 3, 2, 5, 7, 6, 4]\n\n  Level-order (BFS):\n    Visit level by level — useful for printing by depth.\n    Result: [4, 2, 6, 1, 3, 5, 7]',
      code: {
        python: `def inorder(node, result=None):    # L → Root → R
    if result is None: result = []
    if not node: return result
    inorder(node.left, result)
    result.append(node.val)
    inorder(node.right, result)
    return result

def preorder(node, result=None):   # Root → L → R
    if result is None: result = []
    if not node: return result
    result.append(node.val)
    preorder(node.left, result)
    preorder(node.right, result)
    return result

def postorder(node, result=None):  # L → R → Root
    if result is None: result = []
    if not node: return result
    postorder(node.left, result)
    postorder(node.right, result)
    result.append(node.val)
    return result

from collections import deque
def level_order(root):            # BFS level by level
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        node = queue.popleft()
        result.append(node.val)
        if node.left:  queue.append(node.left)
        if node.right: queue.append(node.right)
    return result`,
        java: `void inorder(TreeNode node, List<Integer> res) {
    if (node == null) return;
    inorder(node.left, res);
    res.add(node.val);
    inorder(node.right, res);
}

List<Integer> levelOrder(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        TreeNode n = q.poll();
        res.add(n.val);
        if (n.left  != null) q.offer(n.left);
        if (n.right != null) q.offer(n.right);
    }
    return res;
}`,
        javascript: `function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
  return result;
}

function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left)  queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}`,
        typescript: `function inorder(node: TreeNode<number> | null, result: number[] = []): number[] {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
  return result;
}`,
      },
      complexity: { time: 'O(n) — visits every node once', space: 'O(h) for DFS traversals, O(w) for BFS (w = max width)' },
    },
    {
      title: 'Binary Search Tree Property',
      explanation:
        'A Binary Search Tree (BST) enforces an ordering rule at every node:\n\n  For any node N:\n    • All values in N\'s left subtree are less than N.val\n    • All values in N\'s right subtree are greater than N.val\n\nThis property holds recursively for every subtree.\n\nConsequence: an inorder traversal of a BST always produces values in sorted order.\n\nThe ordering enables binary search: at each node, you know which subtree to go into — eliminating half the remaining nodes at each step (in a balanced tree).',
      visualization: {
        type: 'tree',
        root: '4',
        nodes: [
          { id: '4', value: 4, left: '2', right: '6', state: 'visiting' },
          { id: '2', value: 2, left: '1', right: '3', state: 'default' },
          { id: '6', value: 6, left: '5', right: '7', state: 'default' },
          { id: '1', value: 1, state: 'default' },
          { id: '3', value: 3, state: 'default' },
          { id: '5', value: 5, state: 'default' },
          { id: '7', value: 7, state: 'default' },
        ],
      },
    },
    {
      title: 'BST Insert and Search',
      explanation:
        'Search: start at root. At each node, go left if target < node.val, go right if target > node.val, return true if equal.\n\nInsert: follow the same path as search until you find a null slot — insert the new node there.',
      code: {
        python: `def search(node, target) -> bool:
    if not node:
        return False
    if target == node.val:
        return True
    if target < node.val:
        return search(node.left, target)
    return search(node.right, target)

def insert(node, val):
    if not node:
        return TreeNode(val)       # found the insertion point
    if val < node.val:
        node.left  = insert(node.left, val)
    elif val > node.val:
        node.right = insert(node.right, val)
    # if val == node.val: duplicate, do nothing
    return node`,
        java: `boolean search(TreeNode node, int target) {
    if (node == null) return false;
    if (target == node.val) return true;
    return target < node.val
        ? search(node.left, target)
        : search(node.right, target);
}

TreeNode insert(TreeNode node, int val) {
    if (node == null) return new TreeNode(val);
    if (val < node.val) node.left  = insert(node.left, val);
    else if (val > node.val) node.right = insert(node.right, val);
    return node;
}`,
        javascript: `function search(node, target) {
  if (!node) return false;
  if (target === node.val) return true;
  return target < node.val
    ? search(node.left, target)
    : search(node.right, target);
}

function insert(node, val) {
  if (!node) return new TreeNode(val);
  if (val < node.val)      node.left  = insert(node.left, val);
  else if (val > node.val) node.right = insert(node.right, val);
  return node;
}`,
        typescript: `function search(node: TreeNode<number> | null, target: number): boolean {
  if (!node) return false;
  if (target === node.val) return true;
  return target < node.val
    ? search(node.left, target)
    : search(node.right, target);
}`,
      },
      complexity: {
        time: 'O(h) where h = height of tree',
        space: 'O(h) call stack',
        note: 'Balanced BST: h = O(log n). Degenerate BST (sorted insertions): h = O(n). Self-balancing trees (AVL, Red-Black) guarantee O(log n).',
      },
      callout: {
        type: 'warning',
        text: 'A BST built by inserting sorted data degenerates into a linked list — every node has only a right child, giving O(n) operations. Always consider self-balancing variants (AVL, Red-Black) for production use.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Validate Binary Search Tree',
      url: 'https://leetcode.com/problems/validate-binary-search-tree/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Binary Tree Inorder Traversal',
      url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Lowest Common Ancestor of a BST',
      url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Kth Smallest Element in a BST',
      url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default binaryTrees;
