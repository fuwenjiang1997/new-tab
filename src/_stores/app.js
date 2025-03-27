import { useLocalStorage, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { onMounted } from 'vue'

export default defineStore('app', () => {
  const menus = useStorage('menus', [])
  const bookmarks = useStorage('bookmarks', {})
  const todos = useStorage('todos', {})

  onMounted(() => {})

  return {
    menus,
    bookmarks,
    todos
  }
})
