import type { Topic } from '../../../dsa-types';

const radixSort: Topic = {
  id: 'radix-sort',
  title: 'Radix Sort',
  description:
    'Sorts integers by processing digits one at a time — from least significant to most significant. Breaks the O(n log n) lower bound for comparison sorts by never comparing elements directly. Linear time for fixed-width integers.',
  difficulty: 'intermediate',
  category: 'sorting',
  tags: ['sorting', 'non-comparison', 'linear', 'stable', 'O(nk)'],
  steps: [
    {
      title: 'Beyond Comparison Sorts',
      explanation:
        'Every sort we\'ve seen so far (Insertion, Bubble, Selection, Merge, Quick, Heap) works by comparing elements. There\'s a provable lower bound: any comparison-based sort requires at least O(n log n) comparisons in the worst case.\n\nRadix Sort sidesteps this entirely — it never compares two elements against each other. Instead, it sorts by digit position, one digit at a time.\n\nThis is only possible when elements have a structure we can exploit — integers, strings, dates, or any fixed-length keys.',
      callout: {
        type: 'insight',
        text: 'The O(n log n) lower bound applies only to comparison sorts. Radix Sort, Counting Sort, and Bucket Sort all achieve better asymptotic complexity by exploiting the structure of keys.',
      },
    },
    {
      title: 'Counting Sort — The Building Block',
      explanation:
        'Radix Sort relies on Counting Sort as a subroutine. Counting Sort sorts elements in O(n + k) where k is the range of values.\n\nFor sorting by a single digit (0–9): k=10, so each pass is O(n).\n\nAlgorithm:\n  1. Count occurrences of each digit value (0–9)\n  2. Compute prefix sums to determine output positions\n  3. Build the output array by placing each element at its position\n  4. Copy output back\n\nImportant: Counting Sort must be stable — equal elements must preserve their original relative order. This is what makes multi-pass Radix Sort work correctly.',
      code: {
        python: `def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count  = [0] * 10

    # Count occurrences of each digit at position exp
    for num in arr:
        digit = (num // exp) % 10
        count[digit] += 1

    # Prefix sums: count[i] = number of elements ≤ digit i
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Build output (traverse in reverse to preserve stability)
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        count[digit] -= 1
        output[count[digit]] = arr[i]

    arr[:] = output`,
        java: `private static void countingSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n];
    int[] count  = new int[10];

    for (int num : arr)
        count[(num / exp) % 10]++;

    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];

    // Traverse in reverse for stability
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[--count[digit]] = arr[i];
    }
    System.arraycopy(output, 0, arr, 0, n);
}`,
        javascript: `function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count  = new Array(10).fill(0);

  for (const num of arr) count[Math.floor(num / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[--count[digit]] = arr[i];
  }
  arr.splice(0, n, ...output);
}`,
        typescript: `function countingSortByDigit(arr: number[], exp: number): void {
  const n = arr.length;
  const output = new Array<number>(n).fill(0);
  const count  = new Array<number>(10).fill(0);

  for (const num of arr) count[Math.floor(num / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[--count[digit]] = arr[i];
  }
  arr.splice(0, n, ...output);
}`,
      },
    },
    {
      title: 'LSD Radix Sort',
      explanation:
        'LSD (Least Significant Digit) Radix Sort processes digits from right to left.\n\nFor each digit position (ones, tens, hundreds, ...):\n  1. Run a stable Counting Sort on that digit\n\nAfter all digit positions are processed, the array is sorted.\n\nWhy LSD and not MSD (Most Significant Digit)? LSD with a stable sort naturally handles multi-digit numbers: after sorting by ones, two numbers with the same ones digit will be ordered by how they were before (their tens digit order), which is set up correctly by the next pass.\n\nExample on [170, 45, 75, 90, 2, 802, 24, 66]:\n  Pass 1 (ones):     [170, 90, 2, 802, 24, 45, 75, 66]\n  Pass 2 (tens):     [2, 802, 24, 45, 66, 170, 75, 90]\n  Pass 3 (hundreds): [2, 24, 45, 66, 75, 90, 170, 802]',
      code: {
        python: `def radix_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)

    # Process each digit position
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10

    return arr`,
        java: `public static int[] radixSort(int[] arr) {
    if (arr.length == 0) return arr;
    int maxVal = Arrays.stream(arr).max().getAsInt();

    for (int exp = 1; maxVal / exp > 0; exp *= 10)
        countingSortByDigit(arr, exp);

    return arr;
}`,
        javascript: `function radixSort(arr) {
  if (!arr.length) return arr;
  const maxVal = Math.max(...arr);

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10)
    countingSortByDigit(arr, exp);

  return arr;
}`,
        typescript: `function radixSort(arr: number[]): number[] {
  if (!arr.length) return arr;
  const maxVal = Math.max(...arr);

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10)
    countingSortByDigit(arr, exp);

  return arr;
}`,
      },
      complexity: {
        time: 'O(nk) where k = number of digits in max value',
        space: 'O(n + k)',
        note: 'For 32-bit integers, k ≤ 10 decimal digits, so this is effectively O(n) for fixed-range integers.',
      },
    },
    {
      title: 'When to Use Radix Sort',
      explanation:
        'Radix Sort is excellent when:\n  ✓ Sorting large arrays of integers with bounded values\n  ✓ Sorting fixed-length strings (sort character by character)\n  ✓ Sorting IP addresses, dates, or other structured keys\n  ✓ You need stable sort behavior\n\nNot suitable when:\n  ✗ Elements have no digit/byte decomposition (floats, arbitrary objects)\n  ✗ k is large (e.g., very long strings) — O(nk) can exceed O(n log n)\n  ✗ Negative numbers (requires a workaround)\n  ✗ Memory is extremely tight — needs O(n) extra space\n\nComparison to Counting Sort: Counting Sort works when value range k is small. Radix Sort works when values have many digits but a small per-digit range.',
      callout: {
        type: 'interview',
        text: '"Sort 1 billion integers efficiently" — Radix Sort is a strong answer. For 32-bit ints, 4 passes of base-256 Counting Sort (k=256) gives O(4n) = O(n) and is extremely cache-friendly in practice.',
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
      title: 'Maximum Gap',
      url: 'https://leetcode.com/problems/maximum-gap/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default radixSort;
