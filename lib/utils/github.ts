import { PullRequestState } from '@/lib/github/data/pull-request-state';

export function splitRepositoryFullName(fullName: string) {
  const [owner, name] = fullName.split('/');
  return { owner, name };
}

export function parseGithubPRState(state: string, merged = false): PullRequestState {
  if (merged) {
    return PullRequestState.Merged;
  }

  const stateMap: Record<string, PullRequestState> = {
    open: PullRequestState.Open,
    closed: PullRequestState.Closed,
    merged: PullRequestState.Merged,
  };

  return stateMap[state.toLowerCase()] ?? PullRequestState.Closed;
}
