<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-4xl font-serif text-gray-900 mb-8">Ваш профиль</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Profile Info Sidebar -->
      <aside class="md:col-span-1 space-y-6">
        <div class="bg-[#f8faf9] p-6 rounded-2xl border border-gray-100">
          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-serif">
              {{ auth.user?.login?.[0]?.toUpperCase() || 'U' }}
            </div>
            <div>
              <h3 class="font-serif text-xl">{{ auth.user?.login || 'Садовод' }}</h3>
              <p class="text-sm text-gray-500">{{ auth.user?.email || 'Email не указан' }}</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">В клубе с</span>
              <span class="font-medium text-gray-900">{{ registrationDate }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Всего заказов</span>
              <span class="font-medium text-gray-900">{{ orders.length }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Всего потрачено</span>
              <span class="font-medium text-gray-900">{{ totalSpent.toFixed(2) }} ₽</span>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200">
             <button @click="handleLogout" class="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
               Выйти
             </button>
          </div>
        </div>
      </aside>

      <!-- Order History -->
      <main class="md:col-span-2">
        <section>
          <h2 class="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-2">
            <Icon name="lucide:history" class="text-gray-400" />
            История заказов
          </h2>
          
          <div v-if="ordersPending" class="space-y-4 animate-pulse">
             <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-lg"></div>
          </div>
          
          <div v-else-if="orders.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
             <p class="text-gray-500 mb-4">Вы еще не сделали ни одного заказа.</p>
             <NuxtLink to="/shop" class="text-primary font-medium hover:underline">Начать покупки</NuxtLink>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="order in orders"
              :key="order.id"
              class="border border-gray-100 rounded-xl bg-white overflow-hidden"
            >
              <!-- Order Header (always visible, clickable) -->
              <button
                class="w-full p-5 flex justify-between items-center hover:bg-gray-50/60 transition-colors text-left"
                @click="toggleOrder(order.id)"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <span class="font-medium text-gray-900">Заказ №{{ order.id.slice(0, 8) }}…</span>
                    <span :class="statusClass(order.status)" class="px-2 py-0.5 rounded text-xs font-medium tracking-wide">
                      {{ statusLabel(order.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ new Date(order.createdAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    &bull; {{ order.items?.length || 0 }} товар(ов)
                  </p>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0 ml-4">
                  <p class="font-medium text-lg">{{ Number(order.totalPrice).toFixed(2) }} ₽</p>
                  <Icon
                    name="lucide:chevron-down"
                    class="text-gray-400 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedOrders.has(order.id) }"
                    size="18"
                  />
                </div>
              </button>

              <!-- Expanded Order Details -->
              <Transition name="slide">
                <div v-if="expandedOrders.has(order.id)" class="border-t border-gray-100">
                  <div v-if="order.items?.length" class="p-5 space-y-3">
                    <div
                      v-for="item in order.items"
                      :key="item.id"
                      class="flex items-center justify-between py-2"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            v-if="item.product?.imageUrl"
                            :src="item.product.imageUrl"
                            :alt="item.nameSnapshot"
                            class="w-full h-full object-cover"
                          />
                          <div v-else class="w-full h-full flex items-center justify-center">
                            <Icon name="lucide:flower-2" class="text-gray-300" size="16" />
                          </div>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-800">{{ item.nameSnapshot }}</p>
                          <p class="text-xs text-gray-400">× {{ item.qty }} &nbsp;·&nbsp; {{ item.price }} ₽ за шт.</p>
                        </div>
                      </div>
                      <p class="text-sm font-medium text-gray-700">{{ (item.price * item.qty).toFixed(2) }} ₽</p>
                    </div>

                    <!-- Subtotal row -->
                    <div class="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span class="text-sm text-gray-500">Итого по заказу</span>
                      <span class="font-semibold text-gray-900">{{ Number(order.totalPrice).toFixed(2) }} ₽</span>
                    </div>
                  </div>
                  <div v-else class="p-5 text-sm text-gray-400">Данные о товарах отсутствуют.</div>
                </div>
              </Transition>
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

interface OrderItem {
  id: string
  nameSnapshot: string
  qty: number
  price: number
  product?: { imageUrl?: string | null }
}

interface Order {
  id: string
  status: string
  totalPrice: number
  createdAt: string
  items?: OrderItem[]
}

interface UserStats {
  registeredAt: string
  totalPurchases: number
  totalSpent: number
}

const headers = useRequestHeaders(['cookie']) as Record<string, string>

const { data: ordersData, pending: ordersPending } = await useFetch<Order[]>(`${config.public.apiBase}/orders/me`, {
  headers,
  credentials: 'include',
  default: () => []
})

const { data: statsData } = await useFetch<UserStats>(`${config.public.apiBase}/users/me/stats`, {
  headers,
  credentials: 'include'
})

const orders = computed(() => ordersData.value || [])

const totalSpent = computed(() =>
  orders.value.reduce((acc, o) => acc + Number(o.totalPrice || 0), 0)
)

const registrationDate = computed(() => {
  const date = statsData.value?.registeredAt
  if (!date) return 'Неизвестно'
  return new Date(date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
})

// Expandable orders
const expandedOrders = ref<Set<string>>(new Set())

function toggleOrder(orderId: string) {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId)
  } else {
    expandedOrders.value.add(orderId)
  }
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    new: 'Новый',
    paid: 'Оплачен',
    in_assembly: 'В сборке',
    done: 'Выполнен',
    cancelled: 'Отменен',
  }
  return map[status] ?? status
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    in_assembly: 'bg-yellow-100 text-yellow-700',
    done: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-gray-100 text-gray-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

async function handleLogout() {
  await auth.logout()
  navigateTo('/')
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
