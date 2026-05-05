// =============================================================
// priority.js — Stage 6: Priority Inbox (Top N Notifications)
// Fetches from live Notification API, scores by type + recency,
// extracts Top N using a Min-Heap.
// =============================================================

const { Log, initLogger } = require("../logging_middleware/logger");

// ── CONFIG ────────────────────────────────────────────────────
const NOTIFICATION_API = "http://20.207.122.201/evaluation-service/notifications";
const AUTH_API = "http://20.207.122.201/evaluation-service/auth";

const TOP_N = 10; // change to 15, 20, etc. as needed

// Type weights: Placement > Result > Event
const TYPE_WEIGHT = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

// ── CREDENTIALS — fill these in ───────────────────────────────
const CREDENTIALS = {
    email: process.env.EMAIL || "your@university.edu",
    name: process.env.NAME || "Your Name",
    rollNo: process.env.ROLL_NO || "yourrollno",
    accessCode: process.env.ACCESS_CODE || "yourAccessCode",
    clientID: process.env.CLIENT_ID || "your-client-id",
    clientSecret: process.env.CLIENT_SECRET || "your-client-secret",
};

// ── AUTH ──────────────────────────────────────────────────────
let _token = "";

async function getToken() {
    const res = await fetch(AUTH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CREDENTIALS),
    });
    const data = await res.json();
    _token = data.access_token;
    await Log("backend", "info", "auth", "Bearer token fetched successfully for priority inbox");
}

// ── SCORING ───────────────────────────────────────────────────
/**
 * Compute a priority score for one notification.
 *   score = type_weight × recency_factor
 *   recency_factor = 1 / (1 + hours_since_created)
 *
 * Recent high-weight notifications score highest.
 * An old Placement can be outranked by a very recent Event.
 */
function computeScore(notification) {
    const weight = TYPE_WEIGHT[notification.Type] ?? 1;
    const created = new Date(notification.Timestamp);
    const hoursAgo = (Date.now() - created.getTime()) / (1000 * 60 * 60);
    const recency = 1 / (1 + hoursAgo);
    return weight * recency;
}

// ── MIN-HEAP ──────────────────────────────────────────────────
/**
 * MinHeap of size N.
 * Stores { score, notification } objects.
 * The root is always the LOWEST score in the current Top-N.
 * On each new notification: if its score > root → swap in.
 * Result: heap holds exactly the Top N highest-scored items.
 */
class MinHeap {
    constructor() { this._data = []; }

    size() { return this._data.length; }

    peek() { return this._data[0]; }   // lowest score in heap

    push(item) {
        this._data.push(item);
        this._bubbleUp(this._data.length - 1);
    }

    pop() {
        const top = this._data[0];
        const last = this._data.pop();
        if (this._data.length > 0) {
            this._data[0] = last;
            this._sinkDown(0);
        }
        return top;
    }

    _bubbleUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this._data[parent].score <= this._data[i].score) break;
            [this._data[parent], this._data[i]] = [this._data[i], this._data[parent]];
            i = parent;
        }
    }

    _sinkDown(i) {
        const n = this._data.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this._data[l].score < this._data[smallest].score) smallest = l;
            if (r < n && this._data[r].score < this._data[smallest].score) smallest = r;
            if (smallest === i) break;
            [this._data[smallest], this._data[i]] = [this._data[i], this._data[smallest]];
            i = smallest;
        }
    }

    // Extract all items sorted highest → lowest score
    toSortedArray() {
        return [...this._data]
            .sort((a, b) => b.score - a.score);
    }
}

// ── TOP-N EXTRACTOR ───────────────────────────────────────────
/**
 * Given an array of raw notifications, return the Top N
 * by priority score using a min-heap of size N.
 *
 * Time complexity: O(M log N) where M = total notifications
 * Space complexity: O(N) — heap never grows beyond N
 */
function getTopN(notifications, n) {
    const heap = new MinHeap();

    for (const notif of notifications) {
        const score = computeScore(notif);

        if (heap.size() < n) {
            heap.push({ score, notification: notif });
        } else if (score > heap.peek().score) {
            // New notification beats the current lowest in Top-N → swap
            heap.pop();
            heap.push({ score, notification: notif });
        }
        // else: score too low to make Top-N → discard
    }

    return heap.toSortedArray();
}

