<template>
  <a-modal
    v-model:open="open"
    title="下班时间设置"
    width="960px"
    @ok="onOk"
    @cancel="onCancel"
  >
    <div class="flex items-center">
      <slot :formState="formState"></slot>
      <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="工作日" name="label" :rules="[{ required: true }]">
          <a-checkable-tag
            v-for="(tag, index) in weekOptions"
            :key="tag.value"
            v-model:checked="formState.weekWorkDay[index]"
          >
            {{ tag.label }}
          </a-checkable-tag>
        </a-form-item>

        <a-form-item label="工作时间" name="workTime" :rules="[{ required: true }]">
          <a-time-range-picker
            v-model:value="formState.workTime"
            value-format="HH:mm"
            format="HH:mm"
          />
        </a-form-item>

        <a-form-item label="文字" name="workTime" :rules="[{ required: true }]">
          <div class="flex gap-1 items-center">
                <div
                  v-for="(item, index) in shortcutBgColors"
                  :key="index"
                  class="flex-center border w-5 h-5 rounded-full shrink-0 cursor-pointer hover:scale-105"
                  :style="`background:${item}`"
                  @click="formState.textColor = item"
                >
                  <CheckOutlined v-if="formState.textColor === item" :class="{ '!text-white': index >= 7 }" />
                </div>
                <div class=" w-40">
                  <n-color-picker
                    v-model:value="formState.textColor"
                    :actions="['clear']"
                  />
                </div>
              </div>
        </a-form-item>

        <a-form-item label="背景" name="workTime" :rules="[{ required: true }]">
          <div>
            <div class="flex gap-2 mt-1">
              <a-tag class=" cursor-pointer" :color="formState.bgSetType === 1 ? '#1677ff' : ''" @click="formState.bgSetType = 1">
                颜色
              </a-tag>
              <!-- <a-tag class=" cursor-pointer" :color="formState.bgSetType === 2 ? '#1677ff' : ''" @click="formState.bgSetType = 2">
                背景图
              </a-tag> -->
            </div>

            <div class="mt-2">
              <div v-if="formState.bgSetType === 1" class="flex gap-1 items-center">
                <div
                  v-for="(item, index) in shortcutBgColors"
                  :key="index"
                  class="flex-center border w-5 h-5 rounded-full shrink-0 cursor-pointer hover:scale-105"
                  :style="`background:${item}`"
                  @click="formState.bgColor = item"
                >
                  <CheckOutlined v-if="formState.bgColor === item" :class="{ '!text-white': index >= 7 }" />
                </div>
                <div class=" w-40">
                  <n-color-picker
                    v-model:value="formState.bgColor"
                    :actions="['clear']"
                  />
                </div>
              </div>
            </div>
          </div>
        </a-form-item>

        <a-form-item label="发薪日" name="salaryDay" :rules="[{ required: true }]">
          <div class="flex gap-2">
            <a-date-picker :value="isSpecialsalaryDay ? '' : formState.salaryDay" @update:value="(v) => formState.salaryDay = v" format="MM-DD" valueFormat="MM-DD" />
            <a-button :type="formState.salaryDay === MONTH_END ? 'primary' : 'default'" @click="formState.salaryDay = MONTH_END">月底</a-button>
            <a-button :type="formState.salaryDay === MONTH_START ? 'primary' : 'default'" @click="formState.salaryDay = MONTH_START">月初</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import {CheckOutlined} from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash'
import { computed, ref } from 'vue'
import {  MONTH_END, MONTH_START } from '@/_utils/const'

const appStore = useAppStore()
const open = ref(false)

const formState = ref(appStore.baseGoOffWorkTimeConfig())
const weekOptions = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 0 },
]
const shortcutBgColors = ['rgb(255, 255, 255)', 'rgb(244, 238, 230)','rgb(163, 221, 185)',  'rgb(125, 172, 104)', 'rgb(251, 190, 35)', 'rgb(252, 69, 72)', 'rgb(200, 172, 112)', 'rgb(2, 51, 115)',  'rgb(55, 33, 40)', 'rgb(200, 44, 52)', 'rgb(5, 64, 146)',  'rgb(36, 88, 119)','rgb(75, 60, 54)']
const isSpecialsalaryDay = computed(() => [MONTH_START, MONTH_END].includes(formState.value.salaryDay))

function onOk() {
  open.value = false
  appStore.goOffWorkTimeConfig = formState.value
}
function onCancel() {
}
function show() {
  formState.value = cloneDeep({
    ...appStore.baseGoOffWorkTimeConfig(),
    ...appStore.goOffWorkTimeConfig
  })
  open.value = true
}

defineExpose({
  show,
})
</script>