const DB_NAME = 'CordovaPortalImageCache';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedImageBlob(url: string): Promise<string | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }

        // Check if expired
        if (Date.now() - result.timestamp > MAX_CACHE_AGE_MS) {
          deleteCachedImage(url);
          resolve(null);
          return;
        }

        const objectUrl = URL.createObjectURL(result.blob);
        resolve(objectUrl);
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function saveImageBlob(url: string, blob: Blob): Promise<void> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({
      url,
      blob,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.warn('Failed to cache image in IndexedDB:', error);
  }
}

export async function cacheImageFromUrl(url: string): Promise<string | null> {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    await saveImageBlob(url, blob);
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export async function deleteCachedImage(url: string): Promise<void> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(url);
  } catch {
    // Ignore errors
  }
}
