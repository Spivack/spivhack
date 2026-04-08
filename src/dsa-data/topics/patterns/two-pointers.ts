import type { Topic } from '../../../dsa-types';

const twoPointers: Topic = {
  id: 'two-pointers',
  title: 'Two Pointers',
  description:
    'Use two indices moving through a sequence to eliminate nested loops. Reduces O(n²) brute force to O(n). Two core variants: opposite ends (shrink inward) and same direction (fast/slow). Appears in a huge fraction of array and string interview problems.',
  difficulty: 'beginner',
  category: 'patterns',
  tags: ['two-pointers', 'array', 'string', 'pattern', 'O(n)'],
  steps: [
    {
      title: 'The Idea',
      explanation:
        'Two Pointers is not a data structure — it\'s a technique. Instead of checking every pair with nested loops (O(n²)), place one pointer at each end and move them inward based on what you find.\n\nThe key insight: if the data is sorted (or has some ordering property), you can make a decision at each step that eliminates entire regions of the search space.\n\nTwo variants:\n  1. Opposite ends: left starts at 0, right starts at n-1, they move toward each other\n  2. Same direction: slow and fast pointer both start at 0, move at different speeds\n\nBoth reduce two nested loops to a single linear pass.',
      visualization: {
        type: 'array',
        array: [1, 3, 5, 7, 9, 11, 13],
        pointers: [
          { index: 0, label: 'left', color: 'text-green-400' },
          { index: 6, label: 'right', color: 'text-yellow-400' },
        ],
      },
    },
    {
      title: 'Opposite Ends: Two Sum (Sorted)',
      explanation:
        'Given a sorted array, find two numbers that sum to a target.\n\nBrute force: check every pair — O(n²).\nTwo pointers: start left=0, right=n-1.\n  • sum == target → found\n  • sum < target  → move left right (need a larger number)\n  • sum > target  → move right left (need a smaller number)\n\nWhy does this work? When sum is too small, the only way to increase it is to increase the left value. When too large, decrease the right value. Every step eliminates at least one position — O(n) total.',
      code: {
        python: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1    # need larger sum
        else:
            right -= 1   # need smaller sum

    return []   # no solution`,
        java: `public static int[] twoSumSorted(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int s = nums[left] + nums[right];
        if (s == target)  return new int[]{left, right};
        else if (s < target) left++;
        else                 right--;
    }
    return new int[]{};
}`,
        javascript: `function twoSumSorted(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const s = nums[left] + nums[right];
    if (s === target)  return [left, right];
    else if (s < target) left++;
    else                 right--;
  }
  return [];
}`,
        typescript: `function twoSumSorted(nums: number[], target: number): number[] {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const s = nums[left] + nums[right];
    if (s === target)  return [left, right];
    else if (s < target) left++;
    else                 right--;
  }
  return [];
}`,
      },
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      title: 'Opposite Ends: Container With Most Water',
      explanation:
        'Given heights at each index, find two lines that form the container holding the most water.\n\nArea = min(height[left], height[right]) × (right - left)\n\nStart with the widest container (left=0, right=n-1). Moving the pointer with the greater height can only decrease width without guaranteed increase in height — so always move the shorter pointer inward.',
      code: {
        python: `def max_water(heights):
    left, right = 0, len(heights) - 1
    best = 0
    while left < right:
        area = min(heights[left], heights[right]) * (right - left)
        best = max(best, area)
        if heights[left] < heights[right]:
            left += 1   # move shorter side inward
        else:
            right -= 1
    return best`,
        javascript: `function maxWater(heights) {
  let left = 0, right = heights.length - 1, best = 0;
  while (left < right) {
    const area = Math.min(heights[left], heights[right]) * (right - left);
    best = Math.max(best, area);
    if (heights[left] < heights[right]) left++;
    else right--;
  }
  return best;
}`,
        java: `public static int maxWater(int[] h) {
    int left = 0, right = h.length - 1, best = 0;
    while (left < right) {
        best = Math.max(best, Math.min(h[left], h[right]) * (right - left));
        if (h[left] < h[right]) left++;
        else right--;
    }
    return best;
}`,
        typescript: `function maxWater(heights: number[]): number {
  let left = 0, right = heights.length - 1, best = 0;
  while (left < right) {
    best = Math.max(best, Math.min(heights[left], heights[right]) * (right - left));
    if (heights[left] < heights[right]) left++;
    else right--;
  }
  return best;
}`,
      },
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      title: 'Same Direction: Remove Duplicates',
      explanation:
        'Two pointers can also move in the same direction at different speeds — one "reads" (fast), one "writes" (slow).\n\nRemove duplicates from a sorted array in-place:\n  • slow tracks the last valid position written\n  • fast scans ahead for the next unique element\n  • When fast finds a new value, write it to slow+1 and advance slow\n\nThis overwrites duplicates in-place without extra space.',
      code: {
        python: `def remove_duplicates(nums):
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:   # new unique element found
            slow += 1
            nums[slow] = nums[fast]    # write it to the slow position
    return slow + 1   # length of deduplicated array`,
        java: `public static int removeDuplicates(int[] nums) {
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}`,
        javascript: `function removeDuplicates(nums) {
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}`,
        typescript: `function removeDuplicates(nums: number[]): number {
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}`,
      },
      complexity: { time: 'O(n)', space: 'O(1)' },
      callout: {
        type: 'interview',
        text: 'The fast/slow same-direction pattern also underlies cycle detection in linked lists (Floyd\'s algorithm): slow moves one step, fast moves two. If they ever meet, there\'s a cycle. If fast reaches null, there isn\'t.',
      },
    },
    {
      title: 'When to Reach for Two Pointers',
      explanation:
        'Two Pointers is the right tool when:\n  ✓ Input is sorted (or can be sorted)\n  ✓ You\'re searching for pairs/triplets summing to a target\n  ✓ You need to partition or rearrange an array in-place\n  ✓ You\'re asked to find the maximum/minimum of something across pairs\n  ✓ Slow/fast pointer: detecting cycles, finding midpoints, removing nth-from-end\n\nSignal words in the problem:\n  "sorted array", "find pair", "in-place", "without extra space", "two numbers that sum to"',
      callout: {
        type: 'interview',
        text: '3Sum is the prototypical two-pointer interview problem: sort the array, fix one element with an outer loop, then use two pointers on the remaining subarray. O(n²) total — a huge improvement over O(n³) brute force.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Two Sum II - Input Array Is Sorted',
      url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: '3Sum',
      url: 'https://leetcode.com/problems/3sum/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Container With Most Water',
      url: 'https://leetcode.com/problems/container-with-most-water/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Linked List Cycle',
      url: 'https://leetcode.com/problems/linked-list-cycle/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
  ],
};

export default twoPointers;
