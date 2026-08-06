// Types
export interface PullRequestData {
  readonly repositoryOwner: string;
  readonly repositoryName: string;
  readonly number: number;
  readonly title: string;
  readonly state: string;
  readonly author: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
