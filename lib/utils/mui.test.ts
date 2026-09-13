import { describe, it, expect } from 'vitest';
import { mergeSx } from './mui';

describe('mergeSx', () => {
  it('returns an empty array when all args are undefined', () => {
    const result = mergeSx(undefined, undefined);
    expect(result).toEqual([]);
  });

  it('keeps single object as single-element array', () => {
    const a = { color: 'red' } as const;
    const result = mergeSx(a);
    expect(result).toEqual([a]);
  });

  it('flattens one level for array inputs and appends single objects', () => {
    const arr = [{ color: 'red' }, { bgcolor: 'blue' }];
    const obj = { display: 'block' };
    const result = mergeSx(arr, obj);
    expect(result).toEqual([...arr, obj]);
  });

  it('filters out undefined values amongst mixed inputs', () => {
    const a = { m: 1 };
    const b = [{ p: 2 }];
    const result = mergeSx(undefined, a, undefined, b, undefined);
    expect(result).toEqual([a, b[0]]);
  });
});
