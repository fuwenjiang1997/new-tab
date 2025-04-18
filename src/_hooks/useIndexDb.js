import { ref, onMounted, onUnmounted } from 'vue';
import { openDB } from 'idb';

const DB_NAME = 'newTabDb'; // 数据库名称
const STORE_NAME = 'newTableStore'; // 存储对象名称

const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  return db;
};

let db;
export function useIndexedDB(key, defaultValue = null) {
  const storedValue = ref(defaultValue);

  const loadStoredValue = async () => {
    if (!db) return defaultValue;
    const value = await db.get(STORE_NAME, key);
    if (value === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      return value
    }
  };

  const saveStoredValue = async (value) => {
    if (!db) return;
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    await db.put(STORE_NAME, value, key);
  };

  const updateStoredValue = async (value) => {
    storedValue.value = value;
    await saveStoredValue(value);
  };

  async function init() {
    db = await initDB();
    storedValue.value = await loadStoredValue();
  }
  
  init();

  return [storedValue, updateStoredValue, loadStoredValue];
}