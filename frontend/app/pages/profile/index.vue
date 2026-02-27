<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-4xl font-serif text-gray-900 mb-8">Your Profile</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Profile Info Sidebar -->
      <aside class="md:col-span-1 space-y-6">
        <div class="bg-[#f8faf9] p-6 rounded-2xl border border-gray-100">
          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-serif">
              {{ auth.user?.login?.[0]?.toUpperCase() || 'U' }}
            </div>
            <div>
              <h3 class="font-serif text-xl">{{ auth.user?.login || 'Gardener' }}</h3>
              <p class="text-sm text-gray-500">{{ auth.user?.email || 'No email provided' }}</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Member Since</span>
              <span class="font-medium text-gray-900">{{ registrationDate }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Total Purchases</span>
              <span class="font-medium text-gray-900">{{ stats.totalPurchases }} items</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Total Spent</span>
              <span class="font-medium text-gray-900">${{ stats.totalSpent.toFixed(2) }}</span>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200">
             <button @click="handleLogout" class="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
               Sign Out
             </button>
          </div>
        </div>
      </aside>

      <!-- Order History -->
      <main class="md:col-span-2">
        <section>
          <h2 class="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-2">
            <Icon name="lucide:history" class="text-gray-400" />
            Order History
          </h2>
          
          <div v-if="ordersPending" class="space-y-4 animate-pulse">
             <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-lg"></div>
          </div>
          
          <div v-else-if="orders.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
             <p class="text-gray-500 mb-4">You haven't placed any orders yet.</p>
             <NuxtLink to="/shop" class="text-primary font-medium hover:underline">Start Shopping</NuxtLink>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="order in orders" :key="order.id" class="p-5 border border-gray-100 rounded-xl bg-white flex justify-between items-center group hover:border-primary/30 transition-colors">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <span class="font-medium text-gray-900">Order #{{ order.id.slice(0, 8) }}...</span>
                  <span :class="{
                    'bg-green-100 text-green-700': order.status === 'DELIVERED',
                    'bg-blue-100 text-blue-700': order.status === 'PROCESSING',
                    'bg-gray-100 text-gray-700': order.status === 'CANCELLED'
                  }" class="px-2 py-0.5 rounded text-xs font-medium tracking-wide">
                    {{ order.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">{{ new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }} • {{ order.itemsCount }} items</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-lg">${{ Number(order.totalAmount || 0).toFixed(2) }}</p>
                <NuxtLink :to="`/orders/${order.id}`" class="text-sm text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Details</NuxtLink>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: [
    async function (to, from) {
      const auth = useAuthStore()
      // Wait for auth to initialize if we don't have a user yet
      if (!auth.isAuthenticated) {
         await auth.fetchUser()
      }
      if (!auth.isAuthenticated) {
        return navigateTo('/auth/login')
      }
    }
  ]
})

const auth = useAuthStore()
const config = useRuntimeConfig()

interface Order {
  id: string
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  itemsCount: number
  createdAt: string
}

interface UserStats {
  registeredAt: string
  totalPurchases: number
  totalSpent: number
}

// Fetch orders
const headers = useRequestHeaders(['cookie']) as Record<string, string>

const { data: ordersData, pending: ordersPending } = await useFetch<Order[]>(`${config.public.apiBase}/orders/me`, {
  headers,
  credentials: 'include',
  default: () => []
})

// Fetch user stats
const { data: statsData } = await useFetch<UserStats>(`${config.public.apiBase}/users/me/stats`, {
  headers,
  credentials: 'include'
})

const orders = computed(() => ordersData.value || [])

// Fallback logic for stats in case backend doesn't implement totalPurchases etc.
const stats = computed(() => statsData.value || {
  registeredAt: new Date().toISOString(),
  totalPurchases: orders.value.reduce((acc, order) => acc + (order.itemsCount || 0), 0),
  totalSpent: orders.value.reduce((acc, order) => acc + Number(order.totalAmount || 0), 0)
})

const registrationDate = computed(() => {
  if (!stats.value?.registeredAt) return 'Unknown'
  return new Date(stats.value.registeredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
})

async function handleLogout() {
  await auth.logout()
  navigateTo('/')
}
</script>
