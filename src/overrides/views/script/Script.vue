<template>
  <div class="m-5 p-5 bg-[rgba(255,255,255,04)]">
    <div class="flex justify-between">
      <div>
        <span />
      </div>

      <a-button type="primary" @click="editDialogRef.show()">
        新建脚本
      </a-button>
    </div>

    <a-table class="mt-5" :columns="columns" :data-source="scripts" size="small" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'action'">
          <a-button class="mr-2" type="primary" size="small" @click="onEdit(record, index)">
            编辑
          </a-button>
          <a-button type="primary" size="small" danger @click="onDelete(record, index)">
            删除
          </a-button>
        </template>
      </template>
    </a-table>
  </div>

  <EditDialog ref="editDialogRef" />
</template>

<script setup>
import useAppStore from '@/_stores/app'
import {storeToRefs} from 'pinia'
import { ref } from 'vue'
import EditDialog from './EditDialog.vue'

const appStore = useAppStore()
const { scripts } = storeToRefs(appStore)
const editDialogRef = ref()
const columns = [
  {
    title: '脚本名称',
    dataIndex: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: 'Action',
    key: 'action',
    width: '120px',
  },
]

function onEdit(data, index) {
  editDialogRef.value.show(data)
}
function onDelete(data, index) {
  scripts.value.splice(index, 1)
  appStore.updateScripts(scripts.value)
}
</script>
