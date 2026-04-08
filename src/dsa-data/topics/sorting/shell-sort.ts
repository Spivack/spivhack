import type { Topic } from '../../../dsa-types';

const shellSort: Topic = {
  id: 'shell-sort',
  title: 'Shell Sort',
  description:
    'An extension of Insertion Sort that sorts elements far apart before sorting adjacent ones. By reducing large out-of-place distances early, it avoids the slow one-step-at-a-time shifting that makes Insertion Sort O(n²).',
  difficulty: 'intermediate',
  category: 'sorting',
  tags: ['sorting', 'in-place', 'gap-sequence', 'adaptive', 'O(n^1.5)'],
  steps: [
    {
      title: "Insertion Sort's Weakness",
      explanation:
        'Insertion Sort is slow on large, random arrays because every element can only move one position per comparison.\n\nExample: sorting [9, 8, 7, 6, 5, 4, 3, 2, 1]\nThe 1 at the end must travel 8 positions to the front — requiring 8 comparisons and 8 shifts, just for that one element.\n\nIn general, moving an element k positions left costs k operations. If all elements are far from their final positions, this becomes O(n²) very quickly.\n\nShell Sort\'s insight: first move elements far apart toward their correct region, then clean up with regular Insertion Sort.',
      visualization: {
        type: 'sorting',
        array: [9, 8, 7, 6, 5, 4, 3, 2, 1],
      },
    },
    {
      title: 'The Gap Sequence Idea',
      explanation:
        'Shell Sort performs multiple passes, each using a different "gap" value.\n\nIn each pass, instead of comparing adjacent elements (gap=1), you compare elements that are gap positions apart. This creates multiple interleaved subsequences, each sorted independently by Insertion Sort.\n\nExample with gap=4 on [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]:\n  • Subsequence 0: indices [0, 4, 8] → values [9, 5, 1]\n  • Subsequence 1: indices [1, 5, 9] → values [8, 4, 0]\n  • Subsequence 2: indices [2, 6]    → values [7, 3]\n  • Subsequence 3: indices [3, 7]    → values [6, 2]\n\nSorting each subsequence moves elements much closer to their final positions. Then reduce gap and repeat. Final pass: gap=1 (standard Insertion Sort on a nearly-sorted array → fast!).',
    },
    {
      title: "Knuth's Gap Sequence",
      explanation:
        'The gap sequence determines Shell Sort\'s performance. Many sequences exist — the choice matters.\n\nKnuth\'s sequence (1959) is the most common starting point:\n  h₁ = 1\n  hₙ₊₁ = 3hₙ + 1\n  → 1, 4, 13, 40, 121, 364, ...\n\nStart with the largest gap ≤ n/3, then shrink by dividing by 3 each pass until gap=1.\n\nOther sequences:\n  Shell (1959): n/2, n/4, ..., 1   → O(n²) worst case\n  Hibbard (1963): 1, 3, 7, 15, ... → O(n^1.5) worst\n  Knuth: O(n^1.5) worst, good in practice\n  Ciura (2001): 1,4,10,23,57,132,301,701 → empirically best known',
      callout: {
        type: 'insight',
        text: 'The optimal gap sequence is still an open research problem. No one has proven a Shell Sort variant with O(n log n) worst case, but Ciura\'s sequence is the best empirically found sequence for most real inputs.',
      },
    },
    {
      title: 'Implementation',
      explanation:
        'The implementation is a small modification of Insertion Sort: replace 1 with the current gap wherever adjacent elements are compared or shifted.',
      code: {
        python: `def shell_sort(arr):
    n = len(arr)
    # Build Knuth gap sequence: 1, 4, 13, 40, ...
    gap = 1
    while gap < n // 3:
        gap = gap * 3 + 1

    while gap >= 1:
        # Insertion sort with this gap
        for i in range(gap, n):
            key = arr[i]
            j = i
            while j >= gap and arr[j - gap] > key:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = key
        gap //= 3   # shrink gap

    return arr`,
        java: `public static int[] shellSort(int[] arr) {
    int n = arr.length;
    // Build Knuth gap sequence
    int gap = 1;
    while (gap < n / 3) gap = gap * 3 + 1;

    while (gap >= 1) {
        // Insertion sort with this gap
        for (int i = gap; i < n; i++) {
            int key = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > key) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = key;
        }
        gap /= 3;  // shrink gap
    }
    return arr;
}`,
        javascript: `function shellSort(arr) {
  const n = arr.length;
  let gap = 1;
  while (gap < Math.floor(n / 3)) gap = gap * 3 + 1;

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      const key = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > key) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = key;
    }
    gap = Math.floor(gap / 3);
  }
  return arr;
}`,
        typescript: `function shellSort(arr: number[]): number[] {
  const n = arr.length;
  let gap = 1;
  while (gap < Math.floor(n / 3)) gap = gap * 3 + 1;

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      const key = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > key) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = key;
    }
    gap = Math.floor(gap / 3);
  }
  return arr;
}`,
      },
      complexity: {
        time: 'O(n^1.5) worst (Knuth), O(n log² n) average empirically',
        space: 'O(1)',
        note: 'Exact complexity depends on the gap sequence and is still an open research problem. Best case O(n log n) when array is nearly sorted.',
      },
    },
    {
      title: 'When to Use Shell Sort',
      explanation:
        'Shell Sort sits in an interesting middle ground:\n\n  ✓ Much faster than O(n²) sorts in practice\n  ✓ In-place — no extra memory\n  ✓ Simple to implement\n  ✓ Good for medium-sized arrays (hundreds to low thousands)\n  ✓ Adaptive — works well on nearly-sorted data\n\n  ✗ No O(n log n) worst-case guarantee (unlike Merge or Heap Sort)\n  ✗ Not stable\n  ✗ Not the default choice for n > 10,000 (use Quicksort/Mergesort)\n\nShell Sort appears in embedded systems and standard libraries where code size matters and malloc is not available — notably in the uClibc and older Linux kernel implementations.',
      callout: {
        type: 'interview',
        text: 'Shell Sort is rarely asked directly, but understanding it shows you understand why gap sequences matter. It\'s a good answer to "how would you improve Insertion Sort?" in an interview.',
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
  ],
};

export default shellSort;
