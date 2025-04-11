<template>
  <div class="m-5 p-5 bg-[rgba(255,255,255,04)]">
    <a-table :columns="columns" :data-source="data" size="small">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <a-button type="primary" size="small">
            运行
          </a-button>
          <a-button type="primary" size="small">
            编辑
          </a-button>
          <a-button type="primary" size="small" status="danger">
            删除
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { DownOutlined, SmileOutlined } from '@ant-design/icons-vue'

const columns = [
  {
    name: '脚本名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    description: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
]
</script>
