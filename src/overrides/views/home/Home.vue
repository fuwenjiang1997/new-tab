<template>
  <div class="pt-10 h-screen overflow-y-scroll no-scrollbar">
    <p class="mb-10 text-6xl text-center">
      {{ now.format('HH:mm:ss') }}
    </p>
    <div class="w-2/3 mx-auto">
      <form
        class="flex gap-2 h-12"
        action="https://www.google.com/search"
        method="GET"
      >
        <input
          class="flex-1 h-full px-5 outline-0 bg-[rgba(0,0,0,0.5)] rounded-full"
          type="text"
          name="q"
          placeholder="搜索 Google"
          autofocus
          autocomplete="off"
        >
      </form>
    </div>

    <div class="flex gap-5 mt-20 w-4/5 mx-auto">
      <div class="flex-1 icon-card-container">
        <AlarmTask />
        <GoOffWork />
        <!-- <Weather></Weather> -->

        <MyIconCard
          v-for="(item, index) in homeAppList"
          :id="item.id"
          :key="index"
          :class="{
            [`icon-size-${item.size || '1x1'}`]: true,
          }"
          :title="item.name"
        >
          <a
            :href="item.link"
            class="app-item-icon !flex flex-center p-2 bg-white text-black"
          >
            <img
              v-if="item.icon"
              :src="item.icon"
              class="w-10 h-10 object-contain"
            >
            <IconLink
              v-else
              class="w-full h-full"
            />
          </a>
        </MyIconCard>

        <EditAppItem />
      </div>
      <div class="fixed-box shrink-0">
        <Todo />
      </div>
    </div>
  </div>
</template>
<script setup>
import IconLink from '@/_components/icons/IconLink.vue'
import useAppStore from '@/_stores/app'
import AlarmTask from '@/overrides/components/cmpCard/AlarmTask.vue'
import EditAppItem from '@/overrides/components/cmpCard/EditAppItem.vue'
import GoOffWork from '@/overrides/components/cmpCard/GoOffWork.vue'
import Todo from '@/overrides/components/cmpCard/Todo.vue'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()

const { now, homeAppList } = storeToRefs(appStore)
</script>

<style scoped>
.fixed-box {
  display: flex;
  flex-direction: column;
  gap: var(--icon-gap-y);
  width: calc(var(--icon-size) * 4 + var(--icon-gap-x) * 3);
}
</style>
