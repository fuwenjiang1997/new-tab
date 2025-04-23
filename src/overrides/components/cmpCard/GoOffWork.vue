<template>
  <MyIconCard
    v-bind="$attrs"
    class="icon-size-4x2"
    title="下班倒计时"
    @click="goOffWorkTimeSetDialogRef.show()"
  >
    <div class="app-item-icon py-2 px-3 bg-white" :style="{
            backgroundColor: goOffWorkTimeConfig?.bgColor,
            color: goOffWorkTimeConfig?.textColor,
          }">
      <div>
        <p class="opacity-70">
          下班还有
          <span class="text-xs">【今日事今日毕】</span>
        </p>
        <p class="text-3xl font-semibold">
          {{ getDiffGoOffWorkTime(goOffWorkTimeConfig.workTime[0], goOffWorkTimeConfig.workTime[1]) }}
        </p>
      </div>
      <div class="" />
    </div>
  </MyIconCard>


  <GoOffWorkTimeSetDialog ref="goOffWorkTimeSetDialogRef">
    <template #default="{ formState }">
      <div class="flex-1 flex-center items-stretch py-20 bg-zinc-600" >
        <MyIconCard
          class="icon-size-4x2"
          title="下班倒计时"
        >
          <div class="app-item-icon py-2 px-3 bg-white" :style="{
            backgroundColor: formState.bgColor,
            color: formState.textColor,
          }" >
            <div>
              <p class="opacity-70">
                下班还有
                <span class="text-xs">【今日事今日毕】</span>
              </p>
              <p class="text-3xl font-semibold">
                {{ getDiffGoOffWorkTime(formState.workTime[0], formState.workTime[1]) }}
              </p>
            </div>
            <div class="" />
          </div>
        </MyIconCard>
    </div>
    </template>
  </GoOffWorkTimeSetDialog>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { storeToRefs } from 'pinia'
import GoOffWorkTimeSetDialog from '../GoOffWorkTimeSetDialog.vue'
import { ref } from 'vue'
dayjs.extend(duration)

const appStore = useAppStore()
const { now, goOffWorkTimeConfig } = storeToRefs(appStore)
const goOffWorkTimeSetDialogRef = ref()
function getDiffGoOffWorkTime(goOnWorkTime, goOffWorkTime) {
  const goOffWorkArr = goOffWorkTime.split(':')
  const onWorkArr = goOnWorkTime.split(':')
  const todayGoOffWorkTime = dayjs().hour(goOffWorkArr[0]).minute(goOffWorkArr[1]).second(0)
  const todayGoOnWorkTime = dayjs().hour(onWorkArr[0]).minute(onWorkArr[1]).second(0)

  if (now.value.isBefore(todayGoOffWorkTime) && now.value.isAfter(todayGoOnWorkTime)) {
    const duration = dayjs.duration(todayGoOffWorkTime.diff(now.value))
    return duration.format('HH:mm:ss')
  } else {
    return '已下班'
  }
}

</script>
