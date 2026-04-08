import type { Topic } from '../../../dsa-types';

const bubbleSort: Topic = {
  id: 'bubble-sort',
  title: 'Bubble Sort',
  description:
    'The simplest sorting algorithm. Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest unsorted element "bubbles up" to its correct position each pass.',
  difficulty: 'beginner',
  category: 'sorting',
  tags: ['sorting', 'comparison', 'in-place', 'stable'],
  steps: [
    {
      title: 'Problem Statement',
      explanation:
        'Given an array of integers, sort it in ascending order.\n\nFor example:\n  Input:  [5, 3, 8, 1, 4]\n  Output: [1, 3, 4, 5, 8]\n\nBubble Sort is rarely used in production, but it is the perfect starting point for understanding how sorting algorithms work — especially the concepts of comparisons and swaps.',
      visualization: {
        type: 'sorting',
        array: [5, 3, 8, 1, 4],
      },
    },
    {
      title: 'The Core Idea',
      explanation:
        'In each pass through the array, we compare every adjacent pair of elements.\n\nIf the left element is greater than the right element, we swap them.\n\nAfter one full pass, the largest element has "bubbled up" to the last position. After each subsequent pass, the next-largest element settles into place.\n\nWe repeat until no swaps occur — the array is sorted.',
      visualization: {
        type: 'sorting',
        array: [5, 3, 8, 1, 4],
        comparing: [0, 1],
      },
      callout: {
        type: 'insight',
        text: 'Think of air bubbles rising through water to the surface. Each pass "floats" the largest unsorted value to the top (rightmost unsorted position), guaranteeing one more element is in its final position.',
      },
    },
    {
      title: 'Naive Implementation',
      explanation:
        'The simplest version uses two nested loops:\n\n• Outer loop: runs n-1 times (n = array length)\n• Inner loop: compares each adjacent pair from index 0 to the end\n\nAfter the outer loop completes, the array is sorted.',
      code: {
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
        java: `public static int[] bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}`,
        javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
        typescript: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
      },
      highlightLines: {
        python: [4, 5],
        java: [5, 6, 7, 8],
        javascript: [4, 5, 6],
        typescript: [4, 5, 6],
      },
      complexity: {
        time: 'O(n²)',
        space: 'O(1)',
        note: 'Every pass runs the inner loop n-1 times regardless — even if already sorted.',
      },
      visualization: {
        type: 'sorting',
        array: [3, 5, 8, 1, 4],
        swapping: [2, 3],
      },
    },
    {
      title: 'Optimization: Early Exit',
      explanation:
        'The naive version always runs O(n²) comparisons, even on an already-sorted array.\n\nOptimization: add a `swapped` flag. If we complete an inner loop pass with zero swaps, the array is already sorted — we can exit early.\n\nThis improves best-case performance from O(n²) to O(n) for nearly-sorted arrays.',
      code: {
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False                      # reset flag each pass
        for j in range(n - 1 - i):          # shrink inner range
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break                            # already sorted!
    return arr`,
        java: `public static int[] bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`,
        javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
        typescript: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
      },
      highlightLines: {
        python: [4, 5, 8, 9, 10],
        java: [4, 5, 9, 10, 11, 12],
        javascript: [4, 5, 7, 8, 10, 11],
        typescript: [4, 5, 7, 8, 10, 11],
      },
      callout: {
        type: 'insight',
        text: 'Note n-1-i in the inner loop: after pass i, the last i elements are already in their final positions — no need to compare them again.',
      },
    },
    {
      title: 'Complexity Analysis',
      explanation:
        'Time Complexity:\n• Best case O(n): array is already sorted; the swapped flag triggers early exit after one pass.\n• Average case O(n²): roughly n²/2 comparisons.\n• Worst case O(n²): array is reverse sorted; every pair swaps every pass.\n\nSpace Complexity:\n• O(1): sorting is done in-place, no extra memory needed.\n\nStability:\n• Bubble Sort is stable — equal elements maintain their original relative order, because we only swap when strictly greater (>).',
      complexity: {
        time: 'O(n²) worst/avg, O(n) best',
        space: 'O(1)',
        note: 'Stable sort. In-place. Never use for large datasets — O(n²) is too slow.',
      },
      visualization: {
        type: 'sorting',
        array: [1, 3, 4, 5, 8],
        sorted: [0, 1, 2, 3, 4],
      },
    },
    {
      title: 'When to Use It',
      explanation:
        'Bubble Sort is almost never used in production code. Better alternatives exist in every scenario:\n\n• Small arrays (<20 elements): Insertion Sort is faster in practice.\n• General purpose: Use your language\'s built-in sort (Timsort in Python/Java, V8 sort in JS — all O(n log n)).\n• Nearly sorted data: Insertion Sort is better even here.\n\nWhere Bubble Sort matters:\n• Learning: clearest illustration of comparison-swap sorting.\n• Embedded systems with extreme memory constraints (though even then, Insertion Sort is preferred).',
      callout: {
        type: 'interview',
        text: 'You will almost never be asked to implement Bubble Sort in an interview. But you may be asked to compare it to other sorts, or discuss why it\'s inefficient. Know the O(n²) complexity and why Merge/Quick/Heap Sort are preferred.',
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
      title: 'Sort Colors (Dutch National Flag)',
      url: 'https://leetcode.com/problems/sort-colors/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default bubbleSort;
