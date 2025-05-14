<!-- frontend/components/SearchBar.vue -->
<template>
  <form @submit.prevent="onSearch" class="search-form">
    <input v-model="q" type="text" placeholder="Search author or title…" />
    <button type="submit">Search</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const q = ref('')
const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

function onSearch() {
  emit('search', q.value.trim())
}
</script>
