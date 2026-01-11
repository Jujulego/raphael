import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Octokit } from '@octokit/core';
import { startSpan } from '@sentry/nextjs';
import { print } from 'graphql';

export function graphql<R>(
  octokit: Octokit,
  document: TypedDocumentNode<R, NoVariables>,
): Promise<R>;

export function graphql<R, V extends AnyVariables>(
  octokit: Octokit,
  document: TypedDocumentNode<R, V>,
  variables: V,
): Promise<R>;

export function graphql(
  octokit: Octokit,
  document: TypedDocumentNode<unknown, NoVariables>,
  variables?: AnyVariables,
): Promise<unknown> {
  const query = document.definitions.find((def) => def.kind === 'OperationDefinition');
  const queryName = query?.name?.value ?? '<unnamed>';
  const queryType = query?.operation ?? 'query';

  return startSpan(
    {
      op: 'graphql',
      name: queryName,
      attributes: {
        'graphql.type': queryType,
        'graphql.variables': variables && JSON.stringify(variables),
      },
    },
    async () => await octokit.graphql(print(document), variables),
  );
}

type NoVariables = Record<string, never>;
type AnyVariables = Record<string, unknown>;
