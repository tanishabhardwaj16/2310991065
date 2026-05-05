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