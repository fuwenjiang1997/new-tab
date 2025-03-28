<template>
  <!-- 定时任务 -->
  <MyIconCard v-bind="$attrs" class="icon-size-4x4" title="定时提醒">
    <div class="app-item-icon flex flex-col bg-neutral-700">
        <div class="flex-1 overflow-y-scroll no-scrollbar">
          <div class="flex gap-2 pt-2 px-4" v-for="item in appStore.alarmTasks">
            <a-checkbox v-model:checked="item.completed"></a-checkbox>
            <p class="flex-1" @click="editTodo(item)">
              <span class="text-white">{{ item.name }}</span>
            </p>
            <div class="flex-center text-xs">
              <template v-if="item.notification">
                <span v-if="item.notificationCompleted" class="block w-2 h-2 mr-1 rounded-full bg-red-600"></span>
                <template v-else>
                  <span v-if="dayjs().isAfter(dayjs(item.notificationStartTime))"
                    class="block w-2 h-2 mr-1 rounded-full bg-orange-400"></span>
                  <span v-else="!item.notificationCompleted"
                    class="block w-2 h-2 mr-1 rounded-full bg-green-600"></span>
                </template>
              </template>
              <span class="cursor-pointer underline" @click="deleteTask(item)">删除</span>
            </div>
          </div>
        </div>

        <div class="h-6 flex-center bg-white text-neutral-700 cursor-pointer text-sm" @click="editTask()">
          新增
        </div>
      </div>
  </MyIconCard>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import dayjs from 'dayjs'

const appStore = useAppStore()

const baseTask = function () {
  return {
    name: '提醒事项',
    description: '',
    completed: false,
    index: 0,
    notification: false,
    notificationStartTime: '',
    notificationLastNotifyTime: '', // 上一次通知的时间
    notificationRepeatCount: 0,
    notificationSuccessCount: 0, // 已通知次数
    notificationRepeatTime: 5,
    notificationRepeatTimebase: 1000 * 60, // 分
    notificationCompleted: false,
  }
}

function editTask() {}

function deleteTask() {}

</script>