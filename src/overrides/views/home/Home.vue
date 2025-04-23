<template>
  <div class="pt-10 h-screen overflow-y-scroll no-scrollbar">
    <p class="mb-10 text-6xl text-center">
      {{ now.format('HH:mm:ss') }}
    </p>
    <div class="w-2/3 mx-auto">
      <form class="flex gap-2 h-12" action="https://www.google.com/search" method="GET">
        <input class="flex-1 h-full px-5 outline-0 bg-[rgba(0,0,0,0.5)] rounded-full" type="text" name="q"
          placeholder="搜索 Google" autofocus autocomplete="off">
      </form>
    </div>

    <VueDraggable
      v-model="homeAppList"
      target="#custom-app-container"
      draggable=".app-item-drag"
      :group="{name: 'g1', put: true, pull: 'clone'}"
    >
      <div class="flex gap-5 mt-20 w-4/5 mx-auto">
        <div id="custom-app-container" class="flex-1 icon-card-container app-item-drop">
          <AlarmTask />
          <GoOffWork />

          <MyIconCard
            v-for="(item, index) in homeAppList"
            :key="index"
            :id="item.id"
            :data-id="item.id"
            :class="{
              [`icon-size-${item.size || '1x1'}`]: true,
              'app-item-drag': true,
            }" 
            :title="item.name"
          >
            <VueDraggable
              v-if="item.type === 'group'"
              class="icon-card-container"
              v-model="item.children"
              draggable=".app-item-drag"
              group="g1"
            >
              <MyIconCard
                v-for="childItem in item.children"
                :key="childItem.id"
                :id="childItem.id"
                :data-id="childItem.id"
                class="app-item-drag"
                :class="{
                  [`icon-size-${childItem.size || '1x1'}`]: true,
                }"
                :title="childItem.name"
              >
                <a :href="childItem.link" class="app-item-icon !flex flex-center p-2 bg-white text-black">
                  <img v-if="childItem.icon" :src="childItem.icon" class="w-10 h-10 object-contain">
                  <IconLink v-else class="w-full h-full" />
                </a>
              </MyIconCard>
            </VueDraggable>

            <a v-else :href="item.link" class="app-item-icon !flex flex-center p-2 bg-white text-black">
              <img v-if="item.icon" :src="item.icon" class="w-10 h-10 object-contain">
              <IconLink v-else class="w-full h-full" />
            </a>
          </MyIconCard>

          <EditAppItem />
        </div>
        <div class="fixed-box shrink-0">
          <Todo />
        </div>
      </div>
    </VueDraggable>
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
import { VueDraggable } from 'vue-draggable-plus'

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
