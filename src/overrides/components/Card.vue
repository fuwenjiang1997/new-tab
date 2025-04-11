<template>
  <div
    class="relative transition-all"
    app-icon
  >
    <slot />
    <p
      v-if="title"
      class="absolute -bottom-0.5 left-0 right-0 translate-y-full text-white text-xs text-center"
    >
      {{ title }}
    </p>
  </div>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<style></style>
