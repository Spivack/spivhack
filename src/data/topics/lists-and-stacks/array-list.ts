import type { Topic } from '../../../types';

const arrayList: Topic = {
  id: 'array-list',
  title: 'Array-Based List',
  description:
    'A list backed by a contiguous array. Supports O(1) random access but O(n) insert and delete due to element shifting. The foundation of Python lists, Java ArrayLists, and JavaScript arrays.',
  difficulty: 'beginner',
  category: 'lists-and-stacks',
  tags: ['list', 'array', 'dynamic-array', 'data-structure'],
  steps: [
    {
      title: 'The List ADT',
      explanation:
        'A List is an ordered sequence of elements that supports:\n\n  get(i)         — return element at index i\n  set(i, val)    — overwrite element at index i\n  insert(i, val) — insert val before index i; shift others right\n  delete(i)      — remove element at index i; shift others left\n  size()         — number of elements\n  isEmpty()      — true if size is 0\n\nAn ADT (Abstract Data Type) defines what operations are available — not how they\'re implemented. The array-based list and the linked list both implement the List ADT, but with very different performance profiles.',
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50],
        pointers: [{ index: 0, label: 'index 0', color: 'text-green-400' }],
      },
    },
    {
      title: 'Underlying Storage',
      explanation:
        'An array-based list stores elements in a contiguous block of memory. A fixed-size array is allocated internally; the list tracks how many slots are actually used.\n\n  capacity  — total slots in the underlying array\n  size      — number of elements currently stored\n\nWhen size reaches capacity, the array is resized — a new (larger) array is allocated and all elements are copied over. Python lists and Java ArrayLists double the capacity on each resize, giving O(1) amortized appends.\n\nThe key benefit: index i directly maps to memory address base + i × element_size. No traversal needed.',
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50, '—', '—', '—'],
        highlighted: [0, 1, 2, 3, 4],
        pointers: [
          { index: 4, label: 'size=5', color: 'text-green-400' },
          { index: 7, label: 'cap=8', color: 'text-green-800' },
        ],
      },
    },
    {
      title: 'Access and Search',
      explanation:
        'Access by index is O(1) — the CPU computes the memory address directly from the index.\n\nSearch (find by value) is O(n) — there is no shortcut without sorting; every element must be checked in the worst case.',
      code: {
        python: `class ArrayList:
    def __init__(self):
        self._data = []

    def get(self, i: int):
        return self._data[i]          # O(1)

    def search(self, val) -> int:
        for i, x in enumerate(self._data):  # O(n)
            if x == val:
                return i
        return -1`,
        java: `public class ArrayList<T> {
    private Object[] data;
    private int size;

    public T get(int i) {
        return (T) data[i];           // O(1)
    }

    public int search(T val) {
        for (int i = 0; i < size; i++) { // O(n)
            if (data[i].equals(val)) return i;
        }
        return -1;
    }
}`,
        javascript: `class ArrayList {
  #data = [];

  get(i) { return this.#data[i]; }      // O(1)

  search(val) {
    for (let i = 0; i < this.#data.length; i++) { // O(n)
      if (this.#data[i] === val) return i;
    }
    return -1;
  }
}`,
        typescript: `class ArrayList<T> {
  #data: T[] = [];

  get(i: number): T { return this.#data[i]; }  // O(1)

  search(val: T): number {
    for (let i = 0; i < this.#data.length; i++) { // O(n)
      if (this.#data[i] === val) return i;
    }
    return -1;
  }
}`,
      },
      visualization: {
        type: 'array',
        array: [10, 20, 30, 40, 50],
        highlighted: [2],
        pointers: [{ index: 2, label: 'get(2) = 30', color: 'text-green-400' }],
      },
      complexity: { time: 'O(1) access, O(n) search', space: 'O(1)' },
    },
    {
      title: 'Insert at Index',
      explanation:
        'Inserting at index i requires shifting every element from index i onward one position to the right to make room.\n\nIn the worst case (insert at index 0), all n elements shift — O(n).\nIn the best case (insert at end), no shifting is needed — O(1) amortized.',
      code: {
        python: `def insert(self, i: int, val) -> None:
    self._data.insert(i, val)   # O(n) — Python shifts internally

# Manual version to show the shifting:
def insert_manual(self, i: int, val) -> None:
    self._data.append(None)     # grow by one
    for j in range(len(self._data) - 1, i, -1):
        self._data[j] = self._data[j - 1]   # shift right
    self._data[i] = val`,
        java: `public void insert(int i, T val) {
    // ensure capacity (resize if needed)
    if (size == data.length) resize();
    // shift elements right
    for (int j = size; j > i; j--) {
        data[j] = data[j - 1];
    }
    data[i] = val;
    size++;
}`,
        javascript: `insert(i, val) {
  this.#data.splice(i, 0, val); // O(n) — JS shifts internally
}

// Manual version:
insertManual(i, val) {
  this.#data.push(null);
  for (let j = this.#data.length - 1; j > i; j--) {
    this.#data[j] = this.#data[j - 1];
  }
  this.#data[i] = val;
}`,
        typescript: `insert(i: number, val: T): void {
  this.#data.splice(i, 0, val); // O(n)
}

insertManual(i: number, val: T): void {
  this.#data.push(null as unknown as T);
  for (let j = this.#data.length - 1; j > i; j--) {
    this.#data[j] = this.#data[j - 1];
  }
  this.#data[i] = val;
}`,
      },
      visualization: {
        type: 'array',
        array: [10, '→', 20, 30, 40, 50],
        highlighted: [1],
        pointers: [{ index: 1, label: 'insert here', color: 'text-yellow-400' }],
      },
      complexity: { time: 'O(n) worst case, O(1) amortized at end', space: 'O(1)' },
      callout: {
        type: 'insight',
        text: 'Appending to the end is the fast path. Inserting anywhere else pays the shifting cost — this is the array list\'s main weakness.',
      },
    },
    {
      title: 'Delete at Index',
      explanation:
        'Deleting at index i requires shifting every element from index i+1 onward one position to the left to fill the gap.\n\nSame asymmetry as insert: deleting the first element is O(n); deleting the last is O(1).',
      code: {
        python: `def delete(self, i: int):
    val = self._data[i]
    del self._data[i]       # O(n) — Python shifts internally
    return val

# Manual version:
def delete_manual(self, i: int):
    val = self._data[i]
    for j in range(i, len(self._data) - 1):
        self._data[j] = self._data[j + 1]   # shift left
    self._data.pop()
    return val`,
        java: `public T delete(int i) {
    T val = (T) data[i];
    for (int j = i; j < size - 1; j++) {
        data[j] = data[j + 1];   // shift left
    }
    data[size - 1] = null;       // avoid memory leak
    size--;
    return val;
}`,
        javascript: `delete(i) {
  return this.#data.splice(i, 1)[0]; // O(n)
}

deleteManual(i) {
  const val = this.#data[i];
  for (let j = i; j < this.#data.length - 1; j++) {
    this.#data[j] = this.#data[j + 1];
  }
  this.#data.pop();
  return val;
}`,
        typescript: `delete(i: number): T {
  return this.#data.splice(i, 1)[0]; // O(n)
}

deleteManual(i: number): T {
  const val = this.#data[i];
  for (let j = i; j < this.#data.length - 1; j++) {
    this.#data[j] = this.#data[j + 1];
  }
  this.#data.pop();
  return val;
}`,
      },
      visualization: {
        type: 'array',
        array: [10, 30, 40, 50, '—'],
        highlighted: [1, 2, 3],
        pointers: [{ index: 0, label: '20 deleted', color: 'text-red-400' }],
      },
      complexity: { time: 'O(n) worst case, O(1) at end', space: 'O(1)' },
    },
    {
      title: 'Complexity Summary',
      explanation:
        'Array-Based List Complexities:\n\n  Operation          Time         Notes\n  ─────────────────────────────────────────\n  Access (get/set)   O(1)         Direct index calculation\n  Search             O(n)         Linear scan\n  Insert at end      O(1)*        Amortized; O(n) on resize\n  Insert at index    O(n)         Must shift elements right\n  Delete at end      O(1)         Decrement size\n  Delete at index    O(n)         Must shift elements left\n\n  * Amortized O(1): doubling the array on resize means each\n    element is moved only once on average across all appends.\n\n  Space: O(n) for n elements; up to 2x capacity due to doubling.',
      complexity: {
        time: 'O(1) access, O(n) insert/delete at arbitrary index',
        space: 'O(n)',
        note: 'Use when you need fast random access. Avoid for frequent mid-list insertions or deletions.',
      },
      callout: {
        type: 'interview',
        text: 'Python list, Java ArrayList, C++ vector, and JavaScript Array are all array-based lists. When you use arr[i], you\'re getting O(1) access. When you use arr.splice(0, 1) or list.remove(0) in a loop, you\'re paying O(n) per deletion.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Remove Duplicates from Sorted Array',
      url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Rotate Array',
      url: 'https://leetcode.com/problems/rotate-array/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default arrayList;
