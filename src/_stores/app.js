import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { onBeforeMount, onMounted, computed, watch, ref } from 'vue'
import { chromeNotification } from '@/_utils/util'
import dayjs from 'dayjs'

export default defineStore('app', () => {
  const menus = useStorage('menus', [])
  const bookmarks = useStorage('bookmarks', {})
  const todos = useStorage('todos', {})
  const now = ref(dayjs())
  const nowDay = computed(() => now.value.format('YYYY-MM-DD'))

  async function clearAllAlarm() {
    await chrome.alarms.clearAll()
  }


  async function setAllAlarmState() {
    const todoList = todos.value[nowDay.value]
    await clearAllAlarm()
    for (const todo of todoList) {
      await updateAlarm(todo)
    }
  }

  async function updateAlarm(todo) {
    const { id, name, notificationRepeatTime, notificationRepeatTimebase, notification, notificationStartTime, notificationCompleted  } = todo
    const alarmName = `${id}%_%${name}`
    await chrome.alarms.clear(alarmName)
    if (notification && notificationStartTime && !notificationCompleted) {
      chrome.alarms.create(`${alarmName}`, {
        periodInMinutes: notificationRepeatTime * notificationRepeatTimebase / 60000,
        when: dayjs(notificationStartTime).valueOf()
      })
    }
  }

  async function clearAlarm(todo) {
     const alarmName = `${todo.id}%_%${todo.name}`
    await chrome.alarms.clear(alarmName)
  }

  let timer
  onMounted(() => {
    timer = setInterval(() => {
      now.value = dayjs()
    }, 1000)
    setAllAlarmState()
  })
  onBeforeMount(() => {
    clearInterval(timer)
  })

  return {
    menus,
    bookmarks,
    todos,
    nowDay,
    clearAlarm,
    setAllAlarmState,
    updateAlarm
  }
})
