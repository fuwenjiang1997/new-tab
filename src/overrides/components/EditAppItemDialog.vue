<template>
  <a-modal
    v-model:open="open"
    :title="form.id ? '编辑快捷链接' : '新增快捷链接'"
    :width="570"
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
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <a-upload
                :show-upload-list="false"
                @change="handleUploadIcon"
              >
                <a-button size="small">
                  <upload-outlined />
                  上传图片
                </a-button>
              </a-upload>
              <a-input
                v-model:value="iconUrl"
                size="small"
                placeholder="输入图标链接"
                class="flex-1"
              />
              <a-button
                size="small"
                :loading="iconUrlLoading"
                @click="handleFetchIconUrl"
              >
                使用
              </a-button>
              <a-button
                size="small"
                :loading="faviconLoading"
                @click="handleFetchFavicon"
              >
                抓取
              </a-button>
            </div>
            <img
              v-if="form.icon"
              class="w-10 h-10 object-contain"
              :src="form.icon"
            >
            <span v-else class="text-gray-400 text-xs">暂无图标，可上传、输入链接或点击抓取自动获取</span>
          </div>
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
import useAppStore from '@/_stores/app'
import { generateRandomString, getFavicon, fileToBase64, fetchImgToBase64 } from '@/_utils/util'
import { UploadOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

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
const iconUrl = ref('')
const iconUrlLoading = ref(false)
const faviconLoading = ref(false)

async function handleFetchFavicon() {
  if (!form.value.link) return
  faviconLoading.value = true
  try {
    const base64 = await getFavicon(form.value.link)
    if (base64) {
      form.value.icon = base64
    }
  } finally {
    faviconLoading.value = false
  }
}

async function handleUploadIcon(v) {
  form.value.icon = await fileToBase64(v.file.originFileObj)
}

async function handleFetchIconUrl() {
  if (!iconUrl.value) return
  iconUrlLoading.value = true
  try {
    const base64 = await fetchImgToBase64(iconUrl.value)
    if (base64) {
      form.value.icon = base64
    }
  } finally {
    iconUrlLoading.value = false
  }
}

async function onSave() {
  const index = homeAppList.value.findIndex((item) => item.id === form.value.id)
  if (index === -1) {
    form.value.icon = form.value.icon || (await getFavicon(form.value.link)) || ''
    homeAppList.value.push(form.value)
  } else {
    homeAppList.value.splice(index, 1, form.value)
  }
  open.value = false
}

function show(v) {
  form.value = v || getBaseForm()
  iconUrl.value = ''
  open.value = true
}

defineExpose({
  show,
})
</script>
