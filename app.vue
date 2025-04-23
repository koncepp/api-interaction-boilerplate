<template>
  <UContainer>
    <UrlAnalyzer />
  </UContainer>
</template>

<script setup lang="ts">
import UrlAnalyzer from './components/UrlAnalyzer.vue'

useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>

<style>
/* Global styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
}
</style>
