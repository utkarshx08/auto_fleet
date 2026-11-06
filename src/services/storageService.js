/**
 * Resilient Storage Service for AutoFleet Cockpit
 * Provides cross-browser, in-memory failover, quota-safe JSON persistence,
 * and cross-tab synchronisation support.
 */

// In-memory memory-store failover for SSR, incognito restrictions, or quota limits
const memoryStore = new Map();

/**
 * Detect whether localStorage is available and writable
 */
function isStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__autrail_test_storage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const hasLocalStorage = isStorageAvailable();

export const storageService = {
  /**
   * Safely retrieves and parses a JSON item
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  getItem(key, defaultValue = null) {
    try {
      if (hasLocalStorage) {
        const raw = window.localStorage.getItem(key);
        if (raw === null) {
          return memoryStore.has(key) ? memoryStore.get(key) : defaultValue;
        }
        return JSON.parse(raw);
      }
      return memoryStore.has(key) ? memoryStore.get(key) : defaultValue;
    } catch (err) {
      console.warn(`[storageService] Failed to parse key "${key}", falling back to default:`, err);
      return defaultValue;
    }
  },

  /**
   * Safely serializes and persists a value
   * @param {string} key
   * @param {any} value
   * @returns {boolean} Whether persistence succeeded
   */
  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value);
      if (hasLocalStorage) {
        window.localStorage.setItem(key, serialized);
      }
      memoryStore.set(key, value);
      return true;
    } catch (err) {
      console.warn(`[storageService] Failed to set key "${key}" into localStorage:`, err);
      // Fallback to memory store so user actions still work for the session
      memoryStore.set(key, value);
      return false;
    }
  },

  /**
   * Safely removes an item
   * @param {string} key
   */
  removeItem(key) {
    try {
      if (hasLocalStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.warn(`[storageService] Failed to remove key "${key}":`, err);
    }
    memoryStore.delete(key);
  },

  /**
   * Clears all fleet storage
   */
  clear() {
    try {
      if (hasLocalStorage) {
        window.localStorage.clear();
      }
    } catch (err) {
      console.warn('[storageService] Failed to clear localStorage:', err);
    }
    memoryStore.clear();
  },

  /**
   * Check if a key exists
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    if (hasLocalStorage) {
      try {
        return window.localStorage.getItem(key) !== null;
      } catch (e) {
        return memoryStore.has(key);
      }
    }
    return memoryStore.has(key);
  }
};

export default storageService;
