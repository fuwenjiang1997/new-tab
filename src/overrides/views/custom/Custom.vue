<template>
  <div>
    {{ $route.params.pageName }}
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
</script>
