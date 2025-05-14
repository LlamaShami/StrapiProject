<template>
  <div class="container">
    <h1>All Blog Posts</h1>

    <label>
      Category:
      <select v-model="categoryFilter">
        <option value="">All</option>
        <option v-for="c in categories" :key="c">{{ c }}</option>
      </select>
    </label>

    <p v-if="posts.length === 0" style="color: red; margin-top: 1rem;">
      No posts loaded yet.
    </p>

    <div v-else class="posts-grid">
      <PostCard v-for="p in filteredPosts" :key="p.id" :post="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PostCard from '~/components/PostCard.vue'
import { useRuntimeConfig } from '#imports'

interface RawItem {
  id: number
  attributes?: Record<string, any>
  Title?: string
  Author?: string
  Snippet?: string
  Category?: string
}

interface Post {
  id: number
  Title: string
  Author: string
  Snippet: string
  Category: string
}

const posts = ref<Post[]>([])
const categories = ref<string[]>([])
const categoryFilter = ref<string>('')

const config = useRuntimeConfig()

onMounted(async () => {
  const base = config.public.strapiBase
  const fetchUrl = `${base}/api/blog-posts?populate=*`

  const res = await fetch(fetchUrl)
  if (!res.ok) {
    console.error('❌ API error', res.status, res.statusText)
    return
  }

  const json = await res.json()

  posts.value = (json.data as RawItem[]).map(r => {
    const src = r.attributes ?? r
    return {
      id: r.id,
      Title: src.Title  ?? 'No Title',
      Author: src.Author ?? 'Unknown',
      Snippet: src.Snippet ?? '',
      Category: src.Category ?? ''
    }
  })

  categories.value = Array.from(
    new Set(posts.value.map(p => p.Category))
  ).filter(c => c).sort()
})

const filteredPosts = computed(() =>
  categoryFilter.value
    ? posts.value.filter(p => p.Category === categoryFilter.value)
    : posts.value
)
</script>
