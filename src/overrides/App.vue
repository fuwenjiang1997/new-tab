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

      <main class="flex-1">
        <router-view></router-view>
      </main>
    </div>

    <AddMenuDialog v-model:visiable="addMenuVisiable"></AddMenuDialog>
    <ContextMenu></ContextMenu>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import useAppStore from '@/_stores/app'
import AddMenuDialog from './components/AddMenuDialog.vue'
import ContextMenu from './components/ContextMenu.vue'
import {
  HomeOutlined,
  PlusOutlined,
  SettingOutlined,
  CodeOutlined,
} from '@ant-design/icons-vue'
import useMenuIcon from './hooks/useMenuIcon'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { config } = storeToRefs(appStore)
const { customMenuIcons } = useMenuIcon()
const addMenuVisiable = ref(false)
const renderMenus = computed(() => {
  const menus = [
    {
      label: '首页',
      path: '/',
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
</style>
