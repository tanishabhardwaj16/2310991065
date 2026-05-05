# Stage 1

## Notification System — REST API Design & Contract

---

## Base URL

```
http://localhost:5000/api/v1
```

---

## Authentication

All endpoints (except Auth) require a Bearer token in the request header.

```
Authorization: Bearer <token>
```

---

## Core Actions Supported

| Action | Description |
|--------|-------------|
| Register / Login | User authentication |
| Get Notifications | Fetch all notifications for logged-in user |
| Get Single Notification | Fetch one notification by ID |
| Create Notification | Send a new notification to a user |
| Mark as Read | Mark one notification as read |
| Mark All as Read | Mark all notifications as read for a user |
| Delete Notification | Remove a notification |
| Get Unread Count | Fetch count of unread notifications |

---

## Endpoints

---

### 1. Auth — Login

**POST** `/auth/login`

#### Request Headers
```json
{
  "Content-Type": "application/json"
}
```

#### Request Body
```json
{
  "email": "john@university.edu",
  "password": "yourpassword"
}
```

#### Response — 200 OK
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_01",
    "name": "John Doe",
    "email": "john@university.edu"
  }
}
```

#### Response — 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 2. Get All Notifications

Fetch all notifications for the currently logged-in user.

**GET** `/notifications`

#### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Query Parameters (optional)

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `status` | string | `read` or `unread` |
| `type` | string | `email`, `sms`, `push`, `in-app` |

#### Response — 200 OK
```json
{
  "success": true,
  "total": 45,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": "notif_01",
      "userId": "usr_01",
      "title": "Assignment Deadline Reminder",
      "message": "Your assignment is due tomorrow at 11:59 PM.",
      "type": "in-app",
      "priority": "high",
      "isRead": false,
      "createdAt": "2025-04-10T08:30:00.000Z"
    },
    {
      "id": "notif_02",
      "userId": "usr_01",
      "title": "New Message from Admin",
      "message": "The campus will be closed on Friday.",
      "type": "in-app",
      "priority": "medium",
      "isRead": true,
      "createdAt": "2025-04-09T14:00:00.000Z"
    }
  ]
}
```

#### Response — 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized. Token missing or invalid."
}
```

---

### 3. Get Single Notification

**GET** `/notifications/:id`

#### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Response — 200 OK
```json
{
  "success": true,
  "data": {
    "id": "notif_01",
    "userId": "usr_01",
    "title": "Assignment Deadline Reminder",
    "message": "Your assignment is due tomorrow at 11:59 PM.",
    "type": "in-app",
    "priority": "high",
    "isRead": false,
    "createdAt": "2025-04-10T08:30:00.000Z"
  }
}
```

#### Response — 404 Not Found
```json
{
  "success": false,
  "error": "Notification not found."
}
```

---

### 4. Create Notification

Send a new notification to a specific user.

**POST** `/notifications`

#### Request Headers
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

#### Request Body
```json
{
  "userId": "usr_02",
  "title": "Welcome to the Platform!",
  "message": "Hey John, your account has been set up successfully.",
  "type": "in-app",
  "priority": "low"
}
```

#### Field Reference

| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| `userId` | string | ✅ | any valid user ID |
| `title` | string | ✅ | max 100 chars |
| `message` | string | ✅ | max 500 chars |
| `type` | string | ✅ | `email`, `sms`, `push`, `in-app` |
| `priority` | string | ❌ | `low`, `medium`, `high`, `critical` (default: `medium`) |

#### Response — 201 Created
```json
{
  "success": true,
  "message": "Notification created successfully.",
  "data": {
    "id": "notif_09",
    "userId": "usr_02",
    "title": "Welcome to the Platform!",
    "message": "Hey John, your account has been set up successfully.",
    "type": "in-app",
    "priority": "low",
    "isRead": false,
    "createdAt": "2025-04-10T10:00:00.000Z"
  }
}
```

#### Response — 400 Bad Request
```json
{
  "success": false,
  "error": "userId and message are required fields."
}
```

---

### 5. Mark Single Notification as Read

**PATCH** `/notifications/:id/read`

#### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Response — 200 OK
```json
{
  "success": true,
  "message": "Notification marked as read.",
  "data": {
    "id": "notif_01",
    "isRead": true,
    "updatedAt": "2025-04-10T11:00:00.000Z"
  }
}
```

#### Response — 404 Not Found
```json
{
  "success": false,
  "error": "Notification not found."
}
```

---

### 6. Mark All Notifications as Read

**PATCH** `/notifications/read-all`

#### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Response — 200 OK
```json
{
  "success": true,
  "message": "All notifications marked as read.",
  "updatedCount": 12
}
```

---

### 7. Delete Notification

**DELETE** `/notifications/:id`

#### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Response — 200 OK
```json
{
  "success": true,
  "message": "Notification deleted successfully.",
  "deletedId": "notif_01"
}
```

#### Response — 404 Not Found
```json
{
  "success": false,
  "error": "Notification not found."
}
```

---

### 8. Get Unread Notification Count

Lightweight endpoint for the frontend notification badge/counter.

**GET** `/notifications/unread-count`

#### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Response — 200 OK
```json
{
  "success": true,
  "unreadCount": 7
}
```

---

## Polling Mechanism for Real-Time Updates

Since WebSockets add infrastructure complexity, this system uses **short polling** — the frontend periodically calls the unread count endpoint to check for new notifications.

### How It Works

```
Frontend                          Backend
   |                                 |
   |--- GET /notifications/unread-count -->|
   |<-- { unreadCount: 3 } ----------|
   |                                 |
   | (wait 15 seconds)               |
   |                                 |
   |--- GET /notifications/unread-count -->|
   |<-- { unreadCount: 5 } ----------|
   |  (2 new notifications!)         |
   |                                 |
   |--- GET /notifications ---------->|
   |<-- full notification list -------|
```

### Frontend Implementation (pseudo-code)

```js
// Poll every 15 seconds
setInterval(async () => {
  const res = await fetch("/api/v1/notifications/unread-count", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const { unreadCount } = await res.json();

  if (unreadCount > previousCount) {
    // Fetch updated notifications and refresh UI
    fetchNotifications();
  }

  previousCount = unreadCount;
}, 15000);
```

### Why Polling (not WebSockets)?
- Simpler to implement and deploy
- No persistent connection management needed
- Works reliably across all network conditions
- Sufficient for notification use cases (not latency-critical)

---

## Error Response Format (Standard)

All error responses follow the same structure:

```json
{
  "success": false,
  "error": "Human-readable error message here."
}
```

---

## HTTP Status Code Reference

| Code | Meaning |
|------|---------|
| 200 | OK — request succeeded |
| 201 | Created — resource created |
| 400 | Bad Request — invalid input |
| 401 | Unauthorized — missing/invalid token |
| 404 | Not Found — resource doesn't exist |
| 500 | Internal Server Error |

---

## Notification JSON Schema (Full)

```json
{
  "id":        "string   — unique notification ID (e.g. notif_01)",
  "userId":    "string   — ID of the recipient user",
  "title":     "string   — short notification title (max 100 chars)",
  "message":   "string   — full notification body (max 500 chars)",
  "type":      "string   — email | sms | push | in-app",
  "priority":  "string   — low | medium | high | critical",
  "isRead":    "boolean  — whether user has read this notification",
  "createdAt": "string   — ISO 8601 timestamp",
  "updatedAt": "string   — ISO 8601 timestamp (set on read/update)"
}
```

---

---

# Stage 2

## Persistent Storage — Database Design

---

## Database Choice: PostgreSQL (Relational / SQL)

### Why PostgreSQL?

The notification system has clearly structured, predictable data — every notification has the same fields (userId, title, message, type, priority, isRead, timestamps). This makes a relational database a natural fit.

PostgreSQL is chosen over other options for the following reasons:

**Structured & consistent data** — Notifications always follow the same schema. There are no variable or nested fields that would benefit from a document store like MongoDB.

**Relational integrity** — Notifications belong to users. Foreign key constraints in PostgreSQL enforce that a notification cannot exist for a non-existent user, preventing orphaned records at the database level.

**Powerful querying** — The REST APIs require filtering by `userId`, `isRead`, `type`, and sorting by `createdAt`. PostgreSQL handles these with simple, efficient SQL and supports composite indexes that make such queries fast even at scale.

**ACID compliance** — Operations like "mark all as read" update multiple rows atomically. PostgreSQL guarantees these updates either fully succeed or fully roll back, keeping data consistent.

**Scalability features built-in** — PostgreSQL natively supports table partitioning, partial indexes, and connection pooling (via PgBouncer), which directly address the scale problems discussed below.

**Wide ecosystem** — Works seamlessly with Node.js via `pg` or `Sequelize`, has excellent tooling, and is production-proven.

### Why NOT MongoDB (NoSQL)?

MongoDB would be a reasonable choice only if notification schemas varied wildly per user or notification type. Since our schema is fixed and we need JOIN-like queries between users and notifications, PostgreSQL gives better consistency guarantees and query flexibility.