// ── FETCH FROM API ────────────────────────────────────────────
async function fetchNotifications() {
    await Log("backend", "info", "api", "Fetching notifications from evaluation-service API");

    const res = await fetch(NOTIFICATION_API, {
        headers: { Authorization: `Bearer ${_token}` },
    });

    if (!res.ok) {
        await Log("backend", "error", "api", `Notification API returned status ${res.status}`);
        throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    await Log("backend", "info", "api", `Fetched ${data.notifications.length} notifications from API`);
    return data.notifications;
}

// ── DISPLAY ───────────────────────────────────────────────────
function displayTopN(topN) {
    const divider = "─".repeat(72);

    console.log("\n" + divider);
    console.log(`  🏆  TOP ${topN.length} PRIORITY NOTIFICATIONS`);
    console.log(divider);

    const typeIcon = { Placement: "💼", Result: "📋", Event: "🎉" };

    topN.forEach(({ score, notification }, idx) => {
        const rank = String(idx + 1).padStart(2, " ");
        const icon = typeIcon[notification.Type] || "🔔";
        const type = notification.Type.padEnd(10);
        const message = notification.Message.padEnd(30);
        const ts = notification.Timestamp;
        const sc = score.toFixed(6);

        console.log(`  ${rank}. ${icon} [${type}]  ${message}  ${ts}  score: ${sc}`);
    });

    console.log(divider + "\n");
}

// ── SIMULATE STREAMING NEW NOTIFICATIONS ─────────────────────
/**
 * Demonstrates O(log N) heap maintenance as new notifications arrive.
 * In production this would be called on each new WebSocket/poll event.
 */
function demonstrateStreamingUpdate(heap, newNotification, n) {
    console.log("─".repeat(72));
    console.log("  📡  NEW NOTIFICATION ARRIVED (streaming update)");
    console.log(`      Type: ${newNotification.Type} | Message: ${newNotification.Message}`);

    const score = computeScore(newNotification);

    if (heap.size() < n) {
        heap.push({ score, notification: newNotification });
        console.log(`      ✅ Added to Top-${n} (heap not full yet). Score: ${score.toFixed(6)}`);
    } else if (score > heap.peek().score) {
        const evicted = heap.pop();
        heap.push({ score, notification: newNotification });
        console.log(`      ✅ Replaced lowest (score ${evicted.score.toFixed(6)}) → new score ${score.toFixed(6)}`);
    } else {
        console.log(`      ❌ Score ${score.toFixed(6)} too low — not in Top-${n}. Discarded.`);
    }
    console.log("─".repeat(72) + "\n");
}

// ── MAIN ──────────────────────────────────────────────────────
async function main() {
    // Initialize logger
    initLogger(CREDENTIALS);

    // Get auth token
    await getToken();

    // Fetch all notifications from the live API
    const notifications = await fetchNotifications();

    // Build heap and extract Top N
    await Log("backend", "info", "service", `Computing Top ${TOP_N} priority notifications from ${notifications.length} total`);
    const topN = getTopN(notifications, TOP_N);

    // Display results
    displayTopN(topN);

    await Log("backend", "info", "service", `Top ${TOP_N} priority inbox computed and displayed successfully`);

    // ── Demonstrate streaming update ──────────────────────────
    // Rebuild heap for streaming demo
    const heap = new MinHeap();
    for (const notif of notifications) {
        const score = computeScore(notif);
        if (heap.size() < TOP_N) {
            heap.push({ score, notification: notif });
        } else if (score > heap.peek().score) {
            heap.pop();
            heap.push({ score, notification: notif });
        }
    }

    console.log("\n  ── Streaming Demo: 3 new notifications arrive in real-time ──\n");

    // Simulate 3 incoming notifications
    const incoming = [
        { ID: "new-001", Type: "Placement", Message: "Google hiring SWE", Timestamp: new Date().toISOString() },
        { ID: "new-002", Type: "Event", Message: "Blood donation camp", Timestamp: new Date(Date.now() - 3600000 * 48).toISOString() },
        { ID: "new-003", Type: "Result", Message: "Final semester result declared", Timestamp: new Date().toISOString() },
    ];

    for (const notif of incoming) {
        demonstrateStreamingUpdate(heap, notif, TOP_N);
    }

    // Show updated Top N after streaming
    console.log("  Updated Top N after streaming:\n");
    displayTopN(heap.toSortedArray());

    await Log("backend", "info", "service", "Priority inbox streaming demo completed");
}

main().catch(async (err) => {
    await Log("backend", "fatal", "handler", `Priority inbox crashed: ${err.message}`);
    console.error(err);
    process.exit(1);
});