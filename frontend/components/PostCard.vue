<template>
  <div class="post-card">
    <h2>{{ post.Title }}</h2>
    <p class="meta">by {{ post.Author }}</p>
    <p class="snippet">{{ post.Snippet }}</p>
    <NuxtLink :to="`/post/${post.id}`">Read more →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: number
  Title: string
  Author: string
  Snippet: string
  Category: string
}

const props = defineProps<{ post: Post }>()

console.log(
  '▶️ [PostCard.vue] post props →',
  'Title:', props.post.Title,
  'Author:', props.post.Author,
  'Snippet:', props.post.Snippet
)
</script>
