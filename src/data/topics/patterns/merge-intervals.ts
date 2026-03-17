import type { Topic } from '../../../types';

const mergeIntervals: Topic = {
  id: 'merge-intervals',
  title: 'Merge Intervals',
  description:
    'Sort intervals by start time, then scan once to merge overlapping ones. A clean pattern that appears across scheduling, calendar, and range-merging problems. Once you see the sorting trick, the rest follows naturally.',
  difficulty: 'intermediate',
  category: 'patterns',
  tags: ['intervals', 'sorting', 'greedy', 'pattern', 'scheduling'],
  steps: [
    {
      title: 'The Problem',
      explanation:
        'Given a list of intervals, merge all overlapping ones.\n\nExample:\n  Input:  [[1,3], [2,6], [8,10], [15,18]]\n  Output: [[1,6], [8,10], [15,18]]\n\n  [1,3] and [2,6] overlap (3 ≥ 2) → merge to [1,6]\n  [8,10] does not overlap [1,6] → keep as-is\n  [15,18] does not overlap [8,10] → keep as-is\n\nTwo intervals [a,b] and [c,d] overlap if c ≤ b (the second starts before the first ends). The merged interval is [min(a,c), max(b,d)].\n\nBrute force: compare every pair — O(n²). With sorting: O(n log n).',
      visualization: {
        type: 'array',
        array: [1, 3, 2, 6, 8, 10, 15, 18],
        highlighted: [0, 1, 2, 3],
        pointers: [
          { index: 0, label: '[1,3]', color: 'text-green-400' },
          { index: 2, label: '[2,6]', color: 'text-yellow-400' },
        ],
      },
    },
    {
      title: 'The Algorithm',
      explanation:
        'Sort intervals by start time. Then one linear scan is enough:\n\n  1. Sort by start time\n  2. Add the first interval to the result\n  3. For each subsequent interval:\n     a. If it overlaps the last result interval (start ≤ last.end):\n        → extend the last result interval\'s end if needed\n     b. If it doesn\'t overlap:\n        → append it as a new interval\n\nSorting ensures all potential overlaps are adjacent — you never need to look back more than one step.',
      code: {
        python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])   # sort by start time
    merged = [intervals[0]]

    for start, end in intervals[1:]:
        last = merged[-1]
        if start <= last[1]:              # overlaps: extend end if needed
            last[1] = max(last[1], end)
        else:
            merged.append([start, end])   # no overlap: new interval

    return merged`,
        java: `public static int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    List<int[]> result = new ArrayList<>();
    result.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] last = result.get(result.size() - 1);
        if (intervals[i][0] <= last[1])
            last[1] = Math.max(last[1], intervals[i][1]);
        else
            result.add(intervals[i]);
    }
    return result.toArray(new int[0][]);
}`,
        javascript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1])
      last[1] = Math.max(last[1], intervals[i][1]);
    else
      result.push(intervals[i]);
  }
  return result;
}`,
        typescript: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1])
      last[1] = Math.max(last[1], intervals[i][1]);
    else
      result.push(intervals[i]);
  }
  return result;
}`,
      },
      complexity: { time: 'O(n log n) — sorting dominates', space: 'O(n)' },
    },
    {
      title: 'Variant: Insert Interval',
      explanation:
        'Given a sorted, non-overlapping list of intervals and a new interval to insert, return the merged result.\n\nThree phases:\n  1. Add all intervals that end before the new one starts (no overlap, come before)\n  2. Merge all intervals that overlap with the new one\n  3. Add all remaining intervals (come after)\n\nNo sorting needed — the list is already sorted.',
      code: {
        python: `def insert(intervals, new_interval):
    result = []
    i, n = 0, len(intervals)

    # Phase 1: add all intervals ending before new_interval starts
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1

    # Phase 2: merge all overlapping intervals
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    result.append(new_interval)

    # Phase 3: add remaining intervals
    result.extend(intervals[i:])
    return result`,
        javascript: `function insert(intervals, newInterval) {
  const result = [];
  let i = 0;

  while (i < intervals.length && intervals[i][1] < newInterval[0])
    result.push(intervals[i++]);

  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);

  while (i < intervals.length) result.push(intervals[i++]);
  return result;
}`,
        java: `public static int[][] insert(int[][] intervals, int[] n) {
    List<int[]> res = new ArrayList<>();
    int i = 0, len = intervals.length;
    while (i < len && intervals[i][1] < n[0]) res.add(intervals[i++]);
    while (i < len && intervals[i][0] <= n[1]) {
        n[0] = Math.min(n[0], intervals[i][0]);
        n[1] = Math.max(n[1], intervals[i][1]);
        i++;
    }
    res.add(n);
    while (i < len) res.add(intervals[i++]);
    return res.toArray(new int[0][]);
}`,
        typescript: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  const result: number[][] = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < newInterval[0])
    result.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  while (i < intervals.length) result.push(intervals[i++]);
  return result;
}`,
      },
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
    {
      title: 'Variant: Meeting Rooms',
      explanation:
        'Can one person attend all meetings (no two overlap)?\n\nAfter sorting by start time, check if any interval starts before the previous one ends.',
      code: {
        python: `def can_attend_all(intervals):
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False   # overlap found
    return True

# Meeting Rooms II: minimum rooms needed = maximum concurrent meetings
# Use a min-heap of end times:
import heapq
def min_rooms(intervals):
    intervals.sort(key=lambda x: x[0])
    heap = []   # end times of active meetings
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)   # reuse a room
        else:
            heapq.heappush(heap, end)       # need a new room
    return len(heap)`,
        javascript: `function canAttendAll(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++)
    if (intervals[i][0] < intervals[i-1][1]) return false;
  return true;
}`,
        java: `boolean canAttendAll(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    for (int i = 1; i < intervals.length; i++)
        if (intervals[i][0] < intervals[i-1][1]) return false;
    return true;
}`,
        typescript: `function canAttendAll(intervals: number[][]): boolean {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++)
    if (intervals[i][0] < intervals[i-1][1]) return false;
  return true;
}`,
      },
      callout: {
        type: 'interview',
        text: 'Merge Intervals is one of Amazon\'s most asked problems. The pattern extends to: Employee Free Time, Non-Overlapping Intervals (greedy — remove minimum intervals to eliminate all overlaps), and Meeting Rooms II (min heap of end times).',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Merge Intervals',
      url: 'https://leetcode.com/problems/merge-intervals/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Insert Interval',
      url: 'https://leetcode.com/problems/insert-interval/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Non-overlapping Intervals',
      url: 'https://leetcode.com/problems/non-overlapping-intervals/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'Meeting Rooms II',
      url: 'https://leetcode.com/problems/meeting-rooms-ii/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default mergeIntervals;
