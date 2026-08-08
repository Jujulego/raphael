// Types
export interface PullRequestData {
  readonly repositoryOwner: string;
  readonly repositoryName: string;
  readonly number: number;
  readonly title: string;
  readonly state: PullRequestState;
  readonly author: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export enum PullRequestState {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Merged = 'MERGED',
}

// Utils
export function mapToPullRequestState(state: string, merged = false): PullRequestState {
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
