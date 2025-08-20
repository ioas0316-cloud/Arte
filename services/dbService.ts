
import { PersonalMemory, Dream } from '../types';

const DB_NAME = 'ElysiaParadiseDB';
const DB_VERSION = 2; // Incremented version for schema change
const MEMORY_STORE_NAME = 'personalMemories';
const DREAM_STORE_NAME = 'dreams';

let db: IDBDatabase;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      reject('Error opening database.');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(MEMORY_STORE_NAME)) {
        dbInstance.createObjectStore(MEMORY_STORE_NAME, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(DREAM_STORE_NAME)) {
        dbInstance.createObjectStore(DREAM_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function addMemory(memory: PersonalMemory): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEMORY_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(MEMORY_STORE_NAME);
    const request = store.add(memory);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error adding memory:', request.error);
      reject('Could not save memory.');
    };
  });
}

export async function getMemories(): Promise<PersonalMemory[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEMORY_STORE_NAME, 'readonly');
    const store = transaction.objectStore(MEMORY_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('Error getting memories:', request.error);
      reject('Could not retrieve memories.');
    };
  });
}

export async function deleteMemory(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEMORY_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(MEMORY_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error deleting memory:', request.error);
      reject('Could not delete memory.');
    };
  });
}

// --- Dream Functions ---

export async function addDream(dream: Dream): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DREAM_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(DREAM_STORE_NAME);
    const request = store.add(dream);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error adding dream:', request.error);
      reject('Could not save dream.');
    };
  });
}

export async function getDreams(): Promise<Dream[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DREAM_STORE_NAME, 'readonly');
    const store = transaction.objectStore(DREAM_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('Error getting dreams:', request.error);
      reject('Could not retrieve dreams.');
    };
  });
}