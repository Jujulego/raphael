-- @param {String} $1:repositoryOwner - The owner of the repository
-- @param {String} $2:repositoryName - The name of the repository
-- @param {DateTime} $3:startDate - The start date for filtering pull requests
-- @param {DateTime} $4:endDate - The end date for filtering pull requests

SELECT date, sum(added)::INT as added, sum("closed")::INT as closed
FROM (
    SELECT date_trunc('hour', pr."createdAt") AS date, count(*)::INT AS added, 0 AS closed
    FROM "PullRequest" pr
    WHERE pr."repositoryOwner" = $1
      AND pr."repositoryName" = $2
      AND pr."createdAt" BETWEEN $3 AND $4
    GROUP BY date_trunc('hour', pr."createdAt")
UNION
    SELECT date_trunc('hour', pr."closedAt") AS date, 0 AS added, count(*)::INT AS closed
    FROM "PullRequest" pr
    WHERE pr."repositoryOwner" = $1
      AND pr."repositoryName" = $2
      AND pr."closedAt" BETWEEN $3 AND $4
    GROUP BY date_trunc('hour', pr."closedAt")) stats
GROUP BY date
ORDER BY date DESC;