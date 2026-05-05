const LOG_API_URL  = "http://20.207.122.201/evaluation-service/logs";
const AUTH_API_URL = "http://20.207.122.201/evaluation-service/auth";

// ---- Internal State ----
let authToken  = "";
let tokenExpiry = 0;
let _credentials = null;

// ---- Allowed Values ----
const VALID_STACKS  = new Set(["backend", "frontend"]);
const VALID_LEVELS  = new Set(["debug", "info", "warn", "error", "fatal"]);

const BACKEND_PACKAGES = new Set([
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service"
]);
const FRONTEND_PACKAGES = new Set([
  "api", "component", "hook", "page", "state", "style"
]);
const SHARED_PACKAGES = new Set([
  "auth", "config", "middleware", "utils"
]);

// ---- Console colors for pretty output ----
const COLORS = {
  debug: "\x1b[36m",  // cyan
  info:  "\x1b[32m",  // green
  warn:  "\x1b[33m",  // yellow
  error: "\x1b[31m",  // red
  fatal: "\x1b[35m",  // magenta
  reset: "\x1b[0m"
};

const ICONS = {
  debug: "🔍",
  info:  "ℹ️ ",
  warn:  "⚠️ ",
  error: "❌",
  fatal: "💀"
};


function initLogger(creds) {
  if (
    !creds.email || !creds.name || !creds.rollNo ||
    !creds.accessCode || !creds.clientID || !creds.clientSecret
  ) {
    throw new Error("[Logger] Missing one or more required credentials.");
  }
  _credentials = creds;
  console.log(`[Logger] ✅ Initialized for: ${creds.email}`);
}


function setAuthToken(token, expiresIn = 0) {
  authToken   = token;
  tokenExpiry = expiresIn;
  console.log("[Logger] 🔑 Auth token set manually.");
}


async function _fetchToken() {
  if (!_credentials) {
    throw new Error("[Logger] No credentials found. Call initLogger() before using Log().");
  }

  const res = await fetch(AUTH_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_credentials),
  });

  if (!res.ok) {
    throw new Error(`[Logger] Token fetch failed with status: ${res.status}`);
  }

  const data = await res.json();
  authToken   = data.access_token;
  tokenExpiry = data.expires_in;
  console.log("[Logger] 🔄 Token refreshed successfully.");
}


async function _ensureToken() {
  const now = Math.floor(Date.now() / 1000);
  const isExpired = tokenExpiry && now >= tokenExpiry - 30;
  if (!authToken || isExpired) {
    await _fetchToken();
  }
}


function _validate(stack, level, pkg) {
  if (!VALID_STACKS.has(stack)) {
    throw new Error(
      `[Logger] Invalid stack: "${stack}". Allowed: "backend", "frontend".`
    );
  }

  if (!VALID_LEVELS.has(level)) {
    throw new Error(
      `[Logger] Invalid level: "${level}". Allowed: debug, info, warn, error, fatal.`
    );
  }

  const isValid =
    SHARED_PACKAGES.has(pkg) ||
    (stack === "backend"  && BACKEND_PACKAGES.has(pkg)) ||
    (stack === "frontend" && FRONTEND_PACKAGES.has(pkg));

  if (!isValid) {
    throw new Error(
      `[Logger] Invalid package "${pkg}" for stack "${stack}".`
    );
  }
}


async function Log(stack, level, pkg, message) {
  // 1. Validate inputs
  _validate(stack, level, pkg);

  // 2. Ensure we have a valid token
  await _ensureToken();

  // 3. Send to Log API
  try {
    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    const data = await res.json();

    // 4. Pretty console output
    const color = COLORS[level] || COLORS.reset;
    console.log(
      `${ICONS[level]} ${color}[${stack.toUpperCase()}][${level.toUpperCase()}][${pkg}]${COLORS.reset} ${message}`
    );
    if (data.logID) {
      console.log(`   └─ logID: ${data.logID}`);
    }

    return data;

  } catch (err) {
    console.error(`[Logger] ❌ Failed to send log: ${err.message}`);
    throw err;
  }
}

module.exports = { Log, initLogger, setAuthToken };