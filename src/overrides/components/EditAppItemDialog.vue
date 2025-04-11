<template>
  <a-modal
    v-model:open="open"
    :title="form.id ? '编辑提醒' : '新增提醒'"
    @ok="onSave"
  >
    <div class="mt-5">
      <a-form
        :model="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item
          label="名称"
          name="name"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item
          label="链接"
          name="link"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="form.link" />
        </a-form-item>
        <a-form-item
          label="图标"
          name="icon"
          :rules="[{ required: false }]"
        >
          <img
            class="w-10 h-auto"
            :src="form.icon"
          />
        </a-form-item>
        <a-form-item
          label="描述"
          name="description"
        >
          <a-textarea
            v-model:value="form.description"
            :rows="2"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import { ref } from 'vue'
import useAppStore from '@/_stores/app'
import { storeToRefs } from 'pinia'
import { generateRandomString, getFavicon } from '@/_utils/util'

const getBaseForm = () => ({
  id: generateRandomString(10),
  type: 'link',
  name: '',
  description: '',
  link: '',
  icon: '',
})
const appStore = useAppStore()
const { homeAppList } = storeToRefs(appStore)
const form = ref({})
const open = ref(false)

async function onSave() {
  const index = homeAppList.value.findIndex((item) => item.id === form.value.id)
  if (index === -1) {
    form.value.icon = (await getFavicon(form.value.link)) || ''
    homeAppList.value.push(form.value)
  } else {
    homeAppList.value.splice(index, 1, form.value)
  }
  open.value = false
}

function show(v) {
  form.value = v || getBaseForm()
  open.value = true
}

defineExpose({
  show,
})
</script>
