<template>
  <!-- 随手记 -->
  <MyIconCard v-bind="$attrs" class="icon-size-4x4" title="随手记">
    <div class="app-item-icon flex flex-col bg-neutral-700">
      <!-- Head 区域：上一条 / 随手记（点击显示列表） / 下一条 -->
      <div
        class="flex justify-between items-center gap-1 h-10 px-2 font-extrabold bg-orange-500 shadow-2xl select-none"
      >
        <button
          type="button"
          class="inline-flex items-center gap-1 h-8 px-2 text-sm rounded-md bg-white/10 hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 transition"
          :disabled="currentIndex <= 0"
          :aria-label="`上一条随手记，当前第 ${currentIndex + 1} 条，共 ${notes.length} 条`"
          title="上一条"
          @click="prevNote"
        >
          <LeftOutlined class="text-xs" aria-hidden="true" />
          <span>上一条</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 h-8 px-2 text-sm rounded-md hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none active:scale-95 transition"
          :aria-label="`查看随手记列表，共 ${notes.length} 条`"
          title="查看列表"
          @click="openList"
        >
          <UnorderedListOutlined class="text-xs" aria-hidden="true" />
          <span>随手记</span>
          <span
            v-if="notes.length"
            class="text-xs px-1.5 py-0.5 rounded-full bg-white/25"
            aria-hidden="true"
          >
            {{ currentIndex + 1 }}/{{ notes.length }}
          </span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1 h-8 px-2 text-sm rounded-md bg-white/10 hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 transition"
          :disabled="currentIndex >= notes.length - 1"
          :aria-label="`下一条随手记，当前第 ${currentIndex + 1} 条，共 ${notes.length} 条`"
          title="下一条"
          @click="nextNote"
        >
          <span>下一条</span>
          <RightOutlined class="text-xs" aria-hidden="true" />
        </button>
      </div>

      <!-- 内容区域 -->
      <div
        class="flex flex-col bg-neutral-700"
        style="height: calc(100% - 40px)"
      >
        <div class="flex-1 overflow-y-scroll no-scrollbar p-4">
          <!-- 空状态 -->
          <div
            v-if="!currentNote"
            class="h-full flex flex-col justify-center items-center text-neutral-300 gap-3"
          >
            <EditOutlined class="text-3xl opacity-50" aria-hidden="true" />
            <p class="text-sm">
              暂无随手记
            </p>
            <button
              type="button"
              class="inline-flex items-center gap-1 h-9 px-3 text-sm rounded-md bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none active:scale-95 transition"
              @click="createNote"
            >
              <PlusOutlined aria-hidden="true" />
              新增一条
            </button>
          </div>

          <!-- 阅读模式：点击 / Enter / Space 进入编辑 -->
          <button
            v-else-if="!isEditing"
            ref="readRef"
            type="button"
            class="flex flex-col justify-start items-start h-full w-full text-left cursor-text text-white whitespace-pre-wrap break-words text-sm leading-relaxed rounded-md p-1 appearance-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none hover:bg-white/5 transition"
            :title="currentNote.content ? '点击编辑' : '点击开始编辑'"
            @click="startEdit"
          >
            <template v-if="currentNote.content">
              {{
                currentNote.content
              }}
            </template>
            <span v-else class="text-neutral-300 italic">（点击此处开始编辑）</span>
          </button>

          <!-- 编辑模式 -->
          <div v-else class="h-full flex flex-col">
            <textarea
              ref="editRef"
              v-model="editContent"
              class="flex-1 w-full resize-none bg-neutral-800 text-white text-sm leading-relaxed rounded-md p-2 outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-neutral-400"
              placeholder="记录点什么吧..."
              aria-label="随手记内容"
              @blur="saveEdit(false)"
              @keydown.ctrl.enter.prevent="saveEdit(true)"
              @keydown.esc="cancelEdit"
            />
            <div class="flex justify-end gap-2 mt-2">
              <button
                type="button"
                class="inline-flex items-center h-8 px-3 text-xs rounded-md bg-neutral-600 hover:bg-neutral-500 text-white focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:outline-none active:scale-95 transition"
                title="放弃本次编辑 (Esc)"
                @mousedown.prevent
                @click="cancelEdit"
              >
                取消
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1 h-8 px-3 text-xs rounded-md bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none active:scale-95 transition"
                title="保存 (Ctrl+Enter)"
                @mousedown.prevent
                @click="saveEdit(true)"
              >
                保存
                <span class="opacity-70 text-[10px]">Ctrl+↵</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 底部：更新时间 / 新增 -->
        <div
          class="h-6 flex items-center justify-between bg-white text-neutral-700 text-xs px-3"
        >
          <span v-if="currentNote" class="truncate">
            {{ formatTime(currentNote.updatedAt || currentNote.createdAt) }}
          </span>
          <span v-else aria-hidden="true">&nbsp;</span>
          <button
            type="button"
            class="inline-flex items-center gap-1 h-6 -mr-1 px-1 rounded hover:text-orange-600 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none active:scale-95 transition"
            title="新增随手记"
            @mousedown.prevent
            @click="createNote"
          >
            <PlusOutlined aria-hidden="true" />
            新增
          </button>
        </div>
      </div>
    </div>
  </MyIconCard>

  <!-- 随手记列表弹窗 -->
  <a-modal
    v-model:open="listOpen"
    title="随手记列表"
    :footer="null"
    width="560px"
  >
    <div class="max-h-[60vh] overflow-y-auto">
      <TransitionGroup name="qn-list" tag="div">
        <div
          v-for="(note, idx) in notes"
          :key="note.id"
          class="flex gap-2 items-start border-b last:border-b-0 py-3 -mx-2 px-2 rounded hover:bg-neutral-50"
        >
          <button
            type="button"
            class="flex-1 text-left cursor-pointer rounded focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none"
            :aria-label="`打开第 ${idx + 1} 条随手记`"
            @click="selectNote(idx)"
          >
            <div class="flex justify-between text-xs text-neutral-500 mb-1">
              <span>{{ formatTime(note.updatedAt || note.createdAt) }}</span>
              <span>{{
                note.content ? `${note.content.length }字` : "空"
              }}</span>
            </div>
            <div
              class="text-sm text-neutral-800 line-clamp-2 whitespace-pre-wrap break-words"
            >
              <template v-if="note.content">
                {{ note.content }}
              </template>
              <span v-else class="italic text-neutral-400">（空内容）</span>
            </div>
          </button>
          <button
            type="button"
            class="shrink-0 inline-flex items-center gap-1 h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none active:scale-95 transition"
            :aria-label="`删除第 ${idx + 1} 条随手记`"
            @click="deleteNote(note.id)"
          >
            <DeleteOutlined aria-hidden="true" />
            删除
          </button>
        </div>
      </TransitionGroup>
      <div
        v-if="!notes.length"
        class="py-10 text-center text-neutral-400 text-sm"
      >
        还没有随手记，去创建一条吧 ~
      </div>
    </div>
    <div class="mt-4 flex justify-end">
      <button
        type="button"
        class="inline-flex items-center gap-1 h-9 px-4 text-sm rounded-md bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none active:scale-95 transition"
        @click="createNoteFromList"
      >
        <PlusOutlined aria-hidden="true" />
        新增随手记
      </button>
    </div>
  </a-modal>
