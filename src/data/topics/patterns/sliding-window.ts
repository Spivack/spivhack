import type { Topic } from '../../../types';

const slidingWindow: Topic = {
  id: 'sliding-window',
  title: 'Sliding Window',
  description:
    'Maintain a contiguous subarray or substring as a "window" that slides across the input. Avoids recomputing from scratch on every step by incrementally adding the new element and removing the old one. Turns O(n²) substring/subarray problems into O(n).',
  difficulty: 'intermediate',
  category: 'patterns',
  tags: ['sliding-window', 'array', 'string', 'pattern', 'O(n)'],
  steps: [
    {
      title: 'The Idea',
      explanation:
        'Many problems ask about properties of contiguous subarrays or substrings: maximum sum, longest without repeats, smallest covering a target.\n\nBrute force: check every subarray — O(n²) or worse.\n\nSliding window: maintain a window [left, right] and slide it across the input.\n  • Expand right to add new elements\n  • Shrink left to remove invalid ones\n  • Track the answer at each valid window state\n\nTwo variants:\n  Fixed size: window stays exactly k wide\n  Variable size: window grows and shrinks based on a condition\n\nThe key optimization: instead of recomputing a property over the whole window each step, update it incrementally in O(1).',
      visualization: {
        type: 'array',
        array: [2, 1, 5, 1, 3, 2],
        highlighted: [1, 2, 3],
        pointers: [
          { index: 1, label: 'left', color: 'text-green-400' },
          { index: 3, label: 'right', color: 'text-yellow-400' },
        ],
      },
    },
    {
      title: 'Fixed-Size Window: Maximum Sum Subarray of Size K',
      explanation:
        'Find the maximum sum of any contiguous subarray of exactly length k.\n\nSlide a window of width k across the array:\n  • First window: sum elements [0..k-1]\n  • Each step: add the new right element, subtract the outgoing left element\n  • Track the maximum seen',
      code: {
        python: `def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])   # first window
    best = window_sum

    for i in range(k, len(nums)):
        window_sum += nums[i]       # add incoming element
        window_sum -= nums[i - k]   # remove outgoing element
        best = max(best, window_sum)

    return best`,
        java: `public static int maxSumSubarray(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int best = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        best = Math.max(best, windowSum);
    }
    return best;
}`,
        javascript: `function maxSumSubarray(nums, k) {
  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let best = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    best = Math.max(best, windowSum);
  }
  return best;
}`,
        typescript: `function maxSumSubarray(nums: number[], k: number): number {
  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let best = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    best = Math.max(best, windowSum);
  }
  return best;
}`,
      },
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      title: 'Variable-Size Window: Longest Substring Without Repeats',
      explanation:
        'Find the length of the longest substring with all unique characters.\n\nExpand right as long as the new character is not already in the window. When a repeat is found, shrink left until the repeat is gone.\n\nUse a set (or frequency map) to track what\'s in the current window.',
      code: {
        python: `def length_of_longest_substring(s):
    seen  = set()
    left  = 0
    best  = 0

    for right in range(len(s)):
        while s[right] in seen:       # shrink until no repeat
            seen.remove(s[left])
            left += 1
        seen.add(s[right])
        best = max(best, right - left + 1)

    return best`,
        java: `public static int lengthOfLongestSubstring(String s) {
    Set<Character> seen = new HashSet<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        while (seen.contains(s.charAt(right))) {
            seen.remove(s.charAt(left++));
        }
        seen.add(s.charAt(right));
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        javascript: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left++]);
    }
    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
        typescript: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) seen.delete(s[left++]);
    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      },
      complexity: { time: 'O(n)', space: 'O(k) where k = alphabet size' },
    },
    {
      title: 'The Variable Window Template',
      explanation:
        'Most variable-size sliding window problems follow this exact skeleton:',
      code: {
        python: `def sliding_window(s):
    window = {}    # or set(), or a counter
    left   = 0
    best   = 0

    for right in range(len(s)):
        # 1. Add s[right] to the window
        window[s[right]] = window.get(s[right], 0) + 1

        # 2. Shrink from left while window is invalid
        while not is_valid(window):
            window[s[left]] -= 1
            if window[s[left]] == 0:
                del window[s[left]]
            left += 1

        # 3. Update answer with current valid window
        best = max(best, right - left + 1)

    return best`,
        javascript: `function slidingWindow(s) {
  const window = new Map();
  let left = 0, best = 0;

  for (let right = 0; right < s.length; right++) {
    // 1. Add s[right]
    window.set(s[right], (window.get(s[right]) ?? 0) + 1);

    // 2. Shrink while invalid
    while (!isValid(window)) {
      window.set(s[left], window.get(s[left]) - 1);
      if (window.get(s[left]) === 0) window.delete(s[left]);
      left++;
    }

    // 3. Update answer
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
        java: `// Same pattern — window is a HashMap<Character, Integer>`,
        typescript: `// Same pattern — window is a Map<string, number>`,
      },
      callout: {
        type: 'insight',
        text: 'Minimum Window Substring is the hardest common sliding window problem. It adds a "need" map (characters required) and a "have" counter, but still follows this exact template — just with a more complex validity check.',
      },
    },
    {
      title: 'When to Use Sliding Window',
      explanation:
        'Reach for sliding window when the problem involves:\n  ✓ Contiguous subarray or substring\n  ✓ Maximum/minimum length satisfying some condition\n  ✓ Fixed-size window statistics (average, max, sum)\n  ✓ Counting subarrays/substrings meeting a constraint\n\nSignal phrases:\n  "longest/shortest subarray/substring"\n  "contiguous subarray with sum equal to k"\n  "maximum average of k consecutive elements"\n  "minimum window containing all characters"\n\nDo NOT use sliding window if the problem involves non-contiguous subsequences (use DP instead) or if order doesn\'t matter (use a hash map).',
      callout: {
        type: 'interview',
        text: '"Longest Substring Without Repeating Characters" is one of the single most asked interview questions across all companies. If you only practice one sliding window problem, make it that one.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Longest Substring Without Repeating Characters',
      url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Maximum Average Subarray I',
      url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Longest Repeating Character Replacement',
      url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Minimum Window Substring',
      url: 'https://leetcode.com/problems/minimum-window-substring/',
      difficulty: 'hard',
      platform: 'leetcode',
    },
  ],
};

export default slidingWindow;