---

## Database Schema

### Table: `users`

Stores registered users of the notification platform.

```sql
CREATE TABLE users (
  id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(255)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

---

### Table: `notifications`

Core table storing every notification sent on the platform.

```sql
CREATE TYPE notification_type     AS ENUM ('email', 'sms', 'push', 'in-app');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE notifications (
  id         UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID                  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(100)          NOT NULL,
  message    VARCHAR(500)          NOT NULL,
  type       notification_type     NOT NULL DEFAULT 'in-app',
  priority   notification_priority NOT NULL DEFAULT 'medium',
  is_read    BOOLEAN               NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);
```

---

### Indexes

Indexes are defined separately from the schema to make performance intent explicit.

```sql
-- Most frequent query: fetch all notifications for a user, newest first
CREATE INDEX idx_notifications_user_id_created_at
  ON notifications (user_id, created_at DESC);

-- Unread count query: filter by user + is_read = false
CREATE INDEX idx_notifications_user_id_is_read
  ON notifications (user_id, is_read);

-- Filter by type (e.g. GET /notifications?type=email)
CREATE INDEX idx_notifications_type
  ON notifications (type);
```

---

### Entity Relationship Diagram

```
┌─────────────────────┐          ┌──────────────────────────────────┐
│        users        │          │          notifications            │
├─────────────────────┤          ├──────────────────────────────────┤
│ id          UUID PK │◄────┐    │ id          UUID PK              │
│ name        VARCHAR │     └────│ user_id     UUID FK → users.id   │
│ email       VARCHAR │          │ title       VARCHAR(100)         │
│ password    VARCHAR │          │ message     VARCHAR(500)         │
│ created_at  TSTZ    │          │ type        ENUM                 │
└─────────────────────┘          │ priority    ENUM                 │
                                 │ is_read     BOOLEAN              │
                                 │ created_at  TSTZ                 │
                                 │ updated_at  TSTZ                 │
                                 └──────────────────────────────────┘