</template>

<script setup>
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'
import { useStorage } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'

const notes = useStorage('quickNotes', [])
const currentIndex = ref(0)
const listOpen = ref(false)
const isEditing = ref(false)
const editContent = ref('')
const editRef = ref(null)
const readRef = ref(null)

// 读取时同步索引，防止越界
watch(
  () => notes.value.length,
  (len) => {
    if (currentIndex.value >= len) {
      currentIndex.value = Math.max(0, len - 1)
    }
  },
  { immediate: true },
)

const currentNote = computed(() => notes.value[currentIndex.value] || null)

function formatTime(t) {
  if (!t) return ''
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function prevNote() {
  if (currentIndex.value > 0) currentIndex.value -= 1
}
function nextNote() {
  if (currentIndex.value < notes.value.length - 1) currentIndex.value += 1
}

function createNote() {
  // 若当前正在编辑，先保存（不抢占焦点，随后由 startEdit 聚焦新文本框）
  if (isEditing.value) saveEdit(false)
  const now = Date.now()
  const note = {
    id: now,
    content: '',
    createdAt: now,
    updatedAt: now,
  }
  notes.value.unshift(note)
  currentIndex.value = 0
  // 新增后立即进入编辑模式
  nextTick(() => startEdit())
}

function createNoteFromList() {
  listOpen.value = false
  createNote()
}

function deleteNote(id) {
  const idx = notes.value.findIndex((n) => n.id === id)
  if (idx === -1) return
  notes.value.splice(idx, 1)
}

function selectNote(idx) {
  currentIndex.value = idx
  listOpen.value = false
}

function openList() {
  listOpen.value = true
}

function startEdit() {
  if (!currentNote.value) return
  editContent.value = currentNote.value.content || ''
  isEditing.value = true
  nextTick(() => {
    if (editRef.value) {
      editRef.value.focus()
      // 光标移到末尾
      const len = editContent.value.length
      editRef.value.setSelectionRange(len, len)
    }
  })
}

function cancelEdit() {
  isEditing.value = false
  editContent.value = ''
  nextTick(() => readRef.value?.focus())
}

function saveEdit(restoreFocus = false) {
  if (!isEditing.value || !currentNote.value) {
    isEditing.value = false
    return
  }
  const idx = notes.value.findIndex((n) => n.id === currentNote.value.id)
  if (idx !== -1) {
    notes.value[idx].content = editContent.value
    notes.value[idx].updatedAt = Date.now()
  }
  isEditing.value = false
  editContent.value = ''
  if (restoreFocus) {
    nextTick(() => readRef.value?.focus())
  }
}
</script>

<style scoped>
/* 列表新增 / 删除动画 */
.qn-list-enter-active,
.qn-list-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.qn-list-enter-from,
.qn-list-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
