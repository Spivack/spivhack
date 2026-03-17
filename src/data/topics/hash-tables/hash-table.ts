import type { Topic } from '../../../types';

const hashTable: Topic = {
  id: 'hash-table',
  title: 'Hash Tables',
  description:
    'Maps keys to values in O(1) average time using a hash function to convert keys into array indices. The most important data structure for lookup-heavy problems. Powers Python dicts, Java HashMaps, and JavaScript objects.',
  difficulty: 'intermediate',
  category: 'hash-tables',
  tags: ['hash-table', 'hash-map', 'O(1)', 'collision', 'key-value'],
  steps: [
    {
      title: 'The Problem: O(1) Lookup',
      explanation:
        'Arrays give O(1) access by index. But what if your keys are strings, arbitrary integers, or objects — not sequential indices?\n\nA hash table solves this by converting any key into an array index using a hash function:\n  key → hash function → index → array slot\n\nLook up "alice" → hash("alice") → 42 → arr[42]\n\nThis achieves O(1) average-case for insert, delete, and lookup — regardless of the key type.',
      visualization: {
        type: 'array',
        array: ['', 'bob→99', '', '', 'alice→42', '', 'carol→77', ''],
        pointers: [
          { index: 1, label: 'hash("bob")=1', color: 'text-green-400' },
          { index: 4, label: 'hash("alice")=4', color: 'text-yellow-400' },
          { index: 6, label: 'hash("carol")=6', color: 'text-blue-400' },
        ],
      },
    },
    {
      title: 'Hash Functions',
      explanation:
        'A hash function maps a key to an integer index in [0, capacity).\n\nProperties of a good hash function:\n  • Deterministic: same key always produces the same index\n  • Uniform: keys spread evenly across the array (minimizes collisions)\n  • Fast: O(1) to compute\n\nSimple example for strings:\n  sum the ASCII values of each character, then mod by array capacity.\n\nIn practice, use polynomial rolling hash or language built-ins (Python\'s hash(), Java\'s hashCode()) — they\'re well-tested.\n\nThe modulo operation keeps the index in bounds:\n  index = hash(key) % capacity',
      code: {
        python: `def simple_hash(key: str, capacity: int) -> int:
    total = 0
    for char in key:
        total += ord(char)       # sum ASCII values
    return total % capacity      # fit into array bounds

# simple_hash("hello", 10) → (104+101+108+108+111) % 10 = 532 % 10 = 2

# Python's built-in hash is much better — use it:
index = hash("hello") % capacity`,
        java: `private int hash(String key) {
    // Java's String.hashCode() uses polynomial rolling:
    // s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
    return Math.abs(key.hashCode()) % capacity;
}`,
        javascript: `// No built-in hash in JS — use a djb2-style function:
function hash(key, capacity) {
  let h = 5381;
  for (let i = 0; i < key.length; i++) {
    h = (h * 33) ^ key.charCodeAt(i);
  }
  return Math.abs(h) % capacity;
}`,
        typescript: `function hash(key: string, capacity: number): number {
  let h = 5381;
  for (let i = 0; i < key.length; i++) {
    h = (h * 33) ^ key.charCodeAt(i);
  }
  return Math.abs(h) % capacity;
}`,
      },
    },
    {
      title: 'Collision Resolution: Chaining',
      explanation:
        'Two different keys can hash to the same index — this is a collision.\n  hash("abc") = 4 and hash("xyz") = 4? They collide.\n\nChaining (open hashing): each array slot holds a linked list of all key-value pairs that hash to that index.\n\n  arr[4] → [(abc, val1)] → [(xyz, val2)] → null\n\nTo get "abc": go to arr[4], then scan the linked list for key=="abc".\n\nWith a good hash function and low load factor, chains are short (average length ≈ 1), keeping operations O(1).\n\nWorst case: all keys hash to the same slot → O(n) chain → O(n) lookup.',
      code: {
        python: `class HashTable:
    def __init__(self, capacity=16):
        self.capacity = capacity
        self.buckets = [[] for _ in range(capacity)]  # list of lists
        self.size = 0

    def _hash(self, key):
        return hash(key) % self.capacity

    def put(self, key, val):
        idx = self._hash(key)
        for pair in self.buckets[idx]:
            if pair[0] == key:     # update existing key
                pair[1] = val
                return
        self.buckets[idx].append([key, val])
        self.size += 1

    def get(self, key):
        idx = self._hash(key)
        for pair in self.buckets[idx]:
            if pair[0] == key:
                return pair[1]
        return None`,
        java: `public class HashTable<K, V> {
    private List<List<Object[]>> buckets;
    private int capacity;

    public HashTable(int capacity) {
        this.capacity = capacity;
        buckets = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) buckets.add(new ArrayList<>());
    }

    private int hash(K key) {
        return Math.abs(key.hashCode()) % capacity;
    }

    public void put(K key, V val) {
        int idx = hash(key);
        for (Object[] pair : buckets.get(idx)) {
            if (pair[0].equals(key)) { pair[1] = val; return; }
        }
        buckets.get(idx).add(new Object[]{key, val});
    }

    @SuppressWarnings("unchecked")
    public V get(K key) {
        int idx = hash(key);
        for (Object[] pair : buckets.get(idx))
            if (pair[0].equals(key)) return (V) pair[1];
        return null;
    }
}`,
        javascript: `class HashTable {
  #buckets;
  #capacity;

  constructor(capacity = 16) {
    this.#capacity = capacity;
    this.#buckets = Array.from({ length: capacity }, () => []);
  }

  #hash(key) {
    let h = 5381;
    for (let i = 0; i < key.length; i++) h = (h * 33) ^ key.charCodeAt(i);
    return Math.abs(h) % this.#capacity;
  }

  put(key, val) {
    const idx = this.#hash(key);
    const pair = this.#buckets[idx].find(([k]) => k === key);
    if (pair) pair[1] = val;
    else this.#buckets[idx].push([key, val]);
  }

  get(key) {
    const idx = this.#hash(key);
    return this.#buckets[idx].find(([k]) => k === key)?.[1] ?? null;
  }
}`,
        typescript: `class HashTable<K extends string, V> {
  #buckets: [K, V][][];
  #capacity: number;

  constructor(capacity = 16) {
    this.#capacity = capacity;
    this.#buckets = Array.from({ length: capacity }, () => []);
  }

  #hash(key: K): number {
    let h = 5381;
    for (let i = 0; i < key.length; i++) h = (h * 33) ^ key.charCodeAt(i);
    return Math.abs(h) % this.#capacity;
  }

  put(key: K, val: V): void {
    const idx = this.#hash(key);
    const pair = this.#buckets[idx].find(([k]) => k === key);
    if (pair) pair[1] = val;
    else this.#buckets[idx].push([key, val]);
  }

  get(key: K): V | null {
    const idx = this.#hash(key);
    return this.#buckets[idx].find(([k]) => k === key)?.[1] ?? null;
  }
}`,
      },
      complexity: { time: 'O(1) average, O(n) worst case', space: 'O(n)' },
    },
    {
      title: 'Collision Resolution: Open Addressing',
      explanation:
        'Open addressing (closed hashing): all entries live in the array itself — no linked lists.\n\nOn collision, probe for the next open slot.\n\nLinear probing: if slot i is taken, try i+1, i+2, i+3, ...\n  Pros: cache-friendly, simple\n  Cons: clustering — filled slots clump together, slowing future probes\n\nQuadratic probing: try i+1², i+2², i+3², ...\n  Reduces clustering but can miss slots\n\nDouble hashing: use a second hash function for the step size\n  Best distribution, most complex\n\nDeletion is tricky — you can\'t just blank a slot (it would break probe chains). Use a "tombstone" marker instead.',
      callout: {
        type: 'insight',
        text: 'Python\'s dict uses open addressing with a sophisticated probing scheme. Java\'s HashMap uses chaining. Both achieve O(1) average — the difference shows up in memory usage and cache behavior.',
      },
    },
    {
      title: 'Load Factor and Resizing',
      explanation:
        'Load factor α = n / capacity (items stored / array slots)\n\nAs α increases, collisions increase and performance degrades:\n  α < 0.5: collisions rare, O(1) practically\n  α = 0.75: Java HashMap\'s default resize threshold — good balance\n  α → 1.0: many collisions, performance approaches O(n)\n\nWhen load factor exceeds the threshold, resize:\n  1. Allocate a new array (typically 2× size)\n  2. Rehash every existing key into the new array\n\nRehashing is O(n) but amortized O(1) per insertion (same logic as dynamic arrays).',
      complexity: {
        time: 'O(1) average for get/put/delete, O(n) amortized for resize',
        space: 'O(n)',
        note: 'The "average" assumes a good hash function and reasonable load factor.',
      },
      callout: {
        type: 'interview',
        text: '"Design a HashMap" is a classic interview problem. Walk through: array of buckets, hash function with mod, chaining for collisions, resize at load factor 0.75. That\'s the whole thing.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Two Sum',
      url: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Design HashMap',
      url: 'https://leetcode.com/problems/design-hashmap/',
      difficulty: 'easy',
      platform: 'leetcode',
    },
    {
      title: 'Group Anagrams',
      url: 'https://leetcode.com/problems/group-anagrams/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
    {
      title: 'LRU Cache',
      url: 'https://leetcode.com/problems/lru-cache/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default hashTable;
