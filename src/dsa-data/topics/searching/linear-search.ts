import type { Topic } from '../../../dsa-types';

const linearSearch: Topic = {
  id: 'linear-search',
  title: 'Linear Search',
  description:
    'The simplest search algorithm. Scans every element in sequence until the target is found or the array is exhausted. O(n) time — the baseline all other search algorithms must beat.',
  difficulty: 'beginner',
  category: 'searching',
  tags: ['searching', 'brute-force', 'unsorted', 'O(n)'],
  steps: [
    {
      title: 'Problem Statement',
      explanation:
        'Find the index of a target value in an array. The array is not necessarily sorted.\n\nExample:\n  arr    = [4, 2, 7, 1, 9, 3]\n  target = 9\n  Output = 4   (arr[4] == 9)\n\nLinear search is the only option when the array is unsorted and we can\'t preprocess it.',
      visualization: {
        type: 'array',
        array: [4, 2, 7, 1, 9, 3],
      },
    },
    {
      title: 'Implementation',
      explanation:
        'Walk through the array from left to right. Return the index as soon as the target is found. If we reach the end without finding it, return -1.',
      code: {
        python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i            # found at index i
    return -1                   # not found`,
        java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
        javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
        typescript: `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      },
      complexity: {
        time: 'O(n)',
        space: 'O(1)',
        note: 'Best case O(1) if target is first element. Worst case O(n) if target is last or missing.',
      },
      visualization: {
        type: 'array',
        array: [4, 2, 7, 1, 9, 3],
        highlighted: [0, 1, 2, 3],
        found: 4,
      },
    },
    {
      title: 'When to Use It',
      explanation:
        'Use Linear Search when:\n• The array is unsorted and you only need to search once\n• The array is very small (<20 elements)\n• You\'re searching a linked list (no random access)\n• Comparing complex objects where only a full scan works\n\nDon\'t use it when:\n• The array is sorted → use Binary Search O(log n)\n• You search frequently → sort once, then binary search\n• Performance matters on large data → use a hash map O(1)',
      callout: {
        type: 'interview',
        text: 'Linear Search is rarely asked directly, but understanding why it\'s O(n) and when it beats binary search (unsorted arrays, small n) shows solid fundamentals.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Find the Index of the First Occurrence in a String',
      url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
  ],
};

export default linearSearch;
