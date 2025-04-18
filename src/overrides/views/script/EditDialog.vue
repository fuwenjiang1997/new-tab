<template>
  <a-modal
    v-model:open="open" title="编辑脚本" :width="600"
    autocomplete="off" @ok="onOk" @cancel="onCancel"
  >
    <a-form ref="formRef" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="脚本名称" name="name" :rules="[{ required: true }]">
        <a-input v-model:value="form.name" placeholder="脚本名称" />
      </a-form-item>
      <a-form-item label="脚本描述" name="description" :rules="[{ required: false }]">
        <a-input v-model:value="form.description" placeholder="脚本描述" />
      </a-form-item>
      <a-form-item label="脚本内容" name="script" :rules="[]">
        <a-textarea v-model:value="form.script" placeholder="脚本" :rows="6" />
      </a-form-item>
      <a-form-item label="运行地址" name="url" :rules="[{ required: true }]">
        <a-input v-model:value="form.url" placeholder="运行地址" />
      </a-form-item>
      <a-form-item label="自动运行" name="autoRun" :rules="[{ required: true }]">
        <a-switch v-model:checked="form.autoRun" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import useAppStore from '@/_stores/app'
import { watch, ref } from 'vue'
import { cloneDeep } from 'lodash'
import { transform } from '@babel/standalone';

const appStore = useAppStore()
const open = ref(false)
const form = ref(baseForm())
const formRef = ref()
const scripts = ref(cloneDeep(appStore.scripts))
watch(() => appStore.scripts, (val) => {
  scripts.value = cloneDeep(val)
})

async function onOk() {
  try {
    await formRef.value.validate()

    form.value.es5Script = transform(form.value.script, {
      presets: ['es2015']
    }).code

    if (form.value.id) {
      scripts.value.findIndex((item, index) => {
      if (item.id === form.value.id) {
        scripts.value.splice(index, 1, form.value)
      }
    })
    } else {
      form.value.id = `script_${new Date().getTime()}`
      scripts.value.push(form.value)
    }
    appStore.updateScripts(scripts.value)
    open.value = false
  } catch (err) {
    console.log(err)
  }
}
function onCancel() {
}

function baseForm() {
  return {
    name: '',
    description: '',
    script: '',
    es5Script: '',
    url: '*',
    autoRun: true,
  }
}

function show(v) {
  form.value = v || baseForm()
  open.value = true
}
defineExpose({
  show,
})
</script>