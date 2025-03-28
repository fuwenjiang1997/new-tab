<template>
  <div class="pt-20">
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
        />
      </form>
    </div>

    <div class="flex gap-5 mt-20 w-4/5 mx-auto">
      <div class="flex-1 icon-card-container">
        <AlarmTask></AlarmTask>
        <GoOffWork></GoOffWork>
        <!-- <Weather></Weather> -->
        <MyIconCard v-for="(item, index) in 10" :key="index" class="icon-size-1x1 bg-red-100" title="测试icon">111</MyIconCard>
      </div>
      <div class="fixed-box shrink-0 ">
        <Todo></Todo>
      </div>
    </div>
  </div>
</template>
<script setup>
import GoOffWork from '@/overrides/components/cmpCard/GoOffWork.vue'
import Weather from '@/overrides/components/cmpCard/Weather.vue'
import Todo from '@/overrides/components/cmpCard/Todo.vue'
import AlarmTask from '@/overrides/components/cmpCard/AlarmTask.vue'

</script>

<style scoped>
.fixed-box {
  display: flex;
  flex-direction: column;
  gap: var(--icon-gap-y);
  width: calc(var(--icon-size)* 4 + var(--icon-gap-x)* 3);
}
</style>
