<template>
  <MyIconCard
    v-bind="$attrs"
    class="icon-size-4x4"
    title="Todo"
  >
    <div class="app-item-icon">
      <div
        class="flex justify-center items-center h-10 px-5 font-extrabold bg-yellow-500 shadow-2xl select-none"
      >
        <span
          class="text-xs cursor-pointer"
          @click="
            activeDay = dayjs(activeDay).add(-1, 'day').format('YYYY-MM-DD')
          "
        >
          前一天
        </span>
        <span
          class="mx-auto text-center cursor-pointer"
          @click="activeDay = now.format('YYYY-MM-DD')"
        >
          待办
        </span>
        <span
          class="text-xs cursor-pointer"
          @click="
            activeDay = dayjs(activeDay).add(1, 'day').format('YYYY-MM-DD')
          "
        >
          后一天
        </span>
      </div>
      <div
        class="flex flex-col bg-neutral-700"
        style="height: calc(100% - 40px)"
      >
        <p class="text-center text-sm py-1">
          {{ activeDay }}
        </p>
        <div class="flex-1 overflow-y-scroll no-scrollbar">
          <div
            v-for="item in dayTodos"
            :key="item.id"
            class="flex gap-2 pt-2 px-4"
          >
            <a-checkbox v-model:checked="item.completed" />
            <p
              class="flex-1"
              @click="editTodo(item)"
            >
              <span v-if="!item.completed">{{ item.name }}</span>
              <del v-else>{{ item.name }}</del>
            </p>
            <div class="flex-center text-xs">
              <template v-if="item.notification">
                <span
                  v-if="item.notificationCompleted"
                  class="block w-2 h-2 mr-1 rounded-full bg-red-600"
                />
                <template v-else>
                  <span
                    v-if="now.isAfter(dayjs(item.notificationStartTime))"
                    class="block w-2 h-2 mr-1 rounded-full bg-green-600"
                  />
                  <span
                    v-else
                    class="block w-2 h-2 mr-1 rounded-full bg-orange-400"
                  />
                </template>
              </template>
              <span
                class="cursor-pointer underline"
                @click="deleteTodo(item)"
              >
                删除
              </span>
            </div>
          </div>
        </div>

        <div
          class="h-6 flex-center bg-white text-neutral-700 cursor-pointer text-sm"
          @click="editTodo()"
        >
          新增
        </div>
      </div>
    </div>
  </MyIconCard>

  <a-modal
    v-model:open="open"
    :title="todoForm.id ? '编辑Todo' : '新增Todo'"
    @ok="saveTodo"
  >
    <div class="mt-5">
      <a-form
        :model="todoForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item
          label="名称"
          name="name"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="todoForm.name" />
        </a-form-item>
        <a-form-item
          label="描述"
          name="description"
        >
          <a-textarea
            v-model:value="todoForm.description"
            :rows="4"
          />
        </a-form-item>

        <a-form-item
          label="开启通知"
          name="notification"
        >
          <a-switch
            :checked="todoForm.notification"
            @update:checked="changeTodoFormNotification"
          />
        </a-form-item>

        <a-form-item
          v-if="todoForm.notificationCompleted"
          label="通知已完成"
          name="notificationCompleted"
        >
          <a-switch
            :checked="todoForm.notificationCompleted"
            @update:checked="changeTodoFormCompleted"
          />
        </a-form-item>

        <template v-if="todoForm.notification">
          <a-form-item
            label="开始通知时间"
            name="notificationStartTime"
            :rules="[{ required: true }]"
          >
            <a-time-picker
              v-model:value="todoForm.notificationStartTime"
              format="HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>

          <a-form-item
            label="通知间隔"
            name="notificationRepeatTime"
          >
            <div class="flex">
              <a-input-number
                v-model:value="todoForm.notificationRepeatTime"
                class="!w-[90px] mr-10"
              >
                <template #addonAfter>
                  <a-select
                    v-model:value="todoForm.notificationRepeatTimebase"
                    style="width: 60px"
                  >
                    <!-- <a-select-option :value="1000">秒</a-select-option> -->
                    <a-select-option :value="60 * 1000">
                      分
                    </a-select-option>
                    <a-select-option :value="60 * 60 * 2000">
                      时
                    </a-select-option>
                  </a-select>
                </template>
              </a-input-number>
            </div>
          </a-form-item>

          <a-form-item
            label="通知次数"
            name="notificationRepeatCount"
          >
            <a-input-number
              v-model:value="todoForm.notificationRepeatCount"
              class="!w-[200px]"
              placeholder="0或者空表示一直通知"
            />
          </a-form-item>
        </template>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const appStore = useAppStore()
const { now } = storeToRefs(appStore)
const open = ref(false)
const todoForm = ref({})
const activeDay = ref(now.value.format('YYYY-MM-DD'))
const todos = ref({})

watch(() => activeDay.value, () => {
  todos.value = useStorage(`todos_${activeDay.value.slice(0, 7)}`, {}).value
}, {
  immediate: true,
})

const baseTody = function () {
  return {
    name: '',
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
  return todos.value[activeDay.value] || []
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
  const todoList = todos.value[activeDay.value] || []
  const todoData = todoForm.value
  if (todoData.id) {
    const index = todoList.findIndex((item) => item.id === todoData.id)
    todoList.splice(index, 1, todoData)
  } else {
    todoData.id = new Date().getTime()
    todoList.push(todoData)
  }
  todos.value[activeDay.value] = todoList
  open.value = false
}

const deleteTodo = (v) => {
  const todoList = todos.value[activeDay.value] || []
  const index = todoList.findIndex((item) => item.id === v.id)
  if (index !== -1) {
    todoList.splice(index, 1)
    todos.value[activeDay.value] = todoList
  }
}
</script>
