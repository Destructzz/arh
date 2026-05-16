<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'admin',
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

interface OrderItem {
  id: string
  nameSnapshot: string
  qty: number
  price: number
  product?: { name: string; imageUrl?: string }
}

interface Order {
  id: string
  status: string
  channel: string
  deliveryType: string
  totalPrice: number
  createdAt: string
  userId?: string
  items?: OrderItem[]
}

const headers = useRequestHeaders(['cookie']) as Record<string, string>

const { data: ordersData, pending, refresh } = await useFetch<Order[]>(
  `${config.public.apiBase}/orders`,
  { headers, credentials: 'include', default: () => [] }
)

const orders = computed(() => ordersData.value || [])

const totalRevenue = computed(() =>
  orders.value.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0)
)

const newOrdersCount = computed(() =>
  orders.value.filter(o => o.status === 'new').length
)

function statusLabel(status: string) {
  const map: Record<string, string> = {
    new: 'New',
    paid: 'Paid',
    in_assembly: 'In Assembly',
    out_for_delivery: 'Out for Delivery',
    done: 'Delivered',
    cancelled: 'Cancelled',
  }
  return map[status] ?? status
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    in_assembly: 'bg-yellow-100 text-yellow-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    done: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

async function updateStatus(orderId: string, newStatus: string) {
  try {
    await $fetch(`${config.public.apiBase}/orders/${orderId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: { status: newStatus }
    })
    await refresh()
  } catch (e) {
    console.error('Failed to update order status', e)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-4xl text-primary font-bold mb-1">Orders</h1>
        <p class="text-gray-500">All customer orders, real-time.</p>
      </div>
      <button @click="refresh()" class="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
        <Icon name="lucide:refresh-cw" size="14" />
        Refresh
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Orders</h3>
        <p class="text-3xl font-bold text-gray-900">{{ orders.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">New Orders</h3>
        <p class="text-3xl font-bold text-blue-600">{{ newOrdersCount }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Revenue</h3>
        <p class="text-3xl font-bold text-green-600">${{ totalRevenue.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="pending" class="p-8 space-y-4 animate-pulse">
        <div v-for="i in 5" :key="i" class="h-14 bg-gray-50 rounded-lg"></div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-16">
        <Icon name="lucide:inbox" class="text-gray-300 mx-auto mb-3" size="48" />
        <p class="text-gray-500">No orders yet.</p>
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
              <span class="font-mono text-sm text-gray-700">#{{ order.id.slice(0, 8) }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1 max-w-xs">
                <span
                  v-for="item in order.items"
                  :key="item.id"
                  class="text-xs bg-gray-100 rounded px-2 py-0.5 text-gray-600 whitespace-nowrap"
                >
                  {{ item.nameSnapshot }} ×{{ item.qty }}
                </span>
                <span v-if="!order.items?.length" class="text-xs text-gray-400">—</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="font-medium text-gray-900">${{ Number(order.totalPrice).toFixed(2) }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm capitalize text-gray-600">{{ order.channel }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-gray-500">
                {{ new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <select
                :value="order.status"
                @change="(e) => updateStatus(order.id, (e.target as HTMLSelectElement).value)"
                :class="statusClass(order.status)"
                class="text-xs font-medium rounded px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary/30 outline-none"
              >
                <option value="new">New</option>
                <option value="paid">Paid</option>
                <option value="in_assembly">In Assembly</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="done">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
