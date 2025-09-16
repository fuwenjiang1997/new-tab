<template>
  <div class="flex flex-col gap-3">
    <div class="my-card">
      <div class="flex items-center gap-2">
        <span class="w-16">图标大小</span>
        <div class=" flex-1">
          <a-slider v-model:value="appSetForm.iconSize" :min="40" :max="130" :tooltipOpen="false" />
        </div>
        <span class="w-6 text-xs">{{ appSetForm.iconSize }}px</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-16">图标圆角</span>
        <div class=" flex-1">
          <a-slider v-model:value="appSetForm.iconRadius" :min="0" :max="20" :tooltipOpen="false" />
        </div>
        <span class="w-6 text-xs">{{ appSetForm.iconRadius }}px</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-16">不透明度</span>
        <div class=" flex-1">
          <a-slider v-model:value="appSetForm.iconOpacity" :min="0" :max="1" :step="0.1" :tooltipOpen="false" />
        </div>
        <span class="w-6 text-xs">{{ Math.ceil(appSetForm.iconOpacity * 100) }}%</span>
      </div>

    </div>

    <div>
      <p class="mt-2 mb-2">间距</p>
      <div class="my-card">
        <div class="flex items-center gap-2">
          <span class="w-16">图标间距</span>
          <div class=" flex-1">
            <a-slider v-model:value="appSetForm.iconSpace" :min="10" :max="100" :tooltipOpen="false" />
          </div>
          <span class="w-6 text-xs">{{ appSetForm.iconSpace }}px</span>
        </div>
      </div>
    </div>
   
  </div>
</template>
<script setup>
import useAppStore from '@/_stores/app';
import { storeToRefs } from 'pinia';

const appStore = useAppStore()
const { appSetForm } = storeToRefs(appStore)
</script>