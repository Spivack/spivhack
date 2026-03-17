import type { Topic } from '../../../types';

const listAdt: Topic = {
  id: 'list-adt',
  title: 'The List ADT',
  description:
    'An Abstract Data Type defines what a structure does, not how it does it. The List ADT specifies the operations every list must support — allowing ArrayList and LinkedList to be interchangeable behind a common interface.',
  difficulty: 'beginner',
  category: 'lists-and-stacks',
  tags: ['list', 'ADT', 'abstraction', 'interface', 'data-structure'],
  steps: [
    {
      title: 'What Is an ADT?',
      explanation:
        'An Abstract Data Type (ADT) separates what a data structure does from how it does it.\n\nYou define:\n  • The operations it supports (the interface)\n  • The behavior each operation must have (the contract)\n\nYou leave out:\n  • Memory layout\n  • Implementation details\n  • Language specifics\n\nThis lets you swap implementations without changing any code that uses the list. Your sort function works on an ArrayList, a LinkedList, or a future SkipList — as long as all three satisfy the List ADT.',
      callout: {
        type: 'insight',
        text: 'ADTs are the foundation of polymorphism. Java\'s List<T> interface, Python\'s Sequence protocol, and C++ iterators are all examples of ADTs in practice.',
      },
    },
    {
      title: 'The List Interface',
      explanation:
        'A list is an ordered sequence of elements. Every List ADT implementation must support these core operations:\n\n  insert(i, val)   — insert val at position i; shift elements right\n  remove(i)        — remove element at position i; shift elements left\n  get(i)           — return element at position i\n  set(i, val)      — replace element at position i\n  size()           — return number of elements\n  clear()          — remove all elements\n\nThe list is zero-indexed. Elements have a defined order. Duplicates are allowed.',
      code: {
        python: `from abc import ABC, abstractmethod
from typing import TypeVar, Generic

T = TypeVar('T')

class List(ABC, Generic[T]):
    @abstractmethod
    def insert(self, i: int, val: T) -> None: ...

    @abstractmethod
    def remove(self, i: int) -> T: ...

    @abstractmethod
    def get(self, i: int) -> T: ...

    @abstractmethod
    def set(self, i: int, val: T) -> None: ...

    @abstractmethod
    def size(self) -> int: ...

    @abstractmethod
    def clear(self) -> None: ...`,
        java: `public interface List<T> {
    void insert(int i, T val);
    T remove(int i);
    T get(int i);
    void set(int i, T val);
    int size();
    void clear();

    default boolean isEmpty() {
        return size() == 0;
    }
}`,
        typescript: `interface List<T> {
  insert(i: number, val: T): void;
  remove(i: number): T;
  get(i: number): T;
  set(i: number, val: T): void;
  size(): number;
  clear(): void;
}`,
        javascript: `// No formal interface in JS, but the contract is:
// insert(i, val), remove(i), get(i), set(i, val),
// size(), clear()
// Both ArrayList and LinkedList below satisfy this.`,
      },
    },
    {
      title: 'Two Implementations, One Interface',
      explanation:
        'ArrayList and LinkedList both satisfy the List ADT but have completely different performance profiles:\n\n  Operation        ArrayList     LinkedList\n  ──────────────────────────────────────────\n  get(i)           O(1)          O(n)\n  set(i, val)      O(1)          O(n)\n  insert(0, val)   O(n)          O(1)\n  insert(n, val)   O(1)*         O(1)†\n  insert(i, val)   O(n)          O(n)‡\n  remove(0)        O(n)          O(1)\n  remove(n)        O(1)          O(n)§\n  size()           O(1)          O(1)\n\n  * Amortized — occasional resize\n  † With tail pointer\n  ‡ O(n) to reach position, then O(1) to rewire\n  § O(n) for singly linked; O(1) for doubly linked',
      callout: {
        type: 'interview',
        text: 'In most real-world code, ArrayList wins. CPU cache lines load contiguous memory efficiently — pointer chasing in a LinkedList causes cache misses that dominate the theoretical O(1) advantage.',
      },
    },
    {
      title: 'Choosing an Implementation',
      explanation:
        'Use ArrayList when:\n  • You need random access (get/set by index) frequently\n  • You mostly append to the end\n  • Memory efficiency matters\n  • You\'re iterating sequentially (cache-friendly)\n\nUse LinkedList when:\n  • You insert/delete at the front constantly\n  • You\'re building a queue or deque\n  • Node-level operations dominate over indexed access\n  • You explicitly need O(1) head/tail operations\n\nIn practice: default to ArrayList. Switch to LinkedList only when profiling proves it\'s the right call.',
      callout: {
        type: 'tip',
        text: 'Python\'s list is an ArrayList (dynamic array). Java\'s ArrayList and LinkedList both implement List<T>. JavaScript\'s Array is also dynamic. Most languages give you the ArrayList behavior by default.',
      },
    },
  ],
  practiceProblems: [
    {
      title: 'Design Linked List',
      url: 'https://leetcode.com/problems/design-linked-list/',
      difficulty: 'medium',
      platform: 'leetcode',
    },
  ],
};

export default listAdt;
