import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { onBeforeMount, onMounted, computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { chromeNotification, generateRandomString } from '@/_utils/util'
import { NOTIFICATION_JUST_MESSAGE, NOTIFICATION_ALARM, NOTIFICATION_TODO } from '@/_utils/const'

export default defineStore('app', () => {
  const menus = useStorage('menus', [])
  const bookmarks = useStorage('bookmarks', {})
  const todos = useStorage('todos', {})
  const alarmTasks = useStorage('alarmTasks', [])
  const homeAppList = useStorage('homeAppList', [])
  const now = ref(dayjs())
  const nowDay = computed(() => now.value.format('YYYY-MM-DD'))
  const nowDayTodos = computed(() => {
    return todos.value[nowDay.value] || []
  })
  const homeAppMap = computed(() => {
    const map = {}
    homeAppList.value.forEach(item => {
      map[item.id] = item
    })
    return map
  })

  const gHandlerMap = {}

  // 新的一天
  watch(nowDay, () => {
    alarmTasks.value.forEach(task => {
      task.notificationCompleted = false
      task.notificationLastNotifyTime = ''
      task.notificationSuccessCount = 0
    })
  })

  function checkItemIsNotifify(params, _now = dayjs()) {
    const {
      notificationRepeatTime,
      notificationRepeatTimebase,
      notificationLastNotifyTime,
      notification,
      notificationStartTime,
      notificationStartTimeHMS,
      notificationCompleted,
    } = params
    if (notificationCompleted || !notification || !notificationStartTime) {
      return false
    }

    return notificationLastNotifyTime
        ? _now.isAfter(
          dayjs(notificationLastNotifyTime).add(
            notificationRepeatTime * notificationRepeatTimebase,
            'millisecond'
          )
        )
        : _now.isAfter(dayjs(notificationStartTimeHMS || notificationStartTime))
  }

  // 执行通知检查
  async function checkNotificationAction() {
    const _now = dayjs()
    for (let i = 0; i < nowDayTodos.value.length; i++) {
      const todo = nowDayTodos.value[i]
      const { name, notificationRepeatCount } = todo
      if (checkItemIsNotifify(todo, _now)) {
        chromeNotification(
          `${generateRandomString(10)}%_%${NOTIFICATION_TODO}%_%${todo.id}`,
          {
            title: `提醒您：${name}`,
            message: '任务即将开始，请尽快完成',
            buttons: [
              { title: '关闭通知' }
            ]
          }
        )

        todo.notificationSuccessCount += 1
        todo.notificationLastNotifyTime = _now.valueOf()
        if (notificationRepeatCount >= 1 && todo.notificationSuccessCount >= notificationRepeatCount) {
          todo.notificationCompleted = true
        }
      }
    }

    for (let i = 0; i < alarmTasks.value.length; i++) {
      const alarmTask = alarmTasks.value[i]
      const isNotifyWeekDay = alarmTask.weeks[_now.day()]
      if (isNotifyWeekDay && checkItemIsNotifify(alarmTask, _now)) {
        chromeNotification(
          `${generateRandomString(10)}%_%${NOTIFICATION_ALARM}%_%${alarmTask.id}`,
          {
            title: `提醒您：${alarmTask.name}`,
            message: '任务即将开始，请尽快完成',
            buttons: [
              { title: '关闭通知' },
              // { title: '执行任务' }
            ]
          }
        )
      }
    }
  }

  function notificationBtnEventHandler() {
    const eventHandler = {
      // 普通通知
      [NOTIFICATION_JUST_MESSAGE]: () => {
  
      },
      // 定时通知
      [NOTIFICATION_ALARM]: (btnIndex, id, handlerName, ...args) => {
        if (btnIndex === 0) {
          // 关闭通知
          const task = alarmTasks.value.find(task => task.id == id)
          task.notificationCompleted = true
        }
      },
       // todo通知
      [NOTIFICATION_TODO]: (btnIndex, todoId, handlerName, ...args) => {
        if (btnIndex === 0) {
          // 关闭通知
          const todo = nowDayTodos.value.find(todo => todo.id == todoId)
          todo.notificationCompleted = true
        }
        if (btnIndex === 1 && handlerName) {
          gHandlerMap[handlerName]?.(...args)
        }
      }
    }
    
    chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
      const info = notificationId.split('%_%')
      eventHandler[info[1]]?.(buttonIndex, ...info.slice(2))
      // 关闭通知
      chrome.notifications.clear(notificationId);
    });
  }

  let nowTimetimer
  let notifiCheckTimer
  onMounted(() => {
    nowTimetimer = setInterval(() => {
      now.value = dayjs()
    }, 1000)
    notifiCheckTimer = setInterval(() => {
      checkNotificationAction()
    }, 10000)
    notificationBtnEventHandler()
  })

  onBeforeMount(() => {
    clearInterval(nowTimetimer)
    clearInterval(notifiCheckTimer)
  })

  return {
    menus,
    bookmarks,
    todos,
    now,
    nowDay,
    alarmTasks,
    homeAppList,
    homeAppMap
  }
})
