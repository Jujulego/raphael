import { PullRequestState } from '@/lib/prisma/enums';

export function splitRepositoryFullName(fullName: string) {
  const [owner, name] = fullName.split('/');
  return { owner, name };
}

export function parseGithubPRState(state: string, merged = false): PullRequestState {
  if (merged) {
    return PullRequestState.MERGED;
  }

  const stateMap: Record<string, PullRequestState> = {
    open: PullRequestState.OPEN,
    closed: PullRequestState.CLOSED,
    merged: PullRequestState.MERGED,
  };

  return stateMap[state.toLowerCase()] ?? PullRequestState.CLOSED;
}
