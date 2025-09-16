<template>
  <div class="w-[500px] fixed top-0 right-0 flex gap-0 pl-[1px] h-full bg-[#141414] text-white">
    <div class="w-[120px] flex flex-col gap-2 py-4 px-2 text-sm">
      <div class="h-10"></div>
      <div class="bg-[#333] h-[1px] my-2"></div>
      <div
        v-for="(item, index) in menuOptions"
        :key="item.key"
        class="flex items-center gap-2 px-3 py-2 rounded-2xl cursor-pointer hover:bg-[#1d1d1d]"
        :class="{ ' bg-[#1677ff]': activeMenu === item.key }"
        @click="activeMenu = item.key"
      >
        <component :is="item.icon" class=" shrink-0 text-base" />
        <span>{{ item.label }}</span>
      </div>
    </div>
   
    <div class="flex-1">
      <div class=" h-[72px]">
        
      </div>
      <div class="bg-[#0c0c0c] rounded-2xl p-4" style="height: calc(100% - 90px)">
        <component :is="renderCmp" />
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  InstagramOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import { computed, ref } from 'vue';
import IconSet from './views/app/IconSet.vue';
import SerachBar from './views/searchBar/SearchBar.vue'

const menuOptions = [
  {
    label: '图标',
    key: 'IconSet',
    icon: InstagramOutlined,
    component: IconSet
  },
  {
    label: '搜索栏',
    key: 'SerachBar',
    icon: SearchOutlined,
    component: SerachBar
  }
]

const activeMenu = ref('IconSet')

const renderCmp = computed(() => {
  const option = menuOptions.find(item => item.key === activeMenu.value)
  return option.component
})

// const menuOptions = [
//   {
//     label: 'app',
//     path: '/set/app',
//     key: 'appSet',
//   },
// ]
</script>
