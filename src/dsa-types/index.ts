export type Language = 'python' | 'java' | 'javascript' | 'typescript';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CodeSnippet {
  python?: string;
  java?: string;
  javascript?: string;
  typescript?: string;
}

export interface ComplexityInfo {
  time: string;
  space: string;
  note?: string;
}

// Visualization types
export interface SortingVisualization {
  type: 'sorting';
  array: number[];
  comparing?: number[];   // indices being compared (yellow)
  swapping?: number[];    // indices being swapped (red)
  sorted?: number[];      // indices confirmed sorted (green)
  pivot?: number;         // pivot index for quicksort
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  state: 'default' | 'visiting' | 'visited' | 'path' | 'start' | 'end';
  distance?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state: 'default' | 'active' | 'path';
  directed?: boolean;
}

export interface GraphVisualization {
  type: 'graph';
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TreeNode {
  id: string;
  value: number | string;
  left?: string;  // id of left child
  right?: string; // id of right child
  x?: number;
  y?: number;
  state: 'default' | 'visiting' | 'visited' | 'found';
}

export interface TreeVisualization {
  type: 'tree';
  nodes: TreeNode[];
  root: string;
}

export interface ArrayVisualization {
  type: 'array';
  array: (number | string)[];
  highlighted?: number[];
  pointers?: { index: number; label: string; color: string }[];
  found?: number;
}

export type Visualization =
  | SortingVisualization
  | GraphVisualization
  | TreeVisualization
  | ArrayVisualization;

export interface Step {
  title: string;
  explanation: string;
  code?: CodeSnippet;
  highlightLines?: Partial<Record<Language, number[]>>;
  visualization?: Visualization;
  complexity?: ComplexityInfo;
  callout?: {
    type: 'tip' | 'warning' | 'insight' | 'interview';
    text: string;
  };
}

export interface PracticeProblem {
  title: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  platform: 'leetcode' | 'hackerrank' | 'other';
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  steps: Step[];
  practiceProblems?: PracticeProblem[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  topics: Topic[];
}
