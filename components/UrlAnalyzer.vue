<template>
    <div class="url-analyzer">
        <h1>URL Analyzer</h1>
        <form @submit.prevent="analyzeUrl" class="url-form">
            <input v-model="url" type="url" placeholder="Enter a URL to analyze" required class="url-input" />
            <button type="submit" :disabled="isLoading" class="submit-button">
                {{ isLoading ? 'Analyzing...' : 'Analyze' }}
            </button>
        </form>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-if="result" class="result">
            <h2>Analysis Results</h2>

            <div class="result-section">
                <h3>Basic Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Title:</strong>
                        <span>{{ result.data.title }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Description:</strong>
                        <span>{{ result.data.description }}</span>
                    </div>
                    <div class="info-item">
                        <strong>H1:</strong>
                        <span>{{ result.data.h1 }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Word Count:</strong>
                        <span>{{ result.data.wordCount }}</span>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <h3>Links ({{ result.data.linkCount }} total)</h3>
                <ul class="link-list">
                    <li v-for="(link, index) in result.data.links" :key="index">
                        <a :href="link.href" target="_blank" rel="noopener noreferrer">
                            {{ link.text || link.href }}
                        </a>
                    </li>
                </ul>
            </div>

            <div class="result-section">
                <h3>Meta Tags</h3>
                <div class="meta-tags">
                    <div v-for="(tag, index) in result.data.metaTags" :key="index" class="meta-tag">
                        <strong>{{ tag.name }}:</strong>
                        <span>{{ tag.content }}</span>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <h3>Images ({{ result.data.imageCount }} total)</h3>
                <div class="image-grid">
                    <div v-for="(image, index) in result.data.images" :key="index" class="image-item">
                        <img :src="image.src" :alt="image.alt || 'Image'" loading="lazy" />
                        <div class="image-alt">{{ image.alt || 'No alt text' }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const url = ref('')
const isLoading = ref(false)
const error = ref('')
const result = ref(null)

const analyzeUrl = async () => {
    isLoading.value = true
    error.value = ''
    result.value = null

    try {
        const response = await $fetch('/api/analyze-url', {
            method: 'POST',
            body: { url: url.value }
        })
        result.value = response
    } catch (err) {
        error.value = err.message || 'An error occurred while analyzing the URL'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.url-analyzer {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.url-form {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.url-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.submit-button {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.error-message {
    color: red;
    margin-bottom: 1rem;
}

.result {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
}

.result-section {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ddd;
}

.result-section:last-child {
    border-bottom: none;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.link-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.link-list li {
    margin-bottom: 0.5rem;
}

.link-list a {
    color: #2196F3;
    text-decoration: none;
}

.link-list a:hover {
    text-decoration: underline;
}

.meta-tags {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.meta-tag {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.image-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.image-item img {
    width: 100%;
    height: auto;
    border-radius: 4px;
}

.image-alt {
    font-size: 0.8rem;
    color: #666;
}
</style>