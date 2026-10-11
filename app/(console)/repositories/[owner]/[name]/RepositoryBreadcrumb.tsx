export default async function RepositoryBreadcrumb({
  className,
  content,
}: RepositoryBreadcrumbProps) {
  return <p className={className}>{await content}</p>;
}

export interface RepositoryBreadcrumbProps {
  readonly className?: string;
  readonly content: Promise<string>;
}
