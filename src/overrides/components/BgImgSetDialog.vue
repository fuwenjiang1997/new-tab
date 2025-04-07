<template>
  <a-modal v-model:open="open" title="修改背景图" @ok="onOk" @cancel="onCancel">
    <div class="flex gap-4 my-4">
      <a-upload
        v-model:file-list="bgImgList"
        name="file"
        :show-upload-list="false"
        @change="handleUploadImg"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          Click to Upload
        </a-button>
      </a-upload>

      <a-button @click="recoverBg">恢复默认背景图</a-button>
    </div>

    <div class="flex">
      <img class="w-full h-80 object-cover" :src="bgImg || defaultBgImg" alt="" />
    </div>
  </a-modal>
</template>
<script setup>
import { ref, defineExpose } from 'vue';
import useAppStore from '@/_stores/app'
import { storeToRefs } from 'pinia'
import defaultBgImg from '../assets/bg.jpeg'
import { fileToBase64 } from '@/_utils/util'

const appStore = useAppStore()
const { config } = storeToRefs(appStore)
const open = ref(false)
const bgImgList = ref([])
const bgImg = ref(config.value.bgImg)

async function handleUploadImg(v) {
  bgImg.value = await fileToBase64(v.file.originFileObj)
}

function onOk() {
  config.value.bgImg = bgImg.value
  open.value = false
}
function onCancel() {
  bgImg.value = ''
}
function show() {
  bgImg.value = config.value.bgImg
  open.value = true
}
function recoverBg() {
  bgImg.value = ''
}

defineExpose({
  show
})

</script>
