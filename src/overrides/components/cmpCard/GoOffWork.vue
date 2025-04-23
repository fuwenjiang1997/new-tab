<template>
  <GoOffWorkCard
    v-bind="$attrs"
    :config="goOffWorkTimeConfig"
    @click="goOffWorkTimeSetDialogRef.show()"
  ></GoOffWorkCard>

  <GoOffWorkTimeSetDialog ref="goOffWorkTimeSetDialogRef">
    <template #default="{ formState }">
      <div class="flex-1 flex-center items-stretch py-20 bg-zinc-600" >
        <GoOffWorkCard
          :config="formState"
        ></GoOffWorkCard>
    </div>
    </template>
  </GoOffWorkTimeSetDialog>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { storeToRefs } from 'pinia'
import GoOffWorkCard from '../GoOffWorkCard.vue'
import GoOffWorkTimeSetDialog from '../GoOffWorkTimeSetDialog.vue'
import { ref } from 'vue'
dayjs.extend(duration)

const appStore = useAppStore()
const { goOffWorkTimeConfig } = storeToRefs(appStore)
const goOffWorkTimeSetDialogRef = ref()

</script>
