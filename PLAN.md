# Plan: Add In-Memory Cache to Server

## Context
The server currently has no caching layer. Adding a general-purpose in-memory cache with TTL support will provide a reusable utility for any data that benefits from fast, repeated access — channel metadata, computed results, HTTP responses, etc.

## Approach
Create a standalone `MemoryCache` class, wire it into the server, and expose cache stats via an endpoint.

---

## Step 1: Create `server/cache.js`

Create a new file with the `MemoryCache` class:

```js
class MemoryCache {
  constructor(options = {}) {
    this.store = new Map();
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 min
    this.hits = 0;
    this.misses = 0;
    this.sets = 0;
  }

  set(key, value, ttl) {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.store.set(key, { value, expiresAt });
    this.sets++;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) { this.misses++; return null; }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return entry.value;
  }

  has(key) {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  delete(key) { return this.store.delete(key); }
  clear() { this.store.clear(); }
  size() { return this.store.size; }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) this.store.delete(key);
    }
  }

  getStats() {
    return {
      keys: this.store.size,
      hits: this.hits,
      misses: this.misses,
      sets: this.sets,
    };
  }
}

module.exports = MemoryCache;
```

## Step 2: Add config in `server/config.js`

Add a `CACHE` section:

```js
CACHE: {
  defaultTTL: 5 * 60 * 1000,   // 5 minutes
  cleanupInterval: 60 * 1000,  // sweep every 60s
},
```

## Step 3: Update `server/index.js`

- Import `MemoryCache` and `CACHE` config
- Instantiate: `const cache = new MemoryCache(CACHE)`
- Start periodic cleanup: `setInterval(() => cache.cleanup(), CACHE.cleanupInterval)`
- Pass `cache` to `createRoutes(channelManager, cache)` and `setupSocket(io, channelManager, cache)`

## Step 4: Update `server/routes.js`

- Accept `cache` parameter: `function createRoutes(channelManager, cache)`
- Add endpoint:
  ```js
  router.get("/cache/stats", (req, res) => {
    res.json(cache.getStats());
  });
  ```

## Step 5: Update `server/socket.js`

- Accept `cache` parameter: `function setupSocket(io, channelManager, cache)`
- Optionally cache channel data on writes, invalidate on changes

---

## Files to modify
| File | Action |
|------|--------|
| `server/cache.js` | Create — MemoryCache class |
| `server/config.js` | Edit — add CACHE config |
| `server/index.js` | Edit — instantiate cache, wire to routes/socket |
| `server/routes.js` | Edit — add /cache/stats endpoint, accept cache param |
| `server/socket.js` | Edit — accept cache param |

## Verification
1. Run `node server/index.js` — server starts without errors
2. `curl http://localhost:3000/cache/stats` — returns `{ keys, hits, misses, sets }`
3. Verify existing endpoints still work (`/getChannels`, socket events)
