import type { Topic } from '../../../types';

const mergeSort: Topic = {
  id: 'merge-sort',
  title: 'Merge Sort',
  description:
    'A divide-and-conquer sorting algorithm that splits the array in half, recursively sorts each half, then merges the two sorted halves. Guaranteed O(n log n) in all cases — the gold standard for comparison-based sorting.',
  difficulty: 'intermediate',
  category: 'sorting',
  tags: ['sorting', 'divide-and-conquer', 'recursive', 'stable', 'O(n log n)'],
  steps: [
    {
      title: 'Problem Statement',
      explanation:
        'Sort an array of integers in O(n log n) time — better than Bubble or Insertion Sort\'s O(n²).\n\nMerge Sort achieves this by exploiting a key insight: merging two already-sorted arrays can be done in O(n) time.\n\nExample:\n  Input:  [38, 27, 43, 3, 9, 82, 10]\n  Output: [3, 9, 10, 27, 38, 43, 82]',
      visualization: {
        type: 'sorting',
        array: [38, 27, 43, 3, 9, 82, 10],
      },
    },
    {
      title: 'Divide: Split Recursively',
      explanation:
        'Step 1 — Divide:\nSplit the array in half at the midpoint. Then recursively split each half until every sub-array has only 1 element.\n\nA single element is always sorted by definition — this is our base case.\n\n[38, 27, 43, 3] → [38, 27] and [43, 3]\n[38, 27] → [38] and [27]\n\nThe recursion tree has O(log n) levels because we halve the problem at each step.',
      callout: {
        type: 'insight',
        text: 'log₂(n) levels of splitting is why the algorithm is O(n log n): O(n) work per level × O(log n) levels.',
      },
      visualization: {
        type: 'sorting',
        array: [38, 27, 43, 3],
        comparing: [0, 1, 2, 3],
      },
    },
    {
      title: 'Conquer: Merge Sorted Halves',
      explanation:
        'Step 2 — Conquer (Merge):\nGiven two sorted arrays, merge them into one sorted array.\n\nAlgorithm:\n1. Use two pointers, one per array, starting at index 0.\n2. Compare the elements at each pointer.\n3. Append the smaller element to the result.\n4. Advance that pointer.\n5. Repeat until one array is exhausted, then append the remainder.\n\nMerge [27, 38] and [3, 43]:\n  Compare 27 vs 3  → take 3\n  Compare 27 vs 43 → take 27\n  Compare 38 vs 43 → take 38\n  Remainder: [43]  → append\n  Result: [3, 27, 38, 43]',
      visualization: {
        type: 'sorting',
        array: [3, 27, 38, 43],
        sorted: [0, 1, 2, 3],
      },
    },
    {
      title: 'Full Implementation',
      explanation:
        'The implementation has two functions:\n\n1. merge_sort(arr) — recursively splits and reassembles\n2. merge(left, right) — merges two sorted arrays\n\nNote: this implementation creates new arrays at each merge step. It uses O(n) extra space.',
      code: {
        python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr                          # base case

    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])           # sort left half
    right = merge_sort(arr[mid:])           # sort right half
    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])                 # append remainder
    result.extend(right[j:])
    return result`,
        java: `public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;

    int mid = arr.length / 2;
    int[] left  = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    return merge(left, right);
}

private static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result[k++] = left[i++];
        else                     result[k++] = right[j++];
    }
    while (i < left.length)  result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    return result;
}`,
        javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid   = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else                     result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
        typescript: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid   = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else                     result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
      },
      highlightLines: {
        python: [5, 6, 7],
        java: [4, 5, 6],
        javascript: [4, 5, 6],
        typescript: [4, 5, 6],
      },
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        note: 'Consistent O(n log n) in all cases — no worst-case degradation like Quick Sort.',
      },
    },
    {
      title: 'Complexity Analysis',
      explanation:
        'Time Complexity — always O(n log n):\n• log n levels of recursion (we halve the array each time)\n• At each level, we do O(n) total work across all merges\n• Total: O(n log n) regardless of input order\n\nSpace Complexity — O(n):\n• Each merge creates a new result array\n• At peak recursion, we hold O(n) elements in auxiliary arrays\n\nStability:\n• Merge Sort is stable — equal elements maintain original relative order (we use <= in the merge comparison)',
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        note: 'Java\'s Arrays.sort() for objects uses Timsort, which is essentially an optimized merge sort.',
      },
    },
    {
      title: 'Interview Tips & Variants',
      explanation:
        'Common follow-up questions:\n\n1. "Can you do it in-place?" — Yes, but it\'s complex and rarely worth it. Standard answer: O(n) space is fine.\n\n2. "How does it compare to Quick Sort?" — Merge Sort is stable and guarantees O(n log n); Quick Sort is in-place and faster in practice but O(n²) worst case.\n\n3. "Why does Java use Merge Sort for objects?" — Stability is required. Primitive arrays use dual-pivot Quick Sort instead.\n\n4. Classic interview problem: "Count inversions in an array" — solved with a modified merge sort.',
      callout: {
        type: 'interview',
        text: '"Implement Merge Sort" is a common interview question at all levels. Know it cold. Bonus: be able to explain why it\'s O(n log n) using the recursion tree argument.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Sort an Array',
      url: 'https://leetcode.com/problems/sort-an-array/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Count of Smaller Numbers After Self',
      url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
    {
      title: 'Merge K Sorted Lists',
      url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default mergeSort;
