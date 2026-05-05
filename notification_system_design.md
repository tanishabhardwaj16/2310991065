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