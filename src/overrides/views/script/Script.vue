<template>
  <div class="m-5 p-5 bg-[rgba(255,255,255,04)]">
    <a-table :columns="columns" :data-source="data" size="small" :pagination="false">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <a-button class="mr-2" type="primary" size="small">
            编辑
          </a-button>
          <a-button type="primary" size="small" danger>
            删除
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>

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

const data = [
  {
    key: '1',
    name: 'John Brown',
    description: 'New York No. 1 Lake Park'
  },
]
</script>
