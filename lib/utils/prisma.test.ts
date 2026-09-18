import { describe, expect, it, vi } from 'vitest';
import { loadPage } from './prisma';

describe('loadPage', () => {
  it('loads a page and calculates pagination metadata', async () => {
    const findMany = vi.fn(async () => ['one', 'two', 'three']);
    const count = vi.fn(async () => 8);
    const model = { findMany, count };
    const where = { owner: 'Jujulego' };

    const result = await loadPage(model, { skip: 2, take: 3, where });

    expect(result).toEqual({
      items: ['one', 'two', 'three'],
      isLast: false,
      pageCount: 3,
      totalCount: 8,
    });
    expect(findMany).toHaveBeenCalledExactlyOnceWith({ skip: 2, take: 3, where });
    expect(count).toHaveBeenCalledExactlyOnceWith({ where });
  });

  it('marks an exact final page as last', async () => {
    const findMany = vi.fn(async () => ['four', 'five']);
    const count = vi.fn(async () => 5);
    const model = { findMany, count };

    const result = await loadPage(model, { skip: 3, take: 2 });

    expect(result).toEqual({
      items: ['four', 'five'],
      isLast: true,
      pageCount: 3,
      totalCount: 5,
    });
    expect(findMany).toHaveBeenCalledExactlyOnceWith({ skip: 3, take: 2 });
    expect(count).toHaveBeenCalledExactlyOnceWith({ where: undefined });
  });

  it('handles an omitted skip value', async () => {
    const findMany = vi.fn(async () => ['first']);
    const count = vi.fn(async () => 4);
    const model = { findMany, count };

    const result = await loadPage(model, { take: 1 });

    expect(result.isLast).toBe(false);
    expect(result.pageCount).toBe(4);
    expect(result.totalCount).toBe(4);
    expect(findMany).toHaveBeenCalledExactlyOnceWith({ take: 1 });
  });

  it('handles an empty page with no matching items', async () => {
    const findMany = vi.fn(async () => []);
    const count = vi.fn(async () => 0);
    const model = { findMany, count };

    const result = await loadPage(model, { take: 10, where: { state: 'OPEN' } });

    expect(result).toEqual({
      items: [],
      isLast: true,
      pageCount: 0,
      totalCount: 0,
    });
  });
});
