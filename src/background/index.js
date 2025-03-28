import { chromeNotification } from '@/_utils/util.js'

chrome.runtime.onInstalled.addListener(async (opt) => {
  console.log('111')
})

chrome.alarms.onAlarm.addListener((alarm) => {
  const info = alarm.name.split('%_%')
  chromeNotification({
    title: `提醒您：${info?.[1]}`,
    message: '任务即将开始，请尽快完成',
  })
})
