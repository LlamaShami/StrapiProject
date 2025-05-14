<template>
  <div class="container">
    <h1>Search Posts</h1>
    <SearchBar @search="doSearch" />
    <div v-if="searched">
      <div v-if="results.length" class="posts-grid">
        <PostCard v-for="p in results" :key="p.id" :post="p" />
      </div>
      <p v-else>No posts found for “{{ lastQuery }}”.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '~/components/SearchBar.vue'
import PostCard from '~/components/PostCard.vue'
import { useRuntimeConfig } from '#imports'

interface Raw {
  id: number
  Title: string
  Author: string
  Snippet: string
  Category: string
}

const results = ref<Raw[]>([])
const lastQuery = ref<string>('')
const searched = ref<boolean>(false)
const config = useRuntimeConfig()

async function doSearch(query: string) {
  lastQuery.value = query
  searched.value = true

  const url = new URL(`${config.public.strapiBase}/api/blog-posts`)
  url.searchParams.set('filters[$or][0][Title][$containsi]', query)
  url.searchParams.set('filters[$or][1][Author][$containsi]', query)
  url.searchParams.set('populate', '*')

  const res = await fetch(url.toString())
  const json = await res.json()
  results.value = json.data.map((r: any) => ({
    id: r.id,
    Title: r.attributes.Title,
    Author: r.attributes.Author,
    Snippet: r.attributes.Snippet,
    Category: r.attributes.Category
  }))
}
</script>
