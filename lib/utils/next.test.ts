import { describe, it, expect } from 'vitest';
import type { RouteSearchParams } from './next';
import { getSearchParam } from './next';

describe('getSearchParam', () => {
  it('returns null when searchParams is undefined', async () => {
    const result = await getSearchParam(undefined, 'foo');
    expect(result).toBeNull();
  });

  it('returns the string value when present', async () => {
    const params: RouteSearchParams = Promise.resolve({ foo: 'bar' });
    const result = await getSearchParam(params, 'foo');
    expect(result).toBe('bar');
  });

  it('returns the first element when value is an array', async () => {
    const params: RouteSearchParams = Promise.resolve({ q: ['one', 'two'] });
    const result = await getSearchParam(params, 'q');
    expect(result).toBe('one');
  });

  it('returns null when the param is missing or undefined', async () => {
    const params: RouteSearchParams = Promise.resolve({});
    const result = await getSearchParam(params, 'missing');
    expect(result).toBeNull();

    const params2: RouteSearchParams = Promise.resolve({ foo: undefined });
    const result2 = await getSearchParam(params2, 'foo');
    expect(result2).toBeNull();
  });

  it('returns empty string when the first array element is empty string', async () => {
    const params: RouteSearchParams = Promise.resolve({ empty: [''] });
    const result = await getSearchParam(params, 'empty');
    expect(result).toBe('');
  });
});
