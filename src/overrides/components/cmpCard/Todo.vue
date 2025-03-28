<template>
  <MyIconCard v-bind="$attrs" class="icon-size-4x4" title="Todo">
    <div class="app-item-icon">
      <div class="flex justify-center items-center h-10 px-5 font-extrabold bg-yellow-500 shadow-2xl select-none">
        <span class="text-xs cursor-pointer" @click="
          activeDay = dayjs(activeDay).add(-1, 'day').format('YYYY-MM-DD')
          ">
          前一天
        </span>
        <span class="mx-auto text-center cursor-pointer" @click="activeDay = now.format('YYYY-MM-DD')">
          待办
        </span>
        <span class="text-xs cursor-pointer" @click="
          activeDay = dayjs(activeDay).add(1, 'day').format('YYYY-MM-DD')
          ">
          后一天
        </span>
      </div>
      <div class="flex flex-col bg-neutral-700" style="height: calc(100% - 40px)">
        <div class="flex-1 overflow-y-scroll no-scrollbar">
          <div class="flex gap-2 pt-2 px-4" v-for="item in dayTodos">
            <a-checkbox v-model:checked="item.completed"></a-checkbox>
            <p class="flex-1" @click="editTodo(item)">
              <span class="text-white">{{ item.name }}</span>
            </p>
            <div class="flex-center text-xs">
              <template v-if="item.notification">
                <span v-if="item.notificationCompleted" class="block w-2 h-2 mr-1 rounded-full bg-red-600"></span>
                <template v-else>
                  <span v-if="now.isAfter(dayjs(item.notificationStartTime))"
                    class="block w-2 h-2 mr-1 rounded-full bg-green-600"></span>
                  <span v-else
                    class="block w-2 h-2 mr-1 rounded-full bg-orange-400"></span>
                </template>
              </template>
              <span class="cursor-pointer underline" @click="deleteTodo(item)">删除</span>
            </div>
          </div>
        </div>

        <div class="h-6 flex-center bg-white text-neutral-700 cursor-pointer text-sm" @click="editTodo()">
          新增
        </div>
      </div>
    </div>
  </MyIconCard>

  <a-modal v-model:open="open" :title="todoForm.id ? '编辑Todo' : '新增Todo'" @ok="saveTodo">
    <div class="mt-5">
      <a-form :model="todoForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="名称" name="name" :rules="[{ required: true }]">
          <a-input v-model:value="todoForm.name" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="todoForm.description" :rows="4" />
        </a-form-item>
      
        <a-form-item label="开启通知" name="notification">
          <a-switch :checked="todoForm.notification" @update:checked="changeTodoFormNotification" />
        </a-form-item>

        <a-form-item v-if="todoForm.notificationCompleted" label="通知已完成" name="notificationCompleted">
          <a-switch :checked="todoForm.notificationCompleted" @update:checked="changeTodoFormCompleted" />
        </a-form-item>

        <template v-if="todoForm.notification">
          <a-form-item label="开始通知时间" name="notificationStartTime" :rules="[{ required: true }]">
            <a-time-picker
              v-model:value="todoForm.notificationStartTime"
              format="HH:mm"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              />
          </a-form-item>

          <a-form-item label="通知间隔" name="notificationRepeatTime">
            <div class="flex">
              <a-input-number class="!w-[90px] mr-10" v-model:value="todoForm.notificationRepeatTime">
                <template #addonAfter>
                  <a-select v-model:value="todoForm.notificationRepeatTimebase" style="width: 60px">
                    <!-- <a-select-option :value="1000">秒</a-select-option> -->
                    <a-select-option :value="60 * 1000">分</a-select-option>
                    <a-select-option :value="60 * 60 * 2000">
                      时
                    </a-select-option>
                  </a-select>
                </template>
              </a-input-number>
            </div>
          </a-form-item>

          <a-form-item label="通知次数" name="notificationRepeatCount">
            <a-input-number class="!w-[200px]" v-model:value="todoForm.notificationRepeatCount"
              placeholder="0或者空表示一直通知" />
          </a-form-item>
        </template>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import { computed, ref } from 'vue'
import useAppStore from '@/_stores/app'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { now } = storeToRefs(appStore)
const open = ref(false)
const todoForm = ref({})
const activeDay = ref(now.value.format('YYYY-MM-DD'))

const baseTody = function () {
  return {
    name: '待办事项',
    description: '',
    completed: false,
    index: 0,
    notification: false,
    notificationStartTime: '',
    notificationLastNotifyTime: '', // 上一次通知的时间
    notificationRepeatCount: 1,
    notificationSuccessCount: 0, // 已通知次数
    notificationRepeatTime: 5,
    notificationRepeatTimebase: 1000 * 60, // 分
    notificationCompleted: false,
  }
}

const dayTodos = computed(() => {
  return appStore.todos[activeDay.value] || []
})

const changeTodoFormNotification = (newStatus) => {
  if (newStatus && !todoForm.value.notificationStartTime) {
    todoForm.value.notificationStartTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  todoForm.value.notification = newStatus
}

const changeTodoFormCompleted = (newStatus) => {
  todoForm.value.notificationCompleted = newStatus
  todoForm.value.notificationLastNotifyTime = ''
}

const editTodo = (v) => {
  if (v) {
    todoForm.value = cloneDeep(v)
  } else {
    todoForm.value = baseTody()
  }
  open.value = true
}

const saveTodo = () => {
  const todoList = appStore.todos[activeDay.value] || []
  const todoData = todoForm.value
  if (todoData.id) {
    const index = todoList.findIndex((item) => item.id === todoData.id)
    todoList.splice(index, 1, todoData)
  } else {
    todoData.id = new Date().getTime()
    todoList.push(todoData)
  }
  appStore.todos[activeDay.value] = todoList
  open.value = false
}

const deleteTodo = (v) => {
  const todoList = appStore.todos[activeDay.value] || []
  const index = todoList.findIndex((item) => item.id === v.id)
  if (index !== -1) {
    todoList.splice(index, 1)
    appStore.todos[activeDay.value] = todoList
  }
}
</script>
