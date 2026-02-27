<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-4xl font-serif text-gray-900 mb-8">Your Cart</h1>
        
    <!-- Cart Section -->
    <section>
      <!-- Authentication check message -->
      <div v-if="!auth.isAuthenticated" class="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <Icon name="lucide:lock" class="text-gray-300 mx-auto mb-4" size="48" />
          <h2 class="text-2xl font-serif text-gray-900 mb-2">Авторизация</h2>
          <p class="text-gray-500 mb-6 text-lg">Чтобы пользоваться корзиной, необходимо войти в аккаунт.</p>
          <NuxtLink to="/auth/login" class="bg-primary text-white font-medium hover:bg-opacity-90 inline-block px-8 py-3 rounded-md shadow-sm transition-all uppercase tracking-widest text-sm">Войти</NuxtLink>
      </div>

      <div v-else-if="cartPending" class="space-y-4 animate-pulse">
          <div v-for="i in 2" :key="i" class="h-24 bg-gray-100 rounded-lg"></div>
      </div>
      
      <div v-else-if="cartItems.length === 0" class="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <Icon name="lucide:shopping-bag" class="text-gray-300 mx-auto mb-4" size="48" />
          <p class="text-gray-500 mb-4 text-lg">Your cart is empty.</p>
          <NuxtLink to="/shop" class="text-primary font-medium hover:underline inline-block px-6 py-2 border border-primary text-sm uppercase tracking-widest rounded transition-colors hover:bg-primary hover:text-white">Continue Shopping</NuxtLink>
      </div>
      
      <div v-else class="space-y-6">
        <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-6 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div class="w-20 h-24 bg-[#f4f7f6] rounded-md overflow-hidden flex-shrink-0">
            <img :src="item.product.imageUrl || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'" class="w-full h-full object-cover" />
          </div>
          <div class="flex-grow">
            <h3 class="font-serif text-lg">{{ item.product.name }}</h3>
            <p class="text-gray-500 text-sm">${{ item.product.price }} each</p>
          </div>
          <div class="flex items-center border border-gray-200 rounded-md">
            <button @click="updateQuantity(item.id, item.quantity - 1)" class="px-3 py-1 hover:bg-gray-50 text-gray-600">-</button>
            <span class="px-3 py-1 border-x border-gray-200 text-sm w-12 text-center">{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)" class="px-3 py-1 hover:bg-gray-50 text-gray-600">+</button>
          </div>
          <div class="text-right w-24">
            <p class="font-medium text-lg">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
            <button @click="removeItem(item.id)" class="text-xs text-red-400 hover:text-red-600 mt-1 uppercase tracking-wider">Remove</button>
          </div>
        </div>
        
        <div class="flex justify-end pt-8 border-t border-gray-200 mt-8">
            <div class="text-right w-full sm:w-auto min-w-[300px]">
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500">Subtotal</span>
                <span class="font-medium">${{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-4 pb-4 border-b border-gray-100">
                <span class="text-sm text-gray-500">Shipping</span>
                <span class="font-medium text-green-600">Free</span>
              </div>
              <div class="flex justify-between mb-6">
                 <span class="text-lg font-serif">Total</span>
                 <span class="text-3xl font-serif">${{ cartTotal.toFixed(2) }}</span>
              </div>
              
              <button class="w-full bg-primary text-white py-4 px-8 rounded-lg uppercase tracking-widest text-sm font-medium hover:bg-opacity-90 transition-all shadow-md">
                Proceed to Checkout
              </button>
            </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const auth = useAuthStore()
const cartStore = useCartStore()

// Make cart state reactive to the template
const cartItems = computed(() => cartStore.items)
const cartPending = computed(() => cartStore.pending)
const cartTotal = computed(() => cartStore.cartTotal)
const cartError = computed(() => cartStore.error)

// If the API returns 401 Unauthorized, it means the user's session is invalid or missing
watch(cartError, (err) => {
  if (err && err.statusCode === 401) {
    auth.user = null // Clear local state just in case
    navigateTo('/auth/login')
  }
}, { immediate: true })

// ------ Actions ------
async function updateQuantity(cartItemId: string, newQuantity: number) {
  await cartStore.updateQuantity(cartItemId, newQuantity)
}

async function removeItem(cartItemId: string) {
  await cartStore.removeItem(cartItemId)
}
</script>
