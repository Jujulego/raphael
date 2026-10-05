-- @param {String} $1:repositoryOwner - The owner of the repository
-- @param {String} $2:repositoryName - The name of the repository
-- @param {DateTime} $3:startDate - The start date for filtering pull requests

SELECT date, sum(added)::INT as added, sum("closed")::INT as closed
FROM (
    SELECT pr."createdAt"::DATE AS date, count(*)::INT AS added, 0 AS closed
    FROM "PullRequest" pr
    WHERE pr."repositoryOwner" = $1
      AND pr."repositoryName" = $2
      AND pr."createdAt" >= $3
    GROUP BY pr."createdAt"::DATE
UNION
    SELECT pr."closedAt"::DATE AS date, 0 AS added, count(*)::INT AS closed
    FROM "PullRequest" pr
    WHERE pr."repositoryOwner" = $1
      AND pr."repositoryName" = $2
      AND pr."createdAt" >= $3
      AND pr."closedAt" IS NOT NULL
    GROUP BY pr."closedAt"::DATE) stats
GROUP BY date
ORDER BY date DESC;