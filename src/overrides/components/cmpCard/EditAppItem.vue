<template>
  <MyIconCard
    v-bind="$attrs"
    class="icon-size-1x1 text-center cursor-pointer"
    @click="onAddItem"
  >
    <div class="app-item-icon hover:bg-[rgba(0,0,0,0.2)]">
      <div class="text-2xl">
        +
      </div>
      <div class="">
        新增
      </div>
    </div>
  </MyIconCard>

  <EditAppItemDialog ref="editAppItemRef" />
</template>
<script setup>
import { ref } from 'vue'
import EditAppItemDialog from '../EditAppItemDialog.vue'

const editAppItemRef = ref()
function onAddItem() {
  editAppItemRef.value.show()
}
</script>
