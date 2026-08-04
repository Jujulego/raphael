# Raphael - Agents & Handlers

This document describes the event handlers and background agents in the Raphael application. Raphael is a GitHub App that syncs and tracks repository data using webhooks and scheduled synchronization.

## Overview

Raphael consists of two main processing systems:

1. **Webhook Handlers** - React to real-time GitHub events
2. **Cron Jobs** - Periodically synchronize repository state

All handlers integrate with Prisma for data persistence and Next.js for request/response handling.

## Webhook Handlers

Webhook handlers process GitHub App events in real-time. They are located in `lib/github/webhooks/` and connected via `lib/github/octokit.webhooks.ts`.

### Installation Events

#### `installation.created`
**Path:** `lib/github/webhooks/installation.created.ts`

**Triggered:** When the GitHub App is installed on a user account or organization

**Responsibilities:**
- Create an installation record in the database
- Fetch details for all repositories the app was granted access to using `getRepository()`
- Create or connect repository records in the database
- Link repositories to the installation

**Key Data:**
- Installation ID
- Repository counts, push timestamps, issue counts

**Cache Invalidation:** Revalidates `repositories` tag

---

#### `installation.deleted`
**Path:** `lib/github/webhooks/installation.deleted.ts`

**Triggered:** When the GitHub App is uninstalled

**Responsibilities:**
- Delete the installation record from the database (likely cascading to related repositories)
- Clean up any associated data

**Cache Invalidation:** Revalidates `repositories` tag

---

### Repository Events

#### `issues`
**Path:** `lib/github/webhooks/issues.ts`

**Triggered:** When an issue is opened, closed, reopened, or edited

**Responsibilities:**
- Extract repository information from the webhook payload
- Update the repository's `issueCount` and `pushedAt` timestamp in the database
- Ensure data freshness after issue activity

**Payload Processing:**
- Repository full name → owner + name split
- Open issues count from GitHub
- Pushed at timestamp conversion using dayjs

**Cache Invalidation:** Revalidates `repositories` tag

---

#### `installation_repositories`
**Path:** `lib/github/webhooks/installation-repositories.ts`

**Triggered:** When repository access changes (repositories added or removed from app permissions)

**Responsibilities:**
- Handle new repositories added to installation permissions
- Handle repositories removed from installation permissions
- Update the database associations

---

### Pull Request Events

#### `pull_request.opened` / `pull_request.reopened`
**Path:** `lib/github/webhooks/pull-request.opened.ts`

**Triggered:** When a pull request is created or reopened

**Responsibilities:**
- Update pull request count for the repository
- Maintain repository state based on PR activity

---

#### `pull_request.closed`
**Path:** `lib/github/webhooks/pull-request.closed.ts`

**Triggered:** When a pull request is closed (merged or abandoned)

**Responsibilities:**
- Update pull request count for the repository
- Process any associated state changes

---

## Background Jobs (Cron)

### Synchronization Agent

**Path:** `app/api/cron/synchronize/route.ts`

**Schedule:** Daily at 00:00 UTC (configurable via `crontab` value: `0 0 * * *`)

**Type:** Scheduled Background Job

**Responsibilities:**
- Iterate through all repositories accessible to the GitHub App across all installations
- Fetch current repository state from GitHub
- Upsert repository records in the database
- Update pull request counts for repositories where the push timestamp changed
- Maintain eventual consistency with GitHub's current state

**Key Features:**
- Uses `app.eachRepository.iterator()` to batch fetch repositories
- Executes GraphQL query to fetch open PR count
- Span-based performance tracking via Sentry
- Error handling with `.catch(() => {})` to prevent job failures
- 15-minute maximum runtime enforcement
- 60-second check-in margin for Vercel Cron monitoring

**Cache Invalidation:** Revalidates `repositories` tag after all updates

**GraphQL Query:** `SynchronizeRepository` - Fetches open PR count for a repository

---

## Request Handlers

### GitHub Webhook Endpoint

**Path:** `app/api/github/webhook/route.ts`

**Method:** POST

**Responsibilities:**
- Validate GitHub webhook signature (`X-Hub-Signature-256`)
- Extract event metadata (delivery ID, event name, action)
- Route to appropriate webhook handler
- Provide Sentry tracing for event processing
- Return appropriate HTTP responses

**Security:**
- Validates webhook secret from environment
- Verifies HMAC signature of payload
- Rejects unsigned or invalid requests with 401/400 responses

**Error Handling:**
- Missing headers → 400 Bad Request
- Invalid signature → 401 Unauthorized
- Valid event → Async processing with Sentry span

---

## Data Integration

### GraphQL Queries

**Repository Query** (`lib/github/repositories/get-repository.ts`)
- Fetches repository metadata
- Returns: `nameWithOwner`, `pushedAt`, open issues count, open PR count

**Synchronize Repository Query** (`app/api/cron/synchronize/route.ts`)
- Fetches open PR count for a specific repository
- Lightweight query for state checking

### Prisma Models

- `Installation` - GitHub App installation record
- `Repository` - Repository metadata
- `RepositoriesOnInstallations` - Junction table for Many-to-Many relationship

---

## Error Handling & Monitoring

### Sentry Integration
- All webhook events wrapped in `startSpan()` for performance tracking
- Span names: `github.event`, `synchronize repository {owner}/{name}`
- Event attributes: ID, name, action
- Automatic error reporting on handler failures

### Graceful Degradation
- Cron job errors don't fail the entire batch (`.catch(() => {})`)
- Webhook errors logged but don't block response

---

## Cache Management

All handlers and jobs revalidate the `repositories` tag after updates. This ensures:
- Next.js cache is invalidated when repository data changes
- Fresh data served to users on subsequent requests
- Consistent state across application

---

## Environment Variables

Required for proper operation:

```bash
GITHUB_APP_ID          # Octokit App ID
GITHUB_PRIVATE_KEY     # Octokit App private key
GITHUB_CLIENT_ID       # OAuth client ID
GITHUB_CLIENT_SECRET   # OAuth client secret
GITHUB_WEBHOOK_SECRET  # Webhook payload signature secret
```

---

## Deployment Notes

1. **Webhook Delivery:** Configure GitHub App webhook URL to point to `/api/github/webhook`
2. **Cron Scheduling:** Use Vercel Cron or equivalent to trigger `/api/cron/synchronize`
3. **Permissions:** App requires `read:repository` and webhook access to configured events
4. **Monitoring:** Check Sentry dashboard for event processing performance and errors

