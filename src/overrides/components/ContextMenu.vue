<template>
  <div
    id="contextmenu"
    class="hidden w-40 px-3 py-3 bg-neutral-900 text-white rounded-lg text-xs shadow-md"
  >
    <template v-if="app">
      <div
        v-if="app.link"
        class="mb-3 flex items-center"
      >
        <i-tabler-location-share class="mr-2 w-[14px] h-[14px]" />
        <a target="_blank" :href="app.link" class="flex-1 cursor-pointer hover:underline">
          新标签页打开
        </a>
      </div>

      <div class="mb-3">
        <div class="flex items-center">
          <LayoutOutlined class="mr-2 text-sm" />
          <span class="flex-1">布局</span>
        </div>
        <div class="mt-2 grid grid-cols-3 gap-2">
          <span
            class="flex-center rounded-full h-5 bg-neutral-700 cursor-pointer"
            @click="app.size = '1x1'"
          >
            1x1
          </span>
          <span
            class="flex-center rounded-full h-5 bg-neutral-700 cursor-pointer"
            @click="app.size = '1x2'"
          >
            1x2
          </span>
          <span
            class="flex-center rounded-full h-5 bg-neutral-700 cursor-pointer"
            @click="app.size = '2x1'"
          >
            2x1
          </span>
          <span
            class="flex-center rounded-full h-5 bg-neutral-700 cursor-pointer"
            @click="app.size = '2x2'"
          >
            2x2
          </span>
          <span
            class="flex-center rounded-full h-5 bg-neutral-700 cursor-pointer"
            @click="app.size = '2x4'"
          >
            2x4
          </span>
        </div>
      </div>

      <div class="mb-3 flex items-center">
        <EditOutlined class="mr-2 text-sm" />
        <span
          class="flex-1 cursor-pointer hover:underline"
          @click="editAppItemRef.show(app)"
        >
          编辑
        </span>
      </div>

      <div class="mb-3 flex items-center">
        <DeleteOutlined class="mr-2 text-sm" />
        <span
          class="flex-1 cursor-pointer hover:underline"
          @click="deleteApp"
        >
          删除
        </span>
      </div>
    </template>

    <div class="flex items-center">
      <i-hugeicons-image-01 class="mr-2 w-[14px] h-[14px]" />
      <span
        class="flex-1 cursor-pointer hover:underline"
        @click="bgImgSetDialogRef.show()"
      >
        更换背景
      </span>
    </div>
  </div>

  <EditAppItemDialog ref="editAppItemRef" />
  <BgImgSetDialog ref="bgImgSetDialogRef" />
  <BgImgSetDialog ref="bgImgSetDialogRef" />
  <GoOffWorkTimeSetDialog ref="goOffWorkTimeSetDialogRef" />
</template>
<script setup>
import useAppStore from '@/_stores/app'
import {
  DeleteOutlined,
  EditOutlined,
  LayoutOutlined,
} from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import BgImgSetDialog from './BgImgSetDialog.vue'
import EditAppItemDialog from './EditAppItemDialog.vue'
import GoOffWorkTimeSetDialog from './GoOffWorkTimeSetDialog.vue'

const appStore = useAppStore()
const { homeAppMap, homeAppList } = storeToRefs(appStore)
const isApp = ref(false)
const appId = ref()
const editAppItemRef = ref()
const goOffWorkTimeSetDialogRef = ref()
const app = computed(() => homeAppMap.value[appId.value])
const bgImgSetDialogRef = ref()

function deleteApp() {
  const index = homeAppList.value.findIndex((item) => item.id === appId.value)
  homeAppList.value.splice(index, 1)
}

document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
  const appContainer = event.target.closest('div[app-icon]')
  appId.value = appContainer?.getAttribute('id')
  isApp.value = !!appContainer
  const contextmenu = document.getElementById('contextmenu')
  contextmenu.style.top = `${event.clientY  }px`
  contextmenu.style.left = `${event.clientX  }px`
  contextmenu.style.display = 'block'
})
document.addEventListener('click', () => {
  const contextmenu = document.getElementById('contextmenu')
  contextmenu.style.display = 'none'
})
</script>

<style>
#contextmenu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>
