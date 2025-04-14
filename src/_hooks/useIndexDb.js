// useIndexedDB.js
import { ref, onMounted, onUnmounted } from 'vue';
import { openDB } from 'idb';

const DB_NAME = 'newTabDb'; // 数据库名称
const STORE_NAME = 'newTableStore'; // 存储对象名称

// 创建数据库和存储
const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
  return db;
};

export function useIndexedDB(key, defaultValue = null) {
  const storedValue = ref(defaultValue);
  let db;

  const loadStoredValue = async () => {
    if (!db) return defaultValue;
    const value = await db.get(STORE_NAME, key);
    if (value === void 0) {
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

  // 加载初始值并初始化数据库
  onMounted(async () => {
    db = await initDB();
    storedValue.value = await loadStoredValue();
  });

  // 在组件卸载时不需要特别的清理
  onUnmounted(() => {
    // 可在此执行任何必需的清理操作
  });

  return [storedValue, updateStoredValue];
}