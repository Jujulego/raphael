-- @param {String} $1:repositoryOwner - The owner of the repository
-- @param {String} $2:repositoryName - The name of the repository
-- @param {DateTime} $3:startDate - The start date for filtering pull requests

SELECT COUNT(*)::INT AS "added", pr."createdAt"::DATE
FROM "PullRequest" pr
WHERE pr."repositoryOwner" = $1
  AND pr."repositoryName" = $2
  AND pr."createdAt" >= $3
GROUP BY pr."createdAt"::DATE
ORDER BY pr."createdAt"::DATE DESC;