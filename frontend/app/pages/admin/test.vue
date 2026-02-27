<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

definePageMeta({
  layout: 'admin'
})

const config = useRuntimeConfig()
const result = ref<any>(null)
const loading = ref(false)

async function testEndpoint(endpoint: string) {
  loading.value = true
  result.value = null
  try {
    const res = await $fetch(`${config.public.apiBase}${endpoint}`, {
      credentials: 'include'
    })
    result.value = res
  } catch (err: any) {
    result.value = {
      _error: true,
      status: err.status || err.response?.status,
      message: err.message,
      data: err.data || err.response?._data
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <div class="mb-8">
      <h1 class="text-3xl font-serif text-gray-900 mb-2">API Test Sandbox</h1>
      <p class="text-gray-600">Нажимайте на кнопки, чтобы отправить тестовые запросы к бекенду и проверить, возвращаются ли данные от текущего пользователя.</p>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Доступные эндпоинты</h2>
      <div class="flex flex-wrap gap-4">
        <button 
          @click="testEndpoint('/auth/me')" 
          :disabled="loading"
          class="px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          <Icon name="lucide:user-check" size="18" />
          GET /auth/me
        </button>

        <button 
          @click="testEndpoint('/orders/me')" 
          :disabled="loading"
          class="px-6 py-3 bg-secondary text-primary border border-primary text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          <Icon name="lucide:package" size="18" />
          GET /orders/me
        </button>
        
        <button 
          @click="testEndpoint('/users/me/stats')" 
          :disabled="loading"
          class="px-6 py-3 bg-green-50 text-green-700 border border-green-200 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          <Icon name="lucide:bar-chart-3" size="18" />
          GET /users/me/stats
        </button>
      </div>
    </div>

    <!-- Results Block -->
    <div class="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
      <div class="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <span class="text-sm font-mono text-gray-300">Ответ сервера (JSON)</span>
        <span v-if="loading" class="text-sm text-primary flex items-center gap-2">
           <Icon name="lucide:loader-2" class="animate-spin" /> Загрузка...
        </span>
      </div>
      <div class="p-6 overflow-x-auto min-h-[300px]">
        <pre v-if="result && !result._error" class="text-green-400 font-mono text-sm leading-relaxed">{{ JSON.stringify(result, null, 2) }}</pre>
        <pre v-else-if="result && result._error" class="text-red-400 font-mono text-sm leading-relaxed">{{ JSON.stringify(result, null, 2) }}</pre>
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-500 min-h-[250px]">
          <Icon name="lucide:terminal-square" size="48" class="mb-4 opacity-50" />
          <p>Нажмите на любую кнопку сверху, чтобы увидеть результат.</p>
        </div>
      </div>
    </div>
  </div>
</template>
