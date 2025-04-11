<template>
  <MyIconCard
    class="icon-size-4x2"
    title="下班倒计时"
  >
    <div class="app-item-icon py-2 px-3 bg-white text-neutral-700">
      <div>
        <p class="text-neutral-500">
          下班还有
          <span class="text-xs">【今日事今日毕】</span>
        </p>
        <p class="text-3xl font-semibold">
          {{ diffGoOffWorkTime }}
        </p>
      </div>
      <div class="" />
    </div>
  </MyIconCard>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
dayjs.extend(duration)

const appStore = useAppStore()
const { now } = storeToRefs(appStore)

const diffGoOffWorkTime = computed(() => {
  const todayGoOffWorkTime = dayjs().hour(18).minute(30).second(0)
  if (now.value.isBefore(todayGoOffWorkTime)) {
    const duration = dayjs.duration(todayGoOffWorkTime.diff(now.value))
    return duration.format('HH:mm:ss')
  } else {
    return '已下班'
  }
  // return now.value.format('YYYY-MM-DD') + ' ' + offWorkTime.value
})
const offWorkTime = ref('18:30:00')
</script>
