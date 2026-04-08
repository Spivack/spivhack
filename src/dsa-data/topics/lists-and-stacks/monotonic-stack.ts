import type { Topic } from '../../../dsa-types';

const monotonicStack: Topic = {
  id: 'monotonic-stack',
  title: 'Monotonic Stack',
  description:
    'A stack that maintains elements in strictly increasing or decreasing order by popping elements that violate the property as new ones arrive. Solves "next greater/smaller element" problems in O(n) — problems that seem to require O(n²) comparisons.',
  difficulty: 'intermediate',
  category: 'lists-and-stacks',
  tags: ['stack', 'monotonic', 'pattern', 'next-greater', 'O(n)'],
  steps: [
    {
      title: 'The Problem It Solves',
      explanation:
        'For each element in an array, find the next element that is greater than it.\n\nExample: [2, 1, 5, 3, 4]\n  2 → 5 (next greater)\n  1 → 5\n  5 → -1 (none)\n  3 → 4\n  4 → -1\n\nBrute force: for each element, scan right until you find a larger one — O(n²).\n\nMonotonic stack: process each element once, using the stack to track elements waiting for their "next greater." When a larger element arrives, it resolves all smaller elements still on the stack — O(n) total.',
      visualization: {
        type: 'array',
        array: [2, 1, 5, 3, 4],
        pointers: [{ index: 2, label: 'resolves 2 and 1', color: 'text-green-400' }],
      },
    },
    {
      title: 'Next Greater Element',
      explanation:
        'Maintain a decreasing monotonic stack (elements on the stack are in decreasing order from bottom to top).\n\n  Scan left to right:\n  1. While the stack is not empty AND the top of the stack < current element:\n     → Pop the top. Its "next greater" is the current element.\n  2. Push the current element onto the stack.\n  3. After the scan: anything still on the stack has no next greater element.',
      code: {
        python: `def next_greater(nums):
    n      = len(nums)
    result = [-1] * n
    stack  = []   # stores indices of elements waiting for next greater

    for i in range(n):
        # Pop all elements smaller than nums[i]
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]   # nums[i] is their next greater
        stack.append(i)

    # Remaining indices on stack have no next greater (result stays -1)
    return result

# next_greater([2, 1, 5, 3, 4]) → [5, 5, -1, 4, -1]`,
        java: `public static int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();  // stores indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            result[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return result;
}`,
        javascript: `function nextGreater(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack  = [];   // indices

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack.at(-1)] < nums[i]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
        typescript: `function nextGreater(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack.at(-1)!] < nums[i]) {
      result[stack.pop()!] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
      },
      complexity: {
        time: 'O(n) — each element is pushed and popped at most once',
        space: 'O(n)',
        note: 'Despite the nested while loop, each element is pushed once and popped once — total operations across the entire scan is 2n.',
      },
    },
    {
      title: 'Daily Temperatures',
      explanation:
        'For each day, how many days until a warmer temperature?\n\nThis is "next greater element" with one twist: instead of storing the value, store the distance to it.\n\nStack stores indices. When a warmer day arrives, the answer for each popped day is (current index − popped index).',
      code: {
        python: `def daily_temperatures(temps):
    n      = len(temps)
    result = [0] * n
    stack  = []   # indices

    for i in range(n):
        while stack and temps[stack[-1]] < temps[i]:
            idx = stack.pop()
            result[idx] = i - idx   # days to wait
        stack.append(i)

    return result

# daily_temperatures([73,74,75,71,69,72,76,73])
# → [1, 1, 4, 2, 1, 1, 0, 0]`,
        java: `public static int[] dailyTemperatures(int[] temps) {
    int[] result = new int[temps.length];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < temps.length; i++) {
        while (!stack.isEmpty() && temps[stack.peek()] < temps[i])
            result[stack.peek()] = i - stack.pop();
        stack.push(i);
    }
    return result;
}`,
        javascript: `function dailyTemperatures(temps) {
  const result = new Array(temps.length).fill(0);
  const stack  = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[stack.at(-1)] < temps[i]) {
      const idx = stack.pop();
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}`,
        typescript: `function dailyTemperatures(temps: number[]): number[] {
  const result = new Array(temps.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[stack.at(-1)!] < temps[i]) {
      const idx = stack.pop()!;
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}`,
      },
    },
    {
      title: 'Largest Rectangle in Histogram',
      explanation:
        'Given bar heights, find the largest rectangle that fits within the histogram.\n\nFor each bar, the rectangle using that bar\'s height extends left and right until it hits a shorter bar. We need the nearest shorter bar on both sides — exactly what a monotonic stack gives us.\n\nMaintain an increasing stack. When a shorter bar arrives, the popped bar is the height of a rectangle bounded by the new bar (right) and the new stack top (left).',
      code: {
        python: `def largest_rectangle(heights):
    stack    = []   # indices, increasing by height
    max_area = 0
    heights  = heights + [0]   # sentinel to flush remaining bars

    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            width  = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)

    return max_area`,
        javascript: `function largestRectangle(heights) {
  const stack = [];
  let maxArea = 0;
  heights = [...heights, 0];  // sentinel

  for (let i = 0; i < heights.length; i++) {
    while (stack.length && heights[stack.at(-1)] >= heights[i]) {
      const height = heights[stack.pop()];
      const width  = stack.length ? i - stack.at(-1) - 1 : i;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
        java: `public static int largestRectangle(int[] h) {
    Deque<Integer> stack = new ArrayDeque<>();
    int max = 0;
    for (int i = 0; i <= h.length; i++) {
        int cur = (i == h.length) ? 0 : h[i];
        while (!stack.isEmpty() && h[stack.peek()] >= cur) {
            int height = h[stack.pop()];
            int width  = stack.isEmpty() ? i : i - stack.peek() - 1;
            max = Math.max(max, height * width);
        }
        stack.push(i);
    }
    return max;
}`,
        typescript: `function largestRectangle(heights: number[]): number {
  const stack: number[] = [];
  let maxArea = 0;
  const h = [...heights, 0];

  for (let i = 0; i < h.length; i++) {
    while (stack.length && h[stack.at(-1)!] >= h[i]) {
      const height = h[stack.pop()!];
      const width  = stack.length ? i - stack.at(-1)! - 1 : i;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
      },
      complexity: { time: 'O(n)', space: 'O(n)' },
      callout: {
        type: 'interview',
        text: 'Largest Rectangle in Histogram is a Google/Amazon classic. Trapping Rain Water is the other iconic monotonic stack problem — same idea, two-direction scan or stack-based. Master these two and you\'ve covered the full pattern.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Daily Temperatures',
      url: 'https://leetcode.com/problems/daily-temperatures/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Next Greater Element I',
      url: 'https://leetcode.com/problems/next-greater-element-i/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Largest Rectangle in Histogram',
      url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
    {
      title: 'Trapping Rain Water',
      url: 'https://leetcode.com/problems/trapping-rain-water/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default monotonicStack;
