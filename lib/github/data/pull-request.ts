import { PullRequestState } from '@/lib/github/data/pull-request-state';

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
