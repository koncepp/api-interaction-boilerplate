<template>
  <UContainer class="py-12">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 text-gray-900">
          URL Analyzer
        </h1>
        <p class="text-xl text-gray-800">
          Enter a URL to analyze its content and structure
        </p>
      </div>

      <UCard class="mb-8 shadow-lg">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-link" class="text-gray-600 dark:text-gray-300" />
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Analyze URL
            </h2>
          </div>
        </template>
        <form @submit.prevent="analyzeUrl">
          <UFormGroup label="URL" class="mb-4" :error="error">
            <UInput v-model="url" type="url" placeholder="https://example.com" required :ui="{ base: 'flex-1' }"
              size="xl" icon="i-heroicons-globe-alt" :loading="loading" :disabled="loading" color="gray"
              @keyup.enter="analyzeUrl">
            </UInput>
            <UButton type="submit" :loading="loading" :disabled="loading" icon="i-heroicons-magnifying-glass"
              color="gray" size="xl" class="cursor-pointer hover:bg-gray-100">
              {{ loading ? 'Analyzing...' : 'Analyze' }}
            </UButton>
          </UFormGroup>
        </form>
      </UCard>

      <UAlert v-if="error" type="error" :title="error" icon="i-heroicons-exclamation-triangle" class="mb-8" />

      <div v-if="results" class="space-y-8">
        <UCard class="shadow-lg">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-information-circle" class="text-gray-600 dark:text-gray-300" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
            </div>
          </template>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div v-for="(value, key) in {
              title: 'Title',
              description: 'Description',
              totalLinks: 'Total Links',
              internalLinks: 'Internal Links',
              externalLinks: 'External Links',
              metaTags: 'Meta Tags'
            }" :key="key" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ value }}
              </dt>
              <dd class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {{ results[key] }}
              </dd>
            </div>
          </div>
        </UCard>

        <UCard class="shadow-lg">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="text-gray-600 dark:text-gray-300" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Email Addresses Found
              </h2>
            </div>
          </template>
          <div v-if="results.emails && results.emails.length > 0" class="space-y-2">
            <div v-for="(email, index) in results.emails" :key="index"
              class="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <UIcon name="i-heroicons-envelope" class="text-gray-400 mr-2" />
              <UButton :to="'mailto:' + email" variant="link" color="gray" class="text-sm">
                {{ email }}
              </UButton>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
            No email addresses found on this page.
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logger } from '~/utils/logger'

const url = ref('')
const loading = ref(false)
const error = ref(null)
const results = ref(null)

const analyzeUrl = async () => {
  logger.debug('Starting URL analysis...')

  if (!url.value) {
    logger.warn('Empty URL submitted')
    error.value = 'Please enter a URL'
    return
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url.value)
    logger.debug('URL validation successful:', {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname
    })
  } catch (e) {
    logger.warn('Invalid URL format:', url.value)
    error.value = 'Please enter a valid URL (e.g., https://example.com)'
    return
  }

  loading.value = true
  error.value = null
  results.value = null

  try {
    logger.info('Making API request to analyze URL:', url.value)
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.value }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData.message || 'Failed to analyze URL')
    }

    const data = await response.json()
    logger.info('Analysis completed successfully:', {
      title: data.title,
      totalLinks: data.totalLinks,
      emailCount: data.emails?.length || 0
    })
    results.value = data
  } catch (err) {
    logger.error('Error during URL analysis:', {
      error: err,
      url: url.value
    })
    error.value = err.message || 'An error occurred while analyzing the URL'
  } finally {
    loading.value = false
    logger.debug('Analysis process completed')
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
