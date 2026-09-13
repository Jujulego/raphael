export enum PullRequestState {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Merged = 'MERGED',
}

// Utils
export function ghStateToPullRequestState(state: string, merged = false): PullRequestState {
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
