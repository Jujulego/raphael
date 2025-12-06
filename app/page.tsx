'use client';

import type { UserQuery, UserQueryVariables } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import gql from 'graphql-tag';

const QUERY: TypedDocumentNode<UserQuery, UserQueryVariables> = gql`
  query User {
    user(login: "Jujulego") {
      id
      createdAt
      updatedAt
      avatarUrl
      login
      name
      url
      repositories(last: 10) {
        totalCount
        totalDiskUsage
        nodes {
          archivedAt
          createdAt
          description
          descriptionHTML
          diskUsage
          homepageUrl
          id
          isArchived
          isDisabled
          isTemplate
          mirrorUrl
          name
          nameWithOwner
          pushedAt
          shortDescriptionHTML
          sshUrl
          updatedAt
          url
          visibility
          issues(states: [OPEN]) {
            totalCount
          }
          pullRequests(states: [OPEN]) {
            totalCount
          }
        }
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(QUERY);

  return (
    <pre>
      <code>{JSON.stringify({ loading, error, data }, null, 2)}</code>
    </pre>
  );
}
