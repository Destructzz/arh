<template>
  <!-- Toast message for unauthorized cart adds -->
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-4 opacity-0"
  >
    <div v-if="authMessage" class="fixed top-24 right-4 bg-red-50 text-red-600 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 border border-red-100">
      <Icon name="lucide:alert-circle" size="20" />
      <span class="font-medium">{{ authMessage }}</span>
    </div>
  </transition>

  <div class="container mx-auto px-4 py-12">
    <div v-if="pending" class="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
       <div class="bg-gray-200 aspect-square"></div>
       <div class="space-y-4">
         <div class="h-8 bg-gray-200 w-3/4"></div>
         <div class="h-4 bg-gray-200 w-full"></div>
         <div class="h-4 bg-gray-200 w-full"></div>
       </div>
    </div>

    <div v-else-if="error || !product" class="text-center py-20">
      <h2 class="text-2xl font-serif mb-4">Товар не найден</h2>
      <NuxtLink to="/shop" class="text-primary underline">Вернуться в магазин</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-16">
      <!-- Image Gallery -->
      <div class="bg-[#f4f7f6] aspect-[4/5] overflow-hidden relative rounded-lg">
         <img 
            :src="product.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'" 
            :alt="product.name" 
            class="w-full h-full object-cover"
         />
      </div>

      <!-- Product Info -->
      <div class="flex flex-col justify-center">
        <h1 class="text-4xl font-serif text-gray-900 mb-2">{{ product.name }}</h1>
        <p class="text-2xl text-gray-500 mb-8 font-light">{{ product.price }} ₽</p>

        <div class="prose text-gray-600 mb-8 text-sm leading-relaxed" v-html="product.description || 'Описание отсутствует.'"></div>

        <div class="flex items-center gap-4 mb-8">
           <div class="flex border border-gray-300 w-32">
              <button @click="quantity > 1 && quantity--" class="px-3 py-3 hover:bg-gray-100 transition-colors">-</button>
              <input type="number" v-model="quantity" class="w-full text-center border-none focus:ring-0 py-3 appearance-none m-0" min="1" />
              <button @click="quantity++" class="px-3 py-3 hover:bg-gray-100 transition-colors">+</button>
           </div>
           <button 
             @click="handleAddToCart"
             :disabled="addingToCart"
             class="flex-grow bg-primary text-white py-3 uppercase tracking-widest text-sm font-medium hover:bg-opacity-90 transition-all flex justify-center items-center gap-2"
           >
             <Icon v-if="addingToCart" name="lucide:loader-2" class="animate-spin" />
             <span>{{ addingToCart ? 'Добавление...' : 'Добавить в корзину' }}</span>
           </button>
        </div>

        <div class="border-t border-gray-100 pt-6 space-y-4">
           <div class="flex items-start gap-3">
             <Icon name="lucide:sun" class="text-primary mt-1" />
             <div>
               <h4 class="font-medium text-sm">Освещение</h4>
               <p class="text-xs text-gray-500">Предпочитает яркий или умеренный непрямой свет.</p>
             </div>
           </div>
           <div class="flex items-start gap-3">
             <Icon name="lucide:droplets" class="text-primary mt-1" />
             <div>
               <h4 class="font-medium text-sm">Полив</h4>
               <p class="text-xs text-gray-500">Поливайте каждые 1-2 недели, давая почве просохнуть между поливами.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
interface Product {
  id: string | number
  name: string
  price: number
  description?: string | null
  imageUrl?: string | null
}

const route = useRoute()
const config = useRuntimeConfig()
const cartStore = useCartStore()
const authStore = useAuthStore()

const quantity = ref(1)
const addingToCart = ref(false)
const authMessage = ref<string | null>(null)

const { data: product, pending, error } = await useFetch<Product>(`${config.public.apiBase}/products/${route.params.id}`)

async function handleAddToCart() {
  if (!product.value) return
  
  if (!authStore.isAuthenticated) {
    authMessage.value = 'Чтобы добавить товар, нужно авторизоваться'
    setTimeout(() => { authMessage.value = null }, 3000)
    return
  }

  addingToCart.value = true
  try {
    await cartStore.addToCart(String(product.value.id), quantity.value)
    // Optional: show a success toast or notification here
  } finally {
    addingToCart.value = false
  }
}
</script>
