<template>
  <MyIconCard
    class="icon-size-4x2"
    title="下班倒计时"
  >
    <div class="app-item-icon py-2 px-3 bg-white" :style="{
            backgroundColor: config.bgColor,
            color: config.textColor,
          }">
      <div>
        <p class="opacity-70">
          下班还有
          <span class="text-xs">【今日事今日毕】</span>
        </p>
        <p class="text-3xl font-semibold">
          {{ getDiffGoOffWorkTime(config.workTime[0], config.workTime[1]) }}
        </p>
      </div>
      <div class="flex gap-2">
        <div :style="{ color: config.textColor }"
          class=" relative p-2 rounded-sm text-xs z-2 overflow-hidden"
        >
          <div class="absolute left-0 top-0 w-full h-full -z-1 bg-white opacity-50"></div>
          <p class="opacity-70">发薪日</p>
          <p><span class=" text-xl">{{ diffNextSalaryDay }}</span>天</p>
        </div>

        <div :style="{ color: config.textColor }"
          class=" relative p-2 rounded-sm text-xs z-2 overflow-hidden"
        >
          <div class="absolute left-0 top-0 w-full h-full -z-1 bg-white opacity-50"></div>
          <p class="opacity-70">周末</p>
          <p><span class=" text-xl">{{ getDiffNextRestDay() }}</span>天</p>
        </div>
      </div>
    </div>
  </MyIconCard>
</template>
<script setup>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import useAppStore from '@/_stores/app'
import {  MONTH_END, MONTH_START } from '@/_utils/const'
import { computed } from 'vue'
dayjs.extend(duration)

const appStore = useAppStore()
const { config } = defineProps(['config'])

function getDiffGoOffWorkTime(goOnWorkTime, goOffWorkTime) {
  const goOffWorkArr = goOffWorkTime.split(':')
  const onWorkArr = goOnWorkTime.split(':')
  const todayGoOffWorkTime = dayjs().hour(goOffWorkArr[0]).minute(goOffWorkArr[1]).second(0)
  const todayGoOnWorkTime = dayjs().hour(onWorkArr[0]).minute(onWorkArr[1]).second(0)

  if (appStore.now.isBefore(todayGoOffWorkTime) && appStore.now.isAfter(todayGoOnWorkTime)) {
    const duration = dayjs.duration(todayGoOffWorkTime.diff(appStore.now))
    return duration.format('HH:mm:ss')
  } else {
    return '已下班'
  }
}

const diffNextSalaryDay = computed(() => {
  const d = dayjs(dayjs().format('YYYY-MM-DD'))
  let nextSalaryDay
  if (config.salaryDay === MONTH_START) {
    nextSalaryDay = d.startOf('month').second(1)
  } else if (config.salaryDay === MONTH_END) {
    nextSalaryDay = d.endOf('month').second(0)
  } else {
    const _arr = config.salaryDay.split('-')
    nextSalaryDay = d.month(_arr[0]*1 - 1).date(_arr[1]*1)
  }
  if (d.isSame(nextSalaryDay)) {
    return 0
  }
  if (d.isAfter(nextSalaryDay)) {
    nextSalaryDay = nextSalaryDay.add(1, 'month')
  }
  return nextSalaryDay.diff(d, 'd')
})

function getDiffNextRestDay() {
  const day = new Date().getDay()
  if (day === 0 || day === 6) {
    return 0
  }
  return 6 - day
}
</script>