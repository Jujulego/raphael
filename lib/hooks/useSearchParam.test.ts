import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchParam } from './useSearchParam';

const { replace } = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

describe('useSearchParam', () => {
  beforeEach(() => {
    replace.mockReset();
    window.history.replaceState({}, '', '/repositories?keep=value&sort=name');
  });

  it('returns the current value for the named search parameter', () => {
    const { result } = renderHook(() => useSearchParam('sort'));

    expect(result.current[0]).toBe('name');
  });

  it('returns undefined when the named search parameter is missing', () => {
    const { result } = renderHook(() => useSearchParam('page'));

    expect(result.current[0]).toBeUndefined();
  });

  it('sets the parameter while preserving other search parameters', () => {
    const { result } = renderHook(() => useSearchParam('sort'));

    result.current[1]('date');

    const url = new URL(replace.mock.calls[0][0]);
    expect(url.searchParams.get('sort')).toBe('date');
    expect(url.searchParams.get('keep')).toBe('value');
  });

  it('removes the parameter when the setter receives no value', () => {
    const { result } = renderHook(() => useSearchParam('sort'));

    result.current[1]();

    const url = new URL(replace.mock.calls[0][0]);
    expect(url.searchParams.has('sort')).toBe(false);
    expect(url.searchParams.get('keep')).toBe('value');
  });
});
