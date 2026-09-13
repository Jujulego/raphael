import { describe, it, expect } from 'vitest';
import { count$ } from './count$';

describe('count$ generator', () => {
  it('yields values from start (inclusive) to end (exclusive)', () => {
    expect([...count$(0, 3)]).toEqual([0, 1, 2]);
  });

  it('yields an empty sequence when start >= end', () => {
    expect([...count$(3, 3)]).toEqual([]);
    expect([...count$(5, 2)]).toEqual([]);
  });

  it('works with negative start values', () => {
    expect([...count$(-2, 2)]).toEqual([-2, -1, 0, 1]);
  });

  it('is end-exclusive', () => {
    expect([...count$(0, 1)]).toEqual([0]);
    expect([...count$(0, 0)]).toEqual([]);
  });

  it('increments by 1 even for non-integer start values', () => {
    // start=1.5 will yield 1.5, 2.5, 3.5 (4.5 is not yielded because end is exclusive)
    expect([...count$(1.5, 4.5)]).toEqual([1.5, 2.5, 3.5]);
  });
});
