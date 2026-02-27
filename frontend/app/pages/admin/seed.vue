<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

definePageMeta({
  layout: 'admin'
})

const config = useRuntimeConfig()
const isSeeding = ref(false)
const showConfirm = ref(false)
const progressMessage = ref('')
const resultMessage = ref('')
const isError = ref(false)
const progressCount = ref(0)
const maxCount = ref(0)

async function runSeed() {
  isSeeding.value = true
  resultMessage.value = ''
  progressMessage.value = 'Загрузка данных с севера (JSON)...'
  showConfirm.value = false
  isError.value = false
  progressCount.value = 0
  maxCount.value = 0

  try {
    // 1. Fetch seed data
    const seedData = await $fetch<any[]>(`${config.public.apiBase}/seed/data`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!Array.isArray(seedData)) {
      throw new Error('Некорректный формат данных')
    }

    maxCount.value = seedData.reduce((acc, cat) => acc + cat.products.length, 0) + seedData.length

    let categoriesAdded = 0
    let productsAdded = 0

    // 2. Iterate and create
    for (const catData of seedData) {
      progressMessage.value = `Создание категории: ${catData.name}`
      
      let categoryId = null

      // Create Category
      try {
        const catRes = await $fetch<any>(`${config.public.apiBase}/categories`, {
          method: 'POST',
          credentials: 'include',
          body: { name: catData.name }
        })
        categoryId = catRes.id
        categoriesAdded++
        progressCount.value++
      } catch (err: any) {
        // if conflict (already exists), we need to fetch all and find it
        if (err.response?.status === 409 || err.message?.includes('already exists')) {
            const allCats = await $fetch<any[]>(`${config.public.apiBase}/categories`, { credentials: 'include' })
            const existingCat = allCats.find((c: any) => c.name === catData.name)
            if (existingCat) {
                categoryId = existingCat.id
                progressCount.value++
            }
        } else {
            console.error('Category error:', err)
        }
      }

      if (categoryId && catData.products) {
        for (const prodData of catData.products) {
          progressMessage.value = `Создание товара: ${prodData.name}`
          
          try {
            // Create Product
            const prodRes = await $fetch<any>(`${config.public.apiBase}/products`, {
              method: 'POST',
              credentials: 'include',
              body: {
                categoryId,
                name: prodData.name,
                description: prodData.description,
                price: prodData.price,
                costPrice: prodData.costPrice,
                imageUrl: prodData.imageUrl,
                isActive: true
              }
            })
            
            // Add Inventory Item (stock)
            await $fetch<any>(`${config.public.apiBase}/inventory-items`, {
              method: 'POST',
              credentials: 'include',
              body: {
                productId: prodRes.id,
                quantityOnHand: prodData.stock,
                reserved: 0
              }
            })
            
            productsAdded++
            progressCount.value++
          } catch(err: any) {
            console.error('Product error:', err)
            // just continue if one product fails
          }
        }
      }
    }

    resultMessage.value = `Успешно! Добавлено ${categoriesAdded} категорий и ${productsAdded} товаров со складом.`
  } catch (err: any) {
    isError.value = true
    if (err.response?.status === 403) {
      resultMessage.value = 'Отказано в доступе. Только администратор может запускать это действие.'
    } else {
      resultMessage.value = 'Произошла ошибка при генерации данных. ' + (err.message || '')
    }
  } finally {
    isSeeding.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <div class="mb-8">
      <h1 class="text-3xl font-serif text-gray-900 mb-2">Генератор каталога (Smart Seed)</h1>
      <p class="text-gray-600">Этот инструмент берет хардкодный JSON файл с бекенда и рассылает запросы на создание 15 категорий и 150 товаров, добавляя каждому количество на складе (от 3 до 20 штук).</p>
    </div>

    <!-- Seed Card -->
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
      <div class="flex flex-col sm:flex-row items-start gap-4 mb-6">
        <div class="p-4 bg-orange-50 text-orange-600 rounded-full flex-shrink-0">
          <Icon name="lucide:database" size="32" />
        </div>
        <div>
          <h2 class="text-xl font-medium text-gray-900 mb-2">Внимание: Заполнение базы данных</h2>
          <p class="text-gray-500 text-sm leading-relaxed mb-4">
            При запуске скрипт сделает около 300 запросов API для создания категорий, продуктов и записей склада (Inventory). Это займет некоторое время.
          </p>
        </div>
      </div>

      <div v-if="!showConfirm && !isSeeding" class="flex justify-end pt-4 border-t border-gray-100">
        <button 
          @click="showConfirm = true" 
          :disabled="isSeeding"
          class="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Icon name="lucide:play" size="18" />
          Сгенерировать данные
        </button>
      </div>

      <!-- Confirmation Box -->
      <div v-if="showConfirm" class="bg-red-50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 border border-red-100">
        <span class="text-red-700 font-medium">Вы уверены? Будет отправлено множество запросов.</span>
        <div class="flex gap-3">
          <button @click="showConfirm = false" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium shadow-sm transition-colors">Отмена</button>
          <button @click="runSeed" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium shadow-sm transition-colors flex items-center gap-2">
            <Icon name="lucide:check" size="16" />
            Да, запустить
          </button>
        </div>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="isSeeding" class="p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4 text-blue-800">
          <Icon name="lucide:loader-2" class="animate-spin text-blue-600" size="24" />
          <h3 class="font-bold text-lg">Генерация данных...</h3>
        </div>
        <span class="text-blue-700 font-mono text-sm font-medium">{{ progressCount }} / {{ maxCount || '?' }}</span>
      </div>
      <p class="text-sm text-blue-700 mb-4">{{ progressMessage }}</p>
      
      <!-- Progress Bar -->
      <div class="h-2 bg-blue-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-blue-600 transition-all duration-300" 
          :style="{ width: maxCount ? `${(progressCount / maxCount) * 100}%` : '0%' }"
        ></div>
      </div>
    </div>

    <div v-if="resultMessage && !isError" class="p-6 bg-green-50 text-green-800 border-l-4 border-green-600 rounded-r-lg flex items-start gap-4">
      <Icon name="lucide:check-circle" size="28" class="text-green-600 flex-shrink-0" />
      <p class="font-medium text-lg leading-snug">{{ resultMessage }}</p>
    </div>

    <div v-if="resultMessage && isError" class="p-6 bg-red-50 text-red-800 border-l-4 border-red-600 rounded-r-lg flex items-start gap-4">
      <Icon name="lucide:x-octagon" size="28" class="text-red-600 flex-shrink-0" />
      <p class="font-medium leading-snug">{{ resultMessage }}</p>
    </div>

  </div>
</template>
