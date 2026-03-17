import type { Topic } from '../../../types';

const quickSort: Topic = {
  id: 'quick-sort',
  title: 'Quick Sort',
  description:
    'The most widely used sorting algorithm in practice. Selects a pivot element and partitions the array so all smaller elements come before it and all larger elements come after. Recursively sorts both partitions. Average O(n log n) with excellent cache performance.',
  difficulty: 'intermediate',
  category: 'sorting',
  tags: ['sorting', 'divide-and-conquer', 'recursive', 'in-place', 'O(n log n)'],
  steps: [
    {
      title: 'Problem Statement',
      explanation:
        'Sort an array in-place with average O(n log n) time and O(log n) space (no extra arrays).\n\nQuick Sort is the algorithm behind most production sort implementations:\n• C stdlib qsort()\n• Java Arrays.sort() for primitives (dual-pivot variant)\n• C++ std::sort()\n\nExample:\n  Input:  [10, 7, 8, 9, 1, 5]\n  Pivot:   5\n  After partition: [1, 5, 8, 9, 7, 10]\n              pivot is at its final position ↑',
      visualization: {
        type: 'sorting',
        array: [10, 7, 8, 9, 1, 5],
        pivot: 5,
      },
    },
    {
      title: 'The Partition Step',
      explanation:
        'Partition is the heart of Quick Sort.\n\nLomuto partition scheme (simpler to understand):\n1. Choose the last element as pivot.\n2. Use pointer i to track the boundary of "small elements".\n3. Walk pointer j through the array:\n   - If arr[j] < pivot: swap arr[j] with arr[i+1], increment i\n4. At the end: swap pivot into position i+1.\n5. Return i+1 (pivot\'s final index).\n\nAfter partition: everything left of pivot < pivot, everything right > pivot.',
      visualization: {
        type: 'sorting',
        array: [1, 7, 8, 9, 10, 5],
        pivot: 5,
        comparing: [1, 5],
      },
      callout: {
        type: 'insight',
        text: 'After partition, the pivot element is in its final sorted position — it will never move again. This is the key invariant.',
      },
    },
    {
      title: 'Full Implementation',
      explanation:
        'The quicksort function:\n1. Base case: if the subarray has 0 or 1 elements, return.\n2. Partition: place pivot at its correct position.\n3. Recurse on the left subarray (before pivot).\n4. Recurse on the right subarray (after pivot).',
      code: {
        python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)


def partition(arr, low, high):
    pivot = arr[high]          # choose last element as pivot
    i = low - 1               # boundary of "smaller" region

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
        java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    return i + 1;
}`,
        javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
        typescript: `function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      },
      highlightLines: {
        python: [10, 11, 13, 14, 15, 16],
        java: [9, 10, 12, 13, 14, 15],
        javascript: [9, 10, 12, 13, 14, 15],
        typescript: [10, 11, 13, 14, 15, 16],
      },
      complexity: {
        time: 'O(n log n) avg, O(n²) worst',
        space: 'O(log n)',
        note: 'In-place. No extra arrays. Space is the call stack depth.',
      },
    },
    {
      title: 'The Worst Case Problem',
      explanation:
        'Quick Sort\'s Achilles heel: if the pivot is always the smallest or largest element, we get O(n²).\n\nThis happens with a sorted (or reverse-sorted) array when always picking first or last as pivot.\n\nPartition of [1, 2, 3, 4, 5] with last element as pivot:\n  Pass 1: pivot=5, left subarray=[1,2,3,4], right=[]\n  Pass 2: pivot=4, left=[1,2,3], right=[]\n  ...\n  n levels deep → O(n²)\n\nFix: use median-of-three pivot selection, or randomize the pivot.',
      callout: {
        type: 'warning',
        text: 'Never use Quick Sort with last/first element as pivot on real-world data — sorted data is common. Always randomize or use median-of-three.',
      },
    },
    {
      title: 'Optimized: Random Pivot',
      explanation:
        'By choosing a random pivot, we make it statistically impossible for an adversary to craft worst-case input.\n\nWith random pivot, the expected time is O(n log n) across all inputs.',
      code: {
        python: `import random

def partition(arr, low, high):
    # Randomly choose pivot and swap to end
    rand_idx = random.randint(low, high)
    arr[rand_idx], arr[high] = arr[high], arr[rand_idx]

    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
        javascript: `function partition(arr, low, high) {
  // Randomly choose pivot and swap to end
  const randIdx = Math.floor(Math.random() * (high - low + 1)) + low;
  [arr[randIdx], arr[high]] = [arr[high], arr[randIdx]];

  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
        java: `private static int partition(int[] arr, int low, int high) {
    // Randomly choose pivot and swap to end
    int randIdx = low + (int)(Math.random() * (high - low + 1));
    int tmp = arr[randIdx]; arr[randIdx] = arr[high]; arr[high] = tmp;

    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    }
    tmp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = tmp;
    return i + 1;
}`,
        typescript: `function partition(arr: number[], low: number, high: number): number {
  const randIdx = Math.floor(Math.random() * (high - low + 1)) + low;
  [arr[randIdx], arr[high]] = [arr[high], arr[randIdx]];

  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      },
      highlightLines: {
        python: [4, 5],
        javascript: [3, 4],
        java: [3, 4],
        typescript: [2, 3],
      },
    },
    {
      title: 'Interview Tips',
      explanation:
        'Quick Sort vs Merge Sort — know this cold:\n\n┌─────────────────┬──────────────┬──────────────┐\n│                 │  Quick Sort  │  Merge Sort  │\n├─────────────────┼──────────────┼──────────────┤\n│ Avg Time        │  O(n log n)  │  O(n log n)  │\n│ Worst Time      │    O(n²)     │  O(n log n)  │\n│ Space           │  O(log n)    │    O(n)      │\n│ Stable          │     No       │     Yes      │\n│ In-place        │    Yes       │     No       │\n│ Cache friendly  │    Yes       │    Less      │\n└─────────────────┴──────────────┴──────────────┘\n\nWhy is Quick Sort preferred in practice despite O(n²) worst case?\nCache efficiency — accessing elements near each other in memory is fast. Quick Sort\'s partition sweeps linearly through memory, which is cache-friendly.',
      callout: {
        type: 'interview',
        text: 'Common question: "When would you use Merge Sort over Quick Sort?" Answer: when stability is required (sorting objects by multiple keys), or when worst-case guarantees matter more than average-case performance.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Kth Largest Element in an Array',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Sort Colors',
      url: 'https://leetcode.com/problems/sort-colors/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Wiggle Sort II',
      url: 'https://leetcode.com/problems/wiggle-sort-ii/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default quickSort;
