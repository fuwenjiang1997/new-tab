<template>
  <div
    class="page-container"
    :style="{
      backgroundImage: config.bgImg && `url(${config.bgImg})`,
    }"
  >
    <div
      id="home-page"
      class="flex h-screen w-screen text-white text-base"
    >
      <aside
        class="w-[140px] h-full shrink-0 flex flex-col justify-between pb-5"
      >
        <div>
          <router-link
            v-for="item in renderMenus"
            :key="item"
            :to="item.path || `/custom-page/${item.customPath}`"
            class="flex flex-col items-center gap-2 py-5 cursor-pointer"
            :class="{
              active:
                $route.path ===
                (item.path ?? `/custom-page/${item.customPath}`),
            }"
          >
            <div>
              <component
                :is="item.icon || customMenuIcons[item.customIcon]"
                class="text-[20px]"
              />
            </div>
            <p>{{ item.label }}</p>
          </router-link>

          <!-- <div
            class="flex justify-center py-5 cursor-pointer"
            @click="addMenuVisiable = true"
          >
            <PlusOutlined class="text-[30px]" />
          </div> -->
        </div>

        <div class="justify-self-end">
          <router-link
            class="flex justify-center py-5 cursor-pointer"
            to="/set"
            :class="{ active: $route.path === '/set' }"
          >
            <SettingOutlined class="text-[30px]" />
          </router-link>
        </div>
      </aside>

      <main class="flex-1 flex flex-col">
        <div class="flex-1 overflow-hidden">
          <router-view />
        </div>
        <div class="yiyan-container h-10 shrink-0 pt-1 text-center">
          <div class="relative inline-block text-xs">
            <p class="yiyan-content">「{{ yiyan.hitokoto }}」</p>
            <p class="yiyan-from opacity-0">{{ yiyan.from }}</p>
            <div class="yiyan-handler hidden absolute left-full top-0 ml-4 flex-center px-2 py-1 bg-[rgba(255,255,255,0.4)] text-xs rounded-md">
                <CopyOutlined class="mr-2 cursor-pointer px-1 py-1 hover:bg-[rgba(255,255,255,0.2)] rounded-sm" @click="copy(yiyan.hitokoto)" />
                <ReloadOutlined class="cursor-pointer px-1 py-1 hover:bg-[rgba(255,255,255,0.2)] rounded-sm" @click="appStore.getYiYan" />
              </div>
          </div>
        </div>
        
      </main>
    </div>

    <AddMenuDialog v-model:visiable="addMenuVisiable" />
    <ContextMenu />
    <n-alert v-if="copied" class=" !absolute top-4 right-2 w-50 transition-all" title="" type="success" closable> 复制成功 </n-alert>
  </div>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import {
  CodeOutlined,
  HomeOutlined,
  SettingOutlined,
  CopyOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import AddMenuDialog from './components/AddMenuDialog.vue'
import ContextMenu from './components/ContextMenu.vue'
import useMenuIcon from './hooks/useMenuIcon'
import { useClipboard } from '@vueuse/core'

const appStore = useAppStore()
const { config, yiyan } = storeToRefs(appStore)
const { customMenuIcons } = useMenuIcon()
const addMenuVisiable = ref(false)
const renderMenus = computed(() => {
  const menus = [
    {
      label: '首页',
      path: '/home',
      icon: HomeOutlined,
    },
    {
      label: '脚本',
      path: '/script',
      icon: CodeOutlined,
    },
  ]
  return [...menus, ...appStore.menus]
})

const { text, copy, copied, isSupported } = useClipboard({ source: yiyan.value.hitokoto })
</script>

<style scoped>
.page-container {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('./assets/bg.jpeg');
}
#home-page {
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.1);
  aside {
    background: rgba(0, 0, 0, 0.3);
    .active {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
.yiyan-container {
  &:hover {
    .yiyan-from {
      opacity: 1;
    }
    .yiyan-handler {
      display: flex;
    }
  }
}
</style>
