<template>
  <div>
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
    <!-- Hero Section -->
    <section class="relative bg-[#f4f7f6] h-[600px] flex items-center">
      <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        <div class="order-2 md:order-1 space-y-6">
          <h1 class="text-5xl md:text-7xl font-serif leading-tight text-gray-900">
            Природа в <br/> <span class="text-primary">вашем доме.</span>
          </h1>
          <p class="text-lg text-gray-600 max-w-md">
            Откройте для себя нашу коллекцию неприхотливых растений, которые украсят ваш дом.
          </p>
          <div class="flex gap-4">
            <NuxtLink to="/shop" class="inline-block bg-primary text-white px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-opacity-90 transition-all">
              Выбрать растения
            </NuxtLink>
            <NuxtLink to="/cart" class="inline-block bg-transparent border-2 border-primary text-primary px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              В корзину
            </NuxtLink>
          </div>
        </div>
        <div class="order-1 md:order-2 h-full relative overflow-hidden">
           <img 
            src="/5.jpg" 
            alt="Beautiful Plant" 
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-serif text-center mb-12">Категории товаров</h2>

        <!-- Loading skeleton -->
        <div v-if="categoriesPending" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="aspect-[3/4] bg-gray-100 rounded mb-4"></div>
            <div class="h-5 bg-gray-100 rounded w-1/2 mb-2"></div>
            <div class="h-3 bg-gray-100 rounded w-1/3"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NuxtLink
            v-for="(cat, index) in featuredCategories"
            :key="cat.id"
            :to="`/shop?category=${cat.id}`"
            class="group cursor-pointer"
          >
            <div class="relative overflow-hidden aspect-[3/4] mb-4 rounded-lg bg-[#f4f7f6]">
              <img
                :src="categoryImage(index)"
                :alt="cat.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h3 class="text-xl font-serif mb-1">{{ cat.name }}</h3>
            <span class="text-sm text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1">
              Перейти <Icon name="lucide:arrow-right" size="14" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Best Sellers -->
    <section class="py-20 bg-[#f9f9f9]">
      <div class="container mx-auto px-4">
         <div class="flex justify-between items-end mb-12">
            <h2 class="text-3xl font-serif">Хиты продаж</h2>
            <NuxtLink to="/shop" class="text-sm border-b border-gray-900 pb-1 hover:text-primary hover:border-primary transition-colors">Смотреть все</NuxtLink>
         </div>
         
         <!-- Loading skeleton -->
         <div v-if="bestSellersPending" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
           <div v-for="i in 4" :key="i" class="animate-pulse">
             <div class="aspect-square bg-gray-100 rounded mb-4"></div>
             <div class="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
             <div class="h-3 bg-gray-100 rounded w-1/3"></div>
           </div>
         </div>

         <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
           <NuxtLink
             v-for="product in bestSellers"
             :key="product.id"
             :to="`/shop/${product.id}`"
             class="group"
           >
             <div class="relative aspect-square bg-white mb-4 overflow-hidden rounded-lg">
                <img
                  :src="product.imageUrl || '/6.jpg'"
                  :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  @click.prevent="addToCart(product.id)"
                  class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                >
                  <Icon name="lucide:plus" size="20" />
                </button>
             </div>
             <h3 class="font-medium text-lg mb-1">{{ product.name }}</h3>
             <p class="text-gray-500 text-sm">{{ Number(product.price).toFixed(2) }} ₽</p>
           </NuxtLink>
         </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const cartStore = useCartStore()
const authStore = useAuthStore()

const authMessage = ref<string | null>(null)

// Featured categories — server picks 3 random ones, changes every hour
const { data: featuredCategories, pending: categoriesPending } = await useFetch<Array<{ id: string; name: string }>>(
  `${config.public.apiBase}/categories/featured`,
  {
    default: () => [],
    // cache key tied to current hour so client revalidates each hour
    key: `featured-cats-${Math.floor(Date.now() / 3_600_000)}`,
  }
)

// Best sellers
const { data: bestSellers, pending: bestSellersPending } = await useFetch<Array<{
  id: string
  name: string
  price: number
  imageUrl?: string | null
}>>(
  `${config.public.apiBase}/products/best-sellers`,
  { default: () => [] }
)

// Hardcoded images for featured categories based on their position (0 = left, 1 = middle, 2 = right)
function categoryImage(index: number): string {
  const imgs = [
    '/розы.jpg',        // Left image
    '/суккуленты.jpg',  // Middle image
    '/5.jpg',           // Right image (same as background)
  ]
  return imgs[index] || '/6.jpg'
}

async function addToCart(productId: string) {
  if (!authStore.isAuthenticated) {
    authMessage.value = 'Чтобы добавить товар, нужно авторизоваться'
    setTimeout(() => { authMessage.value = null }, 3000)
    return
  }
  await cartStore.addToCart(productId, 1)
}
</script>
