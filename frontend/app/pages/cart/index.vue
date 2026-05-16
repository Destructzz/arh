<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-4xl font-serif text-gray-900 mb-8">Your Cart</h1>
        
    <!-- Cart Section -->
    <section>
      <div v-if="cartPending" class="space-y-4 animate-pulse">
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

              <!-- Error message -->
              <p v-if="checkoutError" class="text-sm text-red-500 mb-3">{{ checkoutError }}</p>

              <button
                id="checkout-btn"
                @click="handleCheckout"
                :disabled="checkoutLoading"
                class="w-full bg-primary text-white py-4 px-8 rounded-lg uppercase tracking-widest text-sm font-medium hover:bg-opacity-90 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg v-if="checkoutLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ checkoutLoading ? 'Processing...' : 'Proceed to Checkout' }}
              </button>
            </div>
        </div>
      </div>
    </section>

    <!-- Order Confirmation Modal -->
    <Transition name="fade">
      <div v-if="confirmedOrder" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="confirmedOrder = null">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:check" class="text-green-600" size="32" />
          </div>
          <h2 class="text-2xl font-serif text-gray-900 mb-2">Order Placed!</h2>
          <p class="text-gray-500 mb-1">Order <span class="font-mono text-sm font-medium text-gray-700">#{{ confirmedOrder.id.slice(0, 8) }}</span></p>
          <p class="text-gray-500 mb-6">Total: <span class="font-medium text-gray-900">${{ Number(confirmedOrder.totalPrice).toFixed(2) }}</span></p>

          <div class="space-y-2 text-left mb-6 max-h-48 overflow-y-auto">
            <div v-for="item in confirmedOrder.items" :key="item.id" class="flex justify-between text-sm py-2 border-b border-gray-50">
              <span class="text-gray-700">{{ item.nameSnapshot }} × {{ item.qty }}</span>
              <span class="font-medium">${{ (item.price * item.qty).toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="confirmedOrder = null" class="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Continue Shopping
            </button>
            <NuxtLink to="/profile" class="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors text-center">
              View in Profile
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const auth = useAuthStore()
const cartStore = useCartStore()
const config = useRuntimeConfig()

// Make cart state reactive to the template
const cartItems = computed(() => cartStore.items)
const cartPending = computed(() => cartStore.pending)
const cartTotal = computed(() => cartStore.cartTotal)
const cartError = computed(() => cartStore.error)

// Checkout state
const checkoutLoading = ref(false)
const checkoutError = ref<string | null>(null)
const confirmedOrder = ref<any>(null)

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

async function handleCheckout() {
  if (!auth.isAuthenticated) {
    navigateTo('/auth/login')
    return
  }

  checkoutLoading.value = true
  checkoutError.value = null

  try {
    const order = await $fetch<any>(`${config.public.apiBase}/cart/checkout`, {
      method: 'POST',
      credentials: 'include',
      body: { deliveryType: 'courier', channel: 'online' }
    })

    cartStore.clearCart()
    confirmedOrder.value = order
  } catch (err: any) {
    if (err.status === 401) {
      navigateTo('/auth/login')
    } else {
      checkoutError.value = err?.data?.message || 'Something went wrong. Please try again.'
    }
  } finally {
    checkoutLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
