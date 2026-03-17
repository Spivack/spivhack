import type { Topic } from '../../../types';

const selectionSort: Topic = {
  id: 'selection-sort',
  title: 'Selection Sort',
  description:
    'Repeatedly finds the minimum element in the unsorted portion and swaps it into place. Simple to understand, always O(n²) — but performs far fewer swaps than Bubble Sort, making it useful when writes are expensive.',
  difficulty: 'beginner',
  category: 'sorting',
  tags: ['sorting', 'in-place', 'O(n²)', 'not-stable', 'not-adaptive'],
  steps: [
    {
      title: 'The Idea',
      explanation:
        'Selection Sort divides the array into two parts:\n  • Left side — sorted (grows one element per pass)\n  • Right side — unsorted (shrinks one element per pass)\n\nEach pass:\n  1. Scan the unsorted portion to find the minimum element\n  2. Swap it with the first unsorted element\n\nAfter n-1 passes, the array is sorted.\n\nUnlike Bubble Sort (which swaps repeatedly during a pass), Selection Sort makes exactly one swap per pass — at most n-1 total swaps.',
      visualization: {
        type: 'sorting',
        array: [64, 25, 12, 22, 11],
        sorted: [],
      },
    },
    {
      title: 'Implementation',
      explanation:
        'The outer loop tracks the boundary between sorted and unsorted. The inner loop finds the index of the minimum element in the unsorted portion. After the inner loop, swap the minimum to the boundary position.',
      code: {
        python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):    # find min in unsorted portion
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:             # skip swap if already in place
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
        java: `public static int[] selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {   // find min in unsorted
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {                   // swap if needed
            int tmp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = tmp;
        }
    }
    return arr;
}`,
        javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
        typescript: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
      },
      complexity: { time: 'O(n²)', space: 'O(1)' },
    },
    {
      title: 'Key Properties',
      explanation:
        'Selection Sort has a few notable characteristics:\n\n  NOT adaptive: Always O(n²) — even a sorted array requires the same number of comparisons. There\'s no early exit.\n\n  NOT stable: A swap can move an element past an equal element. Example: [3a, 3b, 1] → after first swap → [1, 3b, 3a]. The two 3s traded places.\n\n  Minimal writes: Exactly n-1 swaps in the worst case. Bubble Sort can do O(n²) swaps. This matters on flash memory or any storage where writes are expensive.\n\n  n(n-1)/2 comparisons: Always — regardless of input order.',
      callout: {
        type: 'insight',
        text: 'Selection Sort minimizes the number of writes. If your data lives in slow flash memory (write-heavy cost), Selection Sort\'s guaranteed ≤ n-1 swaps may outperform Insertion Sort\'s potentially many shifts.',
      },
    },
    {
      title: 'Comparison to Other O(n²) Sorts',
      explanation:
        'All three simple sorts share O(n²) time and O(1) space — but they\'re not equivalent:\n\n  Bubble Sort:\n    • Many swaps per pass (up to n each)\n    • Stable\n    • Adaptive (O(n) best case with early exit)\n\n  Insertion Sort:\n    • Many shifts but no swap overhead\n    • Stable\n    • Adaptive (O(n) best case)\n    • Best in practice for small/nearly-sorted arrays\n\n  Selection Sort:\n    • Minimal swaps (≤ n-1 total)\n    • Not stable\n    • Not adaptive (always O(n²))\n    • Best when writes are expensive\n\nFor general use, Insertion Sort wins among the three. Selection Sort has a niche use case.',
      callout: {
        type: 'interview',
        text: 'Interviewers sometimes ask which sort minimizes writes. The answer is Selection Sort. It\'s also a common question to explain why it\'s not stable.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Sort Colors',
      url: 'https://leetcode.com/problems/sort-colors/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Minimum Number of Swaps to Sort',
      url: 'https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default selectionSort;
