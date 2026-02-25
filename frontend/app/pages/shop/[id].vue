<template>
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
      <h2 class="text-2xl font-serif mb-4">Product not found</h2>
      <NuxtLink to="/shop" class="text-primary underline">Return to Shop</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-16">
      <!-- Image Gallery -->
      <div class="bg-[#f4f7f6] aspect-[4/5] overflow-hidden relative">
         <img 
            :src="product.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'" 
            :alt="product.name" 
            class="w-full h-full object-cover"
         />
      </div>

      <!-- Product Info -->
      <div class="flex flex-col justify-center">
        <h1 class="text-4xl font-serif text-gray-900 mb-2">{{ product.name }}</h1>
        <p class="text-2xl text-gray-500 mb-8 font-light">${{ product.price }}</p>

        <div class="prose text-gray-600 mb-8 text-sm leading-relaxed" v-html="product.description || 'No description available.'"></div>

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
             <span>{{ addingToCart ? 'Adding...' : 'Add to Cart' }}</span>
           </button>
        </div>

        <div class="border-t border-gray-100 pt-6 space-y-4">
           <div class="flex items-start gap-3">
             <Icon name="lucide:sun" class="text-primary mt-1" />
             <div>
               <h4 class="font-medium text-sm">Light</h4>
               <p class="text-xs text-gray-500">Thrives in bright to medium indirect light.</p>
             </div>
           </div>
           <div class="flex items-start gap-3">
             <Icon name="lucide:droplets" class="text-primary mt-1" />
             <div>
               <h4 class="font-medium text-sm">Water</h4>
               <p class="text-xs text-gray-500">Water every 1-2 weeks, allowing soil to dry out between waterings.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const quantity = ref(1)
const addingToCart = ref(false)

const { data: product, pending, error } = await useFetch<Product>(`${config.public.apiBase}/products/${route.params.id}`)

async function handleAddToCart() {
  if (!product.value) return
  
  addingToCart.value = true
  try {
    await cartStore.addToCart(String(product.value.id), quantity.value)
    // Optional: show a success toast or notification here
  } finally {
    addingToCart.value = false
  }
}
</script>
