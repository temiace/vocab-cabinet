// A local stand-in for the `window.storage` API that Claude artifacts get for free.
// Backed by the browser's built-in localStorage, with the same get/set/delete/list
// shape, so the rest of the app (App.jsx) didn't need to change at all.
//
// IMPORTANT: this is per-browser, per-device. Data saved here won't show up
// if you open the app in a different browser or on your phone. Swapping this
// file out for a real database (e.g. Supabase) later is the natural next step.

const PREFIX = 'vocab-cabinet:';

function fullKey(key) {
  return PREFIX + key;
}

const storage = {
  async get(key) {
    try {
      const raw = window.localStorage.getItem(fullKey(key));
      if (raw === null) return null;
      return { key, value: raw, shared: false };
    } catch (e) {
      throw new Error('Local storage read failed: ' + e.message);
    }
  },

  async set(key, value) {
    try {
      window.localStorage.setItem(fullKey(key), value);
      return { key, value, shared: false };
    } catch (e) {
      throw new Error('Local storage write failed: ' + e.message);
    }
  },

  async delete(key) {
    try {
      window.localStorage.removeItem(fullKey(key));
      return { key, deleted: true, shared: false };
    } catch (e) {
      throw new Error('Local storage delete failed: ' + e.message);
    }
  },

  async list(prefix = '') {
    try {
      const keys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(PREFIX + prefix)) {
          keys.push(k.slice(PREFIX.length));
        }
      }
      return { keys, prefix, shared: false };
    } catch (e) {
      throw new Error('Local storage list failed: ' + e.message);
    }
  },
};

// Attach it to `window.storage` so App.jsx's existing calls work unmodified.
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = storage;
}

export default storage;
