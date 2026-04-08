import type { Category } from '../dsa-types';

// Lists and Stacks
import listAdt from './topics/lists-and-stacks/list-adt';
import arrayList from './topics/lists-and-stacks/array-list';
import linkedList from './topics/lists-and-stacks/linked-list';
import doublyLinkedList from './topics/lists-and-stacks/doubly-linked-list';
import stack from './topics/lists-and-stacks/stack';
import linkedStack from './topics/lists-and-stacks/linked-stack';

// Complexity
import bigONotation from './topics/complexity/big-o-notation';
import pVsNp from './topics/complexity/p-vs-np';

// Recursion
import recursion from './topics/recursion/recursion';
import backtracking from './topics/recursion/backtracking';

// Sorting
import bubbleSort from './topics/sorting/bubble-sort';
import insertionSort from './topics/sorting/insertion-sort';
import selectionSort from './topics/sorting/selection-sort';
import shellSort from './topics/sorting/shell-sort';
import mergeSort from './topics/sorting/merge-sort';
import quickSort from './topics/sorting/quick-sort';
import heapSort from './topics/sorting/heap-sort';
import radixSort from './topics/sorting/radix-sort';

// Searching
import linearSearch from './topics/searching/linear-search';
import binarySearch from './topics/searching/binary-search';

// Hash Tables & Queues
import hashTable from './topics/hash-tables/hash-table';
import queue from './topics/hash-tables/queue';

// Trees
import binaryTrees from './topics/trees/binary-trees';
import heapsAndPriorityQueues from './topics/trees/heaps-and-priority-queues';
import generalTrees from './topics/trees/general-trees';
import unionFind from './topics/trees/union-find';

// Dynamic Programming
import fibonacci from './topics/dynamic-programming/fibonacci';
import knapsack from './topics/dynamic-programming/knapsack';
import longestCommonSubsequence from './topics/dynamic-programming/longest-common-subsequence';
import coinChange from './topics/dynamic-programming/coin-change';

// Graphs
import bfs from './topics/graphs/bfs';
import dfs from './topics/graphs/dfs';
import topologicalSort from './topics/graphs/topological-sort';
import dijkstras from './topics/graphs/dijkstras';
import minimumSpanningTree from './topics/graphs/minimum-spanning-tree';

// Patterns
import twoPointers from './topics/patterns/two-pointers';
import slidingWindow from './topics/patterns/sliding-window';
import mergeIntervals from './topics/patterns/merge-intervals';

// Lists and Stacks (additional)
import monotonicStack from './topics/lists-and-stacks/monotonic-stack';

export const categories: Category[] = [
  {
    id: 'complexity',
    title: 'Complexity',
    icon: '📈',
    description: 'Analyze how algorithms scale. Big-O, worst case, and operation costs for common data structures.',
    topics: [bigONotation, pVsNp],
  },
  {
    id: 'lists-and-stacks',
    title: 'Lists & Stacks',
    icon: '📋',
    description: 'Array lists, linked lists, doubly linked lists, and stacks — the core linear data structures.',
    topics: [listAdt, arrayList, linkedList, doublyLinkedList, stack, linkedStack, monotonicStack],
  },
  {
    id: 'recursion',
    title: 'Recursion',
    icon: '🔁',
    description: 'Functions that call themselves to solve smaller subproblems. The foundation of tree algorithms, backtracking, and divide-and-conquer.',
    topics: [recursion, backtracking],
  },
  {
    id: 'sorting',
    title: 'Sorting',
    icon: '↕️',
    description: 'Algorithms for ordering elements in a collection.',
    topics: [bubbleSort, insertionSort, selectionSort, shellSort, mergeSort, quickSort, heapSort, radixSort],
  },
  {
    id: 'searching',
    title: 'Searching',
    icon: '🔍',
    description: 'Algorithms for locating elements efficiently.',
    topics: [linearSearch, binarySearch],
  },
  {
    id: 'hash-tables',
    title: 'Hash Tables & Queues',
    icon: '#️⃣',
    description: 'Hash tables for O(1) key-value lookup, and queues for first-in first-out processing.',
    topics: [hashTable, queue],
  },
  {
    id: 'trees',
    title: 'Trees',
    icon: '🌲',
    description: 'Hierarchical data structures — binary trees, BSTs, heaps, general trees, and disjoint sets.',
    topics: [binaryTrees, heapsAndPriorityQueues, generalTrees, unionFind],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: '🧩',
    description: 'Break problems into overlapping subproblems and cache results.',
    topics: [fibonacci, knapsack, longestCommonSubsequence, coinChange],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    icon: '🕸️',
    description: 'Traversal, shortest paths, spanning trees, and connectivity in graphs.',
    topics: [bfs, dfs, topologicalSort, dijkstras, minimumSpanningTree],
  },
  {
    id: 'patterns',
    title: 'Patterns',
    icon: '🧠',
    description: 'Reusable algorithmic techniques that solve entire classes of interview problems — two pointers, sliding window, merge intervals, and more.',
    topics: [twoPointers, slidingWindow, mergeIntervals],
  },
];

// Flat lookup map for O(1) topic access
export const topicMap = new Map<string, import('../dsa-types').Topic>(
  categories.flatMap((cat) => cat.topics.map((t) => [t.id, t]))
);
