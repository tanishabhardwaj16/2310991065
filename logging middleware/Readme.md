# logging-middleware

Reusable logging middleware for the Notification System.  
Sends structured logs to the evaluation-service Log API on every `Log()` call.

---

## Setup

No external dependencies needed (uses Node.js built-in `fetch`, requires Node 18+).

---

## Usage

### 1. Initialize once at app startup

```js
const { Log, initLogger } = require("./logger");

initLogger({
  email:        "your@university.edu",
  name:         "Your Name",
  rollNo:       "yourrollno",
  accessCode:   "yourAccessCode",
  clientID:     "your-client-id",
  clientSecret: "your-client-secret",
});
```

### 2. Call `Log()` anywhere in your code

```js
Log(stack, level, package, message)
```

```js
await Log("backend", "info",  "handler", "GET /notifications request received");
await Log("backend", "error", "db",      "Failed to insert notification into store");
await Log("backend", "fatal", "service", "Notification dispatch service crashed");
```

---

## Allowed Values

| Argument  | Allowed Values |
|-----------|---------------|
| `stack`   | `backend`, `frontend` |
| `level`   | `debug`, `info`, `warn`, `error`, `fatal` |
| `package` (backend) | `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service` |
| `package` (frontend) | `api`, `component`, `hook`, `page`, `state`, `style` |
| `package` (both) | `auth`, `config`, `middleware`, `utils` |

---

## Test

```bash
node test.js
```

Fill in your credentials in `test.js` before running.

---

## How it works

1. `initLogger()` stores your credentials
2. On first `Log()` call, it auto-fetches a Bearer token from the auth API
3. Token is cached and auto-refreshed 30 seconds before expiry
4. Every `Log()` call POSTs to the Log API with your token
5. Response `logID` is printed to console for traceability