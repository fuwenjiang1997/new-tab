<template>
  <a-modal
    v-model:open="open"
    title="Add Menu"
    @ok="handleOk"
  >
    <div class="mt-5">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
      >
        <a-form-item
          label="Icon"
          name="customIcon"
          :rules="[{ required: true }]"
        >
          <a-select v-model:value="formState.customIcon">
            <a-select-option
              v-for="(icon, iconName) in customMenuIcons"
              :key="iconName"
              :value="iconName"
            >
              <div class="flex items-center">
                <component
                  :is="icon"
                  class="text-[16px] mr-2"
                />
                {{ iconName }}
              </div>
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Label"
          name="label"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="formState.label" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import { generateRandomString } from '@/_utils/util'
import { ref } from 'vue'
import useMenuIcon from '../hooks/useMenuIcon'

const appStore = useAppStore()
const open = defineModel('visiable', { default: false })
const { customMenuIcons } = useMenuIcon()

const formState = ref({
  customIcon: '',
  label: '',
  customPath: '',
})

function handleOk() {
  formState.value.customPath = generateRandomString(8)
  appStore.menus.push(formState.value)
  open.value = false
}
</script>
