import {
  NOTIFICATION_ALARM,
  NOTIFICATION_JUST_MESSAGE,
  NOTIFICATION_TODO,
} from '@/_utils/const'
import {
  chromeNotification,
  generateRandomString,
  getTodayDayjs,
} from '@/_utils/util'
import { DBNAME_SCRIPTS } from '@/_utils/const'
import { useStorage } from '@vueuse/core'
import { useIndexedDB } from '@/_hooks/useIndexDb'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'

export default defineStore('app', () => {
  const menus = useStorage('menus', [])
  const bookmarks = useStorage('bookmarks', {})
  const todos = useStorage(`todos_${dayjs().format('YYYY-MM')}`, {})
  const alarmTasks = useStorage('alarmTasks', [])
  const homeAppList = useStorage('homeAppList', [])
  const baseGoOffWorkTimeConfig = () => ({
    bgSetType: 1,
    bgColor: 'rgb(244, 238, 230)',
    textColor: 'rgb(55, 33, 40)',
    weekWorkDay: [true, true, true, true, true, false, false],
    workTime: ['09:00', '18:30']
  })
  const goOffWorkTimeConfig = useStorage('goOffWorkTimeConfig', baseGoOffWorkTimeConfig())
  const config = useStorage('config', {
    bgImg: '',
  })
  const [scripts, updateScripts] = useIndexedDB(DBNAME_SCRIPTS, [])
  const now = ref(dayjs())
  const nowDay = computed(() => now.value.format('YYYY-MM-DD'))
  const nowDayTodos = computed(() => {
    return todos.value[nowDay.value] || []
  })
  const homeAppMap = computed(() => {
    const map = {}
    homeAppList.value.forEach((item) => {
      map[item.id] = item
    })
    return map
  })

  const gHandlerMap = {}

  // 新的一天
  watch(nowDay, () => {
    alarmTasks.value.forEach((task) => {
      task.notificationCompleted = false
      task.notificationLastNotifyTime = ''
      task.notificationSuccessCount = 0
    })
    todos.value = useStorage(`${nowDay.value.slice(0, 7)}`, {}).value
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
      : _now.isAfter(
        notificationStartTimeHMS
          ? getTodayDayjs(notificationStartTimeHMS)
          : dayjs(notificationStartTime)
      )
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
            buttons: [{ title: '关闭通知' }],
          }
        )

        todo.notificationSuccessCount += 1
        todo.notificationLastNotifyTime = _now.valueOf()
        if (
          notificationRepeatCount >= 1 &&
          todo.notificationSuccessCount >= notificationRepeatCount
        ) {
          todo.notificationCompleted = true
        }
      }
    }

    for (let i = 0; i < alarmTasks.value.length; i++) {
      const alarmTask = alarmTasks.value[i]
      const { notificationRepeatCount } = alarmTask
      const isNotifyWeekDay = alarmTask.weeks[_now.day()]
      console.log(checkItemIsNotifify(alarmTask, _now))
      if (isNotifyWeekDay && checkItemIsNotifify(alarmTask, _now)) {
        chromeNotification(
          `${generateRandomString(10)}%_%${NOTIFICATION_ALARM}%_%${alarmTask.id}`,
          {
            title: `提醒您：${alarmTask.name}`,
            message: '任务即将开始，请尽快完成',
            buttons: [
              { title: '关闭通知' },
              // { title: '执行任务' }
            ],
          }
        )

        alarmTask.notificationSuccessCount += 1
        alarmTask.notificationLastNotifyTime = _now.valueOf()
        if (
          notificationRepeatCount >= 1 &&
          alarmTask.notificationSuccessCount >= notificationRepeatCount
        ) {
          alarmTask.notificationCompleted = true
        }
      }
    }
  }

  function notificationBtnEventHandler() {
    const eventHandler = {
      // 普通通知
      [NOTIFICATION_JUST_MESSAGE]: () => {},
      // 定时通知
      [NOTIFICATION_ALARM]: (btnIndex, id, handlerName, ...args) => {
        if (btnIndex === 0) {
          // 关闭通知
          const task = alarmTasks.value.find((task) => task.id == id)
          task.notificationCompleted = true
        }
      },
      // todo通知
      [NOTIFICATION_TODO]: (btnIndex, todoId, handlerName, ...args) => {
        if (btnIndex === 0) {
          // 关闭通知
          const todo = nowDayTodos.value.find((todo) => todo.id == todoId)
          todo.notificationCompleted = true
        }
        if (btnIndex === 1 && handlerName) {
          gHandlerMap[handlerName]?.(...args)
        }
      },
    }

    chrome.notifications.onButtonClicked.addListener(
      (notificationId, buttonIndex) => {
        const info = notificationId.split('%_%')
        eventHandler[info[1]]?.(buttonIndex, ...info.slice(2))
        // 关闭通知
        chrome.notifications.clear(notificationId)
      }
    )
  }

  let nowTimetimer
  let notifiCheckTimer
  onMounted(() => {
    const a = dayjs()
    const b = dayjs('2025-01-01 00:00:00')

    console.log('a,b:>>', a.isAfter(b))
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
    homeAppMap,
    config,
    scripts,
    updateScripts,
    baseGoOffWorkTimeConfig,
    goOffWorkTimeConfig,
  }
})
