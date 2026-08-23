<template>
  <!-- 定时任务 -->
  <MyIconCard v-bind="$attrs" class="icon-size-4x4" title="定时提醒">
    <div class="app-item-icon flex flex-col bg-neutral-700">
      <div class="flex justify-center items-center h-10 px-5 font-extrabold bg-orange-500 shadow-2xl select-none">
        定时提醒
      </div>
      <div class="flex flex-col bg-neutral-700" style="height: calc(100% - 40px)">
        <div class="flex-1 overflow-y-scroll no-scrollbar">
          <div v-for="(item, index) in alarmTasks" :key="index" class="flex gap-2 pt-2 px-4">
            <p class="flex-1" @click="editTask(item)">
              <span class="text-white">{{ item.name }}</span>
            </p>
            <div class="flex-center text-xs">
              <template v-if="item.notification">
                <span v-if="item.notificationCompleted" class="block w-2 h-2 mr-1 rounded-full bg-red-600" />
                <template v-else>
                  <span v-if="!item.weeks[now.day()]" class="block w-2 h-2 mr-1 rounded-full bg-blue-50" />
                  <span
                    v-else-if="
                      now.isAfter(getTodayDayjs(item.notificationStartTimeHMS))
                    " class="block w-2 h-2 mr-1 rounded-full bg-green-600"
                  />
                  <span v-else class="block w-2 h-2 mr-1 rounded-full bg-orange-400" />
                </template>
              </template>
              <span class="cursor-pointer underline" @click="deleteTask(item.id)">
                删除
              </span>
            </div>
          </div>
        </div>

        <div class="h-6 flex-center bg-white text-neutral-700 cursor-pointer text-sm" @click="editTask()">
          新增
        </div>
      </div>
    </div>
  </MyIconCard>

  <a-modal v-model:open="open" :title="form.id ? '编辑提醒' : '新增提醒'" @ok="saveTask">
    <div class="mt-5">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="名称" name="name" :rules="[{ required: true }]">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="form.description" :rows="2" />
        </a-form-item>

        <a-form-item label="通知日" name="weeks">
          <a-tag
            v-for="item in weekOptions" :key="item.value" :color="form.weeks[item.value] ? '#108ee9' : undefined"
            class="cursor-pointer" @click="() => (form.weeks[item.value] = !form.weeks[item.value])"
          >
            {{ item.label }}
          </a-tag>
        </a-form-item>

        <a-form-item label="开启通知" name="notification">
          <a-switch :checked="form.notification" @update:checked="changeFormNotification" />
        </a-form-item>

        <a-form-item v-if="form.notificationCompleted" label="通知已完成" name="notificationCompleted">
          <a-switch v-model:checked="form.notificationCompleted" />
        </a-form-item>

        <template v-if="form.notification">
          <a-form-item label="开始通知时间" name="notificationStartTime" :rules="[{ required: true }]">
            <a-time-picker
              :value="form.notificationStartTime" format="HH:mm" value-format="YYYY-MM-DD HH:mm:ss"
              @update:value="changeNotificationStartTime"
            />
          </a-form-item>

          <a-form-item label="结束通知时间" name="notificationEndTime">
            <a-time-picker
              :value="form.notificationEndTime" format="HH:mm" value-format="YYYY-MM-DD HH:mm:ss"
              @update:value="changeNotificationEndTime"
            />
          </a-form-item>

          <a-form-item label="通知间隔" name="notificationRepeatTime">
            <div class="flex">
              <a-input-number v-model:value="form.notificationRepeatTime" class="!w-[90px] mr-10">
                <template #addonAfter>
                  <a-select v-model:value="form.notificationRepeatTimebase" style="width: 60px">
                    <a-select-option :value="60 * 1000">
                      分
                    </a-select-option>
                    <a-select-option :value="60 * 60 * 1000">
                      时
                    </a-select-option>
                  </a-select>
                </template>
              </a-input-number>
            </div>
          </a-form-item>

          <a-form-item label="通知次数" name="notificationRepeatCount">
            <a-input-number v-model:value="form.notificationRepeatCount" class="!w-[200px]" placeholder="0或者空表示一直通知" />
          </a-form-item>
        </template>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import { getTodayDayjs } from '@/_utils/util'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const appStore = useAppStore()
const { now, alarmTasks } = storeToRefs(appStore)
const form = ref({})
const open = ref(false)

const baseTask = function () {
  return {
    name: '提醒事项',
    description: '',
    weeks: Array.from({ length: 7 }).fill(false),
    index: 0,
    notification: false,
    notificationStartTime: '',
    notificationStartTimeHMS: '',
    notificationEndTime: '',
    notificationEndTimeHMS: '',
    notificationLastNotifyTime: '', // 上一次通知的时间
    notificationRepeatCount: 0,
    notificationSuccessCount: 0, // 已通知次数
    notificationRepeatTime: 5,
    notificationRepeatTimebase: 1000 * 60, // 分
    notificationCompleted: false,
  }
}

const weekOptions = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 0, label: '周日' },
]

const changeFormNotification = (newStatus) => {
  if (newStatus && !form.value.notificationStartTime) {
    changeNotificationStartTime(now.value)
  }
  form.value.notification = newStatus
}

function changeNotificationStartTime(v) {
  form.value.notificationStartTime = dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  form.value.notificationStartTimeHMS = dayjs(v).format('HH:mm:ss')
}

function changeNotificationEndTime(v) {
  form.value.notificationEndTime = dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  form.value.notificationEndTimeHMS = dayjs(v).format('HH:mm:ss')
}

function editTask(v) {
  if (v) {
    form.value = cloneDeep(v)
  } else {
    form.value = baseTask()
  }
  open.value = true
}

function saveTask() {
  if (form.value.id) {
    const index = alarmTasks.value.findIndex(
      (item) => item.id === form.value.id
    )
    alarmTasks.value.splice(index, 1, form.value)
  } else {
    alarmTasks.value.push({
      id: new Date().getTime(),
      ...form.value,
    })
  }
  open.value = false
}

function deleteTask(id) {
  const index = alarmTasks.value.findIndex((item) => item.id === id)
  alarmTasks.value.splice(index, 1)
}
</script>
