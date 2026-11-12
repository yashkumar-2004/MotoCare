import { getInitialData } from './mockFallbackData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const LOCAL_STORAGE_KEY = 'motocare_db_v1';

let memoryDb = null;

// Initialize localStorage fallback state
const getLocalDb = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
      const initial = getInitialData();
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
  } catch (err) {
    // fallback to in-memory
  }
  if (!memoryDb) {
    memoryDb = getInitialData();
  }
  return memoryDb;
};

const saveLocalDb = (data) => {
  memoryDb = data;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  } catch (err) {
    // silently keep in memory
  }
};

let isServerAvailable = null;

// Check server health with a 800ms timeout
export const checkServerHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const res = await fetch(`${BASE_URL}/services?_limit=1`, { signal: controller.signal });
    clearTimeout(timeoutId);
    isServerAvailable = res.ok;
    return res.ok;
  } catch {
    isServerAvailable = false;
    return false;
  }
};

// Generic REST client with automated fallback
export const apiClient = {
  get: async (resource, params = {}) => {
    // If not checked or server is healthy, try JSON Server first
    if (isServerAvailable !== false) {
      try {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            query.append(key, val);
          }
        });
        const url = `${BASE_URL}/${resource}${query.toString() ? `?${query.toString()}` : ''}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          isServerAvailable = true;
          return await res.json();
        }
      } catch {
        isServerAvailable = false;
      }
    }

    // Local fallback with simulated delay
    await new Promise((resolve) => setTimeout(resolve, 80));
    const db = getLocalDb();
    let items = db[resource] ? [...db[resource]] : [];

    // Search filter
    if (params.q) {
      const q = params.q.toLowerCase();
      items = items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(q)
      );
    }

    // Key-value filters
    Object.entries(params).forEach(([key, val]) => {
      if (['q', '_sort', '_order', '_page', '_limit'].includes(key) || val === undefined || val === '') return;
      items = items.filter((item) => String(item[key]) === String(val));
    });

    // Sorting
    if (params._sort) {
      const field = params._sort;
      const order = params._order === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
      });
    }

    return items;
  },

  getById: async (resource, id) => {
    if (isServerAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/${resource}/${id}`);
        if (res.ok) return await res.json();
      } catch {
        isServerAvailable = false;
      }
    }

    const db = getLocalDb();
    const items = db[resource] || [];
    const item = items.find((i) => String(i.id) === String(id));
    if (!item) throw new Error(`${resource} item not found: ${id}`);
    return item;
  },

  post: async (resource, payload) => {
    if (isServerAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/${resource}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) return await res.json();
      } catch {
        isServerAvailable = false;
      }
    }

    const db = getLocalDb();
    if (!db[resource]) db[resource] = [];
    const newItem = {
      id: payload.id || `${resource.slice(0, 3)}_${Date.now()}`,
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString()
    };
    db[resource].unshift(newItem);
    saveLocalDb(db);
    return newItem;
  },

  patch: async (resource, id, payload) => {
    if (isServerAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/${resource}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) return await res.json();
      } catch {
        isServerAvailable = false;
      }
    }

    const db = getLocalDb();
    const items = db[resource] || [];
    const index = items.findIndex((i) => String(i.id) === String(id));
    if (index === -1) throw new Error(`${resource} with ID ${id} not found`);
    items[index] = { ...items[index], ...payload, updatedAt: new Date().toISOString() };
    db[resource] = items;
    saveLocalDb(db);
    return items[index];
  },

  delete: async (resource, id) => {
    if (isServerAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/${resource}/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) return true;
      } catch {
        isServerAvailable = false;
      }
    }

    const db = getLocalDb();
    if (db[resource]) {
      db[resource] = db[resource].filter((i) => String(i.id) !== String(id));
      saveLocalDb(db);
    }
    return true;
  },

  resetMockDb: () => {
    const initial = getInitialData();
    saveLocalDb(initial);
    return initial;
  }
};
