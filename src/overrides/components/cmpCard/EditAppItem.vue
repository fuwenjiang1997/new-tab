<template>
  <MyIconCard v-bind="$attrs" class="icon-size-1x1 text-center cursor-pointer" @click="onAddItem">
    <div class="app-item-icon hover:bg-[rgba(0,0,0,0.2)]">
      <div class="text-2xl">+</div>
      <div class="">新增</div>
    </div>
  </MyIconCard>

  <a-modal v-model:open="open" :title="form.id ? '编辑提醒' : '新增提醒'" @ok="onSave">
    <div class="mt-5">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="名称" name="name" :rules="[{ required: true }]">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="链接" name="link" :rules="[{ required: true }]">
          <a-input v-model:value="form.link" />
        </a-form-item>
        <a-form-item label="图标" name="icon" :rules="[{ required: false }]">
          <img :src="form.icon" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="form.description" :rows="2" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>

  <!-- <div id="contextmenuModal" class="">
    <a-row>
      <a-col flex="100px">icon</a-col>
      <a-col flex="auto">在新标签页打开</a-col>
    </a-row>
    <a-row>
      <a-col flex="100px">布局</a-col>
      <a-col flex="auto">
        <a-row :gutter="24">
          <a-col class="gutter-row" :span="5">
            <div class="gutter-box">col-6</div>
          </a-col>
          <a-col class="gutter-row" :span="5">
            <div class="gutter-box">col-6</div>
          </a-col>
          <a-col class="gutter-row" :span="5">
            <div class="gutter-box">col-6</div>
          </a-col>
          <a-col class="gutter-row" :span="5">
            <div class="gutter-box">col-6</div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div> -->
</template>
<script setup>
import { ref, reactive } from 'vue'
import { generateRandomString, getFavicon } from '@/_utils/util'
import useAppStore from '@/_stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { homeAppList } = storeToRefs(appStore)
const open = ref(false)

const getBaseForm = () => ({
  id: generateRandomString(10),
  type: 'link',
  name: '',
  description: '',
  link: '',
  icon: '',
})
const form = ref(getBaseForm())

async function onSave() {
  form.value.icon = await getFavicon(form.value.link) || ''
  homeAppList.value.push(form.value)
  open.value = false
}

function onAddItem() {
  form.value = getBaseForm()
  open.value = true
}
</script>
