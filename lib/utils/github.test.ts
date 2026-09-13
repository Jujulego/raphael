import { PullRequestState } from '@/lib/prisma/enums';
import { describe, expect, it } from 'vitest';
import { parseGithubPRState, splitRepositoryFullName } from './github';

describe('splitRepositoryFullName', () => {
  it('should return owner and name from fullName string', () => {
    expect(splitRepositoryFullName('owner/repository')).toEqual({
      owner: 'owner',
      name: 'repository',
    });
  });
});

describe('parseGithubPRState', () => {
  it('should return open state', () => {
    expect(parseGithubPRState('Open')).toStrictEqual(PullRequestState.OPEN);
  });

  it('should return merged state', () => {
    expect(parseGithubPRState('Merged')).toStrictEqual(PullRequestState.MERGED);
  });

  it('should return closed state', () => {
    expect(parseGithubPRState('Closed')).toStrictEqual(PullRequestState.CLOSED);
  });

  it('should fallback to closed state', () => {
    expect(parseGithubPRState('toto')).toStrictEqual(PullRequestState.CLOSED);
  });

  it('should ignore string if merged is true', () => {
    expect(parseGithubPRState('Open', true)).toStrictEqual(PullRequestState.MERGED);
  });
});
