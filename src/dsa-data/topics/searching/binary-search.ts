import type { Topic } from '../../../dsa-types';

const binarySearch: Topic = {
  id: 'binary-search',
  title: 'Binary Search',
  description:
    'The most important search algorithm to know. Efficiently finds an element in a sorted array by repeatedly halving the search space. O(log n) — searching 1 billion elements takes at most 30 comparisons.',
  difficulty: 'beginner',
  category: 'searching',
  tags: ['searching', 'divide-and-conquer', 'sorted-array', 'O(log n)'],
  steps: [
    {
      title: 'Problem Statement',
      explanation:
        'Given a sorted array and a target value, return the index of the target (or -1 if not found).\n\nExample:\n  arr    = [1, 3, 5, 7, 9, 11, 13]\n  target = 7\n  Output = 3   (arr[3] == 7)\n\nWhy not just scan left to right? Linear search is O(n). For n=1,000,000, that\'s up to 1,000,000 comparisons. Binary Search does it in ≤20.',
      visualization: {
        type: 'array',
        array: [1, 3, 5, 7, 9, 11, 13],
        highlighted: [3],
      },
    },
    {
      title: 'The Core Idea',
      explanation:
        'Because the array is sorted, we can discard half the remaining elements with a single comparison.\n\nAlgorithm:\n1. Set left = 0, right = n-1\n2. Find mid = (left + right) / 2\n3. If arr[mid] == target → found, return mid\n4. If arr[mid] < target  → target must be in right half; set left = mid + 1\n5. If arr[mid] > target  → target must be in left half; set right = mid - 1\n6. Repeat until left > right (not found)',
      visualization: {
        type: 'array',
        array: [1, 3, 5, 7, 9, 11, 13],
        highlighted: [3],
        pointers: [
          { index: 0, label: 'L', color: '#818cf8' },
          { index: 3, label: 'M', color: '#fbbf24' },
          { index: 6, label: 'R', color: '#818cf8' },
        ],
      },
      callout: {
        type: 'insight',
        text: 'Each comparison eliminates half the remaining elements. After k comparisons, at most n/2^k elements remain. We stop when n/2^k < 1, so k = log₂(n) comparisons.',
      },
    },
    {
      title: 'Iterative Implementation',
      explanation:
        'The iterative version is preferred in interviews — no recursion overhead, no stack concerns for large arrays.',
      code: {
        python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2    # avoids integer overflow

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1                  # search right half
        else:
            right = mid - 1                 # search left half

    return -1                               # not found`,
        java: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;  // avoids overflow

        if (arr[mid] == target)      return mid;
        else if (arr[mid] < target)  left  = mid + 1;
        else                         right = mid - 1;
    }
    return -1;
}`,
        javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target)   left  = mid + 1;
    else                     right = mid - 1;
  }
  return -1;
}`,
        typescript: `function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target)   left  = mid + 1;
    else                     right = mid - 1;
  }
  return -1;
}`,
      },
      highlightLines: {
        python: [5, 9, 11],
        java: [5, 7, 8, 9],
        javascript: [4, 6, 7, 8],
        typescript: [4, 6, 7, 8],
      },
      callout: {
        type: 'warning',
        text: 'Never write mid = (left + right) / 2. If left and right are large integers, their sum can overflow. Use left + (right - left) / 2 instead.',
      },
    },
    {
      title: 'Recursive Implementation',
      explanation:
        'The recursive version is often more elegant but uses O(log n) call stack space.',
      code: {
        python: `def binary_search(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1

    if left > right:
        return -1                           # base case: not found

    mid = left + (right - left) // 2

    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search(arr, target, mid + 1, right)
    else:
        return binary_search(arr, target, left, mid - 1)`,
        java: `public static int binarySearch(int[] arr, int target, int left, int right) {
    if (left > right) return -1;

    int mid = left + (right - left) / 2;

    if (arr[mid] == target)     return mid;
    if (arr[mid] < target)      return binarySearch(arr, target, mid + 1, right);
    return binarySearch(arr, target, left, mid - 1);
}`,
        javascript: `function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = left + Math.floor((right - left) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target)   return binarySearch(arr, target, mid + 1, right);
  return binarySearch(arr, target, left, mid - 1);
}`,
        typescript: `function binarySearch(
  arr: number[],
  target: number,
  left = 0,
  right = arr.length - 1
): number {
  if (left > right) return -1;

  const mid = left + Math.floor((right - left) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target)   return binarySearch(arr, target, mid + 1, right);
  return binarySearch(arr, target, left, mid - 1);
}`,
      },
      complexity: {
        time: 'O(log n)',
        space: 'O(log n)',
        note: 'Space is O(log n) due to recursive call stack depth.',
      },
    },
    {
      title: 'Complexity Analysis',
      explanation:
        'Time Complexity — O(log n):\n• Each iteration halves the search space.\n• Starting with n elements, after k iterations we have n/2^k elements.\n• We stop when n/2^k = 1, so k = log₂(n).\n• log₂(1,000,000,000) ≈ 30 iterations to search 1 billion elements!\n\nSpace Complexity:\n• Iterative: O(1) — just two pointers\n• Recursive: O(log n) — call stack depth\n\nRequirement: the array must be sorted. If unsorted, sort first: O(n log n) sort + O(log n) search.',
      complexity: {
        time: 'O(log n)',
        space: 'O(1) iterative',
        note: 'Prerequisite: array must be sorted. O(log n) is extremely fast — practically constant for any real dataset.',
      },
    },
    {
      title: 'Interview Tips & Variants',
      explanation:
        'Binary Search is everywhere in interviews — often disguised:\n\n• "Find first/last occurrence" → binary search with modified return condition\n• "Find peak element" → binary search on derivative\n• "Search in rotated sorted array" → binary search with rotation check\n• "Find minimum in rotated sorted array" → binary search\n• "Koko eating bananas / ship packages" → binary search on the answer\n\nThe last pattern — "binary search on the answer" — is advanced and very common at FAANG:\nInstead of searching for a value, binary search for the optimal value of a parameter.',
      callout: {
        type: 'interview',
        text: 'When you see "sorted array" + "find X efficiently" in an interview → immediately think Binary Search. Also think BS when the problem has a monotone feasibility condition (if X works, X+1 also works).',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Binary Search',
      url: 'https://leetcode.com/problems/binary-search/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Search in Rotated Sorted Array',
      url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Find First and Last Position of Element in Sorted Array',
      url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Koko Eating Bananas',
      url: 'https://leetcode.com/problems/koko-eating-bananas/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default binarySearch;
