import { useIndexedDB } from '@/_hooks/useIndexDb'
import {
  DBNAME_SCRIPTS,
  MONTH_END,
  MONTH_START, NOTIFICATION_ALARM, NOTIFICATION_JUST_MESSAGE, NOTIFICATION_TODO
} from '@/_utils/const'
import {
  chromeNotification,
  generateRandomString,
  getTodayDayjs,
} from '@/_utils/util'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'

export default defineStore('app', () => {
  const menus = useStorage('menus', [])
  const bookmarks = useStorage('bookmarks', {})
  const todos = useStorage(`todos_${dayjs().format('YYYY-MM')}`, {})
  const alarmTasks = useStorage('alarmTasks', [])
  const homeAppList = useStorage('homeAppList', [])
  const yiyan = useStorage('yiyan', { hitokoto: '', from: '' })
  const baseGoOffWorkTimeConfig = () => ({
    bgSetType: 1,
    bgColor: 'rgb(244, 238, 230)',
    textColor: 'rgb(55, 33, 40)',
    weekWorkDay: [true, true, true, true, true, false, false],
    workTime: ['09:00', '18:30'],
    salaryDay: MONTH_END
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
      if (item.type === 'group') {
        item?.children?.forEach((child) => {
          map[child.id] = child
        })
      } else {
        map[item.id] = item
      }
    })
    return map
  })

  const gHandlerMap = {}

  // 新的一天
  watch(nowDay, (newDay) => {
    const todayOfWeek = dayjs(newDay).day()
    alarmTasks.value.forEach((task) => {
      // 仅重置今天需要提醒的任务，或已完成标记（避免跨天一直不通知）
      if (task.weeks?.[todayOfWeek]) {
        task.notificationCompleted = false
        task.notificationLastNotifyTime = ''
        task.notificationSuccessCount = 0
      }
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
      notificationEndTime,
      notificationEndTimeHMS,
      weeks, // 可选：alarmTask 的按周重复配置
    } = params
    if (notificationCompleted || !notification || !notificationStartTime) {
      return false
    }

    // alarmTask：若今天不在配置的提醒日中，跳过
    if (Array.isArray(weeks) && !weeks[_now.day()]) {
      return false
    }

    // 若当前时间已超过结束时间，不再通知
    if (notificationEndTimeHMS || notificationEndTime) {
      const endTime = notificationEndTimeHMS
        ? getTodayDayjs(notificationEndTimeHMS)
        : dayjs(notificationEndTime)
      if (_now.isAfter(endTime)) {
        return false
      }
    }

    const afterStart = notificationLastNotifyTime
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

    // 若有结束时间，需要同时确保当前时间未超过结束时间（间隔后可能越界）
    if (afterStart && (notificationEndTimeHMS || notificationEndTime)) {
      const endTime = notificationEndTimeHMS
        ? getTodayDayjs(notificationEndTimeHMS)
        : dayjs(notificationEndTime)
      return !_now.isAfter(endTime)
    }

    return afterStart
  }

  // 执行通知检查
  async function checkNotificationAction() {
    const _now = dayjs()
    for (let i = 0; i < nowDayTodos.value.length; i++) {
      const todo = nowDayTodos.value[i]
      const { name, notificationRepeatCount, description } = todo
      if (checkItemIsNotifify(todo, _now)) {
        chromeNotification(
          `${generateRandomString(10)}%_%${NOTIFICATION_TODO}%_%${todo.id}`,
          {
            title: `提醒您：${name}`,
            message: description || '任务即将开始，请尽快完成',
            buttons: [
              { title: '关闭通知' },
              { title: '今日不再提醒' },
            ],
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
      // weeks 校验已移入 checkItemIsNotifify 内部
      if (checkItemIsNotifify(alarmTask, _now)) {
        chromeNotification(
          `${generateRandomString(10)}%_%${NOTIFICATION_ALARM}%_%${alarmTask.id}`,
          {
            title: `提醒您：${alarmTask.name}`,
            message: alarmTask.description || '任务即将开始，请尽快完成',
            buttons: [
              { title: '关闭通知' },
              { title: '今日不再提醒' },
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
      [NOTIFICATION_JUST_MESSAGE]: () => { },
      // 定时通知
      [NOTIFICATION_ALARM]: (btnIndex, id, handlerName, ...args) => {
        if (btnIndex === 0) {
          // 关闭通知：仅关闭当前弹窗，不影响后续重复提醒（这里什么都不做，后面会自动 clear）
        } else if (btnIndex === 1) {
          // 今日不再提醒：标记完成，今日内不再重复
          const task = alarmTasks.value.find((task) => task.id == id)
          if (task) task.notificationCompleted = true
        }
      },
      // todo通知
      [NOTIFICATION_TODO]: (btnIndex, todoId, handlerName, ...args) => {
        if (btnIndex === 0) {
          // 关闭通知：仅关闭当前弹窗，不影响后续重复提醒
        } else if (btnIndex === 1) {
          // 今日不再提醒：标记完成，今日内不再重复
          const todo = nowDayTodos.value.find((todo) => todo.id == todoId)
          if (todo) todo.notificationCompleted = true
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

  async function getYiYan() {
    try {
      const res = await (await fetch('https://api.codelife.cc/yiyan/random?lang=cn')).json()
      // const { hitokoto, from: author } = res.data
      console.log('res:>>', res.data, res.data.hitokoto)
      if (res.data.hitokoto) {
        yiyan.value = res.data
      }
    } catch (error) {
    }
  }

  let nowTimetimer
  let notifiCheckTimer
  onMounted(() => {
    !yiyan.value.hitokoto && getYiYan()

    nowTimetimer = setInterval(() => {
      now.value = dayjs()
    }, 1000)
    notifiCheckTimer = setInterval(() => {
      checkNotificationAction()
    }, 10000)
    notificationBtnEventHandler()
  })

  /**
   * app设置相关
   */
  const isShowAppSet = ref(false)
  const appSetForm = useStorage('appSetFrom', {
    iconSize: 60,
    iconRadius: 20,
    iconOpacity: 1,
    iconSpace: 20,
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
    yiyan,
    getYiYan,
    isShowAppSet,
    appSetForm
  }
})
