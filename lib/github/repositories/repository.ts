// Types
export interface RepositoryData {
  readonly owner: string;
  readonly name: string;
  readonly pushedAt: string | null;
  readonly issueCount: number;
  readonly pullRequestCount: number;
}
