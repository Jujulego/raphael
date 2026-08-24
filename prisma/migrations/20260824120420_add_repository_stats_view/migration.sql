CREATE VIEW "RepositoryStats" AS
    SELECT
        r.owner as "owner",
        r.name as "name",
        r."issueCount" as "issueCount",
        count(distinct pr."number") as "openPullRequestCount",
        r."pushedAt" as "pushedAt"
    FROM "Repository" r
        LEFT JOIN "PullRequest" pr ON r.owner = pr."repositoryOwner" AND r.name = pr."repositoryName" AND pr."state" = 'OPEN'
    GROUP BY r.owner, r.name, r."issueCount", r."pushedAt";