```

One user → many notifications (`1:N` relationship).  
Deleting a user cascades and removes all their notifications.

---

## Problems at Scale & Solutions

As data volume grows (millions of users, billions of notifications), the following problems emerge:

---

### Problem 1: Slow Queries on Large `notifications` Table

**What happens:** A full table scan on 500 million rows to fetch notifications for one user becomes unacceptably slow.

**Solution: Composite Indexes + Table Partitioning**

The composite index `(user_id, created_at DESC)` ensures that fetching a user's notifications never scans the full table — it jumps directly to that user's rows.

For extreme scale, partition the table by `created_at` month so each partition holds only one month of data:

```sql
CREATE TABLE notifications (
  id         UUID                  NOT NULL DEFAULT gen_random_uuid(),
  user_id    UUID                  NOT NULL,
  title      VARCHAR(100)          NOT NULL,
  message    VARCHAR(500)          NOT NULL,
  type       notification_type     NOT NULL DEFAULT 'in-app',
  priority   notification_priority NOT NULL DEFAULT 'medium',
  is_read    BOOLEAN               NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ           NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE notifications_2025_04 PARTITION OF notifications
  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');

CREATE TABLE notifications_2025_05 PARTITION OF notifications
  FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
```

Queries with a `created_at` filter only scan the relevant partition — ignoring all others entirely.

---

### Problem 2: Unread Count is Slow for Active Users

**What happens:** `SELECT COUNT(*) WHERE user_id = X AND is_read = FALSE` gets expensive when a user has 100,000+ notifications.

**Solution: Partial Index + Cached Counter**

A partial index on only unread rows makes the count query extremely fast:

```sql
CREATE INDEX idx_notifications_unread_only
  ON notifications (user_id)
  WHERE is_read = FALSE;
```

For very high traffic, store the unread count in a Redis cache and invalidate it only when a notification is created or marked as read — making the `/unread-count` endpoint an O(1) cache read instead of a DB query.

---

### Problem 3: "Mark All as Read" Locks Many Rows

**What happens:** `UPDATE notifications SET is_read = TRUE WHERE user_id = X` locks every unread row for that user simultaneously, blocking other queries.

**Solution: Batch Updates**

Update in batches of 500 rows at a time to reduce lock contention:

```sql
-- Run repeatedly until 0 rows affected
UPDATE notifications
SET    is_read = TRUE, updated_at = NOW()
WHERE  id IN (
  SELECT id FROM notifications
  WHERE  user_id = $1 AND is_read = FALSE
  LIMIT  500
);
```

---

### Problem 4: Old Notifications Bloat the Table

**What happens:** Notifications older than 90 days are rarely accessed but consume storage and slow down queries.

**Solution: Archival + Scheduled Cleanup**

Auto-delete notifications older than 90 days with a scheduled cron job:

```sql
DELETE FROM notifications
WHERE created_at < NOW() - INTERVAL '90 days';
```

With monthly partitioning (Problem 1), dropping an old partition is near-instant:

```sql
DROP TABLE notifications_2024_12;  -- removes an entire month instantly
```

---

### Problem 5: Too Many Concurrent DB Connections

**What happens:** At high traffic, each API request opens a DB connection. PostgreSQL struggles beyond ~200 concurrent connections.

**Solution: Connection Pooling via PgBouncer**

Route all app connections through PgBouncer in transaction pooling mode. The app thinks it has 1000 connections; PgBouncer multiplexes them into 50 real PostgreSQL connections — reducing memory pressure and improving throughput.

---

## SQL Queries (Mapped to Stage 1 REST APIs)

---

### 1. User Login — verify credentials

```sql
SELECT id, name, email, password
FROM   users
WHERE  email = $1;

-- $1 = "john@university.edu"
-- Compare returned password hash with bcrypt in application layer
```

---

### 2. GET /notifications — fetch all for a user (paginated + filtered)

```sql
SELECT
  id, user_id, title, message, type, priority, is_read, created_at
FROM notifications
WHERE user_id = $1
  AND ($2::TEXT IS NULL OR is_read = ($2 = 'read'))   -- optional status filter
  AND ($3::TEXT IS NULL OR type = $3::notification_type) -- optional type filter
ORDER BY created_at DESC
LIMIT  $4   -- e.g. 20
OFFSET $5;  -- e.g. (page - 1) * limit

-- Count query for total (used in response metadata)
SELECT COUNT(*) FROM notifications
WHERE user_id = $1;
```

---

### 3. GET /notifications/:id — fetch single notification

```sql
SELECT id, user_id, title, message, type, priority, is_read, created_at, updated_at
FROM   notifications
WHERE  id = $1
  AND  user_id = $2;

-- $1 = notification ID, $2 = logged-in user ID (ownership check)
```

---

### 4. POST /notifications — create a new notification

```sql
INSERT INTO notifications (user_id, title, message, type, priority)
VALUES ($1, $2, $3, $4::notification_type, $5::notification_priority)
RETURNING id, user_id, title, message, type, priority, is_read, created_at;

-- $1 = userId, $2 = title, $3 = message, $4 = type, $5 = priority
```

---

### 5. PATCH /notifications/:id/read — mark one as read

```sql
UPDATE notifications
SET    is_read = TRUE, updated_at = NOW()
WHERE  id = $1
  AND  user_id = $2
RETURNING id, is_read, updated_at;

-- $1 = notification ID, $2 = logged-in user ID
```

---

### 6. PATCH /notifications/read-all — mark all as read

```sql
UPDATE notifications
SET    is_read = TRUE, updated_at = NOW()
WHERE  user_id = $1
  AND  is_read = FALSE;

-- Returns rowCount from the driver as updatedCount in API response
```

---

### 7. DELETE /notifications/:id — delete a notification

```sql
DELETE FROM notifications
WHERE id      = $1
  AND user_id = $2
RETURNING id;

-- $1 = notification ID, $2 = logged-in user ID (ownership check)
```

---

### 8. GET /notifications/unread-count — count unread

```sql
SELECT COUNT(*) AS unread_count
FROM   notifications
WHERE  user_id = $1
  AND  is_read = FALSE;

-- Uses partial index idx_notifications_unread_only for O(log n) performance
```

---

## Summary

| Concern | Solution |
|---------|----------|
| Database | PostgreSQL — structured schema, ACID, relational integrity |
| Slow user queries | Composite index on `(user_id, created_at DESC)` |
| Slow unread count | Partial index on unread rows + Redis cache at scale |
| Mark-all-read locking | Batched UPDATE in chunks of 500 |
| Table bloat over time | Monthly partitioning + scheduled DELETE of old rows |
| Connection overload | PgBouncer connection pooling |

# Stage 3
 
## Query Analysis, Optimization & Indexing
 
---
 
## Is the Original Query Accurate?
 
```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```
 
**Functionally — yes.** The query returns the correct result: all unread notifications for student 1042, ordered oldest-first.
 
**However, it has two practical problems:**
 
**1. `SELECT *` is wasteful.** The frontend only needs `id`, `title`, `message`, `notificationType`, `createdAt`. Fetching every column wastes network bandwidth and serialization time — especially critical when millions of rows exist.
 
**2. `ORDER BY createdAt ASC` is debatable.** For a notification inbox, most UIs show newest-first (`DESC`). Oldest-first is unusual and likely unintended — a new notification buried at the bottom is a poor user experience.
 
---
 
## Why Is It Slow?
 
With 50,000 students and 5,000,000 notifications (~100 notifications/student on average), this query is slow for two compounding reasons:
 
### Reason 1 — Full Table Scan (No Index)
 
Without an index on `studentID`, PostgreSQL/MySQL performs a **sequential scan** — reading all 5,000,000 rows to find the ones where `studentID = 1042`. This is O(N) where N = 5,000,000.
 
### Reason 2 — No Composite Index for the Full WHERE Clause
 
Even with a single index on `studentID`, the database then must re-filter those results for `isRead = false` in memory, and then sort them by `createdAt`. Without a composite index covering all three columns, each of these steps is additional in-memory work on a potentially large intermediate result set.
 
### Computation Cost (Before Optimization)
 
| Step | Operation | Cost |
|------|-----------|------|
| Filter by studentID | Sequential scan, 5M rows | O(N) — very slow |
| Filter isRead = false | In-memory filter on result | O(k) where k = student's notifications |
| ORDER BY createdAt | In-memory sort | O(k log k) |
| **Total** | | **O(N) dominant — unacceptable at scale** |
 
---
 
## The Fix — Composite Index
 
```sql
CREATE INDEX idx_notifications_student_unread_date
  ON notifications (studentID, isRead, createdAt DESC);
```
 
This single composite index covers all three clauses of the query — the database jumps directly to `studentID = 1042`, filters `isRead = false` within that partition, and the results are already sorted by `createdAt`. No table scan, no in-memory sort.
 
### Optimized Query
 
```sql
SELECT id, title, message, notificationType, createdAt
FROM   notifications
WHERE  studentID = 1042
  AND  isRead    = false
ORDER BY createdAt DESC;
```
 
Changes made:
- `SELECT *` → explicit columns only
- `ORDER BY createdAt ASC` → `DESC` (newest-first for inbox UX)
- Composite index ensures the WHERE + ORDER BY is fully index-backed
### Computation Cost (After Optimization)
 
| Step | Operation | Cost |
|------|-----------|------|
| Locate studentID in index | B-tree lookup | O(log N) |
| Filter isRead = false | Index scan within student's rows | O(k) |
| ORDER BY createdAt | Already sorted in index | O(1) |
| **Total** | | **O(log N + k) — fast at any scale** |
 
At 5,000,000 rows, `log₂(5,000,000) ≈ 22` comparisons to locate the student's data. This is effectively instant.
 
---
 
## Should You Index Every Column?
 
**No. This advice is actively harmful.**
 
A teammate suggesting "index every column to be safe" is a common misconception. Here is why it is wrong:
 
**Every index has a write cost.** On every `INSERT`, `UPDATE`, or `DELETE`, PostgreSQL must update every index that covers the modified columns. With 10 indexes on the `notifications` table, inserting one notification updates 10 data structures instead of 1. At 50,000 students receiving bulk notifications, this write amplification severely slows down inserts.
 
**Indexes consume significant storage.** Each index is a separate B-tree data structure on disk. Indexing every column of a 5M-row table could easily consume several gigabytes of extra storage — much of it never queried.
 
**The query planner can be confused.** With many indexes, PostgreSQL's query planner has more paths to evaluate and can occasionally pick a suboptimal one.
 
**Low-cardinality columns waste index space.** Indexing a boolean column like `isRead` alone (only 2 values) gives the planner almost no selectivity — it would still scan ~50% of the table. Boolean columns are only useful inside composite indexes.
 
**The right approach:** Index based on actual query patterns. One well-designed composite index covering `(studentID, isRead, createdAt)` is worth more than ten single-column indexes.
 
---
 
## Query — Students Who Got a Placement Notification in the Last 7 Days
 
```sql
SELECT DISTINCT s.id, s.name, s.email
FROM   students      s
JOIN   notifications n ON n.studentID = s.id
WHERE  n.notificationType = 'Placement'
  AND  n.createdAt >= NOW() - INTERVAL '7 days';
```
 
**Why `DISTINCT`?** A student may have received multiple placement notifications in 7 days. `DISTINCT` ensures each student appears only once in the result.
 
**Why `JOIN` instead of a subquery?** A JOIN with DISTINCT is typically more efficient than `WHERE studentID IN (SELECT ...)` for large datasets because the planner can use hash joins and avoid re-scanning the subquery result.
 
**Supporting index for this query:**
 
```sql
CREATE INDEX idx_notifications_type_created
  ON notifications (notificationType, createdAt DESC);
```
 
This allows the database to jump directly to all `Placement` rows within the last 7 days without scanning unrelated notification types.
 
---
 
---

# Stage 4
 
## Caching Strategy — Reducing DB Load on Page Load
 
---
 
## The Problem
 
Every page load triggers a DB query for every student. At 50,000 concurrent students, that is 50,000 simultaneous `SELECT` queries against the same `notifications` table. The DB becomes the bottleneck — query queue backs up, response times spike, and the user experience degrades.
 
---
 
## Suggested Solutions
 
---
 
### Strategy 1 — Server-Side Caching with Redis
 
**How it works:** On the first request for a student's notifications, fetch from the DB and store the result in Redis with a TTL (Time To Live) of 60 seconds. Subsequent requests within that window are served from Redis — the DB is never touched.
 
```
Request → Check Redis cache
              ├─ HIT  → return cached notifications (< 1ms)
              └─ MISS → query DB → store in Redis → return result
```
 
**Cache key design:**
```
notifications:student:{studentID}:page:{page}:type:{type}:status:{status}
```
 
**Invalidation:** When a notification is created, marked as read, or deleted for `studentID`, delete all Redis keys matching `notifications:student:{studentID}:*`. The next request repopulates the cache from DB.
 
**Tradeoffs:**
 
| Pro | Con |
|-----|-----|
| Dramatically reduces DB read load | Adds Redis as an infrastructure dependency |
| Sub-millisecond cache hits | Cache invalidation logic must be maintained carefully |
| Horizontally scalable | Stale data possible within TTL window (max 60s) |
| Works for all students uniformly | Memory cost — large notification sets consume RAM |
 
---
 
### Strategy 2 — Unread Count Cache (Targeted Caching)
 
Instead of caching the full notification list, cache only the **unread count** — the most-polled endpoint.
 
```
Redis key: unread_count:student:{studentID}  →  value: 7  →  TTL: 30s
```
 
This is lightweight (one integer per student) and directly addresses the highest-frequency query. The full notification list is only fetched when the user actually opens the inbox.
 
**Tradeoffs:**
 
| Pro | Con |
|-----|-----|
| Extremely low memory footprint | Only solves the count endpoint, not full list |
| Simple invalidation (delete one key) | Full list fetch still hits DB |
| Reduces polling load by ~80% | Still requires Redis infrastructure |
 
---
 
### Strategy 3 — Pagination & Lazy Loading
 
**How it works:** Never load all notifications at once. Load 20 at a time. The user scrolls to trigger the next page.
 
```
GET /notifications?page=1&limit=20   →  20 rows from DB
GET /notifications?page=2&limit=20   →  next 20 rows (only if user scrolls)
```
 
Most students never scroll past page 1. This alone reduces DB rows read per request from potentially thousands to exactly 20.
 
**Tradeoffs:**
 
| Pro | Con |
|-----|-----|
| Zero infrastructure cost — pure SQL | Does not reduce total DB connections |
| Drastically reduces data transferred | Users must scroll to see older notifications |
| Combines well with Redis caching | Requires offset-based or cursor-based pagination |
 
**Cursor-based pagination** (preferred at scale over `OFFSET`):
 
```sql
-- First page
SELECT id, title, message, createdAt FROM notifications
WHERE studentID = $1 AND isRead = false
ORDER BY createdAt DESC LIMIT 20;
 
-- Next page (cursor = last createdAt from previous page)
SELECT id, title, message, createdAt FROM notifications
WHERE studentID = $1 AND isRead = false
  AND createdAt < $2   -- cursor
ORDER BY createdAt DESC LIMIT 20;
```
 
`OFFSET 1000` forces the DB to skip 1000 rows. Cursor-based pagination always starts from an index position — O(log N) regardless of page depth.
 
---
 
### Strategy 4 — HTTP Response Caching (ETag / Cache-Control)
 
**How it works:** The server sends an `ETag` header (a hash of the response). On subsequent requests, the browser sends `If-None-Match: <etag>`. If nothing changed, the server returns `304 Not Modified` with no body — zero DB query, zero bandwidth.
 
```
Response headers:
  ETag: "a3f8c2d1"
  Cache-Control: private, max-age=30
 
Next request:
  If-None-Match: "a3f8c2d1"
  → 304 Not Modified (no body, no DB hit)
```
 
**Tradeoffs:**
 
| Pro | Con |
|-----|-----|
| Zero server processing on cache hit | DB still queried to compute ETag on first load |
| No Redis needed | Requires ETag generation logic on server |
| Works transparently with browsers | Not effective for highly dynamic data |
 
---
 
### Recommended Combined Strategy
 
For this system at current scale:
 
1. **Pagination (limit 20)** — implement immediately, zero cost, biggest impact
2. **Redis cache on full notification list** with 60s TTL + invalidation on write
3. **Redis cache on unread count** with 30s TTL for the polling endpoint
4. **ETag headers** on the notification list endpoint as an additional layer
---
 
---

# Stage 5

## Bulk Notification — Reliability & Redesign

---

## Problems with the Original Implementation

```python
function notify_all(student_ids: array, message: string):
  for student_id in student_ids:
    send_email(student_id, message)     # calls Email API
    save_to_db(student_id, message)     # DB insert
    push_to_app(student_id, message)
```

### Problem 1 — Synchronous Sequential Loop

Processing 50,000 students one by one in a `for` loop is extremely slow. If each iteration takes 200ms (email API + DB insert + push), total time = 50,000 × 200ms = **2.7 hours**. The HR clicks "Notify All" and waits nearly 3 hours for it to complete.

### Problem 2 — No Failure Handling or Retry

If `send_email` fails for student 5,000, the loop crashes or skips silently. There is no retry mechanism. The 200 failed students are lost — no record of the failure, no way to retry just those students.

### Problem 3 — Single Point of Failure

If the server restarts mid-loop (at student 25,000), there is no checkpoint. The entire operation must be restarted from scratch, causing duplicate notifications for the first 25,000 students.

### Problem 4 — DB and Email API Overwhelmed Simultaneously

Firing 50,000 DB inserts and 50,000 email API calls at maximum speed hammers both services. The DB connection pool is exhausted, email API rate limits are hit, and everything slows or fails.

### Problem 5 — Tight Coupling of Unrelated Operations

Saving to DB (fast, reliable) and sending email (slow, unreliable, dependent on external API) are coupled inside the same loop iteration. A slow email API blocks the DB insert for every subsequent student.

---

## The 200 Failed Emails — What Now?

With the original implementation, these 200 failures are unrecoverable — there is no log of which students failed, and no retry path.

The fix requires: at the time of failure, log the failed `student_id` to a **dead-letter queue (DLQ)**. A separate retry worker reads from the DLQ and re-attempts delivery with exponential backoff (retry after 1s, 2s, 4s, 8s... up to 5 attempts). After 5 failures, flag the record in the DB as `delivery_status = 'failed'` for manual review.

---

## Should DB Save and Email Send Happen Together?

**No — they should be decoupled.**

Saving to the DB is a fast, local, reliable operation. Sending an email is slow, depends on an external API, and can fail for reasons entirely outside our control (API rate limit, network timeout, provider outage).

Coupling them means: if the email API is slow, the DB insert waits. If the email API is down, the notification is never saved to DB at all — the student never sees it in their inbox either.

**The correct model:** Save to DB first (immediately, reliably). Then enqueue the email send as a separate async job. The in-app notification reflects instantly. The email arrives shortly after. These are independent delivery channels and should fail or succeed independently.

---

## Redesigned Implementation

### Architecture

```
HR clicks "Notify All"
         │
         ▼
  API Handler (fast response to HR — "Job queued ✓")
         │
         ▼
  Batch Job Producer
  → splits 50,000 IDs into chunks of 500
  → pushes each chunk as a job onto Message Queue (e.g. Redis/BullMQ)
         │
         ▼
  ┌──────────────────────────────────────┐
  │   Worker Pool (e.g. 10 workers)      │
  │   Each worker picks one chunk (500)  │
  │   and processes in parallel          │
  └──────────────────────────────────────┘
         │
         ▼
  For each student in chunk:
    ├─ save_to_db()       → bulk INSERT (500 rows at once)
    ├─ push_to_app()      → in-app notification
    └─ enqueue_email()    → separate email queue (decoupled)
         │
         ▼
  Email Worker (separate)
    → reads from email queue
    → calls send_email() with retry + backoff
    → on failure → dead-letter queue
```

---

### Revised Pseudocode

```javascript
// ─── PRODUCER (called when HR clicks "Notify All") ───────────────────────

async function notify_all(student_ids, message) {
  Log("backend", "info", "handler", `notify_all triggered for ${student_ids.length} students`);

  const CHUNK_SIZE = 500;
  const chunks = [];

  // Split into chunks of 500
  for (let i = 0; i < student_ids.length; i += CHUNK_SIZE) {
    chunks.push(student_ids.slice(i, i + CHUNK_SIZE));
  }

  // Push each chunk as a job onto the notification queue
  for (const chunk of chunks) {
    await notificationQueue.add("bulk_notify", { student_ids: chunk, message });
  }

  Log("backend", "info", "service", `${chunks.length} chunks enqueued for bulk notification`);
  return { success: true, message: "Notification job queued", totalStudents: student_ids.length };
}


// ─── NOTIFICATION WORKER (runs in parallel, one chunk per job) ───────────

notificationQueue.process("bulk_notify", 10, async (job) => {
  const { student_ids, message } = job.data;

  Log("backend", "info", "service", `Processing notification chunk of ${student_ids.length} students`);

  try {
    // 1. Bulk DB insert (one query for 500 students — not 500 queries)
    await bulk_save_to_db(student_ids, message);
    Log("backend", "info", "db", `Bulk DB insert complete for ${student_ids.length} students`);

    // 2. Push in-app notifications
    await push_to_app(student_ids, message);
    Log("backend", "info", "service", `In-app push complete for ${student_ids.length} students`);

    // 3. Enqueue emails separately — do NOT send inline
    for (const student_id of student_ids) {
      await emailQueue.add(
        "send_email",
        { student_id, message },
        { attempts: 5, backoff: { type: "exponential", delay: 1000 } }
      );
    }

    Log("backend", "info", "service", `Email jobs enqueued for ${student_ids.length} students`);

  } catch (err) {
    Log("backend", "error", "service", `Chunk processing failed: ${err.message}`);
    throw err; // triggers BullMQ retry for the whole chunk
  }
});


// ─── EMAIL WORKER (separate, processes one student at a time) ────────────

emailQueue.process("send_email", 20, async (job) => {
  const { student_id, message } = job.data;

  try {
    await send_email(student_id, message);
    Log("backend", "info", "service", `Email sent successfully to student ${student_id}`);

  } catch (err) {
    Log("backend", "error", "service", `Email failed for student ${student_id}: ${err.message}`);

    // BullMQ handles retry automatically (5 attempts, exponential backoff)
    // After 5 failures → job moves to dead-letter queue automatically
    throw err;
  }
});


// ─── DEAD LETTER QUEUE MONITOR ───────────────────────────────────────────

emailQueue.on("failed", async (job, err) => {
  if (job.attemptsMade >= 5) {
    const { student_id } = job.data;
    Log("backend", "fatal", "service", `Email permanently failed for student ${student_id} after 5 attempts`);

    // Mark in DB for manual review / admin dashboard
    await mark_delivery_failed_in_db(student_id);
  }
});
```

---

### Key Improvements Over Original

| Issue | Original | Redesigned |
|-------|----------|------------|
| Speed | Sequential, ~2.7 hours | Parallel workers, ~5–10 minutes |
| Failure handling | Silent failure | Retry with exponential backoff |
| Partial failure recovery | Restart from scratch | Only failed jobs retried |
| DB + email coupling | Tightly coupled | Fully decoupled queues |
| DB insert efficiency | 1 row per query | 500 rows per bulk INSERT |
| Observability | None | Logged at every stage with logID |

---

---


# Stage 6

## Priority Inbox — Top N Notifications by Weight + Recency

---

## Approach

Each notification is scored using a **weighted formula** that combines notification type importance and recency:

```
score = type_weight × recency_factor

type_weight:
  Placement → 3
  Result    → 2
  Event     → 1

recency_factor = 1 / (1 + hours_since_created)
```

This means a Placement notification from 1 hour ago scores higher than a Result from 1 hour ago, which scores higher than an Event. But a very recent Event can still outrank an old Placement — recency matters.

All notifications are fetched from the live API, scored, and the top N are extracted using a **min-heap** of size N. This keeps the algorithm at O(M log N) where M = total notifications — efficient even as new notifications stream in.

---

## Maintaining Top N as New Notifications Arrive

A min-heap of fixed size N is the optimal structure:

1. Fetch new notification, compute its score
2. If heap has fewer than N items → push directly
3. If new score > heap minimum → pop the minimum, push the new one
4. Otherwise → discard (it would not make the top N)

This means each new notification is processed in O(log N) time — the heap never grows beyond N items.

The implementation code and output screenshots are available in the repository under `notification_app_be/priority.js`.