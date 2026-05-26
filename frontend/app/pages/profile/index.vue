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
              <p v-if="auth.user?.phone" class="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Icon name="lucide:phone" size="12" />
                {{ auth.user.phone }}
              </p>
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

        <!-- Personal details edit form -->
        <div class="bg-[#f8faf9] p-6 rounded-2xl border border-gray-100 space-y-4">
          <h4 class="font-serif text-lg text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
            <Icon name="lucide:user-cog" class="text-gray-400" size="18" />
            Личные данные
          </h4>
          
          <div class="space-y-3">
            <div>
              <label class="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Email</label>
              <input 
                v-model="profileForm.email"
                type="email"
                placeholder="Email не указан"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all bg-white"
              />
            </div>
            
            <div>
              <label class="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Телефон</label>
              <input 
                v-model="profileForm.phone"
                type="text"
                placeholder="+7 (___) ___-__-__"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all bg-white"
                @input="onPhoneInput"
              />
            </div>
            
            <p v-if="profileUpdateError" class="text-xs text-red-500 font-medium">{{ profileUpdateError }}</p>
            <p v-if="profileUpdateSuccess" class="text-xs text-green-600 font-medium">{{ profileUpdateSuccess }}</p>

            <button 
              @click="saveProfile"
              :disabled="savingProfile"
              class="w-full mt-2 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg v-if="savingProfile" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>{{ savingProfile ? 'Сохранение...' : 'Сохранить изменения' }}</span>
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

const profileForm = reactive({
  email: auth.user?.email || '',
  phone: auth.user?.phone || ''
})

// Keep form in sync with store when auth state loads
watch(() => auth.user, (user) => {
  if (user) {
    profileForm.email = user.email || ''
    profileForm.phone = user.phone || ''
  }
}, { immediate: true })

const savingProfile = ref(false)
const profileUpdateError = ref<string | null>(null)
const profileUpdateSuccess = ref<string | null>(null)

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value
  
  // Clean all non-digit characters
  let digits = value.replace(/\D/g, '')
  
  // If first digit is 7 or 8, remove it to normalize
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.substring(1)
  }
  
  // Limit to 10 digits
  digits = digits.substring(0, 10)
  
  // Format as +7 (999) 123-45-67
  let formatted = ''
  if (digits.length > 0) {
    formatted = '+7 (' + digits.substring(0, 3)
  } else {
    formatted = ''
  }
  
  if (digits.length > 3) {
    formatted += ') ' + digits.substring(3, 6)
  }
  if (digits.length > 6) {
    formatted += '-' + digits.substring(6, 8)
  }
  if (digits.length > 8) {
    formatted += '-' + digits.substring(8, 10)
  }
  
  profileForm.phone = formatted
  input.value = formatted
}

async function saveProfile() {
  savingProfile.value = true
  profileUpdateError.value = null
  profileUpdateSuccess.value = null
  
  try {
    const res = await $fetch<{ user: any }>(`${config.public.apiBase}/users/me`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        email: profileForm.email || null,
        phone: profileForm.phone || null
      }
    })
    
    // Update store
    if (res.user) {
      auth.user = {
        ...auth.user,
        ...res.user
      }
    }
    
    profileUpdateSuccess.value = 'Профиль успешно обновлен!'
    setTimeout(() => {
      profileUpdateSuccess.value = null
    }, 4000)
  } catch (err: any) {
    profileUpdateError.value = err?.data?.message || 'Не удалось обновить профиль'
  } finally {
    savingProfile.value = false
  }
}

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
