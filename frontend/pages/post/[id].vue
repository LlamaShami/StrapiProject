<!-- frontend/pages/post/[id].vue -->
<template>
  <div class="container">
    <div v-if="loading">Loading…</div>
    <div v-else-if="!post" style="color: red;">
      Post not found.
    </div>
    <div v-else>
      <h1>{{ post.Title }}</h1>
      <p class="meta">by {{ post.Author }}</p>

      <!-- Render each paragraph in Content -->
      <div v-for="(blk, i) in post.Content" :key="i">
        <p v-if="blk.type === 'paragraph'">
          <span v-for="(c, j) in blk.children" :key="j">{{ c.text }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'

interface RawItem {
  id: number
  Title: string
  Author: string
  Snippet: string
  Category: string
  Content: Array<{ type: string; children: Array<{ text: string }> }>
}

const route = useRoute()
const config = useRuntimeConfig()

const loading = ref(true)
const post = ref<RawItem | null>(null)

onMounted(async () => {
  // 1) get the id from the URL
  let id = route.params.id
  if (Array.isArray(id)) id = id[0]
  const targetId = Number(id)

  // 2) fetch the full list (public find endpoint)
  const listUrl = `${config.public.strapiBase}/api/blog-posts?populate=*`
  console.log('▶️ [id].vue] fetching full list from:', listUrl)
  const res = await fetch(listUrl)
  if (!res.ok) {
    console.error('❌ [id].vue] list fetch error', res.status)
    loading.value = false
    return
  }
  const json = await res.json()
  console.log('▶️ [id].vue] full list json:', json)

  // 3) find the one post with matching id
  const found = (json.data as RawItem[]).find(item => item.id === targetId)
  if (found) {
    post.value = found
    console.log('▶️ [id].vue] found post:', found)
  } else {
    console.warn('⚠️ [id].vue] no post with id', targetId)
    post.value = null
  }

  loading.value = false
})
</script>
