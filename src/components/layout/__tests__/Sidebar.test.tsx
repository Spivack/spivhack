// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import type { Category } from '../../../types';

// Framer Motion throws in jsdom without layout; mock it to pass-through
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <aside {...props}>{children}</aside>,
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => <ul {...props}>{children}</ul>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockCategories: Category[] = [
  {
    id: 'sorting',
    title: 'Sorting',
    icon: '⬆️',
    description: 'Sorting algorithms',
    topics: [
      { id: 'bubble-sort', title: 'Bubble Sort', description: '', difficulty: 'beginner', category: 'sorting', tags: [], steps: [] },
    ],
  },
];

function renderSidebar(isOpen: boolean) {
  return render(
    <MemoryRouter>
      <Sidebar categories={mockCategories} isOpen={isOpen} onClose={vi.fn()} />
    </MemoryRouter>
  );
}

describe('Sidebar layout', () => {
  it('desktop aside is always in the DOM regardless of isOpen', () => {
    const { container: closed } = renderSidebar(false);
    const { container: open } = renderSidebar(true);

    // The static desktop <aside> (hidden lg:block) should always be present
    const asides = (c: HTMLElement) => c.querySelectorAll('aside');
    expect(asides(closed).length).toBeGreaterThanOrEqual(1);
    expect(asides(open).length).toBeGreaterThanOrEqual(1);
  });

  it('desktop aside is present even when isOpen is false', () => {
    const { container } = renderSidebar(false);
    // At least one aside must exist even when the mobile drawer is closed
    expect(container.querySelector('aside')).not.toBeNull();
  });

  it('mobile drawer is NOT rendered when isOpen is false', () => {
    const { container } = renderSidebar(false);
    // Only 1 aside (the desktop one); mobile drawer is absent
    expect(container.querySelectorAll('aside').length).toBe(1);
  });

  it('mobile drawer IS rendered when isOpen is true', () => {
    const { container } = renderSidebar(true);
    // 2 asides: desktop static + mobile animated
    expect(container.querySelectorAll('aside').length).toBe(2);
  });

  it('topic links are present in the desktop sidebar regardless of isOpen', () => {
    const { getAllByText } = renderSidebar(false);
    expect(getAllByText('Bubble Sort').length).toBeGreaterThan(0);
  });
});
