import type { Topic } from '../../../types';

const insertionSort: Topic = {
  id: 'insertion-sort',
  title: 'Insertion Sort',
  description:
    'Builds the final sorted array one item at a time, like sorting playing cards in your hand. Excellent for small arrays and nearly-sorted data. The algorithm behind Python\'s Timsort for small runs.',
  difficulty: 'beginner',
  category: 'sorting',
  tags: ['sorting', 'in-place', 'stable', 'adaptive', 'O(n²)'],
  steps: [
    {
      title: 'The Idea',
      explanation:
        'Imagine sorting a hand of playing cards. You pick up one card at a time and insert it into the correct position among the cards already in your hand.\n\nInsertion Sort works the same way:\n• The array is split into a "sorted" portion (left) and "unsorted" portion (right)\n• In each step, take the first unsorted element and insert it into the correct position in the sorted portion\n• Shift larger sorted elements right to make room',
      visualization: {
        type: 'sorting',
        array: [5, 2, 4, 6, 1, 3],
        sorted: [0],
      },
    },
    {
      title: 'Implementation',
      explanation:
        'For each element starting from index 1:\n1. Store the current element as "key"\n2. Compare key with each element in the sorted portion, moving right to left\n3. Shift elements that are greater than key one position to the right\n4. Insert key into the gap',
      code: {
        python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # shift larger elements right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key    # insert key in correct position
    return arr`,
        java: `public static int[] insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
        javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
        typescript: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      },
      highlightLines: {
        python: [5, 6, 7, 8, 9],
        java: [4, 5, 6, 7, 8],
        javascript: [4, 5, 6, 7, 8],
        typescript: [4, 5, 6, 7, 8],
      },
      complexity: {
        time: 'O(n²) worst, O(n) best',
        space: 'O(1)',
        note: 'Best case O(n) when array is already sorted — only one comparison per element.',
      },
    },
    {
      title: 'Why Insertion Sort Matters',
      explanation:
        'Despite O(n²), Insertion Sort shines in specific cases:\n\n1. Nearly-sorted arrays: Almost O(n) — few shifts needed.\n2. Small arrays: Constant factors matter. Below ~20 elements, Insertion Sort beats Merge/Quick Sort due to low overhead.\n3. Online algorithm: Can sort a stream of elements as they arrive, without seeing the full input first.\n4. Stable: Equal elements maintain original order.\n\nThis is why Python\'s Timsort and Java\'s Timsort/Arrays.sort use Insertion Sort for small runs (MIN_RUN is typically 32–64 in CPython, ~32 in Java) before merging.',
      callout: {
        type: 'insight',
        text: 'Insertion Sort has the best best-case of any comparison sort: O(n). This is why hybrid sorts like Timsort use it for small subarrays.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Insertion Sort List',
      url: 'https://leetcode.com/problems/insertion-sort-list/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default insertionSort;
